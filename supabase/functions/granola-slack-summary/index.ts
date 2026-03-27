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
    const { meeting_id } = await req.json();
    const { data: settings } = await supabase.from("granola_settings").select("*").limit(1).single();
    const { data: meeting } = await supabase.from("granola_meetings").select("*").eq("id", meeting_id).single();
    if (!meeting || !settings?.slack_webhook_url) throw new Error("Meeting not found or no Slack webhook");

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not set");

    const prompt = `Write a concise Slack summary of this meeting for a team that did not attend. Meeting: ${meeting.title}. Participants: ${meeting.participants || "Not recorded"}. Duration: ${meeting.duration_minutes || "Unknown"} minutes. Notes: ${meeting.enhanced_notes || meeting.raw_notes}. Action items: ${meeting.action_items || "None"}. Decisions: ${meeting.decisions || "None"}. Format as: bold meeting title, one sentence about what the meeting was for, bullet points of key decisions (max 4), bullet points of action items with owner if known (max 5), one sentence on next steps. Keep it scannable. Under 300 words total. Return plain text formatted for Slack markdown. No JSON.`;

    const res = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${lovableApiKey}` },
      body: JSON.stringify({ model: "google/gemini-2.5-flash", messages: [{ role: "user", content: prompt }] }),
    });

    const data = await res.json();
    const summary = data.choices?.[0]?.message?.content || "";

    // Post to Slack
    await fetch(settings.slack_webhook_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: summary }),
    });

    await supabase.from("granola_outputs").insert({
      meeting_id,
      output_type: "slack-summary",
      title: `Slack summary: ${meeting.title}`,
      content: summary,
      published: true,
      published_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    await supabase.from("granola_errors").insert({ function_name: "granola-slack-summary", error_message: error.message });
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
