import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PricingSection = () => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("polar-checkout", {
        body: { action: "create_checkout", submission_id: "direct" },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      toast.error("Failed to start checkout. Please try again.");
      console.error("Checkout error:", err);
    }
    setLoading(false);
  };

  return (
    <section id="pricing" className="relative z-10 border-t border-border">
      <div className="px-6 md:px-12 py-20 md:py-28 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-body text-[14px] tracking-[0.2em] uppercase mb-4" style={{ color: "#c8a961", opacity: 0.6 }}>
            Pricing
          </p>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#f0ead6", lineHeight: 0.95, letterSpacing: "-0.01em" }}>
            Every agent is free.
          </h2>
          <p className="mt-6 max-w-xl font-body text-base md:text-lg leading-relaxed" style={{ color: "#f0ead6", opacity: 0.5 }}>
            Install any agent with a single prompt. Upgrade to Pro for a dedicated product page, priority placement, and a Pro badge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl border border-border p-7 flex flex-col bg-card"
          >
            <p className="font-body text-[14px] tracking-[0.2em] uppercase text-muted-foreground mb-1">
              Lazy
            </p>
            <p className="font-display text-4xl font-extrabold text-foreground">
              Free
            </p>
            <p className="font-body text-sm text-muted-foreground mt-1 mb-6">
              Forever free
            </p>

            <ul className="space-y-3 flex-1">
              {[
                "Listed in the directory",
                "Basic name + tagline",
                "Link to your website",
                "Manual review & approval",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                  <span className="font-body text-sm text-foreground/60">{f}</span>
                </li>
              ))}
            </ul>

            <a
              href="/pricing"
              className="mt-6 w-full inline-flex items-center justify-center font-body text-[13px] tracking-[0.15em] uppercase border border-foreground/20 text-foreground/70 hover:text-primary hover:border-primary/40 px-6 py-2.5 rounded-full font-semibold transition-colors"
            >
              Learn More
            </a>
          </motion.div>

          {/* Pro Tier */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-xl border border-primary/30 p-7 relative overflow-hidden flex flex-col bg-card"
          >
            {/* Glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="flex items-center gap-2 mb-1">
              <p className="font-body text-[14px] tracking-[0.2em] uppercase text-primary">
                Pro
              </p>
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 font-body text-[13px] tracking-wider uppercase font-semibold">
                <Sparkles size={9} />
                Popular
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="font-display text-4xl font-extrabold text-foreground">$5</p>
              <span className="font-body text-sm text-muted-foreground">/mo</span>
            </div>
            <p className="font-body text-sm text-muted-foreground mt-1 mb-6">
              Cancel anytime
            </p>

            <ul className="space-y-3 flex-1">
              {[
                "Everything in Lazy",
                "Dedicated product page",
                "Full description & features list",
                "Logo & screenshot showcase",
                "⭐ Pro badge in directory",
                "Priority placement at top",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check size={14} className="text-primary mt-0.5 shrink-0" />
                  <span className="font-body text-sm text-foreground/70">{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-6 w-full font-body text-[13px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Loading…
                </>
              ) : (
                "Get listed →"
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
