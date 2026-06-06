import React from 'react';
import { MapPin, Phone, Mail, Instagram, CornerRightUp } from 'lucide-react';
import KafenoLogo from './KafenoLogo';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer-container" className="bg-brand-charcoal text-white relative">
      {/* Decorative Checkerboard Border at the very top of footer (matches customer menu layout) */}
      <div className="checkerboard-bar h-6 w-full opacity-90 border-b border-brand-brown/20" />

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* About column */}
        <div className="space-y-4">
          <div className="w-48 max-w-full rounded bg-brand-cream p-2">
            <KafenoLogo className="w-full" />
          </div>
          <p className="text-sm text-brand-cream/70 leading-relaxed font-sans font-light">
            An artisanal corner designed for craft coffee connoisseurs and brunch enthusiasts. Crafting daily tranquility with fine beans, fresh flowers, and soulful hospitality.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <a
              id="social-instagram"
              href="https://instagram.com/kafeno"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-brand-cream/20 flex items-center justify-center hover:border-brand-brown hover:bg-brand-brown/20 transition-all text-brand-cream/80 hover:text-white"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Cafe Hours */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-semibold border-b border-brand-cream/10 pb-2 text-brand-cream">
            Bistro Hours
          </h3>
          <ul className="space-y-3 font-sans text-sm text-brand-cream/75 font-light">
            <li className="flex justify-between items-start">
              <span className="font-medium text-brand-cream">Open Daily</span>
              <span className="text-right">11:00 AM – 10:30 PM</span>
            </li>
            <li className="flex justify-between items-start text-brand-brown font-normal text-xs pt-1">
              <span>* Kitchen closes 30 mins prior</span>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-semibold border-b border-brand-cream/10 pb-2 text-brand-cream">
            Find Us
          </h3>
          <ul className="space-y-3 font-sans text-sm text-brand-cream/75 font-light">
            <li className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-brand-brown mt-0.5 shrink-0" />
              <a
                href="https://maps.app.goo.gl/Lj8HHBSrPwXfKUQMA"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-brown transition-colors underline-offset-4 hover:underline"
              >
                Google Map Location
              </a>
            </li>
            <li className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-brand-brown shrink-0" />
              <a href="tel:+917003148840" className="hover:text-brand-brown transition-colors">7003148840</a>
            </li>
            <li className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-brand-brown shrink-0" />
              <a href="mailto:kafenocafebistro@gmail.com" className="hover:text-brand-brown transition-colors">kafenocafebistro@gmail.com</a>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-semibold border-b border-brand-cream/10 pb-2 text-brand-cream">
            Navigation
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-brand-cream/75 font-light">
            <button onClick={() => onNavigate('hero')} className="text-left hover:text-brand-brown cursor-pointer">Home</button>
            <button onClick={() => onNavigate('menu')} className="text-left hover:text-brand-brown cursor-pointer">Menu List</button>
            <button onClick={() => onNavigate('gallery')} className="text-left hover:text-brand-brown cursor-pointer">Gallery</button>
            <button onClick={() => onNavigate('reservation')} className="text-left hover:text-brand-brown cursor-pointer">Seat Booking</button>
            <button onClick={() => onNavigate('about')} className="text-left hover:text-brand-brown cursor-pointer">About & Map</button>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-xs text-brand-brown hover:text-white transition-colors cursor-pointer border border-brand-brown/45 hover:border-brand-brown px-3 py-1.5 rounded"
          >
            <CornerRightUp className="w-3.5 h-3.5 animate-bounce" />
            <span>Scroll To Top</span>
          </button>
        </div>
      </div>

      {/* Copy lines */}
      <div className="border-t border-brand-cream/10 py-6 text-center text-xs text-brand-cream/40 font-light font-sans">
        <p>© {new Date().getFullYear()} Kafeno Cafe & Bistro. Built with premium artisanal care.</p>
      </div>
    </footer>
  );
}
