import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Paintbrush, Sofa, Lamp, Home, Building2, Palette } from "lucide-react";

const services = [
  { icon: Paintbrush, title: "Interior Styling", desc: "Curated aesthetics that reflect your personality and elevate your space." },
  { icon: Sofa, title: "Furniture Design", desc: "Bespoke furniture pieces crafted to perfection for your unique spaces." },
  { icon: Lamp, title: "Lighting Design", desc: "Strategic lighting solutions that set the perfect mood and ambiance." },
  { icon: Home, title: "Residential Design", desc: "Complete home transformations from concept to final reveal." },
  { icon: Building2, title: "Commercial Spaces", desc: "Sophisticated office and retail environments that inspire." },
  { icon: Palette, title: "Color Consultation", desc: "Expert color palette guidance for harmonious, balanced interiors." },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 bg-background" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">What We Do</p>
          <h2 className="font-display text-3xl md:text-5xl font-medium">
            Our <span className="text-accent-brand italic">Services</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group p-8 border border-border hover:border-accent/30 transition-all duration-500 hover:shadow-lg"
            >
              <service.icon className="w-8 h-8 mb-5 text-accent transition-transform group-hover:scale-110 duration-300" strokeWidth={1.5} />
              <h3 className="font-display text-xl mb-3">{service.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
