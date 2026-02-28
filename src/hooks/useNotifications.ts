import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  archived: boolean;
  reference_id: string | null;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [banner, setBanner] = useState<Notification | null>(null);
  const [shownIds, setShownIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    // Auto-archive old ones first
    await supabase.rpc("auto_archive_notifications");

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("archived", false)
      .order("created_at", { ascending: false });

    if (data) {
      setNotifications(data);
      // Show banner for first unread not yet shown this session
      const firstUnread = data.find(n => !n.read && !shownIds.has(n.id));
      if (firstUnread) {
        setBanner(firstUnread);
        setShownIds(prev => new Set([...prev, firstUnread.id]));
      }
    }
  }, [shownIds]);

  useEffect(() => {
    load();

    // Realtime subscription
    const channel = supabase
      .channel("notifications")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notifications",
      }, payload => {
        const n = payload.new as Notification;
        setNotifications(prev => [n, ...prev]);
        setBanner(n);
        setShownIds(prev => new Set([...prev, n.id]));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const markRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = async () => {
    await supabase.from("notifications").update({ read: true }).eq("read", false).eq("archived", false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismiss = async (id: string) => {
    await supabase.from("notifications").update({ archived: true }).eq("id", id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const dismissBanner = () => setBanner(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, unreadCount, banner, dismissBanner, markRead, markAllRead, dismiss };
};