import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") navigate("/"); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) return;
    setStatus("loading");
    try {
      const { error } = await supabase.from("early_access").insert({ email: trimmed, source: "signup-page" });
      if (error && error.code === "23505") {
        setStatus("success");
        return;
      }
      if (error) throw error;
      setStatus("success");
    } catch {
      setStatus("error");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16 relative">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 right-6 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-display text-lg font-bold tracking-tight">
            Lazy Cloud
          </Link>
          <h1 className="text-2xl font-bold font-display mt-6 mb-2">Get Early Access</h1>
          <p className="text-sm text-muted-foreground">Be the first to try Lazy Cloud. We'll let you know when it's ready.</p>
        </div>

        {status === "success" ? (
          <div className="text-center py-8">
            <p className="text-primary font-medium text-lg mb-2">You're on the list! 🎉</p>
            <p className="text-sm text-muted-foreground">We'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              required
              maxLength={255}
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-muted/50 border-border"
            />
            <Button type="submit" className="w-full h-12" disabled={status === "loading"}>
              {status === "loading" ? "Joining…" : "Join the waitlist"}
              {status !== "loading" && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
