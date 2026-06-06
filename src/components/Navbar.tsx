import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import KafenoLogo from './KafenoLogo';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <header
      id="navbar-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-cream/85 backdrop-blur-md border-b border-brand-sand/50 shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="logo-btn"
          onClick={() => handleNavClick('hero')}
          className="w-40 sm:w-48 lg:w-52 shrink-0 cursor-pointer"
          aria-label="Go to homepage"
        >
          <KafenoLogo className="w-full" />
        </button>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`font-sans text-sm tracking-wide transition-colors cursor-pointer relative py-1 ${
                activeSection === item.id
                  ? 'text-brand-brown font-medium'
                  : 'text-brand-dark/70 hover:text-brand-dark'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-brown"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Call to Action Reservation Button */}
        <div className="hidden md:block">
          <button
            id="nav-reserve-btn"
            onClick={() => handleNavClick('reservation')}
            className="flex items-center space-x-2 bg-brand-brown text-white hover:bg-brand-brown/90 px-5 py-2.5 rounded-full font-sans text-sm tracking-wide font-medium transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Table Booking</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-brand-sand text-brand-dark hover:bg-brand-sand/20 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-brand-cream border-b border-brand-sand/50 shadow-md"
          >
            <div className="px-6 py-6 space-y-4 flex flex-col">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left font-sans text-base py-2 border-b border-brand-sand/20 ${
                    activeSection === item.id
                      ? 'text-brand-brown font-semibold'
                      : 'text-brand-dark/70'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2">
                <button
                  id="mobile-reserve-btn"
                  onClick={() => handleNavClick('reservation')}
                  className="w-full flex items-center justify-center space-x-2 bg-brand-brown text-white hover:bg-brand-brown/90 py-3 rounded-full font-sans text-sm tracking-wide font-medium transition-all shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Table</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
