import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Eye, EyeOff, Plus, X, Upload, GripVertical } from "lucide-react";

const PortfolioManager = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", category: "", description: "", featured: true });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase.from("portfolio_items").select("*").order("sort_order");
    if (data) setItems(data);
  };

  useEffect(() => {
    load();
    // Load service titles as categories
    supabase.from("services").select("title").order("sort_order").then(({ data }) => {
      if (data) setServices(data);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const add = async () => {
    if (!form.title || !form.category) {
      return toast({ title: "Title and category are required", variant: "destructive" });
    }
    if (!imageFile) {
      return toast({ title: "Please select an image", variant: "destructive" });
    }

    setUploading(true);
    try {
      // Upload image to Supabase Storage
      const ext = imageFile.name.split(".").pop();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filename, imageFile, { contentType: imageFile.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("portfolio").getPublicUrl(filename);

      await supabase.from("portfolio_items").insert({
        ...form,
        image_url: urlData.publicUrl,
        sort_order: items.length,
      });

      toast({ title: "Portfolio item added" });
      setForm({ title: "", category: "", description: "", featured: true });
      clearImage();
      setAdding(false);
      load();
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const toggleFeatured = async (item: any) => {
    await supabase.from("portfolio_items").update({ featured: !item.featured }).eq("id", item.id);
    load();
  };

  const remove = async (item: any) => {
    // Extract filename from URL and delete from storage
    const filename = item.image_url.split("/").pop();
    await supabase.storage.from("portfolio").remove([filename]);
    await supabase.from("portfolio_items").delete().eq("id", item.id);
    toast({ title: "Item removed" });
    load();
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const a = items[index], b = items[index - 1];
    await supabase.from("portfolio_items").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("portfolio_items").update({ sort_order: a.sort_order }).eq("id", b.id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Portfolio Items</h2>
        <button
          onClick={() => setAdding(!adding)}
          className="flex items-center gap-2 bg-foreground text-primary-foreground px-4 py-2 font-body text-xs uppercase tracking-widest"
        >
          <Plus size={14} /> Add Item
        </button>
      </div>

      {adding && (
        <div className="border border-border p-6 space-y-4 bg-background">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Title"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="border border-border px-3 py-2 font-body text-sm bg-background w-full"
            />
            <select
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
              className="border border-border px-3 py-2 font-body text-sm bg-background w-full"
            >
              <option value="">Select category</option>
              {services.map(s => (
                <option key={s.title} value={s.title}>{s.title}</option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="w-full border border-border px-3 py-2 font-body text-sm bg-background resize-none"
            rows={2}
          />

          {/* Image picker */}
          <div>
            {preview ? (
              <div className="relative inline-block">
                <img src={preview} alt="Preview" className="h-48 w-auto object-cover border border-border" />
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-background border border-border p-1 hover:bg-muted"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-border hover:border-accent transition-colors py-10 flex flex-col items-center gap-2 text-muted-foreground"
              >
                <Upload size={22} />
                <span className="font-body text-xs uppercase tracking-widest">Click to select image</span>
                <span className="font-body text-[10px]">JPG, PNG, WEBP</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 font-body text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                className="accent-foreground"
              />
              Show on frontend (featured)
            </label>
          </div>

          <button
            onClick={add}
            disabled={uploading}
            className="bg-foreground text-primary-foreground px-6 py-2 font-body text-xs uppercase tracking-widest disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Publish"}
          </button>
        </div>
      )}

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={item.id} className="flex items-center gap-4 border border-border p-4 bg-background">
            <button onClick={() => moveUp(i)} className="text-muted-foreground hover:text-foreground shrink-0">
              <GripVertical size={16} />
            </button>
            <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm font-medium truncate">{item.title}</p>
              <p className="font-body text-xs text-muted-foreground">{item.category}</p>
            </div>
            <button
              onClick={() => toggleFeatured(item)}
              className="text-muted-foreground hover:text-foreground shrink-0"
              title={item.featured ? "Hide from frontend" : "Show on frontend"}
            >
              {item.featured ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button onClick={() => remove(item)} className="text-destructive shrink-0">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <p className="font-body text-sm text-muted-foreground text-center py-8">No portfolio items yet.</p>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;