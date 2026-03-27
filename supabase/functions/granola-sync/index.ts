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
    const { data: settings } = await supabase.from("granola_settings").select("*").limit(1).single();
    if (!settings?.is_running || !settings?.setup_complete) {
      return new Response(JSON.stringify({ message: "Granola not running or setup incomplete" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // NOTE: Granola MCP integration placeholder
    // In production, this would use the Granola MCP server to fetch meetings.
    // For now, return a message indicating the sync check completed.
    return new Response(JSON.stringify({ 
      message: "Granola sync completed. Connect Granola MCP server to fetch meetings automatically.",
      settings_found: true,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (error) {
    await supabase.from("granola_errors").insert({
      function_name: "granola-sync",
      error_message: error.message,
    });
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
