import { useState, createContext, useContext, useEffect, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Loader2, Pause, Play, Settings, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAgentDetection, type AgentState } from "./hooks/useAgentDetection";
import { AGENTS } from "./agentRegistry";

interface AdminCtx {
  states: Record<string, AgentState>;
  loading: boolean;
  refetch: () => void;
}
const AdminContext = createContext<AdminCtx>({
  states: {},
  loading: true,
  refetch: () => {},
});
export const useAdminContext = () => useContext(AdminContext);

export default function AdminLayout() {
  const [password, setPassword] = useState(() => sessionStorage.getItem("admin_pw") || "");
  const [authenticated, setAuthenticated] = useState(() => !!sessionStorage.getItem("admin_pw"));
  const navigate = useNavigate();
  const { states, loading, refetch } = useAgentDetection();

  const runningCount = Object.values(states).filter((s) => s.isRunning).length;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("admin_pw", password);
    setAuthenticated(true);
  };

  const handleBulkToggle = async () => {
    const shouldPause = runningCount > 0;
    const agents = AGENTS.filter((a) => states[a.key]?.installed);
    for (const a of agents) {
      try {
        await (supabase as any).from(a.settingsTable).update({ [a.runField]: !shouldPause });
      } catch {}
    }
    toast.success(shouldPause ? "All agents paused" : "All agents resumed");
    refetch();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a08] flex items-center justify-center">
        <form onSubmit={handleLogin} className="w-full max-w-xs">
          <p className="text-sm tracking-[0.2em] uppercase text-[#f0ead6]/80 mb-6 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Admin Access
          </p>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-transparent border border-[#f0ead6]/10 text-[#f0ead6] px-4 py-3 text-sm focus:outline-none focus:border-[#f0ead6]/30"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          />
          <button type="submit"
            className="w-full mt-3 bg-[#c9a84c] text-[#0a0a08] text-xs tracking-[0.15em] uppercase font-bold py-3 hover:opacity-90 transition-opacity"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <AdminContext.Provider value={{ states, loading, refetch }}>
      <div className="min-h-screen bg-[#0a0a08] text-[#f0ead6]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {/* Top bar */}
        <header className="sticky top-0 z-50 bg-[#0a0a08]/95 backdrop-blur-sm border-b border-[#f0ead6]/8">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/admin")} className="text-[14px] font-bold tracking-[0.12em] uppercase text-[#f0ead6] hover:text-[#f0ead6]/90 transition-colors">
                🦄 LAZY UNICORN
              </button>
              <span className="flex items-center gap-1.5 text-[11px] tracking-[0.1em] uppercase">
                <span className={`w-2 h-2 rounded-full ${runningCount > 0 ? "bg-[#4ade80]" : "bg-[#6b7280]"}`} />
                <span className={runningCount > 0 ? "text-[#4ade80]" : "text-[#f0ead6]/30"}>
                  {runningCount} AGENTS RUNNING
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleBulkToggle}
                className="inline-flex items-center gap-1.5 border border-[#f0ead6]/10 px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase text-[#f0ead6]/60 hover:text-[#f0ead6] hover:border-[#f0ead6]/30 transition-colors">
                {runningCount > 0 ? <><Pause size={10} /> PAUSE ALL</> : <><Play size={10} /> RESUME ALL</>}
              </button>
              <button onClick={() => navigate("/admin/settings")}
                className="p-2 text-[#f0ead6]/40 hover:text-[#f0ead6]/70 transition-colors">
                <Settings size={14} />
              </button>
              <a href="/lazy-cloud" className="px-3 py-1 bg-[#c9a84c] text-[#0a0a08] text-[10px] font-bold tracking-[0.1em] uppercase rounded-full hover:opacity-90 transition-opacity">
                LAZY CLOUD ↗
              </a>
              <button onClick={() => { sessionStorage.removeItem("admin_pw"); setAuthenticated(false); }}
                className="p-2 text-[#f0ead6]/30 hover:text-[#f0ead6]/60 transition-colors">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 pb-20">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-[#f0ead6]/40" size={24} />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </AdminContext.Provider>
  );
}
