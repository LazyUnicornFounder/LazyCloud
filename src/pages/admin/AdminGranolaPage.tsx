import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminGranolaPage() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [outputs, setOutputs] = useState<any[]>([]);
  const [intel, setIntel] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [digestRunning, setDigestRunning] = useState(false);
  const [intelFilter, setIntelFilter] = useState("all");
  const [expandedMeeting, setExpandedMeeting] = useState<string | null>(null);

  const fetchData = async () => {
    const [m, o, i, e] = await Promise.all([
      (supabase as any).from("granola_meetings").select("*").order("created_at", { ascending: false }).limit(50),
      (supabase as any).from("granola_outputs").select("*").order("created_at", { ascending: false }).limit(100),
      (supabase as any).from("granola_intelligence").select("*").order("created_at", { ascending: false }).limit(100),
      (supabase as any).from("granola_errors").select("*").order("created_at", { ascending: false }).limit(20),
    ]);
    setMeetings(m.data || []);
    setOutputs(o.data || []);
    setIntel(i.data || []);
    setErrors(e.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const syncNow = async () => {
    setSyncing(true);
    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/granola-sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      });
      toast.success("Sync triggered");
      setTimeout(fetchData, 3000);
    } catch { toast.error("Sync failed"); }
    setSyncing(false);
  };

  const runDigest = async () => {
    setDigestRunning(true);
    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/granola-weekly-digest`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      });
      toast.success("Digest triggered");
      setTimeout(fetchData, 5000);
    } catch { toast.error("Digest failed"); }
    setDigestRunning(false);
  };

  const stats = {
    meetings: meetings.filter((m) => m.processing_status === "done").length,
    posts: outputs.filter((o) => o.output_type === "blog-post").length,
    issues: outputs.filter((o) => o.output_type === "linear-issues").length,
    insights: intel.length,
  };

  const filteredIntel = intelFilter === "all" ? intel : intel.filter((i) => i.intel_type === intelFilter);
  const intelTypes = ["all", ...new Set(intel.map((i: any) => i.intel_type))];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl tracking-[0.1em] uppercase font-bold">Lazy Granola</h1>
        <div className="flex gap-2">
          <button onClick={syncNow} disabled={syncing}
            className="font-display text-[11px] tracking-[0.12em] uppercase font-bold px-4 py-2 border border-[#f0ead6]/20 text-[#f0ead6]/70 hover:text-[#f0ead6] hover:border-[#f0ead6]/40 disabled:opacity-50">
            {syncing ? "Syncing..." : "Sync Now"}
          </button>
          <button onClick={runDigest} disabled={digestRunning}
            className="font-display text-[11px] tracking-[0.12em] uppercase font-bold px-4 py-2 border border-[#f0ead6]/20 text-[#f0ead6]/70 hover:text-[#f0ead6] hover:border-[#f0ead6]/40 disabled:opacity-50">
            {digestRunning ? "Running..." : "Run Digest Now"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Meetings Processed", value: stats.meetings },
          { label: "Blog Posts Published", value: stats.posts },
          { label: "Linear Issues Created", value: stats.issues },
          { label: "Customer Insights", value: stats.insights },
        ].map((s) => (
          <div key={s.label} className="border border-[#f0ead6]/10 p-4">
            <p className="font-display text-[11px] tracking-[0.12em] uppercase text-[#f0ead6]/50 mb-1">{s.label}</p>
            <p className="font-display text-2xl font-bold text-[#f0ead6]">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent meetings */}
      <div>
        <h2 className="font-display text-[13px] tracking-[0.12em] uppercase font-bold text-[#f0ead6]/70 mb-3">Recent Meetings</h2>
        <div className="border border-[#f0ead6]/10">
          {meetings.length === 0 ? (
            <p className="p-4 text-[#f0ead6]/40 font-body text-sm">No meetings synced yet. Click Sync Now to fetch from Granola.</p>
          ) : meetings.map((m) => {
            const meetingOutputs = outputs.filter((o) => o.meeting_id === m.id);
            return (
              <div key={m.id} className="border-b border-[#f0ead6]/8 last:border-b-0">
                <button onClick={() => setExpandedMeeting(expandedMeeting === m.id ? null : m.id)}
                  className="w-full text-left px-4 py-3 flex items-center gap-4 hover:bg-[#f0ead6]/3">
                  <span className="font-body text-sm text-[#f0ead6]/80 flex-1 truncate">{m.title || "Untitled meeting"}</span>
                  {m.meeting_type && (
                    <span className="font-display text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 border border-[#f0ead6]/20 text-[#f0ead6]/50">{m.meeting_type}</span>
                  )}
                  <span className={`font-display text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 ${m.processing_status === "done" ? "text-green-400 border-green-400/30" : m.processing_status === "failed" ? "text-red-400 border-red-400/30" : "text-yellow-400 border-yellow-400/30"} border`}>
                    {m.processing_status}
                  </span>
                  <span className="font-body text-[12px] text-[#f0ead6]/40">{meetingOutputs.length} outputs</span>
                  <span className="font-body text-[12px] text-[#f0ead6]/30">{new Date(m.created_at).toLocaleDateString()}</span>
                </button>
                {expandedMeeting === m.id && meetingOutputs.length > 0 && (
                  <div className="px-6 pb-3 space-y-2">
                    {meetingOutputs.map((o) => (
                      <div key={o.id} className="flex items-center gap-3 text-[12px]">
                        <span className="font-display tracking-[0.1em] uppercase px-2 py-0.5 border border-[#f0ead6]/15 text-[#f0ead6]/50">{o.output_type}</span>
                        <span className="font-body text-[#f0ead6]/60 truncate flex-1">{o.title}</span>
                        {o.published && <span className="text-green-400">Published</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer intelligence */}
      <div>
        <div className="flex items-center gap-4 mb-3">
          <h2 className="font-display text-[13px] tracking-[0.12em] uppercase font-bold text-[#f0ead6]/70">Customer Intelligence</h2>
          <div className="flex gap-1">
            {intelTypes.map((t) => (
              <button key={t} onClick={() => setIntelFilter(t)}
                className={`font-display text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 border ${intelFilter === t ? "border-[#f0ead6]/40 text-[#f0ead6]" : "border-[#f0ead6]/10 text-[#f0ead6]/40"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="border border-[#f0ead6]/10 divide-y divide-[#f0ead6]/8">
          {filteredIntel.length === 0 ? (
            <p className="p-4 text-[#f0ead6]/40 font-body text-sm">No intelligence extracted yet.</p>
          ) : filteredIntel.slice(0, 20).map((i) => (
            <div key={i.id} className="px-4 py-3">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-display text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30">{i.intel_type}</span>
                <span className="font-body text-[12px] text-[#f0ead6]/40">{i.meeting_title}</span>
                <span className="font-body text-[12px] text-[#f0ead6]/30">{i.meeting_date}</span>
              </div>
              <p className="font-body text-sm text-[#f0ead6]/70">{i.content}</p>
              {i.speaker_context && <p className="font-body text-[12px] text-[#f0ead6]/40 mt-1">{i.speaker_context}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Outputs log */}
      <div>
        <h2 className="font-display text-[13px] tracking-[0.12em] uppercase font-bold text-[#f0ead6]/70 mb-3">Outputs Log</h2>
        <div className="border border-[#f0ead6]/10 divide-y divide-[#f0ead6]/8">
          {outputs.length === 0 ? (
            <p className="p-4 text-[#f0ead6]/40 font-body text-sm">No outputs generated yet.</p>
          ) : outputs.slice(0, 20).map((o) => (
            <div key={o.id} className="px-4 py-3 flex items-center gap-4">
              <span className="font-display text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 border border-[#f0ead6]/15 text-[#f0ead6]/50">{o.output_type}</span>
              <span className="font-body text-sm text-[#f0ead6]/70 flex-1 truncate">{o.title}</span>
              {o.published && <span className="font-display text-[10px] text-green-400">Published</span>}
              <span className="font-body text-[12px] text-[#f0ead6]/30">{new Date(o.created_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error log */}
      {errors.length > 0 && (
        <div>
          <h2 className="font-display text-[13px] tracking-[0.12em] uppercase font-bold text-red-400/70 mb-3">Error Log</h2>
          <div className="border border-red-400/20 divide-y divide-red-400/10">
            {errors.map((e) => (
              <div key={e.id} className="px-4 py-3">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-display text-[10px] tracking-[0.1em] uppercase text-red-400/60">{e.function_name}</span>
                  <span className="font-body text-[12px] text-[#f0ead6]/30">{new Date(e.created_at).toLocaleString()}</span>
                </div>
                <p className="font-body text-sm text-red-400/80">{e.error_message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
