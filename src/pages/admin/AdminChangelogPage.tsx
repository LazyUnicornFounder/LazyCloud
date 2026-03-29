import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AdminChangelogPage() {
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["admin-changelog"],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("changelog")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      return data || [];
    },
  });

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" });
  };

  return (
    <div>
      <h1 className="font-display text-lg font-bold tracking-tight mb-6">Changelog</h1>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 size={16} className="animate-spin text-[#f0ead6]/40" />
        </div>
      ) : entries.length === 0 ? (
        <p className="font-body text-[12px] text-[#f0ead6]/40">No changelog entries yet.</p>
      ) : (
        <div className="border border-[#f0ead6]/8 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#f0ead6]/8">
                <th className="px-3 py-2 font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40 font-normal">Agent</th>
                <th className="px-3 py-2 font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40 font-normal">Version</th>
                <th className="px-3 py-2 font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40 font-normal">Summary</th>
                <th className="px-3 py-2 font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40 font-normal">Affected</th>
                <th className="px-3 py-2 font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40 font-normal">GitHub</th>
                <th className="px-3 py-2 font-body text-[10px] tracking-[0.2em] uppercase text-[#f0ead6]/40 font-normal">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ead6]/5">
              {entries.map((row: any) => (
                <tr key={row.id} className="hover:bg-[#f0ead6]/3 transition-colors">
                  <td className="px-3 py-2">
                    <span className="px-1.5 py-0.5 border border-[#f0ead6]/10 text-[10px] uppercase tracking-wider text-[#f0ead6]/70 font-body">
                      {row.agent}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-body text-[12px] text-[#f0ead6]/60">{row.version}</td>
                  <td className="px-3 py-2 font-body text-[12px] text-[#f0ead6]/80 max-w-xs truncate">{row.summary}</td>
                  <td className="px-3 py-2">
                    {row.affected_agents ? (
                      <div className="flex flex-wrap gap-1">
                        {row.affected_agents.split(", ").map((a: string) => (
                          <span key={a} className="px-1.5 py-0.5 border border-amber-500/30 text-[10px] uppercase tracking-wider text-amber-400/80 font-body">
                            {a}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="font-body text-[11px] text-[#f0ead6]/30">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`px-1.5 py-0.5 border text-[10px] uppercase tracking-wider font-body ${
                      row.pushed_to_github
                        ? "border-emerald-500/30 text-emerald-400/80"
                        : "border-amber-500/30 text-amber-400/80"
                    }`}>
                      {row.pushed_to_github ? "Pushed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-body text-[12px] text-[#f0ead6]/50">{formatDate(row.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
