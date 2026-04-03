import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PRODUCTS: Record<string, { name: string; description: string; priceAmount: number }> = {
  starter: {
    name: "Lazy Cloud Starter",
    description: "Up to 50 GB, 50,000 files, 5 users, email support.",
    priceAmount: 49900, // $499
  },
  professional: {
    name: "Lazy Cloud Professional",
    description: "Up to 500 GB, 500,000 files, 25 users, priority support, custom branding.",
    priceAmount: 99900, // $999
  },
};

async function getOrCreateProduct(
  supabase: any,
  token: string,
  tier: string,
): Promise<string> {
  const configKey = `polar_product_id_${tier}`;
  const { data: config } = await supabase
    .from("app_config")
    .select("value")
    .eq("key", configKey)
    .maybeSingle();

  if (config?.value) return config.value;

  const spec = PRODUCTS[tier];
  if (!spec) throw new Error(`Unknown tier: ${tier}`);

  const res = await fetch("https://api.polar.sh/v1/products/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: spec.name,
      description: spec.description,
      prices: [
        {
          type: "one_time",
          amount_type: "fixed",
          price_amount: spec.priceAmount,
          price_currency: "usd",
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create Polar product (${tier}): ${err}`);
  }

  const product = await res.json();
  await supabase.from("app_config").upsert({ key: configKey, value: product.id });
  return product.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const POLAR_ACCESS_TOKEN = Deno.env.get("POLAR_ACCESS_TOKEN");
    if (!POLAR_ACCESS_TOKEN) throw new Error("POLAR_ACCESS_TOKEN is not configured");

    const body = await req.json();
    const { action, tier, submission_id, checkout_id, product_data } = body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    /* ── Create checkout for a pricing tier ── */
    if (action === "create_checkout") {
      const productTier = (tier || "starter").toLowerCase();
      if (!PRODUCTS[productTier]) throw new Error("Invalid tier");

      const productId = await getOrCreateProduct(supabase, POLAR_ACCESS_TOKEN, productTier);

      const origin =
        req.headers.get("origin") || "https://lazycloud1.lovable.app";

      const checkoutRes = await fetch("https://api.polar.sh/v1/checkouts/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: [productId],
          success_url: `${origin}/checkout/success?checkout_id={CHECKOUT_ID}&tier=${productTier}`,
          metadata: { tier: productTier, ...(submission_id ? { submission_id } : {}) },
        }),
      });

      if (!checkoutRes.ok) {
        const err = await checkoutRes.text();
        throw new Error(`Failed to create checkout: ${err}`);
      }

      const checkout = await checkoutRes.json();
      return new Response(JSON.stringify({ url: checkout.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    /* ── Verify checkout ── */
    if (action === "verify_checkout") {
      const checkoutRes = await fetch(
        `https://api.polar.sh/v1/checkouts/${checkout_id}`,
        { headers: { Authorization: `Bearer ${POLAR_ACCESS_TOKEN}` } },
      );
      if (!checkoutRes.ok) throw new Error("Failed to verify checkout");

      const checkout = await checkoutRes.json();

      if (checkout.status === "succeeded" && submission_id) {
        await supabase
          .from("submissions")
          .update({
            is_paid: true,
            polar_customer_id: checkout.customer_id || null,
            polar_subscription_id: checkout.subscription_id || null,
          })
          .eq("slug", submission_id);
      }

      return new Response(
        JSON.stringify({ status: checkout.status, tier: checkout.metadata?.tier }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    /* ── Update listing (legacy) ── */
    if (action === "update_listing") {
      if (!submission_id || !product_data) throw new Error("submission_id and product_data are required");
      const { description, features, logo_url, screenshot_url } = product_data;
      await supabase
        .from("submissions")
        .update({
          description: description || null,
          features: features || [],
          logo_url: logo_url || null,
          screenshot_url: screenshot_url || null,
        })
        .eq("slug", submission_id);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid action");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("polar-checkout error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
