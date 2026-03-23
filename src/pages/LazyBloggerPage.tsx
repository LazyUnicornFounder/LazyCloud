import { motion } from "framer-motion";
import { Zap, FileText, BarChart3, Play, Pause, PenTool, Search, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import BlogTicker from "@/components/BlogTicker";
import { supabase } from "@/integrations/supabase/client";
import unicornBg from "@/assets/unicorn-beach.png";

const steps = [
  { num: 1, title: "Clone the template", desc: "One click to fork it into your Lovable project." },
  { num: 2, title: "Answer five questions", desc: "Your niche, tone, audience, topics, and CTA — that's it." },
  { num: 3, title: "Add your Anthropic API key", desc: "Paste your key. Lazy Blogger handles the rest." },
  { num: 4, title: "Hit Start Publishing", desc: "Done. Posts start flowing. Walk away." },
];

const features = [
  { icon: FileText, label: "4 posts published per day" },
  { icon: Search, label: "SEO-optimised markdown" },
  { icon: PenTool, label: "Your brand voice and topics" },
  { icon: BarChart3, label: "Public blog at /blog" },
  { icon: Zap, label: "Owner dashboard at /dashboard" },
  { icon: Play, label: "Manual publish trigger" },
  { icon: Pause, label: "Pause and resume anytime" },
];

const LazyBloggerPage = () => {
  const [email, setEmail] = useState("");
  const [footerEmail, setFooterEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleEarlyAccess = async (emailValue: string, setter: (v: string) => void) => {
    if (!emailValue.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("early_access").insert({ email: emailValue.trim().toLowerCase() });
    setSubmitting(false);
    if (error?.code === "23505") {
      toast.info("You're already on the list!");
      setter("");
      return;
    }
    if (error) {
      toast.error("Something went wrong. Try again.");
      return;
    }
    toast.success("You're in! We'll notify you when Lazy Blogger launches.");
    setter("");
  };

  return (
    <div className="min-h-screen text-foreground relative">
      <SEO
        title="Lazy Blogger — Autonomous Blog Publishing for Lovable Sites"
        description="Answer five questions. Lazy Blogger writes and publishes four SEO blog posts a day to your Lovable site — automatically, forever."
        url="/lazy-blogger"
      />
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BlogTicker />
      </div>
      <Navbar />

      <main className="relative z-10 pt-28 pb-32 px-6 md:px-12">
        {/* ── Hero ── */}
        <section className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-xl border border-primary/20 rounded-full px-5 py-2 mb-8">
              <Zap size={14} className="text-primary" />
              <span className="font-body text-[10px] tracking-[0.2em] uppercase text-primary font-semibold">
                Built by Lazy Unicorn
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[0.92] mb-6">
              Your Lovable Site.<br />
              Four Blog Posts a Day.<br />
              <span className="text-primary">Zero Effort.</span>
            </h1>
            <p className="font-body text-lg md:text-xl text-foreground/50 max-w-2xl mx-auto leading-relaxed mb-10">
              Answer five questions about your business. Lazy Blogger writes and publishes four SEO blog posts a day to your Lovable site — automatically, forever, without you touching anything.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <div className="relative flex-1 w-full">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEarlyAccess(email, setEmail)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-4 rounded-full bg-foreground/5 backdrop-blur-xl border border-primary/20 text-foreground placeholder:text-foreground/30 font-body text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <button
                onClick={() => handleEarlyAccess(email, setEmail)}
                disabled={submitting}
                className="whitespace-nowrap bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50"
              >
                {submitting ? "Joining…" : "Get Early Access"}
              </button>
            </div>
            <p className="font-body text-[11px] text-foreground/30 mt-4">No spam. Just a heads-up when it's ready.</p>
          </motion.div>
        </section>

        {/* ── How it works ── */}
        <section className="max-w-5xl mx-auto mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-sm font-bold tracking-[0.2em] uppercase text-primary mb-8 text-center"
          >
            How it works
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-transparent backdrop-blur-xl rounded-2xl border border-primary/20 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-display text-lg font-bold mb-4">
                  {step.num}
                </span>
                <h3 className="font-display text-base font-bold text-foreground mb-2">{step.title}</h3>
                <p className="font-body text-sm text-foreground/40 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── What you get ── */}
        <section className="max-w-3xl mx-auto mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-sm font-bold tracking-[0.2em] uppercase text-primary mb-8 text-center"
          >
            What you get
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-transparent backdrop-blur-xl rounded-3xl border border-primary/20 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                    <f.icon size={16} className="text-primary" />
                  </div>
                  <span className="font-body text-sm text-foreground/70">{f.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Footer CTA ── */}
        <section className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-transparent backdrop-blur-xl rounded-3xl border border-primary/20 px-8 py-16 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_30px_rgba(var(--primary-rgb),0.08)]"
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
              Stop Writing.<br />
              <span className="text-primary">Start Compounding.</span>
            </h2>
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
              <div className="relative flex-1 w-full">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
                <input
                  type="email"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEarlyAccess(footerEmail, setFooterEmail)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-4 rounded-full bg-foreground/5 backdrop-blur-xl border border-primary/20 text-foreground placeholder:text-foreground/30 font-body text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <button
                onClick={() => handleEarlyAccess(footerEmail, setFooterEmail)}
                disabled={submitting}
                className="whitespace-nowrap bg-primary text-primary-foreground font-display font-bold text-sm tracking-[0.08em] uppercase px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50"
              >
                {submitting ? "Joining…" : "Get Early Access"}
              </button>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
};

export default LazyBloggerPage;
