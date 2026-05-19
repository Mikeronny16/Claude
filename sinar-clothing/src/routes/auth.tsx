import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Logo } from "@/components/sinar/Logo";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Account created. You can now sign in.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/admin" });
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-hairline shadow-soft p-8">
        <div className="flex justify-center mb-6"><Logo height={56} /></div>
        <h1 className="font-serif text-3xl text-center text-ink">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-center text-sm text-muted mt-2">Admin panel · Sinar Clothing</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-deep">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-hairline bg-cream focus:outline-none focus:ring-2 focus:ring-deep/30" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-deep">Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-hairline bg-cream focus:outline-none focus:ring-2 focus:ring-deep/30" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-deep hover:bg-deep-hover text-white py-3 rounded-xl font-medium shadow-soft transition disabled:opacity-50">
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-6 w-full text-sm text-muted hover:text-ink transition">
          {mode === "login" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-muted hover:text-deep">← Back to store</Link>
        </div>
      </div>
    </div>
  );
}
