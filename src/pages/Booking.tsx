import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Calendar, User, Mail, Phone, MessageSquare, Home } from "lucide-react";

const serviceOptions = [
  "Interior Styling",
  "Furniture Design",
  "Lighting Design",
  "Residential Design",
  "Commercial Spaces",
  "Color Consultation",
  "Full Home Renovation",
];

const Booking = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    budget: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.service) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    // For now just show success — will connect to DB later
    setTimeout(() => {
      toast({ title: "Booking submitted!", description: "We'll get back to you within 24 hours." });
      setForm({ name: "", email: "", phone: "", service: "", date: "", budget: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="pt-24">
      <section className="py-16 md:py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-body text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Get Started</p>
            <h1 className="font-display text-4xl md:text-6xl font-medium">
              Book a <span className="text-accent-brand italic">Consultation</span>
            </h1>
            <p className="font-body text-sm text-muted-foreground mt-4 max-w-lg leading-relaxed">
              Fill out the form below and our design team will reach out within 24 hours to schedule your consultation.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-2xl">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 flex items-center gap-2">
                  <User size={14} /> Full Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 flex items-center gap-2">
                  <Mail size={14} /> Email *
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 flex items-center gap-2">
                  <Phone size={14} /> Phone Number *
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors"
                  placeholder="+234 800 000 0000"
                />
              </div>
              <div>
                <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 flex items-center gap-2">
                  <Calendar size={14} /> Preferred Date
                </label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 flex items-center gap-2">
                <Home size={14} /> Service Required *
              </label>
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">Select a service</option>
                {serviceOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 flex items-center gap-2">
                Budget Range
              </label>
              <select
                name="budget"
                value={form.budget}
                onChange={handleChange}
                className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">Select budget range</option>
                <option value="500k-1m">₦500,000 - ₦1,000,000</option>
                <option value="1m-3m">₦1,000,000 - ₦3,000,000</option>
                <option value="3m-5m">₦3,000,000 - ₦5,000,000</option>
                <option value="5m-10m">₦5,000,000 - ₦10,000,000</option>
                <option value="10m+">₦10,000,000+</option>
              </select>
            </div>

            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 flex items-center gap-2">
                <MessageSquare size={14} /> Project Details
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="w-full border border-border bg-background px-4 py-3 font-body text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                placeholder="Tell us about your project, space dimensions, style preferences..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-accent-foreground py-4 font-body text-xs font-semibold uppercase tracking-[0.2em] hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Booking Request"}
            </button>
          </motion.form>
        </div>
      </section>
    </main>
  );
};

export default Booking;
