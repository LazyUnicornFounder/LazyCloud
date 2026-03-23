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
    if (!settings) return new Response(JSON.stringify({ error: "No GEO settings found" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const prompt = `You are a GEO specialist. For a business described as "${settings.business_description}" targeting ${settings.target_audience} covering these topics: ${settings.niche_topics} and competing with: ${settings.competitors} — generate 20 specific conversational questions that potential customers are typing into AI assistants like ChatGPT, Claude, and Perplexity when researching this topic. These must be real questions with genuine search intent — the kind a person would actually type into an AI engine. Categorise each as informational, commercial, or navigational. Return only a valid JSON array where each item has three fields: query (string), query_type (string), priority (integer from 1 to 10 where 10 is highest). No preamble. No code fences. Valid JSON only.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${lovableApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "google/gemini-3-flash-preview", messages: [{ role: "system", content: "Return only valid JSON." }, { role: "user", content: prompt }] }),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text();
      await supabase.from("geo_errors").insert({ error_message: `AI failed: ${aiRes.status}` });
      return new Response(JSON.stringify({ error: "AI failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const aiData = await aiRes.json();
    let content = (aiData.choices?.[0]?.message?.content || "").replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();

    let queries: any[];
    try { queries = JSON.parse(content); } catch {
      await supabase.from("geo_errors").insert({ error_message: `Parse failed: ${content.slice(0, 200)}` });
      return new Response(JSON.stringify({ error: "Parse failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Get existing queries to skip duplicates
    const { data: existing } = await supabase.from("geo_queries").select("query");
    const existingSet = new Set((existing || []).map((q: any) => q.query?.toLowerCase()));

    const newRows = queries.filter((q: any) => !existingSet.has(q.query?.toLowerCase())).map((q: any) => ({
      query: q.query, query_type: q.query_type, priority: q.priority, has_content: false, brand_cited: false,
    }));

    if (newRows.length > 0) await supabase.from("geo_queries").insert(newRows);

    return new Response(JSON.stringify({ success: true, count: newRows.length }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
