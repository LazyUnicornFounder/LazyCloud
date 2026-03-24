import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Tv, Zap, FileText, Scissors, Search, MessageSquare, BarChart3, Brain } from "lucide-react";
import { toast } from "sonner";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const SETUP_PROMPT = `Install Lazy Stream — the autonomous Twitch content engine.

When a Twitch stream ends, Lazy Stream should:
1. Detect the new VOD via the Twitch API.
2. Transcribe the full VOD using AI.
3. Write a stream recap blog post from the transcript.
4. Extract the top clips and publish them to a highlights page.
5. Write an SEO article targeting the topics and games covered in the stream.
6. Extract the most engaged chat moments and include them in the recap.
7. Track which recaps drive the most site traffic and adjust the writing template automatically.

Create:
- A setup screen where the user enters their Twitch Client ID, Client Secret, and channel name.
- A dashboard showing all processed streams, published recaps, and performance metrics.
- A blog section for stream recaps at /stream-recaps.
- A highlights page at /stream-highlights.
- A "Live Now" badge component that appears on the site when the channel is live.
- A backend function that polls for new VODs, transcribes them, generates content, and publishes automatically.

Use Supabase for storage. Store Twitch credentials securely. The system should be fully autonomous after setup — no manual intervention required.`;

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const features = [
  { icon: Tv, title: "Live alerts", desc: "Your Lovable site shows a live badge automatically when you go live on Twitch." },
  { icon: FileText, title: "VOD transcription", desc: "Transcribes every stream using AI the moment the VOD becomes available." },
  { icon: Zap, title: "Stream recap", desc: "Writes a full blog post summarising each stream from the transcription automatically." },
  { icon: Scissors, title: "Clip extraction", desc: "Pulls your top clips from each stream and publishes them to a highlights page." },
  { icon: Search, title: "SEO articles", desc: "Writes a keyword-targeted SEO article from each stream targeting the topics and games you covered." },
  { icon: MessageSquare, title: "Chat highlights", desc: "Extracts the most engaged moments from chat and includes them in the recap." },
  { icon: BarChart3, title: "Viewer analytics", desc: "Tracks which streams drove the most site traffic and surfaces your best performing content." },
  { icon: Brain, title: "Self-improving content", desc: "Monitors which stream recaps get the most traffic and improves the writing template automatically week over week." },
];

const steps = [
  "Copy the setup prompt from this page.",
  "Paste it into your existing Lovable project chat.",
  "Add your Twitch credentials in the setup screen.",
  "Go live on Twitch as normal.",
  "Lazy Stream transcribes, writes, and publishes everything automatically when the stream ends.",
];

const faqs = [
  { q: "Do I need a Twitch affiliate or partner account?", a: "No. Lazy Stream works with any Twitch account. You need a free Twitch developer account to get API credentials." },
  { q: "How long does transcription take?", a: "Twitch VODs typically become available within a few minutes of the stream ending. Transcription and content generation usually completes within 15 to 30 minutes." },
  { q: "What if I stream for 8 hours?", a: "Lazy Stream processes the full VOD but focuses the recap and SEO article on the most engaged segments. Long streams produce richer content." },
  { q: "Does it post to social media automatically?", a: "Not in the current version. Content publishes to your Lovable site. Social posting is coming in the Pro version." },
  { q: "What games and content types does it work with?", a: "Everything. Lazy Stream works with any Twitch content — gaming, just chatting, music, creative. The AI adapts the recap style to the content type." },
];

