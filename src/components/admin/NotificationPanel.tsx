import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Check, CheckCheck, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Notification } from "@/hooks/useNotifications";

interface Props {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
}

const typeColors: Record<string, string> = {
  booking: "bg-blue-100 text-blue-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  proposed: "bg-amber-100 text-amber-700",
};

const NotificationPanel = ({ open, onClose, notifications, onMarkRead, onMarkAllRead, onDismiss }: Props) => (
  <AnimatePresence>
    {open && (
      <>
        {/* Backdrop */}
        <div className="fixed inset-0 z-40" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 right-0 h-full w-full max-w-sm bg-background border-l border-border z-50 flex flex-col shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell size={16} />
              <h2 className="font-body text-sm font-semibold uppercase tracking-[0.15em]">Notifications</h2>
            </div>
            <div className="flex items-center gap-3">
              {notifications.some(n => !n.read) && (
                <button
                  onClick={onMarkAllRead}
                  className="font-body text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <CheckCheck size={12} /> Mark all read
                </button>
              )}
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <Bell size={32} strokeWidth={1} />
                <p className="font-body text-sm">No notifications</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-5 py-4 border-b border-border transition-colors ${!n.read ? "bg-accent/5" : ""}`}
                >
                  <div className={`mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${typeColors[n.type] ?? typeColors.booking}`}>
                    {n.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-body text-xs mb-0.5 ${!n.read ? "font-semibold text-foreground" : "text-foreground/80"}`}>
                      {n.title}
                    </p>
                    <p className="font-body text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                    <p className="font-body text-[10px] text-muted-foreground/60 mt-1">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {!n.read && (
                      <button onClick={() => onMarkRead(n.id)} title="Mark read" className="text-muted-foreground hover:text-foreground">
                        <Check size={13} />
                      </button>
                    )}
                    <button onClick={() => onDismiss(n.id)} title="Dismiss" className="text-muted-foreground hover:text-destructive">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-5 py-3 border-t border-border">
            <p className="font-body text-[10px] text-muted-foreground text-center">
              Notifications auto-archive after 14 days
            </p>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default NotificationPanel;