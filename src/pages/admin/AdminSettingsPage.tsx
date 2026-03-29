import { useState } from "react";
import { ArrowLeft, Loader2, Pencil, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminContext } from "./AdminLayout";
import { AGENTS } from "./agentRegistry";

export default function AdminSettingsPage() {
  const navigate = useNavigate();
  const { states, refetch } = useAdminContext();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  const installedAgents = AGENTS.filter((a) => states[a.key]?.installed);

  const siteSettings = [
    { key: "site_url", label: "Site URL" },
    { key: "brand_name", label: "Brand Name" },
    { key: "business_description", label: "Business Description" },
  ];

  const apiServices = [
    { name: "ElevenLabs", agents: ["voice"] },
    { name: "Stripe", agents: ["pay"] },
    { name: "Twilio", agents: ["sms"] },
    { name: "Twitch", agents: ["stream"] },
    { name: "GitHub", agents: ["watch", "fix", "build", "agents"] },
    { name: "GitLab", agents: ["gitlab"] },
    { name: "Linear", agents: ["linear"] },
    { name: "Contentful", agents: ["contentful"] },
    { name: "Aikido", agents: ["security"] },
    { name: "Resend", agents: ["mail"] },
    { name: "Granola", agents: ["granola"] },
    { name: "YouTube", agents: ["youtube"] },
  ];

  return (
    <div>
      <button onClick={() => navigate("/admin")}
        className="flex items-center gap-1 text-[11px] text-[#f0ead6]/40 hover:text-[#f0ead6]/70 mb-4 transition-colors">
        <ArrowLeft size={12} /> Back to overview
      </button>

      <h1 className="text-2xl font-bold tracking-[0.05em] uppercase mb-8">Settings</h1>

      {/* Site Settings */}
      <section className="mb-10">
        <h2 className="text-[11px] tracking-[0.2em] uppercase text-[#f0ead6]/40 font-bold mb-3">Site Settings</h2>
        <div className="border border-[#f0ead6]/8 divide-y divide-[#f0ead6]/5">
          {siteSettings.map((s) => (
            <div key={s.key} className="flex items-center justify-between px-4 py-3">
              <span className="text-[12px] text-[#f0ead6]/50">{s.label}</span>
              <span className="text-[12px] text-[#f0ead6]/30">—</span>
            </div>
          ))}
        </div>
      </section>

      {/* API Keys */}
      <section className="mb-10">
        <h2 className="text-[11px] tracking-[0.2em] uppercase text-[#f0ead6]/40 font-bold mb-3">API Connections</h2>
        <div className="border border-[#f0ead6]/8 divide-y divide-[#f0ead6]/5">
          {apiServices.map((svc) => {
            const isInstalled = svc.agents.some((a) => states[a]?.installed);
            return (
              <div key={svc.name} className="flex items-center justify-between px-4 py-3">
                <span className="text-[12px] text-[#f0ead6]">{svc.name}</span>
                <span className={`text-[10px] tracking-wider uppercase font-bold px-2 py-0.5 rounded ${
                  isInstalled ? "bg-[#4ade80]/10 text-[#4ade80]" : "bg-[#f0ead6]/5 text-[#f0ead6]/25"
                }`}>
                  {isInstalled ? "Connected" : "Not installed"}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Version Status */}
      <section className="mb-10">
        <h2 className="text-[11px] tracking-[0.2em] uppercase text-[#f0ead6]/40 font-bold mb-3">Version Status</h2>
        <div className="border border-[#f0ead6]/8">
          <div className="grid items-center gap-2 px-4 py-2 border-b border-[#f0ead6]/10 text-[10px] tracking-[0.15em] uppercase text-[#f0ead6]/40 font-bold"
            style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
            <div>Agent</div><div>Installed</div><div>Status</div>
          </div>
          {installedAgents.map((agent) => (
            <div key={agent.key} className="grid items-center gap-2 px-4 py-2.5 border-b border-[#f0ead6]/5 text-[12px]"
              style={{ gridTemplateColumns: "2fr 1fr 1fr" }}>
              <div className="text-[#f0ead6]">{agent.label}</div>
              <div className="text-[#f0ead6]/50">{states[agent.key]?.promptVersion ? `v${states[agent.key]!.promptVersion}` : "—"}</div>
              <div className="text-[#4ade80] text-[10px] uppercase tracking-wider font-bold">Up to date</div>
            </div>
          ))}
          {installedAgents.length === 0 && (
            <div className="px-4 py-6 text-center text-[12px] text-[#f0ead6]/30">No agents installed</div>
          )}
        </div>
      </section>
    </div>
  );
}
