import { ReactNode } from "react";

export interface Slide {
  id: string;
  label: string;
  title: string;
  content: ReactNode;
}

export const slides: Slide[] = [
  {
    id: "title",
    label: "01",
    title: "Cover",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">
            Investor Deck · 2026
          </span>
        </div>
        <h2 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[0.92]">
          Lazy
          <br />
          <span className="text-gradient-primary">Unicorn</span>
        </h2>
        <p className="font-body text-sm text-muted-foreground max-w-sm leading-relaxed mt-6">
          The autonomous company directory.
          <br />
          Start, run & scale — agents handle everything.
        </p>
        <div className="mt-8 bg-secondary/60 border border-border rounded-2xl px-6 py-4 max-w-md">
          <p className="font-body text-xs text-primary/80 leading-relaxed italic">
            "We want to be the first one-person unicorn built entirely on Lovable."
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "goal",
    label: "02",
    title: "Goal",
    content: (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/70 mb-4">
          The Vision
        </p>
        <h3 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-6">
          A self-building company
          <br />
          <span className="text-primary">about self-building companies.</span>
        </h3>
        <p className="font-body text-sm text-muted-foreground max-w-lg leading-relaxed mb-6">
          Lazy Unicorn goal: A directory about self-building companies that is itself a self-building company — discovering tools, writing listings, growing its audience, and earning revenue without the founder doing any of it.
        </p>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          {[
            { icon: "🔍", label: "Discovers tools" },
            { icon: "✍️", label: "Writes listings" },
            { icon: "📈", label: "Grows audience" },
            { icon: "💰", label: "Earns revenue" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 bg-secondary/50 rounded-xl px-4 py-3 border border-border">
              <span className="text-lg">{item.icon}</span>
              <span className="font-body text-xs text-foreground/60">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "problem",
    label: "03",
    title: "Problem",
    content: (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-destructive/70 mb-4">
          The Problem
        </p>
        <h3 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-6">
          Building a startup
          <br />
          still requires <span className="text-destructive">you</span>.
        </h3>
        <div className="space-y-3 max-w-md">
          {["90% of founders burn out before product-market fit", "Hiring is slow, expensive, and risky at seed stage", "Operational overhead kills more startups than bad ideas"].map((item) => (
            <div key={item} className="flex items-start gap-3 bg-destructive/5 rounded-xl px-4 py-3 border border-destructive/10">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 shrink-0" />
              <p className="font-body text-sm text-foreground/60 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "solution",
    label: "04",
    title: "Solution",
    content: (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/70 mb-4">
          The Solution
        </p>
        <h3 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-6">
          Autonomous capitalism
          <br />
          <span className="text-gradient-primary">for the rest of us.</span>
        </h3>
        <p className="font-body text-sm text-muted-foreground max-w-lg leading-relaxed mb-6">
          Lazy Unicorn curates and surfaces the best autonomous company builders — AI platforms that let anyone launch, operate, and scale a business with zero employees.
        </p>
        <div className="flex gap-3 max-w-lg">
          {[
            { num: "1", label: "Discover" },
            { num: "2", label: "Launch" },
            { num: "3", label: "Scale" },
          ].map((step, i) => (
            <div key={step.num} className="flex-1 relative">
              <div className="bg-primary/10 rounded-2xl p-5 text-center border border-primary/20 hover:border-primary/40 transition-colors">
                <p className="font-display text-3xl font-extrabold text-primary">{step.num}</p>
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground mt-1">{step.label}</p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-px bg-primary/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "market",
    label: "05",
    title: "Market",
    content: (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/70 mb-4">
          Market Opportunity
        </p>
        <h3 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-8">
          <span className="text-gradient-primary">$4.4T</span> addressable market.
        </h3>
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          {[
            { value: "$4.4T", label: "Global SMB software spend by 2028" },
            { value: "72M", label: "New businesses created annually" },
            { value: "85%", label: "Want to automate operations" },
            { value: "10x", label: "AI agent market CAGR" },
          ].map((stat) => (
            <div key={stat.label} className="bg-secondary/50 border border-border rounded-2xl p-4">
              <p className="font-display text-2xl md:text-3xl font-extrabold text-primary">{stat.value}</p>
              <p className="font-body text-[11px] text-muted-foreground mt-1 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "model",
    label: "06",
    title: "Revenue",
    content: (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/70 mb-4">
          Business Model
        </p>
        <h3 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-8">
          Three revenue streams.
        </h3>
        <div className="space-y-3 max-w-lg">
          {[
            { title: "Featured Listings", desc: "Premium placement for autonomous builders — recurring SaaS model.", tag: "B2B" },
            { title: "Affiliate Revenue", desc: "Commission on every user who signs up through our directory.", tag: "Performance" },
            { title: "Enterprise API", desc: "Programmatic access to our curated dataset for VCs and accelerators.", tag: "Data" },
          ].map((item) => (
            <div key={item.title} className="bg-secondary/50 rounded-2xl p-5 border border-border flex items-start gap-4 hover:border-primary/20 transition-colors">
              <span className="font-body text-[9px] tracking-[0.2em] uppercase bg-primary/10 text-primary px-3 py-1.5 rounded-full shrink-0 border border-primary/20">
                {item.tag}
              </span>
              <div>
                <p className="font-display text-sm font-bold text-foreground">{item.title}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "traction",
    label: "07",
    title: "Traction",
    content: (
      <div className="flex flex-col justify-center h-full px-10 md:px-16">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/70 mb-4">
          Early Traction
        </p>
        <h3 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-8">
          Growing <span className="text-gradient-primary">fast</span>.
        </h3>
        <div className="grid grid-cols-1 gap-4 max-w-lg mb-6">
          <div className="bg-secondary/50 border border-border rounded-2xl p-6 text-center">
            <p className="font-display text-4xl md:text-5xl font-extrabold text-primary">2</p>
            <p className="font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground mt-2">Builders listed</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-primary/5 rounded-2xl px-5 py-3 border border-primary/10 max-w-lg">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="font-body text-xs text-muted-foreground">
            Organic growth — zero paid acquisition to date
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "ask",
    label: "08",
    title: "The Ask",
    content: (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase text-primary/70 mb-6">
          The Ask
        </p>
        <h3 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[0.95] mb-4">
          <span className="text-gradient-primary">$1.5M</span> Seed Round
        </h3>
        <div className="w-16 h-px bg-primary/40 my-4" />
        <p className="font-body text-sm text-muted-foreground max-w-md leading-relaxed mb-8">
          To expand the directory, build the enterprise API, and become the definitive platform for autonomous capitalism.
        </p>
        <div className="flex gap-4 max-w-sm">
          {[
            { pct: "40%", label: "Product" },
            { pct: "35%", label: "Growth" },
            { pct: "25%", label: "Ops" },
          ].map((item) => (
            <div key={item.label} className="flex-1 bg-secondary/50 border border-border rounded-2xl p-4">
              <p className="font-display text-xl font-extrabold text-primary">{item.pct}</p>
              <p className="font-body text-[10px] tracking-[0.15em] uppercase text-muted-foreground mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
        <p className="font-body text-xs text-primary/60 mt-10 tracking-[0.15em]">
          lazyunicorn.ai
        </p>
      </div>
    ),
  },
];
