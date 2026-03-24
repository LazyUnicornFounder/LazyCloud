import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Copy, Check, Heart, Search, FileText, DollarSign,
  Megaphone, TrendingUp, BookOpen, Package, Download,
  ShoppingCart, ArrowRight, RefreshCw,
} from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";
import { useCurrentPrompt } from "@/hooks/usePrompt";
import { toast } from "sonner";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const FALLBACK_PROMPT = `Add a complete autonomous store to my Lovable project using Lazy Store. I want:

1. A /lazy-store-setup page that asks me five questions about my niche, business model, brand voice, product sources, and pricing strategy
2. A product catalog that discovers and adds trending products in my niche automatically
3. AI-written product listings with SEO-optimised titles, descriptions, and pages
4. A pricing engine that monitors competitors and adjusts prices automatically
5. A promotion engine that identifies slow-moving products and creates offers automatically
6. A conversion optimiser that rewrites underperforming product pages weekly
7. An SEO content engine that publishes buying guides and product comparisons

Ask me these questions before building:
- What niche or industry is your store in?
- Which model: dropshipping, digital products, or affiliate?
- What's your brand voice and tone?
- Do you have existing product sources or should it discover products for you?
- What's your target price range?

Make the store feel native to my existing site — match my fonts, colors, and spacing exactly.`;

