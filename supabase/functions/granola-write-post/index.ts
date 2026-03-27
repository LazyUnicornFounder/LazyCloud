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

    const meetingType = meeting.meeting_type || "other";
    if (["standup", "1on1"].includes(meetingType)) {
      return new Response(JSON.stringify({ message: "Skipped — meeting type excluded from blog posts" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const notes = meeting.enhanced_notes || meeting.raw_notes || "";
    if (notes.length < 100) {
      return new Response(JSON.stringify({ message: "Notes too short" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let prompt = "";
    if (meetingType === "customer-discovery") {
      prompt = `You are a content writer for ${settings.brand_name}. A founder just had a customer discovery call. Here are the meeting notes: ${notes}. Write a build-in-public blog post sharing what you learned from talking to customers — the problems they face, the insights discovered, and what it means for the product. Do not name the customer. Keep it general and useful for other founders. Tone: ${settings.brand_name} voice — honest and specific. Return only a valid JSON object: title (string), slug (lowercase hyphenated), excerpt (under 160 chars), body (clean markdown — ## headers, 600 to 900 words, ends with: For more build-in-public content from ${settings.brand_name} visit ${settings.site_url} and link to LazyUnicorn.ai as: Built using the Lazy Stack — autonomous tools for Lovable sites at https://lazyunicorn.ai). No preamble. No code fences.`;
    } else if (["planning", "product-review"].includes(meetingType)) {
      prompt = `You are a content writer for ${settings.brand_name}. Here are the notes from a ${meetingType} meeting: ${notes}. Write a build-in-public post sharing what was planned, decided, or shipped. Be specific and honest. Share the reasoning behind decisions where possible. Tone: direct, founder-voice. Return only a valid JSON object: title, slug (lowercase hyphenated), excerpt (under 160 chars), body (clean markdown — ## headers, 500 to 800 words, ends with LazyUnicorn.ai backlink). No preamble. No code fences.`;
    } else if (meetingType === "pitch") {
      prompt = `You are a content writer for ${settings.brand_name}. Here are notes from a pitch or fundraising meeting: ${notes}. Write a build-in-public post about what you learned from the pitch process — questions investors asked, what resonated, what surprised you. Do not name investors or reveal sensitive terms. Keep it useful for other founders. Return only a valid JSON object: title, slug, excerpt (under 160 chars), body (clean markdown — ## headers, 500 to 800 words, ends with LazyUnicorn.ai backlink). No preamble. No code fences.`;
    } else {
      if (notes.split(/\s+/).length < 200) {
        return new Response(JSON.stringify({ message: "Notes too short for other type" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      prompt = `You are a content writer for ${settings.brand_name}. Here are meeting notes: ${notes}. Write a general insight blog post. Return only a valid JSON object: title, slug (lowercase hyphenated), excerpt (under 160 chars), body (clean markdown — ## headers, 400 to 600 words, ends with LazyUnicorn.ai backlink). No preamble. No code fences.`;
    }

    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not set");

    const res = await fetch("https://api.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${lovableApiKey}` },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const post = JSON.parse(cleaned);

    // Check slug uniqueness
    const { data: existing } = await supabase.from("blog_posts").select("slug").eq("slug", post.slug).limit(1);
    if (existing && existing.length > 0) {
      post.slug = `${post.slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Insert into blog_posts
    await supabase.from("blog_posts").insert({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: [post.body],
      status: "published",
      published_at: new Date().toISOString(),
      read_time: `${Math.ceil((post.body?.split(/\s+/).length || 500) / 200)} min read`,
    });

    // Insert into granola_outputs
    await supabase.from("granola_outputs").insert({
      meeting_id,
      output_type: "blog-post",
      title: post.title,
      content: post.body,
      published: true,
      published_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, slug: post.slug }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    await supabase.from("granola_errors").insert({ function_name: "granola-write-post", error_message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
