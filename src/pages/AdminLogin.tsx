import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Lock, Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [setupLoading, setSetupLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signIn(form.email, form.password);
    if (error) {
      toast({ title: "Login failed", description: error, variant: "destructive" });
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const handleRecovery = async () => {
    if (!recoveryEmail) {
      toast({ title: "Please enter recovery email", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-recover", {
        body: { recovery_email: recoveryEmail },
      });
      if (error) throw error;
      if (data?.error) {
        toast({ title: data.error, variant: "destructive" });
      } else {
        toast({
          title: "Credentials reset!",
          description: `Email: ${data.credentials.email} | Password: ${data.credentials.password}`,
        });
        setShowRecovery(false);
      }
    } catch {
      toast({ title: "Recovery failed", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleSetup = async () => {
    setSetupLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-setup");
      if (error) throw error;
      if (data?.exists) {
        toast({ title: "Admin account already exists" });
      } else {
        toast({
          title: "Admin created!",
          description: `Email: ${data.credentials.email} | Password: ${data.credentials.password}`,
        });
      }
    } catch {
      toast({ title: "Setup failed", variant: "destructive" });
    }
    setSetupLoading(false);
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
            <h1 className="font-display text-2xl font-medium">
              {showRecovery ? "Password Recovery" : "Admin Login"}
            </h1>
            <p className="font-body text-xs text-muted-foreground mt-2 uppercase tracking-[0.15em]">
              {showRecovery ? "Enter your recovery email" : "Dashboard Access"}
            </p>
          </div>

          {showRecovery ? (
            <div className="space-y-5">
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 flex items-center gap-2">
                  <Mail size={14} /> Recovery Email
                </label>
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors"
                  placeholder="Enter your recovery email"
                />
              </div>
              <button
                onClick={handleRecovery}
                disabled={loading}
                className="w-full bg-foreground text-primary-foreground py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Recovering..." : "Reset Credentials"}
              </button>
              <button
                onClick={() => setShowRecovery(false)}
                className="w-full flex items-center justify-center gap-2 py-2 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft size={14} /> Back to login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 flex items-center gap-2">
                  <Mail size={14} /> Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors"
                  placeholder="admin@praizyinterior.ng"
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
          )}

          <div className="mt-6 space-y-2 text-center">
            {!showRecovery && (
              <button
                onClick={() => setShowRecovery(true)}
                className="font-body text-xs text-accent hover:underline underline-offset-4"
              >
                Forgot password?
              </button>
            )}
            <div className="border-t border-border pt-4 mt-4">
              <button
                onClick={handleSetup}
                disabled={setupLoading}
                className="font-body text-[10px] text-muted-foreground hover:text-foreground transition-colors uppercase tracking-[0.15em]"
              >
                {setupLoading ? "Setting up..." : "First time? Initialize admin account"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default AdminLogin;
