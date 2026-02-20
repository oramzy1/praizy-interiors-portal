import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const videos = ["/videos/hero-1.mp4", "/videos/hero-2.mp4", "/videos/hero-3.mp4"];

const HeroSection = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideo]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideo}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videos[currentVideo]} type="video/mp4" />
          </video>
        </motion.div>
      </AnimatePresence>

      {/* Dark Overlay */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-body text-xs tracking-[0.3em] uppercase mb-6 text-primary-foreground/70"
        >
          Premium Interior Design Studio
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-medium leading-tight max-w-4xl text-primary-foreground"
        >
          Crafting <span className="text-accent italic">Timeless</span>
          <br />Living Spaces
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="font-body text-sm md:text-base mt-6 max-w-lg text-primary-foreground/70 leading-relaxed"
        >
          Transform your home into a luxury sanctuary with our bespoke interior design services.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/booking"
            className="bg-accent text-accent-foreground px-10 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] hover:bg-accent/90 transition-colors"
          >
            Book a Consultation
          </Link>
          <Link
            to="/gallery"
            className="border border-primary-foreground/30 text-primary-foreground px-10 py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] hover:bg-primary-foreground/10 transition-colors"
          >
            View Portfolio
          </Link>
        </motion.div>
      </div>

      {/* Video indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentVideo(i)}
            className={`h-0.5 transition-all duration-500 ${
              i === currentVideo ? "w-10 bg-accent" : "w-5 bg-primary-foreground/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
