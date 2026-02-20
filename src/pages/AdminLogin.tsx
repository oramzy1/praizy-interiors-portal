import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Lock, User } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    // Placeholder — will connect to backend auth
    setTimeout(() => {
      toast({ title: "Admin dashboard coming soon", description: "Backend integration will be set up next." });
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-secondary">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-6"
      >
        <div className="bg-background border border-border p-10">
          <div className="text-center mb-8">
            <img src="/images/logo.png" alt="Praizy Interior" className="h-14 mx-auto mb-4" />
            <h1 className="font-display text-2xl font-medium">Admin Login</h1>
            <p className="font-body text-xs text-muted-foreground mt-2 uppercase tracking-[0.15em]">Dashboard Access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 flex items-center gap-2">
                <User size={14} /> Username
              </label>
              <input
                value={form.username}
                onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 flex items-center gap-2">
                <Lock size={14} /> Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-primary-foreground py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center mt-6 font-body text-xs text-muted-foreground">
            <button className="text-accent hover:underline underline-offset-4">Forgot password?</button>
          </p>
        </div>
      </motion.div>
    </main>
  );
};

export default AdminLogin;
