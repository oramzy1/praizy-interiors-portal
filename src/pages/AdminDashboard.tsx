import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  CalendarDays,
  Settings,
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  ImageIcon,
  Bell,
} from "lucide-react";
import BookingManagement from "@/components/admin/BookingManagement";
import AdminSettings from "@/components/admin/AdminSettings";
import DashboardOverview from "@/components/admin/DashboardOverview";
import PortfolioManager from "@/components/admin/PortfolioManager";
import ServicesManager from "@/components/admin/ServicesManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationBanner from "@/components/admin/NotificationBanner";
import NotificationPanel from "@/components/admin/NotificationPanel";

type Tab =
  | "overview"
  | "bookings"
  | "settings"
  | "portfolio"
  | "services"
  | "testimonials";

const AdminDashboard = () => {
  const { signOut, user } = useAuth();
  const {
    notifications,
    unreadCount,
    banner,
    dismissBanner,
    markRead,
    markAllRead,
    dismiss,
  } = useNotifications();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [panelOpen, setPanelOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin");
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { id: "bookings", label: "Bookings", icon: <CalendarDays size={18} /> },
    { id: "portfolio", label: "Portfolio", icon: <ImageIcon size={18} /> },
    { id: "services", label: "Services", icon: <Briefcase size={18} /> },
    {
      id: "testimonials",
      label: "Testimonials",
      icon: <MessageSquare size={18} />,
    },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <NotificationBanner
        notification={banner}
        onDismiss={dismissBanner}
        onView={() => {
          dismissBanner();
          setPanelOpen(true);
        }}
      />
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-background border-r border-border z-50 flex flex-col">
        <div className="p-6 border-b border-border">
          <img
            src="/images/logo.png"
            alt="Praizy Interior"
            className="h-10 mb-2"
          />
          <p className="font-body text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Admin Dashboard
          </p>
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

        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-body text-xs text-muted-foreground truncate flex-1">
              {user?.email}
            </p>
            <button
              onClick={() => setPanelOpen(true)}
              className="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground rounded-full text-[9px] font-bold flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          </div>
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
        {activeTab === "portfolio" && <PortfolioManager />}
        {activeTab === "services" && <ServicesManager />}
        {activeTab === "testimonials" && <TestimonialsManager />}
        {activeTab === "settings" && <AdminSettings />}
      </main>

      <NotificationPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        notifications={notifications}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
        onDismiss={dismiss}
      />
    </div>
  );
};

export default AdminDashboard;
