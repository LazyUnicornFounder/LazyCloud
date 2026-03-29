import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Known dependency map: when agent X changes, check agents Y
const DEPENDENCY_MAP: Record<string, string[]> = {
  "lazy-blogger": ["lazy-run", "lazy-admin"],
  "lazy-watch": ["lazy-run"],
  "lazy-run": ["lazy-admin", "lazy-blogger"],
};

// Agents with _errors tables → watch + run need checking
const AGENTS_WITH_ERRORS = [
  "lazy-blogger", "lazy-seo", "lazy-geo", "lazy-voice", "lazy-stream",
  "lazy-watch", "lazy-fix", "lazy-intel", "lazy-repurpose",
];

// Agents with settings tables → run + admin need checking
const AGENTS_WITH_SETTINGS = [
  "lazy-blogger", "lazy-seo", "lazy-geo", "lazy-voice", "lazy-stream",
  "lazy-run", "lazy-watch", "lazy-fix", "lazy-intel", "lazy-repurpose",
  "lazy-store", "lazy-drop", "lazy-print", "lazy-pay", "lazy-sms", "lazy-mail",
  "lazy-alert", "lazy-telegram", "lazy-supabase", "lazy-security",
  "lazy-build", "lazy-trend", "lazy-churn", "lazy-granola",
];

async function callAI(prompt: string): Promise<string> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY not set");

  const res = await fetch("https://api.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });

  const rawText = await res.text();
  try {
    const data = JSON.parse(rawText);
    return data.choices?.[0]?.message?.content ?? rawText;
  } catch {
    return rawText;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supabaseUrl, serviceKey);

  try {
    const { agent_name, new_version, updated_content, password } = await req.json();

    // Validate admin password
    const adminPw = Deno.env.get("ADMIN_PASSWORD");
    if (adminPw && password !== adminPw) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!agent_name || !new_version || !updated_content) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 1: Detect affected agents
    const directDeps = DEPENDENCY_MAP[agent_name] || [];
    const extraDeps = new Set<string>();

    if (AGENTS_WITH_ERRORS.includes(agent_name)) {
      extraDeps.add("lazy-watch");
    }
    if (AGENTS_WITH_SETTINGS.includes(agent_name)) {
      extraDeps.add("lazy-run");
      extraDeps.add("lazy-admin");
    }

    const allDeps = [...new Set([...directDeps, ...extraDeps])].filter(d => d !== agent_name);

    const affectedResults: { agent: string; needs_update: boolean; reason?: string; suggested_change?: string }[] = [];

    for (const dep of allDeps) {
      // Get the current prompt for the dependent agent
      const { data: depPrompt } = await sb
        .from("prompt_versions")
        .select("prompt_text, version")
        .eq("product", dep)
        .eq("is_current", true)
        .limit(1)
        .single();

      if (!depPrompt) continue;

      // Truncate content to avoid token limits
      const truncatedUpdated = updated_content.slice(0, 3000);
      const truncatedDep = depPrompt.prompt_text.slice(0, 3000);

      try {
        const aiPrompt = `The ${agent_name} prompt was just updated to ${new_version}. Here is the change (truncated): ${truncatedUpdated}. Here is the current ${dep} prompt (truncated): ${truncatedDep}. Does the ${dep} prompt need any updates as a result of this change? If yes return a JSON object: {"needs_update": true, "reason": "one sentence", "suggested_change": "specific targeted edit to make"}. If no return: {"needs_update": false}. No preamble. No code fences.`;

        const aiResponse = await callAI(aiPrompt);
        
        // Try to parse the JSON response
        const cleaned = aiResponse.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
        try {
          const parsed = JSON.parse(cleaned);
          affectedResults.push({
            agent: dep,
            needs_update: !!parsed.needs_update,
            reason: parsed.reason,
            suggested_change: parsed.suggested_change,
          });
        } catch {
          affectedResults.push({ agent: dep, needs_update: false });
        }
      } catch {
        affectedResults.push({ agent: dep, needs_update: false });
      }
    }

    const needsUpdate = affectedResults.filter(r => r.needs_update);
    const affectedList = needsUpdate.map(r => r.agent).join(", ");

    // Step 2: Generate changelog summary
    let summary = `Updated ${agent_name} to ${new_version}`;
    try {
      const summaryPrompt = `Summarise what changed in the ${agent_name} prompt update to version ${new_version}. Here is the updated content (truncated): ${updated_content.slice(0, 2000)}. Write a one-line summary suitable for a changelog. Return only the summary text.`;
      const aiSummary = await callAI(summaryPrompt);
      if (aiSummary && aiSummary.length > 5 && aiSummary.length < 500) {
        summary = aiSummary.trim();
      }
    } catch {
      // Use default summary
    }

    // Step 3: Insert changelog entry
    const { data: changelogRow, error: insertErr } = await sb
      .from("changelog")
      .insert({
        agent: agent_name,
        version: new_version,
        summary,
        changes: updated_content.slice(0, 5000),
        affected_agents: affectedList || null,
        pushed_to_github: false,
      })
      .select("id")
      .single();

    if (insertErr) {
      console.error("Changelog insert error:", insertErr);
    }

    // Step 4: Push to GitHub (invoke existing sync function)
    let pushedToGithub = false;
    try {
      const { error: pushErr } = await sb.functions.invoke("sync-prompts-github");
      if (!pushErr) {
        pushedToGithub = true;
        if (changelogRow?.id) {
          await sb.from("changelog").update({ pushed_to_github: true }).eq("id", changelogRow.id);
        }
      }
    } catch {
      // GitHub push failed, leave pushed_to_github as false
    }

    // Step 5: Return results
    return new Response(JSON.stringify({
      success: true,
      pushed_to_github: pushedToGithub,
      summary,
      affected_agents: needsUpdate.map(r => ({
        agent: r.agent,
        reason: r.reason,
        suggested_change: r.suggested_change,
      })),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("prompt-update-check error:", err);

    // Log to run_errors if possible
    try {
      await sb.from("run_errors").insert({
        function_name: "prompt-update-check",
        error_message: String(err),
      });
    } catch {}

    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
