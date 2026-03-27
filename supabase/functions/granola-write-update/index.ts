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
    if (!meeting || !settings) throw new Error("Meeting or settings not found");

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not set");

    const prompt = `You are a product update writer for ${settings.brand_name}. Here are notes from a ${meeting.meeting_type} meeting: ${meeting.enhanced_notes || meeting.raw_notes}. Action items from this meeting: ${meeting.action_items || "None noted"}. Decisions made: ${meeting.decisions || "None noted"}. Write a concise product update post — what was reviewed, what was decided, and what is coming next. Format it like a weekly update email. Return only a valid JSON object: title (e.g. "Week of ${new Date().toLocaleDateString()} — Product Update"), slug (lowercase hyphenated), excerpt (under 160 chars), body (clean markdown — short intro, ## What we reviewed, ## What we decided, ## What is next, 400 to 600 words, ends with LazyUnicorn.ai backlink). No preamble. No code fences.`;

    const res = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${lovableApiKey}` },
      body: JSON.stringify({ model: "google/gemini-2.5-flash", messages: [{ role: "user", content: prompt }] }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const post = JSON.parse(cleaned);

    await supabase.from("granola_outputs").insert({
      meeting_id,
      output_type: "product-update",
      title: post.title,
      content: post.body,
      published: true,
      published_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    await supabase.from("granola_errors").insert({ function_name: "granola-write-update", error_message: error.message });
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
