import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MANIFESTO_TEXT = `Here's to the lazy ones.

The ones who automate. The ones who sleep while their sites publish. The ones who push one prompt and walk away. The ones who see a task and ask — does this have to be me?

They're not actually lazy. The ones who move fast enough to make the work disappear. The ones who build systems instead of doing things twice. The ones who think the most valuable thing you can do is stop doing things manually.

You can quote them, disagree with them, try to outwork them. The only thing you can't do is ignore what they've built.

Because while you were doing it yourself, they shipped.

They turn streams into articles. Commits into changelogs. Payments into optimised revenue. Customers into conversations. Posts into podcasts. Sites into businesses.

Some see a blank text editor. The lazy ones see twenty engines that will never need one.

And the sites they run on Lovable — the ones that publish four posts before sunrise, that text customers before you've had coffee, that pentest themselves while you sleep, that get cited by ChatGPT without you asking — they change things.

Because the people who are lazy enough to think they don't have to do everything manually, are the ones who actually do everything.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if we already have the audio cached in storage
    const { data: existingFile } = await supabase.storage
      .from("audio")
      .createSignedUrl("manifesto.mp3", 3600);

    if (existingFile?.signedUrl) {
      return new Response(JSON.stringify({ audioUrl: existingFile.signedUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate TTS using ElevenLabs - George voice, warm and authoritative
    const voiceId = "JBFqnCBsd6RMkjVDRZzb"; // George
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: MANIFESTO_TEXT,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.75,
            style: 0.4,
            use_speaker_boost: true,
            speed: 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();

    // Ensure the audio bucket exists
    const { error: bucketError } = await supabase.storage.createBucket("audio", {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });
    // Ignore "already exists" errors
    if (bucketError && !bucketError.message.includes("already exists")) {
      console.error("Bucket creation error:", bucketError);
    }

    // Upload to storage for caching
    const { error: uploadError } = await supabase.storage
      .from("audio")
      .upload("manifesto.mp3", audioBuffer, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
    }

    // Get public URL
    const { data: publicUrl } = supabase.storage
      .from("audio")
      .getPublicUrl("manifesto.mp3");

    return new Response(
      JSON.stringify({ audioUrl: publicUrl.publicUrl }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Manifesto TTS error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
