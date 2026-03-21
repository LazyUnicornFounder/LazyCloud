import { motion } from "framer-motion";

const metrics = [
  { label: "Directory Listings", value: "2+", note: "approved startups" },
  { label: "Blog Content", value: "AI-generated", note: "autonomous publishing" },
  { label: "Revenue Model", value: "Pro listings", note: "recurring SaaS" },
  { label: "Tech Stack", value: "100% AI-built", note: "zero employees" },
  { label: "Target Valuation", value: "$1B", note: "unicorn status" },
];

const ValuationBreakdown = () => (
  <section id="valuation" className="relative z-10 px-8 md:px-12 pb-16 scroll-mt-24">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="max-w-2xl bg-background/60 backdrop-blur-2xl rounded-3xl px-8 py-10 border border-foreground/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
    >
      <p className="font-display text-3xl md:text-4xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-2">
        Valuation
      </p>
      <p className="font-body text-lg md:text-xl text-primary font-semibold leading-relaxed mb-8">
        On a mission to build an autonomous unicorn with Lovable.
      </p>

      <div className="space-y-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex items-center justify-between py-3 border-b border-dashed border-foreground/10 last:border-b-0"
          >
            <div>
              <p className="font-display text-sm md:text-base font-bold tracking-wide uppercase text-foreground/70">
                {m.label}
              </p>
              <p className="font-body text-[11px] text-foreground/40 mt-0.5">{m.note}</p>
            </div>
            <span className="font-display text-lg md:text-xl font-extrabold text-primary shrink-0 ml-4">
              {m.value}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-2xl border border-primary/20 bg-primary/5">
        <p className="font-display text-xs tracking-[0.15em] uppercase text-primary/60 mb-1">
          Estimated Current Value
        </p>
        <p className="font-display text-3xl md:text-4xl font-extrabold text-primary">
          Pre-revenue
        </p>
        <p className="font-body text-sm text-foreground/40 mt-1">
          Building in public — every feature adds equity.
        </p>
      </div>
    </motion.div>
  </section>
);

export default ValuationBreakdown;
