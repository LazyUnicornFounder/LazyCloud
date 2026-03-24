import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PromptVersion {
  id: string;
  product: string;
  version: string;
  prompt_text: string;
  is_current: boolean;
  created_at: string;
}

export function useCurrentPrompt(product: string) {
  const [prompt, setPrompt] = useState<PromptVersion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("prompt_versions")
      .select("*")
      .eq("product", product)
      .eq("is_current", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setPrompt(data as PromptVersion);
        setLoading(false);
      });
  }, [product]);

  return { prompt, loading };
}

export function usePromptHistory(product: string) {
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("prompt_versions")
      .select("*")
      .eq("product", product)
      .order("created_at", { ascending: false });
    if (data) setVersions(data as PromptVersion[]);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [product]);

  return { versions, loading, refetch: fetch };
}

/** Save a new prompt version and mark all previous versions as not current */
export async function savePromptVersion(product: string, promptText: string, version: string) {
  // Mark old versions as not current
  await supabase
    .from("prompt_versions")
    .update({ is_current: false })
    .eq("product", product)
    .eq("is_current", true);

  // Insert new current version
  const { error } = await supabase
    .from("prompt_versions")
    .insert({ product, version, prompt_text: promptText, is_current: true });

  return { error };
}
