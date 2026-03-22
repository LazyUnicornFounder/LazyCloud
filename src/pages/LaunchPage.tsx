import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Copy, ExternalLink } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import BlogTicker from "@/components/BlogTicker";
import FloatingProductCTA from "@/components/FloatingProductCTA";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import unicornBg from "@/assets/unicorn-beach.png";

const platforms = [
  {
    name: "Lovable",
    url: "https://lovable.dev",
    description: "Build your app with AI",
    color: "from-pink-500 to-purple-600",
  },
  {
    name: "Polsia",
    url: "https://polsia.com",
    description: "AI runs your company 24/7",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Naïve",
    url: "https://usenaive.ai",
    description: "Describe it. Naïve builds it.",
    color: "from-emerald-500 to-teal-500",
  },
];

const LaunchPage = () => {
  const [prompt, setPrompt] = useState("");

  const handleLaunch = async (platform: typeof platforms[number]) => {
    if (prompt.trim()) {
      try {
        await navigator.clipboard.writeText(prompt.trim());
        toast.success("Prompt copied to clipboard!", {
          description: `Paste it into ${platform.name} to get started.`,
        });
      } catch {
        toast.error("Couldn't copy — please copy your prompt manually.");
      }
    }
    setTimeout(() => {
      window.open(platform.url, "_blank", "noopener,noreferrer");
    }, 600);
  };

  return (
    <div className="min-h-screen text-foreground relative">
      <SEO
        title="Launch Your Autonomous Startup | Lazy Unicorn"
        description="Describe your startup idea and launch it instantly with Lovable, Polsia, or Naïve."
        url="/launch"
      />
      <div className="fixed inset-0 z-0">
        <img src={unicornBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BlogTicker />
      </div>
      <Navbar activePage="home" />
      <FloatingProductCTA />

      <main className="relative z-10 pt-28 pb-32 px-6 md:px-12 flex justify-center">
        <div className="w-full max-w-2xl">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-xl border border-primary/20 rounded-full px-5 py-2 mb-6">
              <Rocket size={16} className="text-primary" />
              <span className="font-body text-xs tracking-[0.15em] uppercase text-primary">
                Launch pad
              </span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[0.95] mb-4">
              What will you build?
            </h1>
            <p className="font-body text-base text-foreground/50 leading-relaxed max-w-md mx-auto">
              Describe your idea below, pick a platform, and we'll copy your prompt so you can hit the ground running.
            </p>
          </motion.div>

          {/* Chat box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-transparent backdrop-blur-xl rounded-3xl px-8 py-8 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)] mb-6"
          >
            <label className="font-display text-sm font-bold tracking-[0.1em] uppercase text-foreground/60 mb-3 block">
              Your startup idea
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. An AI-powered marketplace that matches freelance designers with startups needing brand identity work, handling contracts, payments, and revisions autonomously..."
              className="min-h-[140px] bg-background/30 border-foreground/10 text-foreground placeholder:text-foreground/30 focus-visible:ring-primary/40 rounded-xl resize-none text-base"
            />
            <p className="font-body text-xs text-foreground/30 mt-2">
              Be as detailed as you want — the more context, the better.
            </p>
          </motion.div>

          {/* Platform buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-transparent backdrop-blur-xl rounded-3xl px-8 py-8 border border-primary/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_20px_rgba(var(--primary-rgb),0.08)]"
          >
            <p className="font-display text-sm font-bold tracking-[0.1em] uppercase text-foreground/60 mb-5 text-center">
              Choose your launchpad
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <button
                  key={platform.name}
                  onClick={() => handleLaunch(platform)}
                  className="group relative overflow-hidden rounded-2xl border border-foreground/10 hover:border-primary/40 bg-background/20 hover:bg-background/30 transition-all duration-300 p-6 text-left"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <p className="font-display text-lg font-extrabold text-foreground mb-1">
                      {platform.name}
                    </p>
                    <p className="font-body text-xs text-foreground/40 mb-4 leading-relaxed">
                      {platform.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-[0.15em] uppercase text-primary/70 group-hover:text-primary transition-colors">
                      {prompt.trim() ? (
                        <>
                          <Copy size={10} /> Copy & Go
                        </>
                      ) : (
                        <>
                          <ExternalLink size={10} /> Visit
                        </>
                      )}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            {prompt.trim() && (
              <p className="font-body text-xs text-foreground/30 mt-4 text-center">
                Your prompt will be copied to clipboard when you click a platform.
              </p>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LaunchPage;
