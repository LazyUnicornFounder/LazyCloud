import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Zap, Search, Brain, AlertTriangle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface Action {
  label: string;
  fnName: string;
  icon: typeof Zap;
  body?: Record<string, any>;
}

function diagnoseError(msg: string): string {
  const lower = msg.toLowerCase();
  if (lower.includes("secret") || lower.includes("api key") || lower.includes("unauthorized") || lower.includes("401"))
    return "Add the required API key to your project secrets.";
  if (lower.includes("not found") || lower.includes("does not exist"))
    return "Check that all database tables were created. Re-run the setup page.";
  if (lower.includes("setup_complete") || lower.includes("setup"))
    return "Complete the setup page first.";
  return "Check the error log for more details.";
}

export default function QuickActions({ actions, queryKeys }: { actions: Action[]; queryKeys: string[] }) {
  const [running, setRunning] = useState<string | null>(null);
  const [error, setError] = useState<{ label: string; message: string } | null>(null);
  const queryClient = useQueryClient();

  const run = async (action: Action) => {
    setRunning(action.fnName);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke(action.fnName, { body: action.body });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      toast.success(`${action.label} completed`);
      queryKeys.forEach((k) => queryClient.invalidateQueries({ queryKey: [k] }));
    } catch (err: any) {
      const msg = err?.message || err?.toString() || "Unknown error";
      setError({ label: action.label, message: msg });
      toast.error(`${action.label} failed — see details below`);
    }
    setRunning(null);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mt-6">
        {actions.map((a) => (
          <button
            key={a.fnName}
            onClick={() => run(a)}
            disabled={!!running}
            className="inline-flex items-center gap-2 border border-foreground/10 px-4 py-2.5 font-body text-xs text-foreground/[0.92] hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-40"
          >
            {running === a.fnName ? <Loader2 size={12} className="animate-spin" /> : <a.icon size={12} />}
            {a.label}
          </button>
        ))}
      </div>
      {error && (
        <div className="border border-red-500/30 bg-red-500/5 p-4 mt-4">
          <div className="flex items-start gap-2 mb-2">
            <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-display text-sm font-bold text-red-400 mb-1">{error.label} failed</p>
              <pre className="font-body text-[11px] text-red-300/80 whitespace-pre-wrap break-all">{error.message}</pre>
            </div>
          </div>
          <div className="border-t border-red-500/20 pt-2 mt-2">
            <p className="font-body text-[11px] text-foreground/50 uppercase tracking-wider mb-1">How to fix</p>
            <p className="font-body text-[12px] text-foreground/70">{diagnoseError(error.message)}</p>
          </div>
          <button onClick={() => setError(null)} className="font-body text-[11px] uppercase tracking-wider text-foreground/40 hover:text-foreground transition-colors mt-2">
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export { Zap, Search, Brain };
