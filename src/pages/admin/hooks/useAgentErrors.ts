import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AGENTS } from "../agentRegistry";

/**
 * Fetches recent errors (last 1 hour) across all agent error tables.
 * Returns a map of agent key → error messages.
 */
export function useAgentErrors(installedKeys: Set<string>) {
  return useQuery({
    queryKey: ["admin-agent-errors", Array.from(installedKeys).sort().join(",")],
    queryFn: async () => {
      const hourAgo = new Date();
      hourAgo.setHours(hourAgo.getHours() - 1);
      const since = hourAgo.toISOString();

      const errors: Record<string, string[]> = {};
      const agents = AGENTS.filter((a) => a.errorTable && installedKeys.has(a.key));

      await Promise.all(
        agents.map(async (agent) => {
          try {
            const { data } = await (supabase as any)
              .from(agent.errorTable!)
              .select("error_message, created_at")
              .gte("created_at", since)
              .order("created_at", { ascending: false })
              .limit(5);
            if (data && data.length > 0) {
              errors[agent.key] = data.map((r: any) => r.error_message);
            }
          } catch {}
        })
      );
      return errors;
    },
    refetchInterval: 60_000,
  });
}
