import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LogOut, CalendarDays, Settings, LayoutDashboard } from "lucide-react";
import BookingManagement from "@/components/admin/BookingManagement";
import AdminSettings from "@/components/admin/AdminSettings";
import DashboardOverview from "@/components/admin/DashboardOverview";

type Tab = "overview" | "bookings" | "settings";

const AdminDashboard = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin");
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { id: "bookings", label: "Bookings", icon: <CalendarDays size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-background border-r border-border z-50 flex flex-col">
        <div className="p-6 border-b border-border">
          <img src="/images/logo.png" alt="Praizy Interior" className="h-10 mb-2" />
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 font-body text-sm transition-colors rounded ${
                activeTab === tab.id
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <p className="font-body text-xs text-muted-foreground mb-2 truncate">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2 font-body text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        {activeTab === "overview" && <DashboardOverview />}
        {activeTab === "bookings" && <BookingManagement />}
        {activeTab === "settings" && <AdminSettings />}
      </main>
    </div>
  );
};

export default AdminDashboard;
