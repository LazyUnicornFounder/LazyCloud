import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search, Upload, Brain, MessageSquare, Globe, FileText,
  Bookmark, Shield, Lock, Eye, FileCheck, Building2,
  Scale, Landmark, HardHat, Check, ArrowRight
} from "lucide-react";

const stats = [
  { value: "55,000+", label: "files indexed" },
  { value: "61GB", label: "processed" },
  { value: "1 afternoon", label: "to set up" },
  { value: "EN + AR", label: "bilingual" },
];

const steps = [
  {
    icon: Upload,
    title: "Upload your files",
    desc: "Connect existing storage or upload directly. Supports PDF, Word, Excel, CAD, images, and more.",
  },
  {
    icon: Brain,
    title: "We index everything",
    desc: "AI reads, chunks, and embeds every document. Full semantic search across your entire archive.",
  },
  {
    icon: Search,
    title: "Ask anything",
    desc: "Search in plain language. Get exact files, page numbers, and AI-powered answers with citations.",
  },
];

const useCases = [
  { icon: HardHat, title: "Construction & Engineering", desc: "Find that FIDIC clause in seconds, not hours" },
  { icon: Scale, title: "Legal", desc: "Search 25 years of court decisions and contracts simultaneously" },
  { icon: Building2, title: "Corporate", desc: "Every policy, procedure, and memo — instantly searchable" },
  { icon: Landmark, title: "Government", desc: "Decades of records, one search bar" },
];

const features = [
  { icon: Search, title: "Semantic search", desc: "Understands meaning, not just keywords" },
  { icon: Globe, title: "Arabic + English", desc: "RTL built in from day one" },
  { icon: FileText, title: "PDF preview", desc: "Highlighting on the exact page" },
  { icon: Bookmark, title: "Bookmarks & collections", desc: "Organise your most-used documents" },
  { icon: MessageSquare, title: "Chat with citations", desc: "AI answers backed by your files" },
  { icon: Shield, title: "Your data stays yours", desc: "Client-owned infrastructure" },
];

const securityPoints = [
  "Client-owned AWS / Supabase accounts",
  "End-to-end encryption",
  "SOC 2 compatible architecture",
  "Full audit trails",
  "NDA + DPA standard",
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$499",
    period: "/month",
    features: ["Up to 50 GB", "50,000 files", "5 users", "Email support"],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$999",
    period: "/month",
    features: ["Up to 500 GB", "500,000 files", "25 users", "Priority support", "Custom branding"],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: ["Unlimited everything", "On-premise option", "Dedicated support", "SLA"],
    cta: "Contact Us",
    highlighted: false,
  },
];

const testimonials = [
  {
    quote: "We went from spending hours digging through archives to finding exactly what we need in seconds. Game changer.",
    name: "Ahmad Al-Rashid",
    title: "Head of Engineering",
    company: "Gulf Construction Co.",
  },
  {
    quote: "The Arabic support is flawless. Our team finally has a tool that works with our documents natively.",
    name: "Sara Mahmoud",
    title: "Legal Director",
    company: "Al-Nour Law Firm",
  },
  {
    quote: "25 years of government records, searchable in one afternoon. I didn't believe it until I saw it.",
    name: "Khalid Nasser",
    title: "IT Director",
    company: "Ministry of Works",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display text-lg font-bold tracking-tight">Lazy Cloud</span>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#use-cases" className="hover:text-foreground transition-colors">Use cases</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#security" className="hover:text-foreground transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight leading-tight mb-6">
            25 Years of Documents.
            <br />
            <span className="text-primary">One Search.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Turn your company's file archive into an AI-powered search assistant.
            Ask questions in plain English or Arabic — get the exact file and page number.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="text-base px-8">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#demo">
              <Button variant="outline" size="lg" className="text-base px-8">
                See Demo
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl md:text-3xl font-bold font-display text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Step {i + 1}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="use-cases" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-16">Built for industries that drown in documents</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {useCases.map((uc) => (
              <Card key={uc.title} className="bg-card border-border">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <uc.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{uc.title}</h3>
                    <p className="text-sm text-muted-foreground">{uc.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo placeholder */}
      <section id="demo" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">See it in action</h2>
          <p className="text-muted-foreground mb-10">Watch how Lazy Cloud searches 55,000+ documents in seconds.</p>
          <div className="aspect-video bg-secondary/50 border border-border rounded-lg flex items-center justify-center">
            <div className="text-muted-foreground text-sm">Demo video coming soon</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-16">Everything you need</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 border border-border rounded-lg bg-card">
                <f.icon className="h-6 w-6 text-primary mb-4" />
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Lock className="h-10 w-10 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Your data, your servers, your keys.</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-10">
            We deploy into your own cloud accounts. Your documents never touch our servers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {securityPoints.map((point) => (
              <div key={point} className="flex items-center gap-2 text-sm border border-border rounded-full px-4 py-2">
                <Check className="h-4 w-4 text-primary" />
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-16">Simple, transparent pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`bg-card border-border relative ${tier.highlighted ? "border-primary ring-1 ring-primary" : ""}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Most popular
                  </div>
                )}
                <CardContent className="p-8">
                  <h3 className="text-lg font-semibold mb-2">{tier.name}</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-bold font-display">{tier.price}</span>
                    <span className="text-muted-foreground text-sm">{tier.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={tier.name === "Enterprise" ? "#contact" : "/signup"}>
                    <Button
                      className="w-full"
                      variant={tier.highlighted ? "default" : "outline"}
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-16">What our customers say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="bg-card border-border">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed italic">"{t.quote}"</p>
                  <div>
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm mb-2">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.title}, {t.company}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-primary/5 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Ready to unlock your archive?</h2>
          <p className="text-muted-foreground mb-8">Start your free trial today. No credit card required.</p>
          <Link to="/signup">
            <Button size="lg" className="text-base px-8">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-display font-bold">Lazy Cloud</span>
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#security" className="hover:text-foreground transition-colors">Security</a>
            <a href="mailto:hello@lazycloud.ai" className="hover:text-foreground transition-colors">Contact</a>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
          <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Lazy Cloud</div>
        </div>
      </footer>
    </div>
  );
}
