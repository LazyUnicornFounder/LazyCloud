import { Link, useLocation } from "react-router-dom";
import { Rocket } from "lucide-react";

export default function LazyLaunchCTA() {
  const { pathname } = useLocation();
  // Don't show on the launch page itself or admin pages
  if (pathname === "/lazy-launch" || pathname.startsWith("/admin")) return null;

  return (
    <section className="border-t border-border bg-card">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Rocket size={18} className="text-foreground/50" />
          <p className="font-body text-sm text-foreground/60">
            Ready to launch? Set up your entire Lovable site in one prompt.
          </p>
        </div>
        <Link
          to="/lazy-launch"
          className="inline-flex items-center gap-2 font-display text-xs tracking-[0.12em] uppercase font-bold px-6 py-3 bg-foreground text-background hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Get Started with Lazy Launch →
        </Link>
      </div>
    </section>
  );
}
