import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { meeting_id } = await req.json();
    if (!meeting_id) throw new Error("meeting_id required");

    const { data: settings } = await supabase.from("granola_settings").select("*").limit(1).single();
    const { data: meeting } = await supabase.from("granola_meetings").select("*").eq("id", meeting_id).single();

    if (!meeting || meeting.processing_status !== "pending") {
      return new Response(JSON.stringify({ message: "Meeting not pending" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    await supabase.from("granola_meetings").update({ processing_status: "processing" }).eq("id", meeting_id);

    // Classify meeting type using Lovable AI
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    let meetingType = "other";
    
    if (lovableApiKey) {
      const classifyRes = await fetch("https://api.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${lovableApiKey}` },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{
            role: "user",
            content: `Given this meeting title: ${meeting.title} and these notes: ${(meeting.enhanced_notes || "").slice(0, 500)}, classify this meeting into one of these types: customer-discovery, planning, product-review, standup, 1on1, pitch, other. Return only the type string. No preamble.`
          }],
        }),
      });
      const classifyData = await classifyRes.json();
      meetingType = classifyData.choices?.[0]?.message?.content?.trim() || "other";
    }

    await supabase.from("granola_meetings").update({ meeting_type: meetingType }).eq("id", meeting_id);

    // Check if meeting type should be processed
    const allowedTypes = settings?.meeting_types_to_process || "all";
    if (allowedTypes !== "all" && !allowedTypes.split(",").includes(meetingType)) {
      await supabase.from("granola_meetings").update({ processing_status: "done", processed: true }).eq("id", meeting_id);
      return new Response(JSON.stringify({ message: "Meeting type excluded" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Trigger enabled outputs in parallel
    const baseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const callFn = (fn: string) => fetch(`${baseUrl}/functions/v1/${fn}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${serviceKey}` },
      body: JSON.stringify({ meeting_id }),
    });

    const tasks: Promise<any>[] = [];
    if (settings?.publish_blog_posts && !["standup", "1on1"].includes(meetingType)) {
      tasks.push(callFn("granola-write-post"));
    }
    if (settings?.send_slack_summary && settings?.slack_webhook_url) {
      tasks.push(callFn("granola-slack-summary"));
    }
    if (settings?.publish_product_updates && ["planning", "product-review"].includes(meetingType)) {
      tasks.push(callFn("granola-write-update"));
    }
    if (settings?.feed_customer_intelligence && meetingType === "customer-discovery") {
      tasks.push(callFn("granola-extract-intel"));
    }

    await Promise.allSettled(tasks);

    await supabase.from("granola_meetings").update({ processing_status: "done", processed: true }).eq("id", meeting_id);

    return new Response(JSON.stringify({ success: true, meetingType }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    await supabase.from("granola_errors").insert({ function_name: "granola-process", error_message: error.message });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
