import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, Wrench, HardHat, BarChart3, Github, Key, Bot } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { useTrackEvent } from "@/hooks/useTrackEvent";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };

const agents = [
  { emoji: "👁️", name: "Lazy Watch", tagline: "Your stack watches itself.", desc: "Monitors every agent's error table hourly and opens GitHub issues automatically.", href: "/lazy-watch", icon: Eye },
  { emoji: "🔧", name: "Lazy Fix", tagline: "Your prompts improve while you sleep.", desc: "Reads performance data every Sunday and opens PRs with targeted prompt improvements.", href: "/lazy-fix", icon: Wrench },
  { emoji: "🏗️", name: "Lazy Build", tagline: "Describe it. Claude builds it.", desc: "Writes complete new agent prompts from a one-paragraph brief and opens a draft GitHub PR.", href: "/lazy-build", icon: HardHat },
  { emoji: "📊", name: "Lazy Intel", tagline: "Your strategy writes itself.", desc: "Reads all your agent data every Monday and fills your SEO and GEO queues automatically.", href: "/lazy-intel", icon: BarChart3 },
  { emoji: "🔄", name: "Lazy Repurpose", tagline: "One post. Five formats. Zero writing.", desc: "Every Sunday, turns your top blog posts into Twitter threads, LinkedIn posts, newsletter sections, and video scripts.", href: "/lazy-repurpose", icon: Bot },
  { emoji: "🔥", name: "Lazy Trend", tagline: "Be first on every trending topic.", desc: "Scans Perplexity, Firecrawl, and competitors every 6 hours. Queues SEO keywords and GEO articles on trending topics.", href: "/lazy-trend", icon: BarChart3 },
  { emoji: "💰", name: "Lazy Churn", tagline: "The cheapest customer is the one you keep.", desc: "Monitors Stripe subscribers daily. Sends personalised re-engagement SMS and email before cancellation happens.", href: "/lazy-churn", icon: Eye },
];

const prerequisites = [
  { icon: Github, title: "GitHub repo", desc: "Your LazyUnicorn prompts live in a GitHub repo. The agents read and write to it. You need GITHUB_TOKEN as a secret with repo scope." },
  { icon: Bot, title: "At least 3 agents installed", desc: "Ops agents need performance data to analyse. Install Lazy Blogger, Lazy SEO, and Lazy GEO as a minimum before running Lazy Fix or Lazy Intel." },
  { icon: Key, title: "ANTHROPIC_API_KEY", desc: "All seven agents use Claude for diagnosis, writing, and strategy. Set this as a secret if not already done." },
];

export default function LazyAgentsPage() {
  const trackEvent = useTrackEvent();
  useEffect(() => { trackEvent("lazy_agents_page_view"); }, [trackEvent]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Lazy Agents — Autonomous Stack Intelligence | Lazy Unicorn"
        description="Seven autonomous agents that monitor your stack, fix broken prompts, improve performance, and write new agents — running inside your Lovable project."
        url="/lazy-agents"
        keywords="autonomous agents, self-improving stack, Lovable agents, prompt improvement, error monitoring"
      />
      <Navbar />

      <main className="relative z-10 pb-32">
        {/* Hero */}
        <section className="relative px-6 md:px-12 pt-32 pb-32 md:pb-40" style={{ backgroundColor: "#0a0a08" }}>
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.7 }}>
              <p className="font-display text-[11px] tracking-[0.25em] uppercase text-foreground/40 font-bold mb-6">Lazy Agents</p>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 3.2rem)", color: "#f0ead6", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
                Your agents monitor, fix, and improve themselves.
              </h1>
              <p className="mt-6 font-body text-base md:text-lg text-foreground/60 max-w-2xl mx-auto leading-relaxed">
                Seven autonomous ops agents that monitor errors, fix prompts, build new agents, strategise content, repurpose posts, detect trends, and prevent churn — all running inside your Lovable project.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Agent cards */}
        <section className="max-w-4xl mx-auto px-6 mt-8 mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-border">
            {agents.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="border-b sm:odd:border-r last:border-b-0 sm:[&:nth-child(3)]:border-b-0 border-border bg-card p-8 flex flex-col"
              >
                <p className="text-2xl leading-[1.2] mb-3 pt-1">{agent.emoji}</p>
                <h3 className="font-display text-lg font-bold text-foreground mb-1">{agent.name}</h3>
                <p className="font-body text-sm font-semibold text-[#c8a961] mb-2">{agent.tagline}</p>
                <p className="font-body text-sm text-foreground/50 leading-relaxed mb-6 flex-1">{agent.desc}</p>
                <Link
                  to={agent.href}
                  className="inline-flex items-center gap-2 font-display text-xs tracking-[0.15em] uppercase font-bold text-foreground/60 hover:text-foreground transition-colors"
                >
                  View Agent →
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Prerequisites */}
        <section className="max-w-3xl mx-auto px-6 mb-20">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-10">
            What you need before installing ops agents
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-border">
            {prerequisites.map((req, i) => (
              <motion.div
                key={req.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 border-border bg-card p-6 text-center"
              >
                <req.icon size={18} className="text-[#c8a961] mx-auto mb-3" />
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{req.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{req.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="font-body text-sm text-foreground/40 mb-6">Pick an agent and get started.</p>
            <div className="flex flex-wrap justify-center gap-3">
              {agents.map((a) => (
                <Link
                  key={a.href}
                  to={a.href}
                  className="inline-flex items-center gap-2 font-display text-xs tracking-[0.12em] uppercase font-bold px-5 py-3 border border-border text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  {a.emoji} {a.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
