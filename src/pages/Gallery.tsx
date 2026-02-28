import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Gallery = () => {
  const [filter, setFilter] = useState("All");
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [allProjects, setAllProjects] = useState<any[]>([]);

  useEffect(() => {
    // Fetch categories from services
    supabase.from("services").select("title").order("sort_order").then(({ data }) => {
      if (data) setCategories(["All", ...data.map(s => s.title)]);
    });
    // Fetch all visible portfolio items
    supabase.from("portfolio_items").select("*").eq("featured", true).order("sort_order").then(({ data }) => {
      if (data) setAllProjects(data);
    });
  }, []);

  const filtered = filter === "All" ? allProjects : allProjects.filter(p => p.category === filter);

  return (
    <main className="pt-24">
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Our Work</p>
            <h1 className="font-display text-4xl md:text-6xl font-medium">
              Project <span className="text-accent-brand italic">Gallery</span>
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`font-body text-xs uppercase tracking-[0.15em] px-5 py-2 border transition-all ${
                  filter === cat
                    ? "bg-foreground text-primary-foreground border-foreground"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group"
              >
                <div className="relative overflow-hidden aspect-[4/5]">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-all duration-500" />
                </div>
                <div className="mt-4">
                  <p className="font-body text-xs tracking-[0.2em] uppercase text-accent">{project.category}</p>
                  <h3 className="font-display text-lg mt-1">{project.title}</h3>
                  <p className="font-body text-sm text-muted-foreground mt-1">{project.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="font-body text-sm text-muted-foreground text-center py-16">
              {allProjects.length === 0 ? "No projects yet." : "No projects in this category."}
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default Gallery;