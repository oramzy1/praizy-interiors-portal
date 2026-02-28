import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Eye, EyeOff, Plus, Check, Star } from "lucide-react";

const TestimonialsManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ client_name: "", client_role: "", content: "", rating: 5 });
  const [tab, setTab] = useState<"pending" | "published">("pending");

  const load = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => { load(); }, []);

  const pending = items.filter(i => !i.featured);
  const published = items.filter(i => i.featured);

  const approve = async (item: any) => {
    await supabase.from("testimonials").update({ featured: true }).eq("id", item.id);
    toast({ title: "Testimonial published" });
    load();
  };

  const unpublish = async (item: any) => {
    await supabase.from("testimonials").update({ featured: false }).eq("id", item.id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    toast({ title: "Testimonial removed" });
    load();
  };

  const add = async () => {
    if (!form.client_name || !form.content) {
      return toast({ title: "Name and message required", variant: "destructive" });
    }
    await supabase.from("testimonials").insert({ ...form, featured: true });
    toast({ title: "Testimonial added and published" });
    setForm({ client_name: "", client_role: "", content: "", rating: 5 });
    setAdding(false);
    load();
  };

  const TestimonialRow = ({ item }: { item: any }) => (
    <div className="border border-border p-4 bg-background space-y-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-body text-sm font-medium">{item.client_name}</p>
            <span className="font-body text-xs text-muted-foreground">·</span>
            <p className="font-body text-xs text-muted-foreground">{item.client_role}</p>
          </div>
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star key={idx} size={11} className={idx < (item.rating ?? 5) ? "text-accent fill-accent" : "text-border"} />
            ))}
          </div>
          <p className="font-body text-sm text-muted-foreground line-clamp-2">"{item.content}"</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {!item.featured && (
            <button onClick={() => approve(item)} title="Approve & publish" className="text-green-600 hover:text-green-700">
              <Check size={16} />
            </button>
          )}
          <button onClick={() => item.featured ? unpublish(item) : null} className="text-muted-foreground hover:text-foreground" title={item.featured ? "Unpublish" : ""}>
            {item.featured ? <EyeOff size={16} /> : <Eye size={14} className="opacity-30" />}
          </button>
          <button onClick={() => remove(item.id)} className="text-destructive">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Testimonials</h2>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-2 bg-foreground text-primary-foreground px-4 py-2 font-body text-xs uppercase tracking-widest"
        >
          <Plus size={14} /> Add Manually
        </button>
      </div>

      {adding && (
        <div className="border border-border p-6 space-y-4 bg-background">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Client name" value={form.client_name} onChange={e => setForm(p => ({ ...p, client_name: e.target.value }))} className="border border-border px-3 py-2 font-body text-sm bg-background w-full" />
            <input placeholder="Role / Location" value={form.client_role} onChange={e => setForm(p => ({ ...p, client_role: e.target.value }))} className="border border-border px-3 py-2 font-body text-sm bg-background w-full" />
          </div>
          <div>
            <label className="font-body text-xs text-muted-foreground mb-1 block">Rating</label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, idx) => (
                <button key={idx} type="button" onClick={() => setForm(p => ({ ...p, rating: idx + 1 }))}>
                  <Star size={20} className={idx < form.rating ? "text-accent fill-accent" : "text-border"} />
                </button>
              ))}
            </div>
          </div>
          <textarea placeholder="Testimonial content" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className="w-full border border-border px-3 py-2 font-body text-sm bg-background resize-none" rows={3} />
          <button onClick={add} className="bg-foreground text-primary-foreground px-6 py-2 font-body text-xs uppercase tracking-widest">Publish</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-0 border border-border w-fit">
        {(["pending", "published"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 font-body text-xs uppercase tracking-widest transition-colors ${tab === t ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t} {t === "pending" ? `(${pending.length})` : `(${published.length})`}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {(tab === "pending" ? pending : published).map(item => (
          <TestimonialRow key={item.id} item={item} />
        ))}
        {(tab === "pending" ? pending : published).length === 0 && (
          <p className="font-body text-sm text-muted-foreground text-center py-8">
            {tab === "pending" ? "No pending reviews." : "No published testimonials yet."}
          </p>
        )}
      </div>
    </div>
  );
};

export default TestimonialsManager;