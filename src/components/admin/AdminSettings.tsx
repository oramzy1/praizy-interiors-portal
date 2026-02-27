import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Shield, Mail, Key } from "lucide-react";

const AdminSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("admin_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setRecoveryEmail(data.recovery_email || "");
      }
      setNewEmail(user.email || "");
    };
    fetchSettings();
  }, [user]);

  const updateRecoveryEmail = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase
      .from("admin_settings")
      .update({ recovery_email: recoveryEmail })
      .eq("user_id", user.id);
    
    if (error) {
      toast({ title: "Error updating recovery email", variant: "destructive" });
    } else {
      toast({ title: "Recovery email updated" });
    }
    setLoading(false);
  };

  const updatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated successfully" });
      setNewPassword("");
    }
    setLoading(false);
  };

  const updateEmail = async () => {
    if (!newEmail) return;
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      toast({ title: error.message, variant: "destructive" });
    } else {
      toast({ title: "Login email updated" });
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-medium mb-8">Settings</h1>

      <div className="space-y-8 max-w-xl">
        {/* Update Login Email */}
        <div className="bg-background border border-border p-6">
          <h2 className="font-body text-sm font-semibold flex items-center gap-2 mb-4">
            <Mail size={16} /> Login Email
          </h2>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors mb-3"
            placeholder="New login email"
          />
          <button
            onClick={updateEmail}
            disabled={loading}
            className="px-6 py-2.5 font-body text-xs uppercase tracking-[0.15em] bg-foreground text-primary-foreground hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            Update Email
          </button>
        </div>

        {/* Update Password */}
        <div className="bg-background border border-border p-6">
          <h2 className="font-body text-sm font-semibold flex items-center gap-2 mb-4">
            <Key size={16} /> Change Password
          </h2>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors mb-3"
            placeholder="New password"
          />
          <button
            onClick={updatePassword}
            disabled={loading}
            className="px-6 py-2.5 font-body text-xs uppercase tracking-[0.15em] bg-foreground text-primary-foreground hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            Update Password
          </button>
        </div>

        {/* Recovery Email */}
        <div className="bg-background border border-border p-6">
          <h2 className="font-body text-sm font-semibold flex items-center gap-2 mb-4">
            <Shield size={16} /> Recovery Email
          </h2>
          <p className="font-body text-xs text-muted-foreground mb-3">
            If you forget your credentials, providing this email will reset your login to the default credentials.
          </p>
          <input
            type="email"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors mb-3"
            placeholder="Recovery email address"
          />
          <button
            onClick={updateRecoveryEmail}
            disabled={loading}
            className="px-6 py-2.5 font-body text-xs uppercase tracking-[0.15em] bg-foreground text-primary-foreground hover:bg-foreground/90 transition-colors disabled:opacity-50"
          >
            Save Recovery Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
