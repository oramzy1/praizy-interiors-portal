import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { Notification } from "@/hooks/useNotifications";

interface Props {
  notification: Notification | null;
  onDismiss: () => void;
  onView: () => void;
}

const NotificationBanner = ({ notification, onDismiss, onView }: Props) => (
  <AnimatePresence>
    {notification && (
      <motion.div
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -60 }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md mx-auto px-4"
      >
        <div className="bg-foreground text-primary-foreground shadow-2xl flex items-start gap-4 p-4 pr-3">
          <div className="w-8 h-8 bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
            <Calendar size={15} className="text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.15em] mb-0.5">
              {notification.title}
            </p>
            <p className="font-body text-xs text-primary-foreground/70 leading-relaxed">
              {notification.message}
            </p>
            <button
              onClick={onView}
              className="mt-2 font-body text-[10px] uppercase tracking-widest text-accent hover:underline"
            >
              View Bookings →
            </button>
          </div>
          <button
            onClick={onDismiss}
            className="text-primary-foreground/50 hover:text-primary-foreground transition-colors shrink-0 p-1"
          >
            <X size={15} />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default NotificationBanner;