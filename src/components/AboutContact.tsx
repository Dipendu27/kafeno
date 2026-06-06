import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Phone, Mail, Send, CheckCircle, Star, Sparkles, AlertCircle, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Review } from '../types';

const REVIEWS: Review[] = [
  {
    id: 'rev1',
    author: 'Eleanor Vance',
    rating: 5,
    text: 'A absolute sanctuary! The Rose Cardamom Latte is beautifully nuanced, and the checkerboard accents remind me of authentic Parisian bars. Exceptional service.',
    date: '3 weeks ago'
  },
  {
    id: 'rev2',
    author: 'Cyril Laurent',
    rating: 5,
    text: 'Seated underneath the beautiful brass chandelier at Table #3 for our anniversary brunch. The compliment cardamom babka is to die for!',
    date: '1 month ago'
  },
  {
    id: 'rev3',
    author: 'Genevieve K.',
    rating: 5,
    text: 'Quiet, beautifully lit, with incredibly soft music. Perfect corner to get work done with their slow-drip cold brew. A true gem.',
    date: '2 weeks ago'
  }
];

export default function AboutContact() {
  const [isOpenNow, setIsOpenNow] = useState<boolean>(true);
  const [closingTimeMsg, setClosingTimeMsg] = useState<string>('Open right now until 09:00 PM');
  
  // Contact Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reviews State
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0);

  useEffect(() => {
    // Evaluate if the cafe is open right now based on local time
    const checkCafeHours = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0 is Sunday, 1 is Mon...
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeVal = currentHour + currentMinute / 60;

      let openTime = 11.0; // 11:00 AM
      let closeTime = 22.5; // 10:30 PM

      if (currentTimeVal >= openTime && currentTimeVal < closeTime) {
        setIsOpenNow(true);
        const formatHour = (h: number) => {
          const ampm = h >= 12 ? 'PM' : 'AM';
          const displayH = h > 12 ? Math.floor(h - 12) : Math.floor(h);
          const mins = h % 1 === 0 ? '00' : '30';
          return `${displayH}:${mins} ${ampm}`;
        };
        setClosingTimeMsg(`Open right now! Closes at ${formatHour(closeTime)}`);
      } else {
        setIsOpenNow(false);
        setClosingTimeMsg('Currently closed. Opens tomorrow morning.');
      }
    };

    checkCafeHours();
    const interval = setInterval(checkCafeHours, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormError('Please fill out all message boxes.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to send inquiry right now.');
      }

      setFormError('');
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setName('');
        setEmail('');
        setMessage('');
      }, 4500);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to send inquiry right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="about-section" className="py-24 bg-brand-paper relative">
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-brand-cream to-transparent opacity-40" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* About us storyline (Left) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-brand-brown uppercase tracking-widest text-[11px] font-medium font-sans">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Roots</span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold text-brand-dark tracking-tight leading-none">
                The Heritage of Kafeno
              </h2>
              <div className="h-0.5 w-16 bg-brand-brown" />
              <p className="font-sans text-sm text-brand-dark/75 font-light leading-relaxed">
                Founded in 2024, Kafeno is the fruition of culinary wanderlust and a sheer adoration for high-acidity direct-trade third-wave coffees. Our name pays tribute to the historic European cafes where artists, philosophers, and travelers met beneath low gas lamps to write cards, spin tales, and enjoy serene hours.
              </p>
              <p className="font-sans text-sm text-brand-dark/75 font-light leading-relaxed">
                We pull state-of-the-art espresso formulations alongside traditional glass-tower cold slow bar. Every pastry in our display cupboard is freshly hand-rolled, brushed in butter, and twice-baked by our onsite patisserie unit using organic stone-ground flours.
              </p>
            </div>

            {/* Live Opening Indicator */}
            <div className={`p-4 rounded-2xl border ${
              isOpenNow 
                ? 'bg-emerald-50/70 border-emerald-150 text-emerald-900' 
                : 'bg-amber-50/70 border-amber-150 text-amber-900'
            } flex items-center space-x-3 max-w-md`}>
              <div className={`w-3.5 h-3.5 rounded-full ${
                isOpenNow ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'
              } shrink-0`} />
              <div className="text-xs font-sans">
                <strong className={isOpenNow ? 'text-emerald-800' : 'text-amber-800'}>
                  {isOpenNow ? 'Live status:' : 'Away:'}
                </strong>{' '}
                {closingTimeMsg}
              </div>
            </div>

            {/* Testimonials sliding reviews card */}
            <div className="bg-brand-cream/80 rounded-3xl p-6 border border-brand-sand/55 relative overflow-hidden max-w-xl">
              <h4 className="text-xs uppercase tracking-widest text-brand-brown font-semibold mb-3 font-sans">
                Bistro Praise
              </h4>
              <div className="space-y-3">
                <p className="font-serif italic text-brand-dark/85 text-sm leading-relaxed">
                  "{REVIEWS[currentReviewIdx].text}"
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-sans text-xs font-bold text-brand-dark">
                      {REVIEWS[currentReviewIdx].author}
                    </span>
                    <span className="text-[10px] text-brand-dark/40">— {REVIEWS[currentReviewIdx].date}</span>
                  </div>
                  <div className="flex items-center space-x-0.5">
                    {Array.from({ length: REVIEWS[currentReviewIdx].rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-brand-gold fill-brand-gold" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Slider bullets */}
              <div className="flex justify-center space-x-2 mt-4">
                {REVIEWS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentReviewIdx(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      currentReviewIdx === idx ? 'w-5 bg-brand-brown' : 'w-2 bg-brand-sand'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Contact Interactive form (Right Column) */}
          <div className="lg:col-span-5 bg-brand-cream rounded-3xl p-8 border border-brand-sand/55 shadow-sm space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-semibold text-brand-dark mb-1">
                Leave a Note / Message
              </h3>
              <p className="font-sans text-xs text-brand-dark/70 font-light">
                Questions about event catering or private coffee tasting boards? Write to us directly.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-6 text-center space-y-3"
                >
                  <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-serif text-lg font-bold">Mail Sent Successfully</h4>
                  <p className="text-xs font-sans font-light leading-relaxed">
                    Thank you for writing. Our customer service desk will reply via <strong className="font-semibold">{email}</strong> within 12 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmitMessage} className="space-y-4">
                  {formError && (
                    <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-xl p-3 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-xs uppercase tracking-wider font-sans font-medium text-brand-dark/70">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Jane Austin"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-brand-paper border border-brand-sand/75 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-brown font-light"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs uppercase tracking-wider font-sans font-medium text-brand-dark/70">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="jane@austin.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-brand-paper border border-brand-sand/75 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-brown font-light"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs uppercase tracking-wider font-sans font-medium text-brand-dark/70">
                      Your Message or catering query
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Introduce your request..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-brand-paper border border-brand-sand/75 rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-brown font-light resize-none"
                      required
                    />
                  </div>

	                  <button
	                    type="submit"
	                    disabled={isSubmitting}
	                    className="w-full bg-brand-brown hover:bg-brand-brown/95 text-white font-sans text-xs uppercase tracking-wider font-semibold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
	                  >
	                    <Send className="w-4 h-4" />
	                    <span>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
	                  </button>
                </form>
              )}
            </AnimatePresence>            {/* Compact Local Contact Info Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-sand/40 text-[11px] font-sans font-light text-brand-dark/80">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-brand-brown shrink-0" />
                <a href="tel:+917003148840" className="hover:text-brand-brown transition-colors">7003148840</a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-brand-brown shrink-0" />
                <a href="mailto:kafenocafebistro@gmail.com" className="hover:text-brand-brown transition-colors">kafenocafebistro@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Painted Map Display */}
        <div className="mt-16 bg-brand-cream border border-brand-sand/55 rounded-3xl p-6 relative overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Map Info details (Left) */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-serif text-2xl font-semibold text-brand-dark">
                How to Locate Us
              </h4>
              <p className="font-sans text-xs text-brand-dark/75 font-light leading-relaxed">
                Come find us in Kalyani, West Bengal. We are located in Block B, offering a beautifully lit, warm, and cozy sanctuary with artisanal food, signature coffee, and soul-stirring hospitality.
              </p>
              <div className="space-y-4 text-xs font-sans font-light text-brand-dark">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-brand-brown shrink-0 mt-0.5" />
                  <a
                    href="https://maps.app.goo.gl/Lj8HHBSrPwXfKUQMA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-brown transition-colors underline-offset-4 hover:underline"
                  >
                    Google Map Location
                  </a>
                </div>
                <div className="pt-2">
                  <a
                    href="https://maps.app.goo.gl/Lj8HHBSrPwXfKUQMA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-brand-brown text-white hover:bg-brand-brown/90 px-4 py-2.5 rounded-full font-semibold uppercase tracking-wider text-[10px] transition-all shadow-sm"
                  >
                    <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
                    <span>Navigate on Google Maps</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Real Interactive Google Maps iframe (Right) */}
            <div className="md:col-span-8 h-80 rounded-2xl overflow-hidden border border-brand-sand shadow-inner relative bg-brand-paper w-full">
              <iframe
                title="Kafeno Cafe & Bistro Location"
                src="https://maps.google.com/maps?q=Kafeno%20cafe%20%26%20Bistro%2C%20Kalyani&t=&z=17&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter grayscale-[5%] contrast-[1.02]"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
