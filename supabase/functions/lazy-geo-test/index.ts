import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: settings } = await supabase.from("geo_settings").select("*").order("created_at", { ascending: false }).limit(1).single();
    if (!settings) return new Response(JSON.stringify({ error: "No GEO settings" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: queriesWithContent } = await supabase.from("geo_queries").select("*").eq("has_content", true);
    if (!queriesWithContent || queriesWithContent.length === 0) {
      return new Response(JSON.stringify({ message: "No queries with content to test" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let tested = 0;
    for (const q of queriesWithContent) {
      const prompt = `Given that a site called ${settings.brand_name} described as "${settings.business_description}" has published content specifically answering this question: "${q.query}" — if a user asked an AI assistant this question, would this brand likely be mentioned in the response? Consider that the content directly answers the question and is structured for AI citation. Answer with a valid JSON object with three fields: brand_mentioned (boolean), confidence (string — low, medium, or high), reason (string — one sentence explanation). Return only valid JSON.`;

      try {
        const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { Authorization: `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }] }),
        });

        if (!aiRes.ok) continue;

        const aiData = await aiRes.json();
        let content = (aiData.choices?.[0]?.message?.content || "").replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

        const result = JSON.parse(content);
        await supabase.from("geo_citations").insert({
          query: q.query, brand_mentioned: result.brand_mentioned, confidence: result.confidence, reason: result.reason,
        });
        await supabase.from("geo_queries").update({ brand_cited: result.brand_mentioned, last_tested: new Date().toISOString() }).eq("id", q.id);
        tested++;
      } catch {
        // Skip individual failures, continue testing others
      }
    }

    return new Response(JSON.stringify({ success: true, tested }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