/* ── Reusable copy button ── */
function CopyPromptButton({
  className = "",
  onCopy,
  promptText,
  variant = "primary",
}: {
  className?: string;
  onCopy: () => void;
  promptText: string;
  variant?: "primary" | "ghost";
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    onCopy();
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2500);
  }, [onCopy, promptText]);

  const base =
    variant === "primary"
      ? "bg-primary text-primary-foreground shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]"
      : "border border-border text-foreground hover:bg-muted";

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity ${base} ${className}`}
    >
      {copied ? (
        <><Check size={16} /> Copied to clipboard ✓</>
      ) : (
        <><Copy size={16} /> Copy the Lovable Prompt</>
      )}
    </button>
  );
}

/* ── Loop visual ── */
const loopSteps = [
  "Product discovered",
  "Listing written & published",
  "Traffic arrives via SEO",
  "Conversion data collected",
  "Underperforming pages rewritten",
  "New products discovered",
];

function SelfImprovingLoop() {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square flex items-center justify-center">
      {loopSteps.map((step, i) => {
        const angle = (i / loopSteps.length) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const r = 42;
        const x = 50 + r * Math.cos(rad);
        const y = 50 + r * Math.sin(rad);
        return (
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12 }}
            className="absolute w-28 text-center"
            style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-display text-xs font-bold mb-1">
              {i + 1}
            </span>
            <p className="font-body text-xs text-foreground/80 leading-tight">{step}</p>
          </motion.div>
        );
      })}
      {/* centre arrow loop icon */}
      <RefreshCw size={32} className="text-primary/40 animate-spin" style={{ animationDuration: "12s" }} />
    </div>
  );
}

/* ── Page ── */
const LazyStorePage = () => {
  const trackEvent = useTrackEvent();
  const { prompt: dbPrompt } = useCurrentPrompt("lazy-store");
  const promptText = dbPrompt?.prompt_text || FALLBACK_PROMPT;
  const howItWorksRef = useRef<HTMLElement>(null);

  useEffect(() => {
    trackEvent("lazy_store_page_view");
  }, [trackEvent]);

  const handlePromptCopy = useCallback(() => {
    trackEvent("lazy_store_prompt_copy");
  }, [trackEvent]);

  const scrollToHow = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const steps = [
    "Copy the setup prompt from this page.",
    "Paste it into your existing Lovable project chat.",
    "Visit /lazy-store-setup on your site and answer five questions.",
    "Your store goes live and starts improving itself automatically.",
  ];

  const features = [
    { icon: Search, title: "Product Discovery", desc: "Finds trending products in your niche daily and adds them to your store automatically." },
    { icon: FileText, title: "Listing Writer", desc: "Writes SEO-optimised product titles, descriptions, and pages for every new product." },
    { icon: DollarSign, title: "Pricing Engine", desc: "Monitors competitor prices and adjusts yours automatically to stay competitive." },
    { icon: Megaphone, title: "Promotion Engine", desc: "Identifies slow-moving products and creates discount offers and homepage banners automatically." },
    { icon: TrendingUp, title: "Conversion Optimiser", desc: "Monitors which product pages convert, rewrites underperforming ones, and improves the store week over week." },
    { icon: BookOpen, title: "SEO Content Engine", desc: "Publishes buying guides and product comparisons targeting the keywords shoppers search before buying." },
  ];

  const models = [
    { icon: Package, title: "Dropshipping", desc: "Connect a supplier API, products sync automatically, orders route to fulfilment, you never touch inventory." },
    { icon: Download, title: "Digital Products", desc: "AI generates and lists digital products in your niche — zero inventory, zero fulfilment, fully autonomous revenue." },
    { icon: ShoppingCart, title: "Affiliate Store", desc: "No inventory at all. The store lists affiliate products, writes SEO content to drive traffic, earns commission on every sale." },
  ];

  const faqs = [
    { q: "Do I need products to start?", a: "No. The product discovery engine finds them for you based on your niche. You can also add your own." },
    { q: "Does it actually fulfil orders?", a: "Not yet. Lazy Store manages the store front, listings, pricing, and content. Order fulfilment connects to your existing supplier or digital delivery setup." },
    { q: "Will the listings sound generic?", a: "You set the brand voice, niche, and tone in the five-question setup. The AI writes every listing in your brand voice." },
    { q: "What if a product page is not converting?", a: "The conversion optimiser detects underperforming pages weekly and rewrites them automatically. You do not need to identify or fix them manually." },
    { q: "Can I add my own products?", a: "Yes. Manually added products get the same AI-written listings, pricing monitoring, and conversion optimisation as auto-discovered ones." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Store — Autonomous E-Commerce Engine for Lovable"
        description="One prompt installs a self-running store into your Lovable project. Product discovery, AI listings, pricing, promotions, and conversion optimisation — automatically, forever."
        url="/lazy-store"
      />
      <Navbar />

      <main className="relative z-10 pt-28 pb-32">
        {/* ── Hero ── */}
        <section className="relative max-w-4xl mx-auto text-center px-6 mb-24">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="font-display text-sm tracking-[0.2em] uppercase text-primary mb-4 font-bold flex items-center justify-center gap-3"
            >
              Introducing Lazy Store
              <span className="bg-primary text-primary-foreground text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 rounded-full">Beta</span>
            </motion.p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-8 max-w-3xl mx-auto">
              One prompt installs a store into your Lovable project. It finds the products, writes the listings, sets the prices, and improves its own conversion rate — automatically, forever.
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <CopyPromptButton onCopy={handlePromptCopy} promptText={promptText} />
              <button
                onClick={scrollToHow}
                className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full border border-border text-foreground hover:bg-muted transition-colors"
              >
                See How It Works <ArrowRight size={14} />
              </button>
            </div>
            <p className="inline-flex items-center gap-2 font-body text-xs text-muted-foreground">
              <Heart size={14} className="text-lovable fill-lovable" />
              Built exclusively for Lovable projects.
            </p>
          </motion.div>
        </section>

        {/* ── How It Works ── */}
        <section ref={howItWorksRef} className="max-w-4xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            One prompt. Then your store runs itself.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-5 text-center"
              >
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground font-display text-sm font-bold mb-3">
                  {i + 1}
                </span>
                <p className="font-body text-sm text-foreground/80 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── What It Does ── */}
        <section className="max-w-4xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            Everything a store needs to run and grow — done for you.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <item.icon size={18} className="text-primary" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Self-Improving Loop ── */}
        <section className="max-w-3xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            The store that gets better every week without you.
          </motion.h2>
          <SelfImprovingLoop />
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="font-body text-sm text-muted-foreground text-center max-w-xl mx-auto mt-8 leading-relaxed"
          >
            Most stores plateau. Lazy Store compounds. Every week it knows more about what converts in your niche and applies that knowledge to everything it publishes next.
          </motion.p>
        </section>

        {/* ── Three Models ── */}
        <section className="max-w-4xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            Pick your model. The engine runs the same.
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {models.map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-6 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon size={18} className="text-primary" />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="max-w-3xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            What does it cost?
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Free */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-bold text-foreground mb-1">Free</h3>
              <p className="font-display text-3xl font-extrabold text-foreground mb-4">$0</p>
              <ul className="space-y-2 font-body text-sm text-muted-foreground">
                <li>✓ The Lovable setup prompt</li>
                <li>✓ Self-hosted in your existing project</li>
                <li>✓ Bring your own Anthropic API key</li>
              </ul>
            </motion.div>
            {/* Pro */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: 0.08 }} className="rounded-2xl border-2 border-yellow-500/50 bg-card p-6 relative overflow-hidden">
              <span className="absolute top-3 right-3 bg-yellow-500/20 text-yellow-400 text-[10px] tracking-[0.15em] uppercase font-extrabold px-3 py-1 rounded-full">
                Coming Soon
              </span>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">Pro</h3>
              <p className="font-display text-3xl font-extrabold text-foreground mb-4">$49<span className="text-base font-normal text-muted-foreground">/mo</span></p>
              <ul className="space-y-2 font-body text-sm text-muted-foreground">
                <li>✓ Hosted version — no API key needed</li>
                <li>✓ Supplier integrations</li>
                <li>✓ Advanced conversion analytics</li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-2xl mx-auto px-6 mb-24">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-8">
            Questions
          </motion.h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <h3 className="font-display text-sm font-bold text-foreground mb-1">{faq.q}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="max-w-3xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-3xl border border-border bg-card px-8 py-14 text-center">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              The store that builds and runs itself.
            </h2>
            <p className="font-body text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed mb-8">
              Every other store requires you to find the products, write the copy, manage the pricing, run the promotions, and optimise the conversions. Lazy Store does all of that automatically. One prompt installs everything into your existing Lovable project.
            </p>
            <CopyPromptButton onCopy={handlePromptCopy} promptText={promptText} />
            <p className="font-body text-xs text-muted-foreground mt-4 max-w-md mx-auto">
              Then open your Lovable project, paste it into the chat, and answer five questions. Your store starts running today.
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyStorePage;
