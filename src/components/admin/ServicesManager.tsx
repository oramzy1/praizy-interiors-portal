import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Pencil, Check, X } from "lucide-react";

const ServicesManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", description: "", icon: "Star" });
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const load = async () => {
    const { data } = await supabase.from("services").select("*").order("sort_order");
    if (data) setItems(data);
  };

  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!form.title) return toast({ title: "Title required", variant: "destructive" });
    await supabase.from("services").insert({ ...form, sort_order: items.length });
    toast({ title: "Service added" });
    setForm({ title: "", description: "", icon: "Star" });
    setAdding(false);
    load();
  };

  const save = async () => {
    await supabase.from("services").update({ title: editing.title, description: editing.description, icon: editing.icon }).eq("id", editing.id);
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("services").delete().eq("id", id);
    toast({ title: "Service removed" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Services</h2>
        <button onClick={() => setAdding(!adding)} className="flex items-center gap-2 bg-foreground text-primary-foreground px-4 py-2 font-body text-xs uppercase tracking-widest">
          <Plus size={14} /> Add Service
        </button>
      </div>

      {adding && (
        <div className="border border-border p-6 space-y-3 bg-background">
          <input placeholder="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full border border-border px-3 py-2 font-body text-sm bg-background" />
          <input placeholder="Icon name (e.g. Paintbrush, Sofa, Lamp, Home)" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className="w-full border border-border px-3 py-2 font-body text-sm bg-background" />
          <textarea placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="w-full border border-border px-3 py-2 font-body text-sm bg-background resize-none" rows={2} />
          <button onClick={add} className="bg-foreground text-primary-foreground px-6 py-2 font-body text-xs uppercase tracking-widest">Save</button>
        </div>
      )}

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-4 border border-border p-4 bg-background">
            {editing?.id === item.id ? (
              <div className="flex-1 space-y-2">
                <input value={editing.title} onChange={e => setEditing((p: any) => ({ ...p, title: e.target.value }))} className="w-full border border-border px-3 py-1.5 font-body text-sm bg-background" />
                <input value={editing.icon} onChange={e => setEditing((p: any) => ({ ...p, icon: e.target.value }))} className="w-full border border-border px-3 py-1.5 font-body text-sm bg-background" />
                <textarea value={editing.description} onChange={e => setEditing((p: any) => ({ ...p, description: e.target.value }))} className="w-full border border-border px-3 py-1.5 font-body text-sm bg-background resize-none" rows={2} />
              </div>
            ) : (
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-medium">{item.title}</p>
                <p className="font-body text-xs text-muted-foreground">{item.description}</p>
                <p className="font-body text-[10px] text-muted-foreground mt-0.5">icon: {item.icon}</p>
              </div>
            )}
            {editing?.id === item.id ? (
              <div className="flex gap-2">
                <button onClick={save} className="text-green-600"><Check size={16} /></button>
                <button onClick={() => setEditing(null)} className="text-muted-foreground"><X size={16} /></button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button onClick={() => setEditing({ ...item })} className="text-muted-foreground hover:text-foreground"><Pencil size={15} /></button>
                <button onClick={() => remove(item.id)} className="text-destructive"><Trash2 size={15} /></button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesManager;