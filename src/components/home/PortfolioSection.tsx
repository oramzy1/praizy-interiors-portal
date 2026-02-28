import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";


// const projects = [
//   { img: portfolio1, title: "Contemporary Living", category: "Living Room" },
//   { img: portfolio2, title: "Serene Bedroom Suite", category: "Bedroom" },
//   { img: portfolio3, title: "Modern Kitchen", category: "Kitchen" },
//   { img: portfolio4, title: "Luxury Bathroom", category: "Bathroom" },
//   { img: portfolio5, title: "Executive Office", category: "Office" },
//   { img: portfolio6, title: "Elegant Dining", category: "Dining" },
// ];

const PortfolioSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [projects, setProjects] = useState<any[]>([]);


   useEffect(() => {
    supabase.from("portfolio_items").select("*").eq("featured", true).order("sort_order").then(({ data }) => {
      if (data) setProjects(data);
    });
  }, []);

  return (
    <section className="py-24 md:py-32 bg-secondary" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Portfolio</p>
            <h2 className="font-display text-3xl md:text-5xl font-medium">
              Featured <span className="text-accent-brand italic">Projects</span>
            </h2>
          </div>
          <Link to="/gallery" className="mt-4 md:mt-0 font-body text-xs uppercase tracking-[0.2em] text-accent hover:underline underline-offset-4">
            View All Projects →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.7 }}
              className="group relative overflow-hidden aspect-[4/5] cursor-pointer"
            >
              <img
                src={project.image_url}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="font-body text-xs tracking-[0.2em] uppercase text-accent">{project.category}</p>
                <h3 className="font-display text-xl text-primary-foreground mt-1">{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {projects.length === 0 && (
          <p className="font-body text-sm text-muted-foreground text-center py-16">No featured projects yet.</p>
        )}
      </div>
    </section>
  );
};

export default PortfolioSection;