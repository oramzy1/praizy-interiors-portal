import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 bg-foreground" ref={ref}>
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase text-primary-foreground/50 mb-3">
            Ready to Transform?
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-medium text-primary-foreground max-w-2xl mx-auto leading-tight">
            Let's Create Your <span className="text-accent italic">Dream Space</span>
          </h2>
          <p className="font-body text-sm text-primary-foreground/60 mt-6 max-w-lg mx-auto leading-relaxed">
            Schedule a free consultation and discover how we can transform your space into something extraordinary.
          </p>
          <Link
            to="/booking"
            className="inline-block mt-10 bg-accent text-accent-foreground px-12 py-4 font-body text-xs font-semibold uppercase tracking-[0.2em] hover:bg-accent/90 transition-colors"
          >
            Start Your Project
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