function CopyPromptButton({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);
  const trackEvent = useTrackEvent();

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(SETUP_PROMPT);
    setCopied(true);
    trackEvent("copy_prompt", { product: "lazy-stream" });
    toast.success("Copied! Paste this into your Lovable project chat.");
    setTimeout(() => setCopied(false), 2000);
  }, [trackEvent]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold transition-opacity hover:opacity-90 active:scale-[0.97] bg-foreground text-background ${className}`}
    >
      {copied ? <><Check size={14} /> Copied ✓</> : <><Copy size={14} /> Copy the Lovable Prompt</>}
    </button>
  );
}

const LazyStreamPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Stream — Autonomous Twitch Content Engine for Lovable"
        description="One prompt turns every Twitch stream into a blog post, SEO article, and highlight reel — automatically."
        url="/lazy-stream"
        keywords="Twitch content automation, stream to blog, VOD transcription, Twitch SEO, autonomous content, Lovable, Lazy Stream"
      />
      <Navbar />

      {/* Hero */}
      <header className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: "#0a0a08" }}>
        <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="text-center max-w-3xl">
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-block font-body text-[10px] tracking-[0.2em] uppercase px-3 py-1 border border-border text-foreground/40 mb-6">
              Powered by Twitch
            </span>
          </motion.div>
          <motion.p variants={fadeUp} transition={{ duration: 0.6 }} style={{ fontFamily: "'Dancing Script', cursive", fontSize: "2rem", color: "#f0ead6", opacity: 0.4 }}>
            Lazy Stream
          </motion.p>
          <motion.h1 variants={fadeUp} transition={{ duration: 0.8 }} className="mt-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 3.2rem)", color: "#f0ead6", lineHeight: 1.1 }}>
            One prompt turns every Twitch stream into a blog post, SEO article, and highlight reel — automatically.
          </motion.h1>
          <motion.p variants={fadeUp} transition={{ duration: 0.6 }} className="mt-6 text-sm sm:text-base leading-relaxed" style={{ color: "#f0ead6", opacity: 0.5 }}>
            Lazy Stream monitors your Twitch channel, transcribes your VODs, writes stream recaps, extracts highlights, and publishes SEO content to your Lovable site — all while you are still eating dinner after the stream ends.
          </motion.p>
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <CopyPromptButton />
            <a
              href="#how-it-works"
              className="inline-block font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all"
              onClick={(e) => { e.preventDefault(); document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              See How It Works
            </a>
          </motion.div>
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-block font-body text-[10px] tracking-[0.15em] uppercase px-3 py-1 border border-border text-foreground/20 mt-6">
              BETA
            </span>
          </motion.div>
        </motion.div>
      </header>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 scroll-mt-20" style={{ backgroundColor: "#111110" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>How it works</p>
          <h2 className="mt-2" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            Stream. Then do nothing. Lazy Stream handles the rest.
          </h2>
          <div className="mt-12 space-y-0">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex gap-4 py-5 border-b border-border"
              >
                <span className="font-display text-2xl font-bold text-foreground/20 shrink-0 w-8">{i + 1}</span>
                <p className="font-body text-sm text-foreground/60 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What it installs */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>What it installs</p>
          <h2 className="mt-2 mb-12" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            Hours of content. Zero post-production.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-card p-8"
              >
                <f.icon size={20} className="text-foreground/30 mb-4" />
                <h3 className="font-display text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="font-body text-sm text-foreground/40 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The content problem */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#111110" }}>
        <div className="max-w-4xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>The problem</p>
          <h2 className="mt-2 mb-12" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            You stream for hours. Your site gets nothing.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            <div className="bg-[#111110] p-8">
              <p className="font-body text-sm text-foreground/50 leading-relaxed">
                Every stream is hours of content. Highlights, moments, tutorials, stories, commentary. Content that would rank on Google, drive traffic, and build an audience outside Twitch. Content that disappears the moment the stream ends because turning it into anything publishable requires time you do not have.
              </p>
            </div>
            <div className="bg-[#111110] p-8">
              <p className="font-body text-sm text-foreground/50 leading-relaxed">
                Lazy Stream changes the economics. The stream ends. The engine starts. Transcription, recap, highlights, SEO article — all published to your Lovable site automatically before you have finished your post-stream routine. Your Twitch channel and your website compound together. One stream. Multiple pieces of permanent, indexed, searchable content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Self-improving */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Self-improving</p>
          <h2 className="mt-2 mb-8" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            Stream recaps that get better every week without you.
          </h2>
          <p className="font-body text-sm text-foreground/50 leading-relaxed">
            Lazy Stream tracks which stream recaps drive the most traffic to your site. When it identifies patterns — stream length, topic, game, time of day — it adjusts the writing template automatically to produce more of what performs. The recaps get sharper. The SEO articles get better targeted. The highlights get more relevant. All without you changing a setting.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#111110" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>Pricing</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border mt-8">
            {/* Free */}
            <div className="bg-card p-8 flex flex-col">
              <h3 className="font-display text-2xl font-bold text-foreground">Free</h3>
              <ul className="mt-6 space-y-3 flex-1">
                {["Lazy Stream setup prompt", "Self-hosted in your existing Lovable project", "Bring your own Twitch developer account", "Free to set up"].map((item, i) => (
                  <li key={i} className="font-body text-sm text-foreground/40 flex items-start gap-2">
                    <Check size={14} className="text-foreground/30 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <CopyPromptButton className="w-full justify-center" />
              </div>
            </div>
            {/* Pro */}
            <div className="bg-card p-8 flex flex-col border-l-2 border-yellow-600/40">
              <div className="flex items-center gap-3">
                <h3 className="font-display text-2xl font-bold text-foreground">Pro</h3>
                <span className="font-body text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 border border-yellow-600/40 text-yellow-600/70">Coming Soon</span>
              </div>
              <p className="font-display text-3xl font-bold text-foreground mt-2">$19<span className="text-base font-normal text-foreground/40">/mo</span></p>
              <ul className="mt-6 space-y-3 flex-1">
                {["Hosted version", "Automatic clip editing", "YouTube cross-posting", "Advanced stream analytics"].map((item, i) => (
                  <li key={i} className="font-body text-sm text-foreground/40 flex items-start gap-2">
                    <Check size={14} className="text-foreground/30 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <button disabled className="w-full font-body text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 font-semibold border border-border text-foreground/30 cursor-not-allowed">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#0a0a08" }}>
        <div className="max-w-3xl mx-auto">
          <p style={{ fontFamily: "'Dancing Script', cursive", fontSize: "1.5rem", color: "#f0ead6", opacity: 0.4 }}>FAQ</p>
          <div className="mt-8 space-y-0">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="border-b border-border py-6"
              >
                <h3 className="font-display text-base font-bold text-foreground mb-2">{faq.q}</h3>
                <p className="font-body text-sm text-foreground/40 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-6 md:px-12" style={{ backgroundColor: "#111110" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#f0ead6", lineHeight: 1.2 }}>
            Your streams are content. Lazy Stream publishes them.
          </h2>
          <p className="mt-6 font-body text-sm text-foreground/50 leading-relaxed max-w-xl mx-auto">
            Every hour you stream is an hour of blog posts, SEO articles, and highlights waiting to be published. One prompt installs the entire pipeline — transcription, writing, publishing — into your existing Lovable project.
          </p>
          <div className="mt-8">
            <CopyPromptButton />
          </div>
          <p className="mt-4 font-body text-xs text-foreground/25 max-w-md mx-auto leading-relaxed">
            Open your Lovable project, paste it into the chat, add your Twitch credentials. Your next stream will be published to your site automatically when it ends.
          </p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.65rem", color: "#f0ead6", opacity: 0.2, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "3rem" }}>
            Made for Lovable
          </p>
        </div>
      </section>
    </div>
  );
};

export default LazyStreamPage;
