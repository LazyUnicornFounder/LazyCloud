import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AGENTS } from "../agentRegistry";

export interface AgentState {
  installed: boolean;
  setupComplete: boolean;
  isRunning: boolean;
  promptVersion?: string;
  settings?: Record<string, any>;
}

/**
 * Detects which agents are installed by probing their settings tables.
 * Returns a map of agent key → AgentState.
 */
export function useAgentDetection() {
  const [states, setStates] = useState<Record<string, AgentState>>({});
  const [loading, setLoading] = useState(true);

  const detect = async () => {
    const result: Record<string, AgentState> = {};
    const checks = AGENTS.map(async (agent) => {
      try {
        const { data, error } = await (supabase as any)
          .from(agent.settingsTable)
          .select("*")
          .limit(1)
          .maybeSingle();
        if (error) {
          result[agent.key] = { installed: false, setupComplete: false, isRunning: false };
        } else if (!data) {
          result[agent.key] = { installed: true, setupComplete: false, isRunning: false };
        } else {
          result[agent.key] = {
            installed: true,
            setupComplete: data.setup_complete !== false,
            isRunning: !!data[agent.runField],
            promptVersion: data.prompt_version || undefined,
            settings: data,
          };
        }
      } catch {
        result[agent.key] = { installed: false, setupComplete: false, isRunning: false };
      }
    });
    await Promise.all(checks);
    setStates(result);
    setLoading(false);
  };

  useEffect(() => { detect(); }, []);

  return { states, loading, refetch: detect };
}
