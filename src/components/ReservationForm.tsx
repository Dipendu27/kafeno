import React, { useState, useEffect } from 'react';
import { Reservation, Table } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Users, BookOpen, Check, AlertCircle, Trash2, Gift, Map, Heart, Sparkles } from 'lucide-react';

const INITIAL_TABLES: Table[] = [
  { id: 1, capacity: 2, status: 'available', x: 20, y: 25 }, // Window 1
  { id: 2, capacity: 2, status: 'available', x: 48, y: 25 }, // Fireplace
  { id: 3, capacity: 4, status: 'available', x: 80, y: 28 }, // Chandelier Oval
  { id: 4, capacity: 4, status: 'available', x: 18, y: 72 }, // Garden Alcove
  { id: 5, capacity: 2, status: 'available', x: 48, y: 72 }, // Barista Counter
  { id: 6, capacity: 6, status: 'available', x: 80, y: 70 }, // Library Corner
];

const TIME_SLOTS = [
  '08:30 AM', '10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:30 PM', '06:00 PM', '07:30 PM', '08:45 PM'
];

export default function ReservationForm() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0] // Default tomorrow
  );
  const [selectedTime, setSelectedTime] = useState<string>('06:00 PM');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  // Tables State
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [bookingSuccess, setBookingSuccess] = useState<Reservation | null>(null);
  const [formError, setFormError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing reservations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kafeno_reservations');
    if (saved) {
      try {
        setReservations(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading reservations', e);
      }
    }
  }, []);

  // Sync reserved tables logic based on date and time
  useEffect(() => {
    // Generate randomized mock busy tables for the selected date/time slot to feel interactive!
    const pseudoRandomStatus = () => {
      // Use date + time string as seed multiplier
      const seedStr = `${selectedDate}-${selectedTime}`;
      const sum = seedStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      return INITIAL_TABLES.map(table => {
        // Tables are pseudo-randomly reserved based on string sum + tableId
        const isReserved = (sum + table.id) % 3 === 0;
        return {
          ...table,
          status: isReserved ? ('reserved' as const) : ('available' as const)
        };
      });
    };

    const evaluatedTables = pseudoRandomStatus();
    setTables(evaluatedTables);

    // If currently selected table became busy, reset it
    if (selectedTable) {
      const currentTable = evaluatedTables.find(t => t.id === selectedTable);
      if (currentTable && currentTable.status === 'reserved') {
        setSelectedTable(null);
      }
    }
  }, [selectedDate, selectedTime, selectedTable]);

  const handleTableClick = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    if (!table || table.status === 'reserved') return;
    setSelectedTable(tableId);
  };

  const validateStep1 = () => {
    if (!selectedDate) {
      setFormError('Please choose a valid scheduling date.');
      return false;
    }
    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (selectedDateObj < today) {
      setFormError('Reservations cannot be booked for past dates.');
      return false;
    }
    if (!selectedTime) {
      setFormError('Please select a dining time slot.');
      return false;
    }
    setFormError('');
    return true;
  };

  const handleGoToStep2 = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleGoToStep3 = () => {
    if (!selectedTable) {
      setFormError('Please click and select a dining table on the map.');
      return;
    }
    const table = tables.find(t => t.id === selectedTable);
    if (table && table.capacity < guestsCount) {
      setFormError(`Warning: Table ${table.id} has a capacity of ${table.capacity} guests. Selected guest count is ${guestsCount}. You can still proceed if desired.`);
    } else {
      setFormError('');
    }
    setStep(3);
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setFormError('Please complete all guest contact fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          date: selectedDate,
          time: selectedTime,
          guests: guestsCount,
          occasion: getTableName(selectedTable || 1),
          notes: specialNotes,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'Unable to submit reservation right now.');
      }

      const newReservation: Reservation = {
        id: result.id || 'res-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        date: selectedDate,
        time: selectedTime,
        guests: guestsCount,
        tableNumber: selectedTable || 1,
        notes: specialNotes,
        createdAt: new Date().toISOString(),
      };

      const updatedResList = [newReservation, ...reservations];
      setReservations(updatedResList);
      localStorage.setItem('kafeno_reservations', JSON.stringify(updatedResList));

      setBookingSuccess(newReservation);
      setFormError('');
      
      // Clear State
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setSpecialNotes('');
      setStep(1);
      setSelectedTable(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to submit reservation right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBooking = (id: string) => {
    const updated = reservations.filter(r => r.id !== id);
    setReservations(updated);
    localStorage.setItem('kafeno_reservations', JSON.stringify(updated));
  };

  const getTableName = (id: number) => {
    const names: Record<number, string> = {
      1: 'Window Alcove Seat (2 Seats)',
      2: 'Fireplace Hearth Cozy Bar (2 Seats)',
      3: 'Grand Chandelier Boardroom (4 Seats)',
      4: 'Winter Greenhouse Room (4 Seats)',
      5: 'Sleek Barista Solder stool (2 Seats)',
      6: 'Library Shelf Hideaway (6 Seats)',
    };
    return names[id] || `Table #${id}`;
  };

  return (
    <section id="reservation-section" className="py-24 bg-brand-paper relative">
      <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-brand-cream to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-2 text-brand-brown uppercase tracking-widest text-[11px] font-medium font-sans mb-3">
            <BookOpen className="w-4 h-4 text-brand-brown" />
            <span>Table reservation Workspace</span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-semibold text-brand-dark tracking-tight mb-4">
            Online Table Seating
          </h2>
          <div className="h-0.5 w-16 bg-brand-brown mx-auto mb-6" />
          <p className="font-sans text-brand-dark/70 font-light text-base leading-relaxed">
            Reserve your favorite cozy nook online instantly. Follow our simple, interactive three-step seating engine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Reservation Workspace (Left Columns) */}
          <div className="lg:col-span-8 bg-brand-cream rounded-3xl p-8 shadow-sm border border-brand-sand/55">
            {/* Step Indicators */}
            <div className="flex justify-between items-center mb-10 max-w-md mx-auto">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-sans text-xs font-semibold ${
                  step >= 1 ? 'bg-brand-brown text-white' : 'bg-brand-sand/40 text-brand-dark/40'
                }`}>
                  1
                </div>
                <span className="text-[10px] uppercase font-sans tracking-wider text-brand-dark/60 mt-1">When & Who</span>
              </div>
              <div className="h-0.5 bg-brand-sand grow mx-4 -mt-4" />
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-sans text-xs font-semibold ${
                  step >= 2 ? 'bg-brand-brown text-white' : 'bg-brand-sand/40 text-brand-dark/40'
                }`}>
                  2
                </div>
                <span className="text-[10px] uppercase font-sans tracking-wider text-brand-dark/60 mt-1">Select Seat</span>
              </div>
              <div className="h-0.5 bg-brand-sand grow mx-4 -mt-4" />
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-sans text-xs font-semibold ${
                  step >= 3 ? 'bg-brand-brown text-white' : 'bg-brand-sand/40 text-brand-dark/40'
                }`}>
                  3
                </div>
                <span className="text-[10px] uppercase font-sans tracking-wider text-brand-dark/60 mt-1">Details & Book</span>
              </div>
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <h3 className="font-serif text-xl font-medium text-brand-dark border-b border-brand-sand pb-3">
                    Step 1: Planning Details
                  </h3>

                  {formError && (
                    <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-xl p-3 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date Picker */}
                    <div className="space-y-2">
                      <label className="block text-xs uppercase tracking-wider font-sans font-medium text-brand-dark/80">
                        Dining Date:
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={selectedDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full bg-brand-paper border border-brand-sand rounded-xl px-4 py-3 pl-11 text-sm font-sans focus:outline-none focus:border-brand-brown font-light"
                        />
                        <Calendar className="w-4 h-4 text-brand-brown absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Guests selector */}
                    <div className="space-y-2">
                      <label className="block text-xs uppercase tracking-wider font-sans font-medium text-brand-dark/80">
                        Party Size (Guests):
                      </label>
                      <div className="relative">
                        <select
                          value={guestsCount}
                          onChange={(e) => setGuestsCount(Number(e.target.value))}
                          className="w-full bg-brand-paper border border-brand-sand rounded-xl px-4 py-3 pl-11 text-sm font-sans focus:outline-none focus:border-brand-brown font-light appearance-none"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'Guest' : 'Guests'}
                            </option>
                          ))}
                        </select>
                        <Users className="w-4 h-4 text-brand-brown absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>
                  </div>

                  {/* Time Slots Selection */}
                  <div className="space-y-2.5">
                    <label className="block text-xs uppercase tracking-wider font-sans font-medium text-brand-dark/80">
                      Available Cooking slots:
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2.5 rounded-lg text-xs font-sans font-light tracking-wide border cursor-pointer transition-all ${
                            selectedTime === slot
                              ? 'bg-brand-brown text-white border-brand-brown font-medium shadow-md'
                              : 'bg-brand-paper hover:bg-brand-sand/50 text-brand-dark border-brand-sand'
                          }`}
                        >
                          <Clock className="w-3 h-3 inline-block mr-1 -mt-0.5 text-current opacity-70" />
                          <span>{slot}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={handleGoToStep2}
                      className="bg-brand-brown hover:bg-brand-brown/95 text-white font-sans text-xs uppercase tracking-wider font-semibold px-8 py-3.5 rounded-full cursor-pointer transition-all"
                    >
                      Choose Table →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-brand-sand pb-3">
                    <h3 className="font-serif text-xl font-medium text-brand-dark">
                      Step 2: Micro Seating Map
                    </h3>
                    <span className="text-xs text-brand-brown bg-brand-paper px-3 py-1 rounded">
                      {selectedDate} @ {selectedTime}
                    </span>
                  </div>

                  {formError && (
                    <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-xl p-3 text-xs flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <p className="text-xs text-brand-dark/70 font-sans font-light leading-relaxed mb-4">
                    Please look at the stylized schematic below. Windows are situated at the left, and the cozy bookshelf wall is at the right. Click a glowing <strong className="text-brand-sage font-medium">green circle</strong> to claim your dining nook.
                  </p>

                  {/* Graphic layout of the seating */}
                  <div className="border border-brand-sand/70 rounded-2xl bg-brand-paper relative overflow-hidden aspect-[16/9] w-full max-w-xl mx-auto shadow-inner p-4">
                    {/* Visual landmarks */}
                    <div className="absolute top-0 bottom-0 left-0 w-8 border-r border-dashed border-brand-sand bg-brand-cream/40 flex items-center justify-center">
                      <span className="text-[10px] uppercase font-sans tracking-widest text-brand-dark/30 origin-center -rotate-90">
                        Main Windows
                      </span>
                    </div>
                    <div className="absolute top-0 bottom-0 right-0 w-8 border-l border-dashed border-brand-sand bg-brand-cream/40 flex items-center justify-center">
                      <span className="text-[10px] uppercase font-sans tracking-widest text-brand-dark/30 origin-center rotate-90">
                        Library Wall
                      </span>
                    </div>
                    <div className="absolute top-0 left-12 right-12 text-center text-[9px] uppercase tracking-wider text-brand-dark/25 font-light">
                      Chef's Pass & Garden Deck
                    </div>

                    {/* Dining Tables Dots */}
                    {tables.map((table) => {
                      const isSelected = selectedTable === table.id;
                      const isReserved = table.status === 'reserved';

                      return (
                        <button
                          key={table.id}
                          type="button"
                          onClick={() => handleTableClick(table.id)}
                          style={{ left: `${table.x}%`, top: `${table.y}%` }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer border ${
                            isReserved
                              ? 'bg-red-50 text-red-400 border-red-200 cursor-not-allowed opacity-60'
                              : isSelected
                              ? 'bg-brand-brown text-white border-brand-brown ring-4 ring-brand-brown/20 scale-110 shadow-md font-medium'
                              : 'bg-brand-cream hover:bg-brand-sage hover:text-white text-brand-dark hover:border-brand-sage border-brand-sand hover:scale-105 shadow-sm'
                          }`}
                        >
                          <span className="text-xs leading-none">T{table.id}</span>
                          <span className="text-[8px] opacity-75 mt-0.5 uppercase tracking-wide">
                            {table.capacity}p
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Map Legend */}
                  <div className="flex justify-center space-x-6 text-[10px] uppercase font-sans tracking-wider text-brand-dark/70 bg-brand-paper py-3 rounded-xl max-w-sm mx-auto">
                    <div className="flex items-center space-x-1.5Fixed">
                      <div className="w-3.5 h-3.5 rounded-full border border-brand-sand bg-brand-cream" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-3.5 h-3.5 rounded-full bg-brand-brown" />
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <div className="w-3.5 h-3.5 rounded-full border border-red-200 bg-red-100" />
                      <span>Booked</span>
                    </div>
                  </div>

                  {/* Summary of table choice */}
                  {selectedTable && (
                    <div className="bg-brand-paper p-4 rounded-xl border border-brand-sand/50 text-sm font-sans flex items-center justify-between">
                      <div>
                        <span className="text-xs text-brand-brown uppercase font-medium tracking-wide">Reserved Selection</span>
                        <h4 className="font-serif font-semibold text-brand-dark text-base">
                          {getTableName(selectedTable)}
                        </h4>
                      </div>
                      <Check className="w-5 h-5 text-brand-brown" />
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="pt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="border border-brand-sand hover:bg-brand-sand text-brand-dark text-xs uppercase tracking-wider px-6 py-3.5 rounded-full cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleGoToStep3}
                      disabled={!selectedTable}
                      className={`font-sans text-xs uppercase tracking-wider font-semibold px-8 py-3.5 rounded-full cursor-pointer transition-all ${
                        selectedTable
                          ? 'bg-brand-brown text-white hover:bg-brand-brown/95'
                          : 'bg-brand-sand text-brand-dark/40 cursor-not-allowed'
                      }`}
                    >
                      Input Contact →
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="flex items-baseline justify-between border-b border-brand-sand pb-3">
                    <h3 className="font-serif text-xl font-medium text-brand-dark">
                      Step 3: Diner Credentials
                    </h3>
                    <span className="text-xs text-brand-brown bg-brand-paper px-3 py-1 rounded">
                      Table #{selectedTable} — {guestsCount} Guests
                    </span>
                  </div>

                  <form onSubmit={handleCreateBooking} className="space-y-5">
                    {formError && (
                      <div className="bg-amber-50 text-amber-800 border border-amber-200 rounded-xl p-3 text-xs flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider font-sans font-medium text-brand-dark/70">
                          Primary Guest Name:
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Lord Kensington"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-brand-paper border border-brand-sand rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-brown font-light"
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider font-sans font-medium text-brand-dark/70">
                          Cell phone Number:
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="7003148840"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="w-full bg-brand-paper border border-brand-sand rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-brown font-light"
                        />
                      </div>
                    </div>

                    {/* Email address */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider font-sans font-medium text-brand-dark/70">
                        Email Address for Confirmation:
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="diner@example.com"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full bg-brand-paper border border-brand-sand rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-brown font-light"
                      />
                    </div>

                    {/* Special requests */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider font-sans font-medium text-brand-dark/70">
                        Allergens / Special Requests (Optional):
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Celebrating an anniversary / Wheelchair accessibility requested / Nut allergy..."
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        className="w-full bg-brand-paper border border-brand-sand rounded-xl px-4 py-3 text-sm font-sans focus:outline-none focus:border-brand-brown font-light resize-none animate"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="pt-6 flex justify-between border-t border-brand-sand/40">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="border border-brand-sand hover:bg-brand-sand text-brand-dark text-xs uppercase tracking-wider px-6 py-3.5 rounded-full cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-brand-brown hover:bg-brand-brown/95 text-white font-sans text-xs uppercase tracking-wider font-semibold px-8 py-3.5 rounded-full cursor-pointer shadow-md transform hover:-translate-y-0.5 transition-all"
                      >
                        {isSubmitting ? 'Submitting...' : 'Confirm Seating Booking'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Seating Logs or Active Reservations (Right Column) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Pop confirmation popup after successful booking */}
            <AnimatePresence>
              {bookingSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-600/10 rounded-bl-full flex items-center justify-center p-3">
                    <Check className="w-5 h-5 text-emerald-700" />
                  </div>
                  
                  <div className="flex items-center space-x-2 text-emerald-700 font-serif font-semibold text-lg mb-2">
                    <Sparkles className="w-4 h-4 fill-current shrink-0" />
                    <span>Booking Claimed!</span>
                  </div>
                  <p className="text-xs font-sans font-light leading-relaxed mb-4 text-emerald-800">
                    A confirmation email has been logged to <span className="font-semibold">{bookingSuccess.email}</span> with check-in instructions. Show your table confirmation ID upon arrival at the desk.
                  </p>
                  
                  <div className="bg-white/80 rounded-xl p-4 text-xs font-sans font-light text-emerald-950 space-y-1.5 border border-emerald-100/50">
                    <div>
                      <strong className="font-semibold text-emerald-900 uppercase tracking-wide text-[9px] block">Booking Code:</strong>
                      <span className="font-serif text-sm font-semibold tracking-wider text-brand-dark">{bookingSuccess.id}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-600/10 text-[11px]">
                      <div>
                        <strong>Date:</strong> {bookingSuccess.date}
                      </div>
                      <div>
                        <strong>Hours:</strong> {bookingSuccess.time}
                      </div>
                      <div>
                        <strong>Seat:</strong> Table #{bookingSuccess.tableNumber}
                      </div>
                      <div>
                        <strong>Guests:</strong> {bookingSuccess.guests}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setBookingSuccess(null)}
                    className="mt-4 w-full bg-emerald-750 hover:bg-emerald-800 text-white text-center py-2.5 rounded-xl text-xs font-sans font-medium uppercase tracking-wider cursor-pointer"
                  >
                    Alright, Fantastic
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upcoming Bookings Box */}
            <div className="bg-brand-cream rounded-3xl p-6 border border-brand-sand/55 space-y-4">
              <h3 className="font-serif text-lg font-semibold text-brand-dark pb-2 border-b border-brand-sand flex items-center justify-between">
                <span>Your Reservations</span>
                <span className="text-[10px] font-sans font-normal uppercase bg-brand-sand text-brand-brown px-2 py-0.5 rounded">
                  {reservations.length} Active
                </span>
              </h3>

              {reservations.length === 0 ? (
                <div className="text-center py-8 text-brand-dark/45 space-y-2">
                  <BookOpen className="w-8 h-8 mx-auto text-brand-dark/30 stroke-1" />
                  <p className="text-xs font-sans font-light leading-relaxed">
                    No bookings logged yet. Use our left planner desk to secure a seating slot.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className="bg-brand-paper hover:bg-brand-paper/90 rounded-2xl p-4 border border-brand-sand/35 space-y-3 shadow-inner relative group"
                    >
                      <button
                        onClick={() => handleDeleteBooking(res.id)}
                        className="absolute top-4 right-4 text-brand-dark/30 hover:text-red-600 transition-colors p-1 rounded cursor-pointer"
                        title="Delete reservation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-1">
                        <span className="text-[9px] font-sans text-brand-brown font-semibold bg-brand-cream border border-brand-sand px-2 py-0.5 rounded uppercase tracking-wider">
                          Code: {res.id}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-brand-dark pt-1">
                          {res.name}
                        </h4>
                        <p className="text-[10px] text-brand-dark/50 font-sans font-light">
                          Created {new Date(res.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="text-xs space-y-1 font-sans font-light text-brand-dark/80 pt-1.5 border-t border-brand-sand/40">
                        <div className="flex justify-between">
                          <span>📅 Date:</span>
                          <strong>{res.date}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>⏰ Time:</span>
                          <strong>{res.time}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>👥 Party:</span>
                          <strong>{res.guests} Guests</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>📍 Location:</span>
                          <strong>Table #{res.tableNumber}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Interactive FAQ / Note card */}
            <div className="bg-brand-brown rounded-3xl p-6 text-white text-xs font-sans font-light leading-relaxed space-y-3.5 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-white/5 rounded-full" />
              <div className="flex items-center space-x-2 text-brand-gold font-serif text-sm font-semibold">
                <Gift className="w-4 h-4 fill-current shrink-0" />
                <span>The Chandelier Dining Perk</span>
              </div>
              <p>
                Reservations made for Table #3 (underneath our signature vintage brass chandelier) receive a complimentary slice of our daily baked Cardamom Espresso Babka! Perfect for special celebrations.
              </p>
              <div className="text-[9px] text-white/50 uppercase tracking-widest pt-1 border-t border-white/10 flex justify-between">
                <span>Offer Valid All Season</span>
                <span>★ Certified Kafeno</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
