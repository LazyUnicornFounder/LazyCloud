import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TotalVisitorCount = () => {
  const { data: count } = useQuery({
    queryKey: ["total-visitors"],
    queryFn: async () => {
      const { data } = await supabase
        .from("app_config")
        .select("value")
        .eq("key", "total_visitors")
        .maybeSingle();
      return data?.value ? parseInt(data.value, 10) : null;
    },
    refetchInterval: 60000,
  });

  if (!count) return null;

  return (
    <div className="bg-transparent backdrop-blur-xl border border-primary/20 border-b-0 rounded-t-2xl px-5 py-1.5 inline-flex items-center gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
      <span className="font-body text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-foreground/60 font-semibold">
        {count.toLocaleString()} visitors
      </span>
    </div>
  );
};

export default TotalVisitorCount;
