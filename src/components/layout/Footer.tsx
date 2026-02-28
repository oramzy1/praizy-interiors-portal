import { Link } from "react-router-dom";
import { Instagram, Phone, Mail, MapPin } from "lucide-react";
import Logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <img src={Logo} alt="Praizy Interior" className="h-12 mb-4" />
            <p className="font-body text-sm leading-relaxed opacity-70 max-w-sm">
              Transforming spaces into luxurious sanctuaries. We bring your vision to life with premium materials, expert craftsmanship, and timeless design.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {["Home", "About", "Gallery", "Booking"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="font-body text-sm opacity-70 hover:opacity-100 hover:text-accent transition-all"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg mb-4">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+2348000000000" className="flex items-center gap-2 font-body text-sm opacity-70 hover:opacity-100 transition-opacity">
                <Phone size={14} /> +234 800 000 0000
              </a>
              <a href="mailto:hello@praizyinterior.ng" className="flex items-center gap-2 font-body text-sm opacity-70 hover:opacity-100 transition-opacity">
                <Mail size={14} /> hello@praizyinterior.ng
              </a>
              <span className="flex items-center gap-2 font-body text-sm opacity-70">
                <MapPin size={14} /> Lagos, Nigeria
              </span>
              <a href="https://instagram.com/praizyinterior.ng" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-body text-sm opacity-70 hover:opacity-100 transition-opacity">
                <Instagram size={14} /> @praizyinterior.ng
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 mt-12 pt-6 text-center">
          <p className="font-body text-xs opacity-50">
            © {new Date().getFullYear()} Praizy Interior. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
