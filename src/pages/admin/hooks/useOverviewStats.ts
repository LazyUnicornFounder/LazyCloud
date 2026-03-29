import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useOverviewStats(hasAnyInstalled: boolean) {
  return useQuery({
    queryKey: ["admin-overview-stats"],
    enabled: hasAnyInstalled,
    queryFn: async () => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const todayIso = today.toISOString();

      const countToday = async (table: string, dateField = "created_at") => {
        try {
          const { count } = await (supabase as any).from(table).select("id", { count: "exact", head: true }).gte(dateField, todayIso);
          return count || 0;
        } catch { return 0; }
      };

      const countErrors = async (table: string) => {
        try {
          const { count } = await (supabase as any).from(table).select("id", { count: "exact", head: true }).gte("created_at", todayIso);
          return count || 0;
        } catch { return 0; }
      };

      const [blogToday, seoToday, geoToday] = await Promise.all([
        countToday("blog_posts"),
        countToday("seo_posts", "published_at"),
        countToday("geo_posts", "published_at"),
      ]);

      const errorTables = ["blog_errors", "seo_errors", "geo_errors", "voice_errors", "stream_errors", "granola_errors", "waitlist_errors"];
      const errorCounts = await Promise.all(errorTables.map(countErrors));
      const errorsToday = errorCounts.reduce((a, b) => a + b, 0);

      return {
        postsToday: blogToday + seoToday + geoToday,
        errorsToday,
      };
    },
    refetchInterval: 60_000,
  });
}
