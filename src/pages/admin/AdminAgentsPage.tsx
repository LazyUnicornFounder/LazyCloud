import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Loader2, Play, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminContext } from "./AdminLayout";
import { AGENTS, CATEGORIES, CATEGORY_AGENTS } from "./agentRegistry";
import { adminWrite } from "@/lib/adminWrite";
import { toast } from "sonner";

export default function AdminAgentsPage() {
  const { states, refetch } = useAdminContext();
  const navigate = useNavigate();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const filteredAgents = filter === "All"
    ? AGENTS
    : AGENTS.filter((a) => a.category === filter);

  const installedCount = AGENTS.filter((a) => states[a.key]?.installed).length;
  const runningCount = AGENTS.filter((a) => states[a.key]?.isRunning).length;

  const runAction = async (fn: string) => {
    if (!fn) return;
    setActionLoading(fn);
    try {
      await supabase.functions.invoke(fn);
      toast.success("Action completed");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed");
    }
    setActionLoading(null);
  };

  const toggleAgent = async (agent: typeof AGENTS[0]) => {
    const state = states[agent.key];
    if (!state?.installed) return;
    try {
      await adminWrite({
        table: agent.settingsTable,
        operation: "update",
        data: { [agent.runField]: !state.isRunning },
        match: { id: state.settings?.id },
      });
      toast.success(state.isRunning ? `${agent.label} paused` : `${agent.label} resumed`);
      refetch();
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "var(--admin-text)" }}>Agents</h1>
        <div className="flex gap-4 text-xs" style={{ color: "var(--admin-text-tertiary)" }}>
          <span><strong style={{ color: "var(--admin-text)" }}>{installedCount}</strong> installed</span>
          <span><strong style={{ color: "var(--admin-success)" }}>{runningCount}</strong> running</span>
          <span><strong style={{ color: "var(--admin-text-secondary)" }}>{AGENTS.length}</strong> total</span>
        </div>
      </div>
      <p className="text-sm mb-5" style={{ color: "var(--admin-text-tertiary)" }}>All {AGENTS.length} agents across {CATEGORIES.length} categories.</p>

      {/* Category filter */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {["All", ...CATEGORIES].map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)}
            className="px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors"
            style={{
              background: filter === cat ? "var(--admin-accent)" : "transparent",
              color: filter === cat ? "#fff" : "var(--admin-text-secondary)",
              border: filter === cat ? "none" : "1px solid var(--admin-border)",
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filteredAgents.map((agent) => {
          const state = states[agent.key];
          const installed = state?.installed;
          const primaryAction = agent.actions.find((a) => a.primary);

          return (
            <div key={agent.key} className="p-4 rounded-lg transition-colors"
              style={{
                background: "var(--admin-bg-elevated)",
                border: `1px solid ${installed ? "var(--admin-border)" : "var(--admin-border)"}`,
                opacity: installed ? 1 : 0.6,
              }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium" style={{ color: "var(--admin-text)" }}>{agent.label}</span>
                <div className="flex items-center gap-1.5">
                  {installed ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full" style={{
                        background: state?.hasRecentError ? "var(--admin-error)" : state?.isRunning ? "var(--admin-success)" : "var(--admin-text-tertiary)"
                      }} />
                      <span className="text-[10px]" style={{ color: "var(--admin-text-tertiary)" }}>
                        {state?.hasRecentError ? "Error" : state?.isRunning ? "Running" : "Paused"}
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{
                      background: "var(--admin-warning-muted)",
                      color: "var(--admin-warning)",
                    }}>Not installed</span>
                  )}
                </div>
              </div>

              <p className="text-[11px] mb-1" style={{ color: "var(--admin-text-tertiary)" }}>{agent.subtitle}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded inline-block mb-3" style={{
                background: "var(--admin-accent-muted)",
                color: "var(--admin-accent)",
              }}>{agent.category}</span>

              <div className="flex gap-1.5 flex-wrap">
                {installed ? (
                  <>
                    {primaryAction && (
                      <button onClick={() => runAction(primaryAction.fn)} disabled={!!actionLoading}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium transition-all hover:brightness-110"
                        style={{ background: "var(--admin-accent)", color: "#fff" }}>
                        {actionLoading === primaryAction.fn ? <Loader2 size={9} className="animate-spin" /> : <Play size={9} />}
                        Run
                      </button>
                    )}
                    <button onClick={() => toggleAgent(agent)}
                      className="px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors"
                      style={{ border: "1px solid var(--admin-border-strong)", color: "var(--admin-text-secondary)" }}>
                      {state?.isRunning ? "Disable" : "Enable"}
                    </button>
                    <button onClick={() => navigate(`/admin/${agent.slug}`)}
                      className="px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors"
                      style={{ border: "1px solid var(--admin-border-strong)", color: "var(--admin-text-secondary)" }}>
                      Details →
                    </button>
                  </>
                ) : (
                  <button onClick={() => navigate(`/admin/${agent.slug}`)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors"
                    style={{ border: "1px solid var(--admin-border-strong)", color: "var(--admin-text-secondary)" }}>
                    <Download size={9} />
                    Setup
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
