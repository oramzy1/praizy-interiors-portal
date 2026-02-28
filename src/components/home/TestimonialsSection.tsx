import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Quote, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ client_name: "", client_role: "", content: "", rating: 5 });

  useEffect(() => {
    supabase.from("testimonials").select("*").eq("featured", true).then(({ data }) => {
      if (data) setTestimonials(data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name || !form.content) {
      toast({ title: "Please fill in your name and message", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("testimonials").insert({
      ...form,
      featured: false,
    });
    if (error) {
      toast({ title: "Submission failed", variant: "destructive" });
    } else {
      setSubmitted(true);
      setForm({ client_name: "", client_role: "", content: "", rating: 5 });
    }
    setSubmitting(false);
  };

  return (
    <section className="py-24 md:py-32 bg-secondary" ref={ref}>
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

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="p-8 border border-border bg-background"
            >
              <Quote className="w-6 h-6 text-accent mb-4" strokeWidth={1.5} />
              {/* Star rating */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={13}
                    className={idx < (t.rating ?? 5) ? "text-accent fill-accent" : "text-border"}
                  />
                ))}
              </div>
              <p className="font-body text-sm leading-relaxed text-muted-foreground mb-6">"{t.content}"</p>
              <div>
                <p className="font-display text-base font-medium">{t.client_name}</p>
                <p className="font-body text-xs text-muted-foreground">{t.client_role}</p>
              </div>
            </motion.div>
          ))}

          {testimonials.length === 0 && (
            <p className="col-span-3 text-center font-body text-sm text-muted-foreground py-8">
              Be the first to share your experience.
            </p>
          )}
        </div>

        {/* CTA to leave a testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          {!showForm && !submitted && (
            <div className="text-center">
              <p className="font-body text-sm text-muted-foreground mb-4">Worked with us? We'd love to hear from you.</p>
              <button
                onClick={() => setShowForm(true)}
                className="font-body text-xs uppercase tracking-[0.2em] border border-border px-8 py-3 hover:bg-foreground hover:text-primary-foreground transition-all duration-300"
              >
                Share Your Experience
              </button>
            </div>
          )}

          {showForm && !submitted && (
            <motion.form
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit}
              className="bg-background border border-border p-8 space-y-5"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-lg">Share Your Experience</h3>
                <button type="button" onClick={() => setShowForm(false)} className="font-body text-xs text-muted-foreground hover:text-foreground">Cancel</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">Full Name *</label>
                  <input
                    value={form.client_name}
                    onChange={e => setForm(p => ({ ...p, client_name: e.target.value }))}
                    className="w-full border border-border bg-secondary px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">Role / Location</label>
                  <input
                    value={form.client_role}
                    onChange={e => setForm(p => ({ ...p, client_role: e.target.value }))}
                    className="w-full border border-border bg-secondary px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors"
                    placeholder="e.g. Homeowner, Lekki"
                  />
                </div>
              </div>

              {/* Star rating picker */}
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">Rating</label>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, rating: idx + 1 }))}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={22}
                        className={idx < form.rating ? "text-accent fill-accent" : "text-border"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">Your Experience *</label>
                <textarea
                  value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  rows={4}
                  className="w-full border border-border bg-secondary px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                  placeholder="Tell us about your experience working with Praizy Interior..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-foreground text-primary-foreground py-3.5 font-body text-xs font-semibold uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </motion.form>
          )}

          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-background border border-border p-10"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Star className="text-accent fill-accent" size={22} />
              </div>
              <h3 className="font-display text-xl mb-2">Thank You!</h3>
              <p className="font-body text-sm text-muted-foreground">
                Your review has been submitted and will appear once approved by our team.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;