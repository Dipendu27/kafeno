/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Sparkles, ChevronDown } from 'lucide-react';
import Navbar from './components/Navbar';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import ReservationForm from './components/ReservationForm';
import AboutContact from './components/AboutContact';
import Footer from './components/Footer';
import KafenoLogo from './components/KafenoLogo';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Listen to window scroll to highlight active sections on desktop
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'menu', 'gallery', 'about', 'reservation'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div id="app-root" className="bg-brand-cream min-h-screen text-brand-dark selection:bg-brand-brown/30 selection:text-brand-dark font-sans">
      
      {/* Scroll Progress Bar */}
      <motion.div
        id="scroll-progress-bar"
        className="fixed top-0 left-0 right-0 h-[3px] bg-brand-brown z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Navigation Header */}
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* --- HERO PORTION --- */}
      <section
        id="hero"
        className="min-h-screen relative flex flex-col justify-between pt-24 md:pt-32 pb-16 px-6 relative overflow-hidden"
      >
        {/* Intensely aesthetic backdrop image representing a cozy retro dining area */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1920&q=80"
            alt="Kafeno Cozy Sunlit Interior"
            className="w-full h-full object-cover opacity-20 filter blueprint-[5%] brightness-[96%]"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = "https://picsum.photos/seed/kafenobg/1920/1080";
            }}
          />
          {/* Ambient gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/60 via-brand-cream/40 to-brand-cream" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-paper rounded-full blur-3xl opacity-60 pointer-events-none" />
        </div>

        {/* Outer margin decoration (Empty, tidy border framing like the menu cover picture) */}
        <div className="hidden lg:block absolute inset-8 border border-brand-sand/40 rounded-[32px] pointer-events-none z-10" />

        <div className="max-w-4xl mx-auto text-center pt-10 md:pt-16 relative z-10 flex-grow flex flex-col justify-center items-center">
          
          {/* Subtitle Accent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="flex items-center space-x-2 text-brand-brown uppercase tracking-widest text-[11px] font-semibold font-sans mb-5"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse fill-brand-gold" />
            <span>ESTD 2024 • THE ARTISANAL RETREAT</span>
          </motion.div>

          {/* Supplied Kafeno logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-4xl px-2"
          >
            <KafenoLogo className="w-full" />
          </motion.div>

          {/* Elegant tagline description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="font-sans text-brand-dark/75 font-light text-base md:text-lg max-w-xl text-center leading-relaxed mt-6 mb-10"
          >
            Where every sip feels special—featuring organic microfoamed cardamom espresso brews, hand-folded patisserie crafts, and quiet sunlit seatings.
          </motion.p>

          {/* Interactive Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center px-4"
          >
            <button
              onClick={() => handleNavigate('menu')}
              className="w-full sm:w-auto bg-brand-brown text-white hover:bg-brand-brown/95 font-sans text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Explore Menu Cards
            </button>
            <button
              onClick={() => handleNavigate('reservation')}
              className="w-full sm:w-auto bg-brand-dark text-white hover:bg-brand-charcoal font-sans text-xs uppercase tracking-widest font-semibold px-8 py-4 rounded-full shadow-md hover:shadow-lg border border-brand-sand/50 transition-transform hover:-translate-y-0.5 cursor-pointer"
            >
              Reserve Cozy Seating
            </button>
          </motion.div>
        </div>

        {/* Small Scroll Prompt Indicator (Bottom Margin) */}
        <div className="flex flex-col items-center justify-center cursor-pointer relative z-10 select-none pb-4">
          <button
            onClick={() => handleNavigate('menu')}
            className="text-[10px] tracking-widest uppercase font-sans text-brand-dark/50 hover:text-brand-dark flex flex-col items-center space-y-1.5 transition-colors cursor-pointer"
          >
            <span>Descend Below</span>
            <ChevronDown className="w-4 h-4 text-brand-brown animate-bounce" />
          </button>
        </div>
      </section>

      {/* Specialty Highlights Ribbon (Social proofs) */}
      <section className="bg-brand-paper py-10 border-y border-brand-sand/40 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <h4 className="font-serif text-lg font-semibold text-brand-dark">100% Organic</h4>
            <p className="font-sans text-[11px] uppercase tracking-wider text-brand-brown">Direct Trade Beans</p>
          </div>
          <div className="space-y-1 border-l border-brand-sand">
            <h4 className="font-serif text-lg font-semibold text-brand-dark">Direct Sourced</h4>
            <p className="font-sans text-[11px] uppercase tracking-wider text-brand-brown">Direct Farm Support</p>
          </div>
          <div className="space-y-1 border-l border-brand-sand">
            <h4 className="font-serif text-lg font-semibold text-brand-dark">Meticulously Prepared</h4>
            <p className="font-sans text-[11px] uppercase tracking-wider text-brand-brown">Hand-dripped daily</p>
          </div>
          <div className="space-y-1 border-l border-brand-sand">
            <h4 className="font-serif text-lg font-semibold text-brand-dark">Aesthetic Corners</h4>
            <p className="font-sans text-[11px] uppercase tracking-wider text-brand-brown">Parisian design style</p>
          </div>
        </div>
      </section>

      {/* --- MENU VIEW CONTROLLER --- */}
      <div id="menu">
        <Menu />
      </div>

      {/* Aesthetic Checkerboard Band dividing big sections, matching bottom of custom cover menu picture! */}
      <div className="checkerboard-bar h-10 w-full" />

      {/* --- INTERACTIVE RESERVATION WORKSPACE --- */}
      <div id="reservation">
        <ReservationForm />
      </div>

      {/* Aesthetic Checkerboard Band dividing big sections */}
      <div className="checkerboard-bar h-10 w-full" />

      {/* --- PHOTO GALLERY SECTION --- */}
      <div id="gallery">
        <Gallery />
      </div>

      {/* --- ABOUT STORY LINE & MAP LOCALS --- */}
      <div id="about">
        <AboutContact />
      </div>

      {/* FOOTER BLOCK CONTAINER */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
