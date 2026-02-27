import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, CheckCircle, XCircle, Clock } from "lucide-react";

const DashboardOverview = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.from("bookings").select("status");
      if (data) {
        setStats({
          total: data.length,
          pending: data.filter((b) => b.status === "pending").length,
          accepted: data.filter((b) => b.status === "accepted").length,
          rejected: data.filter((b) => b.status === "rejected").length,
        });
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Bookings", value: stats.total, icon: <CalendarDays size={24} />, color: "text-foreground" },
    { label: "Pending", value: stats.pending, icon: <Clock size={24} />, color: "text-amber-500" },
    { label: "Accepted", value: stats.accepted, icon: <CheckCircle size={24} />, color: "text-emerald-500" },
    { label: "Rejected", value: stats.rejected, icon: <XCircle size={24} />, color: "text-red-500" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-medium mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-background border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <span className={card.color}>{card.icon}</span>
            </div>
            <p className="font-display text-3xl font-semibold">{card.value}</p>
            <p className="font-body text-xs text-muted-foreground uppercase tracking-[0.15em] mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
