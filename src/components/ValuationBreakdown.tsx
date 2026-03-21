import { motion } from "framer-motion";

const metrics = [
  { label: "Directory Listings", value: "2+", note: "approved startups" },
  { label: "Blog Content", value: "AI-generated", note: "autonomous publishing" },
  { label: "Revenue Model", value: "Pro listings", note: "recurring SaaS" },
  { label: "Tech Stack", value: "100% AI-built", note: "zero employees" },
  { label: "Target Valuation", value: "$1B", note: "unicorn status" },
];

const ValuationBreakdown = () => (
  <>
    <p className="font-display text-2xl md:text-3xl font-extrabold tracking-[0.1em] uppercase text-foreground/60 mb-2">
      Valuation
    </p>
    <p className="font-body text-sm md:text-base text-primary font-semibold leading-relaxed mb-6">
      On a mission to build an autonomous unicorn with Lovable.
    </p>

    <div className="space-y-3">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="flex items-center justify-between py-2 border-b border-dashed border-foreground/10 last:border-b-0"
        >
          <div>
            <p className="font-display text-xs md:text-sm font-bold tracking-wide uppercase text-foreground/70">
              {m.label}
            </p>
            <p className="font-body text-[10px] text-foreground/40 mt-0.5">{m.note}</p>
          </div>
          <span className="font-display text-base md:text-lg font-extrabold text-primary shrink-0 ml-4">
            {m.value}
          </span>
        </motion.div>
      ))}
    </div>

    <div className="mt-6 p-3 rounded-2xl border border-primary/20 bg-primary/5">
      <p className="font-display text-[10px] tracking-[0.15em] uppercase text-primary/60 mb-1">
        Estimated Current Value
      </p>
      <p className="font-display text-2xl md:text-3xl font-extrabold text-primary">
        Pre-revenue
      </p>
      <p className="font-body text-xs text-foreground/40 mt-1">
        Building in public — every feature adds equity.
      </p>
    </div>
  </>
);

export default ValuationBreakdown;
