import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Award, Users, Clock, Star } from "lucide-react";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";

const stats = [
  { icon: Award, value: "150+", label: "Projects Completed" },
  { icon: Users, value: "120+", label: "Happy Clients" },
  { icon: Clock, value: "8+", label: "Years Experience" },
  { icon: Star, value: "4.9", label: "Average Rating" },
];

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <main className="pt-24">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">About Us</p>
            <h1 className="font-display text-4xl md:text-6xl font-medium max-w-3xl leading-tight">
              Designing <span className="text-accent-brand italic">Exceptional</span> Spaces Since 2016
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24" ref={ref}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display text-3xl md:text-4xl mb-6">Our Story</h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                Praizy Interior was born from a passion for transforming ordinary spaces into extraordinary experiences. Based in Lagos, Nigeria, we've built our reputation on delivering premium interior design solutions that blend functionality with breathtaking aesthetics.
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                Every project begins with understanding your vision. Our team of skilled designers and artisans work meticulously to ensure every detail — from material selection to final styling — reflects the highest standards of luxury and craftsmanship.
              </p>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                We believe that great design is an investment in how you live. Whether it's a cozy bedroom retreat or a grand commercial space, we bring the same level of dedication and artistry to every project.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              <img src={portfolio1} alt="Interior project" className="w-full aspect-[3/4] object-cover" />
              <img src={portfolio3} alt="Interior project" className="w-full aspect-[3/4] object-cover mt-8" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-foreground">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-accent mx-auto mb-3" strokeWidth={1.5} />
                <p className="font-display text-3xl text-primary-foreground font-medium">{stat.value}</p>
                <p className="font-body text-xs text-primary-foreground/60 mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Our Values</p>
          <h2 className="font-display text-3xl md:text-4xl mb-16">What Drives <span className="text-accent-brand italic">Us</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Excellence", desc: "We never compromise on quality. Every material, every detail, every finish is chosen with intention." },
              { title: "Innovation", desc: "We blend timeless design principles with contemporary trends to create spaces that feel both current and enduring." },
              { title: "Client Focus", desc: "Your vision is our blueprint. We listen, collaborate, and deliver beyond expectations — every single time." },
            ].map((v) => (
              <div key={v.title} className="p-8 border border-border">
                <h3 className="font-display text-xl mb-3">{v.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
