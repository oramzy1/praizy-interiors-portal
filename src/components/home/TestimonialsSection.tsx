import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Adaeze Okonkwo",
    role: "Homeowner, Lekki",
    text: "Praizy Interior completely transformed our home. The attention to detail and quality of materials exceeded our expectations. Truly a luxury experience.",
  },
  {
    name: "Emeka Ibe",
    role: "CEO, Apex Holdings",
    text: "Our office redesign by Praizy Interior has impressed every client who walks through our doors. Professional, creative, and impeccable taste.",
  },
  {
    name: "Funke Adeyemi",
    role: "Homeowner, Victoria Island",
    text: "From the initial consultation to the final reveal, the process was seamless. Our living room is now the talk of every gathering.",
  },
];

const TestimonialsSection = () => {
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
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Testimonials</p>
          <h2 className="font-display text-3xl md:text-5xl font-medium">
            Client <span className="text-accent-brand italic">Stories</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="p-8 border border-border"
            >
              <Quote className="w-6 h-6 text-accent mb-4" strokeWidth={1.5} />
              <p className="font-body text-sm leading-relaxed text-muted-foreground mb-6">"{t.text}"</p>
              <div>
                <p className="font-display text-base font-medium">{t.name}</p>
                <p className="font-body text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
