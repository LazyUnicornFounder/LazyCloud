import { useState, useCallback } from "react";
import { toast } from "sonner";

const BADGE_HTML = `<a href="https://www.lazyunicorn.ai" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#0a0a08;color:#f0ead6;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;border:1px solid rgba(240,234,214,0.2)">🦄 Powered by Lazy Unicorn</a>`;

const BADGE_MARKDOWN = `[![Powered by Lazy Unicorn](https://img.shields.io/badge/🦄_Powered_by-Lazy_Unicorn-0a0a08?style=flat&labelColor=0a0a08&color=f0ead6)](https://www.lazyunicorn.ai)`;

export default function BacklinkBadge() {
  const [tab, setTab] = useState<"html" | "markdown">("html");
  const snippet = tab === "html" ? BADGE_HTML : BADGE_MARKDOWN;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(snippet);
    toast.success("Badge code copied!");
  }, [snippet]);

  return (
    <div className="border border-border p-6 bg-card">
      <h3 className="font-display text-sm font-bold uppercase tracking-[0.1em] mb-4">
        Embed a backlink badge
      </h3>
      <p className="font-body text-sm text-foreground/60 mb-4">
        Add this badge to your site or README to link back to Lazy Unicorn.
      </p>

      {/* Preview */}
      <div className="mb-4 p-4 bg-background border border-border flex items-center justify-center">
        <a
          href="https://www.lazyunicorn.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 font-display text-[12px] font-bold tracking-[0.1em] uppercase no-underline border"
          style={{ background: "#0a0a08", color: "#f0ead6", borderColor: "rgba(240,234,214,0.2)" }}
        >
          🦄 Powered by Lazy Unicorn
        </a>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-3">
        {(["html", "markdown"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-body text-[12px] tracking-[0.1em] uppercase px-3 py-1 border transition-colors ${
              tab === t
                ? "bg-foreground text-background border-foreground"
                : "border-border text-foreground/50 hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Code */}
      <pre className="bg-background border border-border p-3 text-[12px] text-foreground/70 overflow-x-auto whitespace-pre-wrap break-all font-mono leading-relaxed">
        {snippet}
      </pre>

      <button
        onClick={handleCopy}
        className="mt-3 font-body text-[12px] tracking-[0.15em] uppercase px-4 py-2 font-semibold bg-foreground text-background hover:opacity-90 transition-opacity"
      >
        Copy Code
      </button>
    </div>
  );
}
