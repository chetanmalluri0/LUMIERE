import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext.tsx';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please provide your name, email, and message.', 'error');
      return;
    }

    setSubmitted(true);
    showToast('Your message has been received by our concierge desk.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#9D8159] font-medium">
          Get In Touch
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1918] font-light">
          Contact The Atelier
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
          Whether inquiring about couture bridal dossiers, private studio buyouts, or specific formulation sensitivities, our atelier concierge is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 bg-[#F5F2EB] border border-[#EFEBE4] rounded p-8 sm:p-10 space-y-8">
          <div>
            <h2 className="font-serif text-2xl text-[#1A1918]">Atelier Concierge</h2>
            <p className="text-xs text-stone-600 font-light mt-1">
              Located within the leafy, calm heritage avenues of Richmond Town.
            </p>
          </div>

          <div className="space-y-6 text-xs text-stone-700">
            <div className="flex items-start gap-3.5">
              <MapPin className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 font-semibold mb-0.5">Physical Address</strong>
                <span>74 Lavelle Road, Richmond Town, Bengaluru, Karnataka 560001</span>
                <p className="text-[11px] text-stone-500 mt-1">Complimentary valet parking available at entrance.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Clock className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 font-semibold mb-0.5">Atelier Hours</strong>
                <span>Monday through Sunday: 09:00 – 20:00</span>
                <p className="text-[11px] text-stone-500 mt-1">Appointments strongly recommended.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Phone className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 font-semibold mb-0.5">Direct Line</strong>
                <a href="tel:+919876543210" className="hover:text-[#1A1918] transition-colors">
                  +91 98765 43210
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <Mail className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-stone-900 font-semibold mb-0.5">Concierge Email</strong>
                <a href="mailto:concierge@lumierebeauty.com" className="hover:text-[#1A1918] transition-colors">
                  concierge@lumierebeauty.com
                </a>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#DFD7CB]">
            <a
              href="https://wa.me/919876543210?text=Hello%20LUMIÈRE%20Desk,%20I%20have%20an%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#25D366] hover:bg-[#1EBE5B] text-white text-xs uppercase tracking-wider font-semibold rounded transition-colors shadow-sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Message Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#EFEBE4] rounded p-8 sm:p-10">
          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl text-[#1A1918]">Message Forwarded</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Thank you for writing to LUMIÈRE. Our hospitality desk will review your inquiry and respond within two business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setMessage('');
                }}
                className="mt-4 px-6 py-2.5 bg-[#1A1918] text-[#FAF8F5] text-xs uppercase tracking-wider rounded font-medium"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="font-serif text-2xl text-[#1A1918]">Send an Inquiry</h3>
                <p className="text-xs text-stone-500 font-light mt-1">
                  We reply promptly to all consultation requests and bespoke event bookings.
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5 font-medium">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya Krishnan"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maya@example.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5 font-medium">
                    Contact Telephone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 00000"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-600 mb-1.5 font-medium">
                  Your Inquiry or Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe how we may assist you..."
                  className="w-full px-3.5 py-2.5 bg-white border border-[#DFD7CB] rounded text-sm text-[#1A1918] focus:outline-none focus:border-[#C5A880]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1A1918] hover:bg-[#362B28] text-[#FAF8F5] text-xs uppercase tracking-[0.18em] font-semibold rounded transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
