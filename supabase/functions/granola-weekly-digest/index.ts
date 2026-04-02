import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  try {
    const { data: settings } = await supabase.from("granola_settings").select("*").limit(1).single();
    if (!settings?.is_running || !settings?.weekly_digest_enabled) {
      return new Response(JSON.stringify({ message: "Digest disabled" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: meetings } = await supabase.from("granola_meetings")
      .select("*")
      .eq("processing_status", "done")
      .gte("created_at", weekAgo)
      .order("created_at", { ascending: true });

    if (!meetings || meetings.length < 2) {
      return new Response(JSON.stringify({ message: "Fewer than 2 meetings this week" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not set");

    const meetingSummaries = meetings.map((m: any) =>
      `- ${m.title} (${m.meeting_type || "unknown"}, ${new Date(m.created_at).toLocaleDateString()}, ${m.duration_minutes || "?"}min): Decisions: ${m.decisions || "None noted"}. Action items: ${m.action_items || "None noted"}.`
    ).join("\n");

    const weekNum = Math.ceil((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));

    const prompt = `You are a writer creating a weekly digest for ${settings.brand_name}. Here is a summary of all meetings from the past week:\n${meetingSummaries}\nWrite a build-in-public weekly digest post covering: what the team worked on, what was decided, what was learned, and what is coming next. Be specific and honest. This is a genuine build-in-public post not a corporate summary. Tone: direct, founder-voice. Return only a valid JSON object: title (e.g. "Week ${weekNum}: [one-line theme of the week]"), slug (lowercase hyphenated), excerpt (under 160 chars), body (clean markdown — ## Day-by-day or ## Theme-by-theme structure, 600 to 1000 words, includes the most interesting insight from any customer call this week, ends with: Follow along at ${settings.site_url} and: Built using the Lazy Stack — autonomous tools for Lovable sites at https://lazyunicorn.ai). No preamble. No code fences.`;

    const res = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${lovableApiKey}` },
      body: JSON.stringify({ model: "google/gemini-2.5-flash", messages: [{ role: "user", content: prompt }] }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const post = JSON.parse(cleaned);

    // Insert into blog_posts
    await supabase.from("blog_posts").insert({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: [post.body],
      status: "published",
      published_at: new Date().toISOString(),
      read_time: `${Math.ceil((post.body?.split(/\s+/).length || 700) / 200)} min read`,
    });

    await supabase.from("granola_outputs").insert({
      output_type: "weekly-digest",
      title: post.title,
      content: post.body,
      published: true,
      published_at: new Date().toISOString(),
    });

    // Notify Slack
    if (settings.slack_webhook_url) {
      await fetch(settings.slack_webhook_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: `📅 Weekly digest published: ${post.title} — ${settings.site_url}/blog/${post.slug}` }),
      }).catch(() => {});
    }

    return new Response(JSON.stringify({ success: true, slug: post.slug }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    await supabase.from("granola_errors").insert({ function_name: "granola-weekly-digest", error_message: error.message });
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
