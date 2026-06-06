import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data/gallery';
import { GalleryItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Eye, X, Compass, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const tabs = [
    { id: 'all', label: 'All Snaps' },
    { id: 'ambiance', label: 'Ambiance & Seating' },
    { id: 'drinks', label: 'Artisan Sips' },
    { id: 'plates', label: 'Savory Platters' },
    { id: 'craft', label: 'The Craft Ritual' },
  ];

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    return activeTab === 'all' || item.category === activeTab;
  });

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    const nextIdx = (lightboxIndex + 1) % filteredItems.length;
    setLightboxIndex(nextIdx);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    const prevIdx = (lightboxIndex - 1 + filteredItems.length) % filteredItems.length;
    setLightboxIndex(prevIdx);
  };

  return (
    <section id="gallery-section" className="py-24 bg-brand-cream relative">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-sand/15 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-2 text-brand-brown uppercase tracking-widest text-[11px] font-medium font-sans mb-3">
            <Compass className="w-4 h-4 text-brand-brown" />
            <span>Visual Exploration</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-brand-dark tracking-tight mb-4">
            Aesthetic Media Gallery
          </h2>
          <div className="h-0.5 w-16 bg-brand-brown mx-auto mb-6" />
          <p className="font-sans text-brand-dark/70 font-light text-base leading-relaxed">
            A photographic peek inside our cozy bistro—witness the morning sun setting across fresh tulips, steaming pours, and gold leaf pastries.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="mb-12 flex justify-center pb-4 border-b border-brand-sand/35">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full font-sans text-xs tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-brand-brown text-white shadow-sm font-medium'
                    : 'bg-brand-paper hover:bg-brand-sand/60 text-brand-dark/70 hover:text-brand-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setLightboxIndex(index)}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md border border-brand-sand/30"
              >
                {/* Image */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = `https://picsum.photos/seed/${item.id}/600/800`;
                  }}
                />

                {/* Aesthetic blur overlay on hover */}
                <div className="absolute inset-0 bg-brand-charcoal/50 opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-6 backdrop-blur-[2px]">
                  {/* Eye symbol */}
                  <div className="absolute top-4 right-4 bg-brand-cream/20 backdrop-blur-md w-8 h-8 rounded-full flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                    <Eye className="w-4 h-4" />
                  </div>

                  <div className="space-y-1.5 translate-y-3 group-hover:translate-y-0 transition-transform duration-400">
                    <span className="text-[10px] text-brand-gold uppercase tracking-widest font-semibold">
                      {item.category}
                    </span>
                    <h3 className="font-serif text-lg font-semibold text-white leading-tight">
                      {item.title}
                    </h3>
                    <p className="font-sans text-[11px] text-white/85 font-light leading-snug line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Full Screen Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-dark/95 backdrop-blur-md">
            {/* Background click close */}
            <div
              className="absolute inset-0 cursor-default"
              onClick={() => setLightboxIndex(null)}
            />

            {/* Top Close Button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 z-20 hover:bg-white/10 text-brand-cream/80 hover:text-white p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left navigation arrow */}
            <button
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/5 hover:bg-white/10 border border-white/15 text-white p-3.5 rounded-full transition-all cursor-pointer transform active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right navigation arrow */}
            <button
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/5 hover:bg-white/10 border border-white/15 text-white p-3.5 rounded-full transition-all cursor-pointer transform active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Visual Container */}
            <motion.div
              layoutId={`gallery-item-${filteredItems[lightboxIndex].id}`}
              transition={{ duration: 0.3 }}
              className="relative max-w-4xl w-full max-h-[80vh] flex flex-col items-center justify-center z-10"
            >
              <img
                src={filteredItems[lightboxIndex].imageUrl}
                alt={filteredItems[lightboxIndex].title}
                className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl border border-white/10"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = `https://picsum.photos/seed/${filteredItems[lightboxIndex].id}/1200/900`;
                }}
              />

              {/* Informative footer for lightbox */}
              <div className="mt-4 text-center max-w-xl text-white space-y-1.5 px-4">
                <span className="text-[10px] text-brand-brown uppercase tracking-widest font-semibold bg-brand-cream/10 px-2.5 py-0.5 rounded">
                  {filteredItems[lightboxIndex].category}
                </span>
                <h3 className="font-serif text-xl font-bold font-light">
                  {filteredItems[lightboxIndex].title}
                </h3>
                <p className="font-sans text-xs text-brand-cream/70 font-light leading-relaxed">
                  {filteredItems[lightboxIndex].description}
                </p>
                <div className="pt-2 text-[10px] text-brand-cream/35">
                  Image {lightboxIndex + 1} of {filteredItems.length}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
