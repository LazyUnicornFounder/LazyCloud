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
    const { data: meeting } = await supabase.from("granola_meetings").select("*").eq("id", meeting_id).single();
    if (!meeting) throw new Error("Meeting not found");

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not set");

    const prompt = `You are a customer intelligence analyst. Extract structured insights from these customer discovery meeting notes: ${meeting.enhanced_notes || meeting.raw_notes}. For each significant signal return: intel_type (one of problem-mentioned, feature-requested, competitor-named, budget-signal, timeline-signal, decision-made, objection-raised), content (the specific insight in one to two sentences), speaker_context (brief context about who said it — their role or company type without naming them). Return only a valid JSON array. Minimum 3 items if notes are substantial. No preamble. No code fences.`;

    const res = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${lovableApiKey}` },
      body: JSON.stringify({ model: "google/gemini-2.5-flash", messages: [{ role: "user", content: prompt }] }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const insights = JSON.parse(cleaned);

    const meetingDate = meeting.started_at ? new Date(meeting.started_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];

    for (const insight of insights) {
      await supabase.from("granola_intelligence").insert({
        meeting_id,
        intel_type: insight.intel_type,
        content: insight.content,
        speaker_context: insight.speaker_context,
        meeting_title: meeting.title,
        meeting_date: meetingDate,
      });
    }

    await supabase.from("granola_outputs").insert({
      meeting_id,
      output_type: "customer-intel",
      title: `Intelligence from: ${meeting.title}`,
      content: JSON.stringify(insights),
      published: false,
    });

    return new Response(JSON.stringify({ success: true, count: insights.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    await supabase.from("granola_errors").insert({ function_name: "granola-extract-intel", error_message: error.message });
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
