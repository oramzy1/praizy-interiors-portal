import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, ChevronUp, Trash2, Calendar, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface Booking {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  service_type: string;
  budget_range: string | null;
  project_description: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
  admin_notes: string | null;
  proposed_date: string | null;
  proposed_time: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  proposed: "bg-blue-100 text-blue-800",
};

const BookingManagement = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<Record<string, string>>({});
  const [proposedDates, setProposedDates] = useState<Record<string, string>>({});

  const fetchBookings = async () => {
    let query = supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (filter !== "all") query = query.eq("status", filter);
    const { data, error } = await query;
    if (error) {
      toast({ title: "Error fetching bookings", variant: "destructive" });
    } else {
      setBookings((data as Booking[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [filter]);

  const updateStatus = async (id: string, status: string, extra?: Record<string, unknown>) => {
    const updates: Record<string, unknown> = { status, ...extra };
    const { error } = await supabase.from("bookings").update(updates).eq("id", id);
    if (error) {
      toast({ title: "Error updating booking", variant: "destructive" });
    } else {
      toast({ title: `Booking ${status}` });
      fetchBookings();
    }
  };

  const saveNotes = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ admin_notes: noteInput[id] || "" }).eq("id", id);
    if (error) {
      toast({ title: "Error saving notes", variant: "destructive" });
    } else {
      toast({ title: "Notes saved" });
      fetchBookings();
    }
  };

  const deleteBooking = async (id: string) => {
    const { error } = await supabase.from("bookings").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting booking", variant: "destructive" });
    } else {
      toast({ title: "Booking deleted" });
      fetchBookings();
    }
  };

  const filters = ["all", "pending", "accepted", "rejected", "proposed"];

  return (
    <div>
      <h1 className="font-display text-3xl font-medium mb-6">Booking Management</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-body text-xs uppercase tracking-[0.15em] border transition-colors ${
              filter === f ? "bg-foreground text-primary-foreground border-foreground" : "bg-background border-border text-muted-foreground hover:border-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-body text-sm text-muted-foreground">Loading...</p>
      ) : bookings.length === 0 ? (
        <div className="bg-background border border-border p-12 text-center">
          <p className="font-body text-sm text-muted-foreground">No bookings found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-background border border-border">
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-body text-sm font-semibold truncate">{booking.client_name}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded ${statusColors[booking.status] || ""}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">
                    {booking.service_type} · {booking.client_email}
                    {booking.preferred_date && ` · ${format(new Date(booking.preferred_date), "MMM d, yyyy")}`}
                  </p>
                </div>
                {expandedId === booking.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {expandedId === booking.id && (
                <div className="px-5 pb-5 border-t border-border pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-body">
                    <div><span className="text-muted-foreground">Phone:</span> {booking.client_phone || "N/A"}</div>
                    <div><span className="text-muted-foreground">Budget:</span> {booking.budget_range || "N/A"}</div>
                    <div><span className="text-muted-foreground">Preferred Time:</span> {booking.preferred_time || "N/A"}</div>
                    <div><span className="text-muted-foreground">Submitted:</span> {format(new Date(booking.created_at), "MMM d, yyyy HH:mm")}</div>
                  </div>

                  {booking.project_description && (
                    <div>
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-[0.15em] mb-1">Project Details</p>
                      <p className="font-body text-sm bg-muted/50 p-3">{booking.project_description}</p>
                    </div>
                  )}

                  {/* Admin Notes */}
                  <div>
                    <p className="font-body text-xs text-muted-foreground uppercase tracking-[0.15em] mb-1 flex items-center gap-1">
                      <MessageSquare size={12} /> Admin Notes
                    </p>
                    <textarea
                      className="w-full border border-border bg-background px-3 py-2 font-body text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                      rows={2}
                      value={noteInput[booking.id] ?? booking.admin_notes ?? ""}
                      onChange={(e) => setNoteInput((p) => ({ ...p, [booking.id]: e.target.value }))}
                      placeholder="Add notes..."
                    />
                    <button
                      onClick={() => saveNotes(booking.id)}
                      className="mt-1 px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.15em] bg-foreground text-primary-foreground hover:bg-foreground/90 transition-colors"
                    >
                      Save Notes
                    </button>
                  </div>

                  {/* Propose Alternative */}
                  {booking.status === "pending" && (
                    <div>
                      <p className="font-body text-xs text-muted-foreground uppercase tracking-[0.15em] mb-1 flex items-center gap-1">
                        <Calendar size={12} /> Propose Alternative Date
                      </p>
                      <input
                        type="date"
                        className="border border-border bg-background px-3 py-2 font-body text-sm focus:outline-none focus:border-accent transition-colors"
                        value={proposedDates[booking.id] || ""}
                        onChange={(e) => setProposedDates((p) => ({ ...p, [booking.id]: e.target.value }))}
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap pt-2">
                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(booking.id, "accepted")}
                          className="px-4 py-2 font-body text-xs uppercase tracking-[0.15em] bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(booking.id, "rejected")}
                          className="px-4 py-2 font-body text-xs uppercase tracking-[0.15em] bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                        {proposedDates[booking.id] && (
                          <button
                            onClick={() =>
                              updateStatus(booking.id, "proposed", {
                                proposed_date: proposedDates[booking.id],
                              })
                            }
                            className="px-4 py-2 font-body text-xs uppercase tracking-[0.15em] bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          >
                            Propose Date
                          </button>
                        )}
                      </>
                    )}
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="px-4 py-2 font-body text-xs uppercase tracking-[0.15em] border border-red-300 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
