import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';
import { Service, Staff, Appointment } from '../../types/index.ts';
import {
  X,
  Check,
  Calendar,
  Clock,
  User,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedServiceId?: string;
  onViewDashboard?: () => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  isOpen,
  onClose,
  preSelectedServiceId,
  onViewDashboard,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(false);

  // Form State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null); // null means "Any Specialist"
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  // Customer Contact Info
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Confirmation State
  const [submitting, setSubmitting] = useState(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Load services and staff on open
  useEffect(() => {
    if (!isOpen) return;

    setLoadingInitial(true);
    Promise.all([
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/staff').then((r) => r.json()),
    ])
      .then(([srvData, staffData]) => {
        const srvs: Service[] = srvData.services || [];
        setServices(srvs);
        setStaffList(staffData.staff || []);

        if (preSelectedServiceId) {
          const match = srvs.find((s) => s.id === preSelectedServiceId);
          if (match) {
            setSelectedService(match);
            setStep(2);
          }
        }
      })
      .catch((err) => {
        showToast('Failed to load reservation data: ' + err.message, 'error');
      })
      .finally(() => setLoadingInitial(false));

    // Prefill logged-in customer info
    if (user) {
      setCustomerName(user.fullName || '');
      setCustomerEmail(user.email || '');
      setCustomerPhone(user.phone || '');
    }

    // Default date to tomorrow if not set
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);
  }, [isOpen, preSelectedServiceId, user, showToast]);

  // Load available slots whenever date or staff changes
  useEffect(() => {
    if (!selectedDate || step < 3) return;

    setLoadingSlots(true);
    const staffParam = selectedStaff ? selectedStaff.id : 'any';
    const duration = selectedService ? selectedService.durationMinutes : 45;

    fetch(`/api/availability?date=${selectedDate}&staffId=${staffParam}&durationMinutes=${duration}`)
      .then((r) => r.json())
      .then((data) => {
        setAvailableSlots(data.availableSlots || []);
        if (selectedSlot && !data.availableSlots?.includes(selectedSlot)) {
          setSelectedSlot('');
        }
      })
      .catch((err) => {
        console.error(err);
        setAvailableSlots([]);
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, selectedStaff, selectedService, step, selectedSlot]);

  if (!isOpen) return null;

  // Handle Submission
  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) {
      showToast('Please complete all booking steps.', 'error');
      return;
    }

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      showToast('Please enter your contact details.', 'error');
      setStep(5);
      return;
    }

    setSubmitting(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const savedToken = localStorage.getItem('lumiere_token');
      if (savedToken) {
        headers['Authorization'] = `Bearer ${savedToken}`;
      }

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          serviceId: selectedService.id,
          staffId: selectedStaff ? selectedStaff.id : 'any',
          appointmentDate: selectedDate,
          appointmentTime: selectedSlot,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to confirm appointment');
      }

      setConfirmedAppointment(data.appointment);
      setStep(7);
      showToast(`Appointment ${data.appointment.appointmentNumber} reserved successfully!`, 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedStaff(null);
    setSelectedSlot('');
    setConfirmedAppointment(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1918]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] border border-[#EFEBE4] w-full max-w-2xl rounded shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#EFEBE4] flex items-center justify-between bg-[#F5F2EB]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              Bespoke Reservation
            </span>
            <h2 className="font-serif text-xl text-[#1A1918]">
              {step === 7 ? 'Reservation Confirmed' : `Step ${step} of 6`}
            </h2>
          </div>
          <button
            onClick={resetAndClose}
            className="text-stone-400 hover:text-[#1A1918] p-1.5 transition-colors rounded"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1">
          {loadingInitial ? (
            <div className="py-20 text-center text-xs text-stone-500 font-light">
              Preparing the atelier reservation schedule...
            </div>
          ) : (
            <>
              {/* STEP 1: Select Service */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="border-b border-[#EFEBE4] pb-3">
                    <h3 className="font-serif text-lg text-[#1A1918]">Select Your Bespoke Service</h3>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Choose from our curated menu of hair styling, restorative spa, and wellness rituals.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[48vh] overflow-y-auto pr-1">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        onClick={() => setSelectedService(srv)}
                        className={`p-4 rounded border text-left cursor-pointer transition-all ${
                          selectedService?.id === srv.id
                            ? 'border-[#C5A880] bg-[#F5F2EB] shadow-sm ring-1 ring-[#C5A880]'
                            : 'border-[#EFEBE4] bg-white hover:border-[#DFD7CB]'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs text-stone-500 font-light">{srv.category}</span>
                          <span className="text-xs font-semibold tabular-nums text-[#1A1918]">
                            ₹{srv.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <h4 className="font-serif text-base font-normal text-[#1A1918] leading-tight">
                          {srv.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                          {srv.description}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#C5A880] font-medium">
                          <Clock className="w-3 h-3" />
                          <span>{srv.durationMinutes} Minutes</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Select Specialist */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="border-b border-[#EFEBE4] pb-3">
                    <h3 className="font-serif text-lg text-[#1A1918]">Select Master Artist or Stylist</h3>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      You may select a dedicated specialist or allow us to assign the first available master artisan.
                    </p>
                  </div>
                  <div className="space-y-2.5 max-h-[48vh] overflow-y-auto pr-1">
                    {/* Any available specialist option */}
                    <div
                      onClick={() => setSelectedStaff(null)}
                      className={`p-3.5 rounded border flex items-center justify-between cursor-pointer transition-all ${
                        selectedStaff === null
                          ? 'border-[#C5A880] bg-[#F5F2EB] shadow-sm ring-1 ring-[#C5A880]'
                          : 'border-[#EFEBE4] bg-white hover:border-[#DFD7CB]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1A1918] text-[#C5A880] flex items-center justify-center font-serif text-sm">
                          ✦
                        </div>
                        <div>
                          <h4 className="font-serif text-base font-normal text-[#1A1918]">
                            Any Available Specialist
                          </h4>
                          <p className="text-xs text-stone-500 font-light">
                            Maximum scheduling flexibility with certified atelier masters
                          </p>
                        </div>
                      </div>
                      {selectedStaff === null && <Check className="w-4 h-4 text-[#C5A880]" />}
                    </div>

                    {/* Staff members */}
                    {staffList.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => setSelectedStaff(member)}
                        className={`p-3.5 rounded border flex items-center justify-between cursor-pointer transition-all ${
                          selectedStaff?.id === member.id
                            ? 'border-[#C5A880] bg-[#F5F2EB] shadow-sm ring-1 ring-[#C5A880]'
                            : 'border-[#EFEBE4] bg-white hover:border-[#DFD7CB]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={member.avatarUrl}
                            alt={member.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-[#DFD7CB]"
                          />
                          <div>
                            <h4 className="font-serif text-base font-normal text-[#1A1918]">
                              {member.name}
                            </h4>
                            <p className="text-xs text-[#C5A880] font-medium">{member.title}</p>
                            <p className="text-[11px] text-stone-500 line-clamp-1 font-light">
                              {member.bio}
                            </p>
                          </div>
                        </div>
                        {selectedStaff?.id === member.id && (
                          <Check className="w-4 h-4 text-[#C5A880] shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3 & 4: Select Date & Available Slots */}
              {(step === 3 || step === 4) && (
                <div className="space-y-5">
                  <div className="border-b border-[#EFEBE4] pb-3">
                    <h3 className="font-serif text-lg text-[#1A1918]">
                      Select Date & Available Time Slot
                    </h3>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Double-booking is automatically prevented in real time. Already reserved slots are hidden.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-full sm:w-1/2">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                      />
                      <div className="mt-3 p-3 bg-[#F5F2EB] rounded text-[11px] text-stone-600 font-light flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                        <span>
                          {selectedStaff
                            ? `Showing slots for ${selectedStaff.name}`
                            : 'Showing all slots across available masters'}
                        </span>
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label className="block text-xs uppercase tracking-wider font-semibold text-stone-700 mb-2">
                        Available Open Slots
                      </label>

                      {loadingSlots ? (
                        <div className="py-8 text-center text-xs text-stone-400 font-light">
                          Checking atelier availability...
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="p-4 bg-white border border-dashed border-[#DFD7CB] rounded text-center text-xs text-stone-500">
                          No open slots on this date. Please choose an alternate day.
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                          {availableSlots.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setSelectedSlot(slot);
                                setStep(5);
                              }}
                              className={`py-2 px-1 text-xs tabular-nums text-center rounded border transition-all ${
                                selectedSlot === slot
                                  ? 'bg-[#1A1918] text-[#FAF8F5] border-[#1A1918] font-semibold'
                                  : 'bg-white text-stone-800 border-[#DFD7CB] hover:border-[#C5A880]'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Customer Information */}
              {step === 5 && (
                <div className="space-y-4">
                  <div className="border-b border-[#EFEBE4] pb-3">
                    <h3 className="font-serif text-lg text-[#1A1918]">Guest Contact Details</h3>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Your appointment confirmation and WhatsApp dispatch notifications will be sent here.
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1">
                        Full Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Ananya Deshmukh"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="name@domain.com"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1">
                          Contact Telephone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+91 98201 12233"
                          className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1">
                        Special Requests or Scalp/Skin Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Allergies, sensitivities, preferred pressure, inspiration photos..."
                        className="w-full px-3.5 py-2 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Review & Final Confirmation */}
              {step === 6 && (
                <div className="space-y-5">
                  <div className="border-b border-[#EFEBE4] pb-3">
                    <h3 className="font-serif text-lg text-[#1A1918]">Review Your Atelier Reservation</h3>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Verify your bespoke appointment itinerary before confirming.
                    </p>
                  </div>

                  <div className="bg-[#F5F2EB] border border-[#EFEBE4] p-5 rounded space-y-3 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-[#EFEBE4]">
                      <span className="text-stone-500 uppercase tracking-wider text-[11px]">Service</span>
                      <span className="font-serif text-base text-[#1A1918]">
                        {selectedService?.name}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-[#EFEBE4]">
                      <span className="text-stone-500 uppercase tracking-wider text-[11px]">Specialist</span>
                      <span className="font-medium text-[#1A1918]">
                        {selectedStaff ? selectedStaff.name : 'First Available Master Stylist'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-[#EFEBE4]">
                      <span className="text-stone-500 uppercase tracking-wider text-[11px]">Date & Time</span>
                      <span className="font-medium text-[#1A1918]">
                        {selectedDate} at {selectedSlot}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-[#EFEBE4]">
                      <span className="text-stone-500 uppercase tracking-wider text-[11px]">Duration</span>
                      <span className="font-medium text-[#1A1918]">
                        {selectedService?.durationMinutes} Minutes
                      </span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-[#EFEBE4]">
                      <span className="text-stone-500 uppercase tracking-wider text-[11px]">Guest</span>
                      <span className="font-medium text-[#1A1918]">
                        {customerName} ({customerPhone})
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2 text-sm font-semibold text-[#1A1918]">
                      <span>Total Amount</span>
                      <span className="font-serif text-lg text-[#9D8159]">
                        ₹{selectedService?.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
                    <span>
                      Complimentary cancellation up to 4 hours prior. Payable at atelier desk upon completion.
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 7: Success / Confirmed State */}
              {step === 7 && confirmedAppointment && (
                <div className="py-6 text-center space-y-5 animate-fade-in">
                  <div className="w-14 h-14 bg-[#1A1918] text-[#C5A880] rounded-full mx-auto flex items-center justify-center">
                    <Check className="w-7 h-7" />
                  </div>

                  <div>
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
                      Reservation Registered
                    </span>
                    <h3 className="font-serif text-2xl text-[#1A1918] mt-1">
                      We Look Forward to Welcoming You
                    </h3>
                    <p className="text-xs text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
                      Your reservation request has been entered into the LUMIÈRE database. A confirmation dispatch has been routed to{' '}
                      <strong>{confirmedAppointment.customerEmail}</strong>.
                    </p>
                  </div>

                  <div className="p-4 bg-[#F5F2EB] border border-[#EFEBE4] rounded max-w-sm mx-auto text-xs text-left space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Reservation ID:</span>
                      <span className="font-mono font-semibold text-[#1A1918]">
                        {confirmedAppointment.appointmentNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Service:</span>
                      <span className="font-medium text-[#1A1918]">
                        {confirmedAppointment.serviceName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Specialist:</span>
                      <span className="font-medium text-[#1A1918]">
                        {confirmedAppointment.staffName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Scheduled:</span>
                      <span className="font-medium text-[#1A1918]">
                        {confirmedAppointment.appointmentDate} at {confirmedAppointment.appointmentTime}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={`https://wa.me/919876543210?text=Hello%20LUMIÈRE,%20I%20have%20booked%20appointment%20${confirmedAppointment.appointmentNumber}%20for%20${confirmedAppointment.serviceName}%20on%20${confirmedAppointment.appointmentDate}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-[#1EBE5B] transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp Concierge</span>
                    </a>

                    {onViewDashboard && (
                      <button
                        onClick={() => {
                          resetAndClose();
                          onViewDashboard();
                        }}
                        className="py-2.5 px-4 bg-[#1A1918] text-[#FAF8F5] text-xs font-medium uppercase tracking-wider rounded hover:bg-[#362B28] transition-colors"
                      >
                        View in Client Portal
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls (Steps 1 to 6) */}
        {step < 7 && !loadingInitial && (
          <div className="px-6 py-4 border-t border-[#EFEBE4] bg-[#F5F2EB] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-stone-600 hover:text-[#1A1918] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {step === 1 && (
                <button
                  type="button"
                  disabled={!selectedService}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1918] disabled:bg-stone-300 text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded transition-colors"
                >
                  <span>Select Specialist</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded transition-colors"
                >
                  <span>Select Date & Time</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={() => setStep(5)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1918] disabled:bg-stone-300 text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded transition-colors"
                >
                  <span>Guest Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 5 && (
                <button
                  type="button"
                  disabled={!customerName || !customerEmail || !customerPhone}
                  onClick={() => setStep(6)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1A1918] disabled:bg-stone-300 text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded transition-colors"
                >
                  <span>Review Booking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 6 && (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleConfirmBooking}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#C5A880] hover:bg-[#b39366] text-[#1A1918] text-xs uppercase tracking-wider font-bold rounded transition-colors shadow-sm"
                >
                  {submitting ? 'Reserving...' : 'Confirm Appointment'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
