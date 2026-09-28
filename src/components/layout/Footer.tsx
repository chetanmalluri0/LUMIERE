import React from 'react';
import { MessageSquare, Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  return (
    <footer className="bg-[#1A1918] text-[#FAF8F5] pt-20 pb-12 border-t border-[#362B28]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-[#362B28]">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="font-serif text-3xl tracking-[0.2em] font-normal text-[#FAF8F5]">
              LUMIÈRE
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-[#C5A880]">
              Where Beauty Meets Precision.
            </p>
            <p className="text-xs leading-relaxed text-stone-400 font-light pr-4">
              An architectural sanctuary dedicated to high-precision haircuts, bespoke color formulation, skin rejuvenation, and bridal artistry.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/919876543210?text=Hello%20LUMIÈRE%20Concierge,%20I%20would%20like%20to%20inquire%20about%20a%20reservation."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A880] hover:text-[#FAF8F5] transition-colors py-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Concierge</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 2: Studio Information */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#FAF8F5] font-semibold">
              The Atelier
            </h3>
            <ul className="space-y-3 text-xs text-stone-400 font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>74 Lavelle Road, Richmond Town, Bengaluru, KA 560001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>Mon – Sun: 09:00 – 20:00</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-[#FAF8F5] transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                <a href="mailto:concierge@lumierebeauty.com" className="hover:text-[#FAF8F5] transition-colors">
                  concierge@lumierebeauty.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#FAF8F5] font-semibold">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-400 font-light">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-[#FAF8F5] transition-colors text-left"
                >
                  Bespoke Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('team')}
                  className="hover:text-[#FAF8F5] transition-colors text-left"
                >
                  Master Artists & Stylists
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-[#FAF8F5] transition-colors text-left"
                >
                  Transparent Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#FAF8F5] transition-colors text-left"
                >
                  Editorial Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#FAF8F5] transition-colors text-left"
                >
                  Our Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#FAF8F5] transition-colors text-left"
                >
                  Directions & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Book & Client Portal */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-[#FAF8F5] font-semibold">
              Reservations
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              Appointments are strictly curated to allow dedicated, unhurried time for each guest.
            </p>
            <button
              onClick={onOpenBooking}
              className="w-full py-3 px-4 bg-[#C5A880] hover:bg-[#b39366] text-[#1A1918] text-xs uppercase tracking-[0.15em] font-semibold transition-colors rounded text-center"
            >
              Reserve a Session
            </button>
            <div className="pt-2 flex flex-col gap-2 text-xs text-stone-400">
              <button
                onClick={() => onNavigate('customer-login')}
                className="hover:text-[#C5A880] text-left transition-colors"
              >
                Client Portal Sign In →
              </button>
              <button
                onClick={() => onNavigate('admin-login')}
                className="hover:text-[#C5A880] text-left text-stone-500 text-[11px] transition-colors"
              >
                Atelier Administration Suite →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 font-light">
          <div>
            © {new Date().getFullYear()} LUMIÈRE Beauty Studio. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-stone-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-stone-300 transition-colors"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
