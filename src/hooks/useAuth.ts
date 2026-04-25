import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      // SECURITY: strip OAuth tokens/code from URL after sign-in to prevent leak
      // via browser history, Referer header, or extensions.
      if (typeof window !== "undefined") {
        const h = window.location.hash;
        const s = window.location.search;
        if (
          h.includes("access_token") ||
          h.includes("id_token") ||
          h.includes("error_code") ||
          /[?&]code=/.test(s)
        ) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, signOut };
}
