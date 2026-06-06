import React, { useState } from 'react';
import { MENU_ITEMS } from '../data/menu';
import { MenuItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Info, CheckCircle2, Flame, Heart, X, Sparkles } from 'lucide-react';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const categories = [
    { id: 'all', label: 'Complete Menu' },
    { id: 'coffee', label: 'Specialty Espresso' },
    { id: 'slowbar', label: 'Slow Bar (Pour-Overs)' },
    { id: 'tea', label: 'Ceremonial Tea' },
    { id: 'plates', label: 'Bistro Plates' },
    { id: 'pastries', label: 'Exquisite Pastries' },
  ];

  const filteredItems = MENU_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu-section" className="py-24 bg-brand-cream relative">
      {/* Decorative floral accents, backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-paper/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-brand-sand/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-2 text-brand-brown uppercase tracking-widest text-[11px] font-medium font-sans mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Artisan Craftsmanship</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-brand-dark tracking-tight mb-4">
            Curated Cafe Menu
          </h2>
          <div className="h-0.5 w-16 bg-brand-brown mx-auto mb-6" />
          <p className="font-sans text-brand-dark/70 font-light text-base leading-relaxed">
            Freshness rolled, poured, and griddled with hand-selected ingredients. Discover our signature cardamom infusions and gourmet brunch plates.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="mb-12 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 pb-6 border-b border-brand-sand/35">
          {/* Category Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-3 md:pb-0 scrollbar-none max-w-full -mx-6 px-6 md:mx-0 md:px-0">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setSearchQuery('');
                }}
                className={`px-4 py-2.5 rounded-full font-sans text-xs tracking-wider whitespace-nowrap transition-all uppercase cursor-pointer ${
                  activeCategory === category.id
                    ? 'bg-brand-brown text-white shadow-md font-medium'
                    : 'bg-brand-paper/70 hover:bg-brand-sand text-brand-dark/70 hover:text-brand-dark'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative md:w-80">
            <input
              type="text"
              placeholder="Search coffee or plates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-paper text-brand-dark border border-brand-sand/60 px-4 py-3 pl-11 rounded-full font-sans text-xs tracking-wider placeholder:text-brand-dark/40 focus:outline-none focus:border-brand-brown focus:ring-1 focus:ring-brand-brown transition-all"
            />
            <Search className="w-4 h-4 text-brand-dark/40 absolute left-4 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-brand-dark/50 hover:text-brand-dark cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Menu Grid Items */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-brand-paper rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-brand-sand/30 flex flex-col group h-full"
              >
                {/* Visual Thumbnail */}
                <div className="relative h-56 w-full overflow-hidden shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null;
                      target.src = `https://picsum.photos/seed/${item.id}/600/400`;
                    }}
                  />
                  {/* Category Chip */}
                  <span className="absolute top-4 left-4 text-[9px] uppercase tracking-widest bg-brand-cream/90 backdrop-blur-sm text-brand-brown font-semibold px-2.5 py-1 rounded">
                    {item.category}
                  </span>

                  {/* Highlights tags and symbols */}
                  <div className="absolute top-4 right-4 flex flex-col space-y-1.5 items-end">
                    {item.isPopular && (
                      <span className="flex items-center space-x-1.5 text-[8px] uppercase tracking-widest bg-brand-brown text-white font-semibold px-2.5 py-1 rounded">
                        <Flame className="w-3 h-3 block text-brand-gold fill-brand-gold animate-pulse" />
                        <span>Best Seller</span>
                      </span>
                    )}
                    {item.isVegetarian && (
                      <span className="flex items-center space-x-1.5 text-[8px] uppercase tracking-widest bg-brand-sage text-white font-semibold px-2.5 py-1 rounded">
                        <Heart className="w-3 h-3 fill-white text-transparent" />
                        <span>Vegetarian</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-serif text-lg font-medium text-brand-dark group-hover:text-brand-brown transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-serif text-base font-semibold text-brand-brown">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <p className="font-sans text-xs text-brand-dark/70 font-light leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Tags and Detailed Action */}
                  <div className="mt-5 pt-4 border-t border-brand-sand/40 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-sans text-brand-dark/50 bg-brand-cream px-2 py-0.5 rounded border border-brand-sand/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-xs font-sans tracking-wide text-brand-brown hover:text-brand-dark font-medium inline-flex items-center space-x-1 decoration-brand-brown decoration-px hover:underline cursor-pointer"
                    >
                      <span>Chef Info</span>
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* When Empty search */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 bg-brand-paper/50 rounded-2xl border border-dashed border-brand-sand/80 max-w-md mx-auto">
            <Search className="w-8 h-8 text-brand-dark/30 mx-auto mb-3" />
            <h4 className="font-serif text-lg font-medium text-brand-dark mb-1">
              No Culinary Items Found
            </h4>
            <p className="font-sans text-xs text-brand-dark/60">
              We couldn't find items Matching "{searchQuery}". Try browsing separate tabs.
            </p>
          </div>
        )}
      </div>

      {/* Culinary Detail Dialog (Aesthetic Details and Origin) */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-brand-dark/70 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="bg-brand-cream text-brand-dark rounded-3xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden relative z-10 border border-brand-sand flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 bg-brand-dark/40 hover:bg-brand-dark/65 text-white p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Scrollable Modal Content Wrapper */}
              <div className="overflow-y-auto w-full h-full scrollbar-transparent-track">
                {/* Cover Photo */}
                <div className="h-64 w-full relative">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.onerror = null;
                    target.src = `https://picsum.photos/seed/${selectedItem.id}/800/600`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-cream via-transparent to-transparent" />
              </div>

              {/* Informative Dialog */}
              <div className="p-8 space-y-6">
                <div>
                  <div className="flex flex-wrap gap-1.5 items-center mb-2">
                    <span className="text-[9px] uppercase tracking-widest bg-brand-brown text-white font-semibold px-2 py-0.5 rounded">
                      Category: {selectedItem.category}
                    </span>
                    {selectedItem.isPopular && (
                      <span className="text-[9px] uppercase tracking-widest bg-brand-gold text-brand-dark font-medium px-2 py-0.5 rounded">
                        Daily Favorite
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif text-3xl font-semibold text-brand-dark">
                      {selectedItem.name}
                    </h3>
                    <span className="font-serif text-2xl font-bold text-brand-brown">
                      ${selectedItem.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-brand-sand/50" />

                {/* Craft Origin Narrative */}
                <div className="space-y-2">
                  <h4 className="font-serif text-sm font-semibold text-brand-brown uppercase tracking-wider">
                    The Culinary Narrative
                  </h4>
                  <p className="font-sans text-sm text-brand-dark/85 font-light leading-relaxed">
                    Inspired by classic French bistros and crafted with artisan local produce, this item represents the signature flavor profiles of Kafeno Cafe & Bistro. Every step—from tempering the vanilla pods up to pouring the fresh double pulls—is monitored with microelectronic timers and chef sensory panels to ensure flawless consistency.
                  </p>
                </div>

                {/* Tasting Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Ingredients Checklist */}
                  <div className="bg-brand-paper/50 p-4 rounded-2xl border border-brand-sand/35 space-y-2.5">
                    <h5 className="font-serif text-xs font-semibold uppercase tracking-wider text-brand-dark">
                      Key Highlights
                    </h5>
                    <ul className="text-xs space-y-2 text-brand-dark/75 font-sans font-light">
                      <li className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-brown shrink-0" />
                        <span>100% Organic dairy or certified oat alternatives</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-brown shrink-0" />
                        <span>Sustainably sourced direct-trade beans</span>
                      </li>
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-brand-paper/50 p-4 rounded-2xl border border-brand-sand/35 space-y-2.5">
                    <h5 className="font-serif text-xs font-semibold uppercase tracking-wider text-brand-dark">
                      Allergens & Notes
                    </h5>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {selectedItem.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-brand-sand/40 text-brand-dark/80 text-[10px] uppercase tracking-wide px-2.5 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="bg-brand-sand/40 text-brand-dark/80 text-[10px] uppercase tracking-wide px-2.5 py-1 rounded">
                        {selectedItem.isVegetarian ? 'Vegetarian' : 'Standard'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 flex justify-end">
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="bg-brand-dark hover:bg-brand-charcoal text-white text-xs font-sans font-medium px-6 py-3 rounded-full uppercase tracking-wider cursor-pointer"
                  >
                    Back to Menu
                  </button>
                </div>
              </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
