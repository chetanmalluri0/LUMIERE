import React, { useState, useEffect } from 'react';
import { Service, Staff } from '../types/index.ts';
import {
  ArrowRight,
  Clock,
  Sparkles,
  ShieldCheck,
  Star,
  Compass,
  HeartHandshake,
  MapPin,
  Calendar,
  CheckCircle,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenBooking: (serviceId?: string) => void;
  onSelectService: (service: Service) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenBooking,
  onSelectService,
}) => {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [teamMembers, setTeamMembers] = useState<Staff[]>([]);

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => setFeaturedServices((data.services || []).slice(0, 4)))
      .catch(console.error);

    fetch('/api/staff')
      .then((r) => r.json())
      .then((data) => setTeamMembers((data.staff || []).slice(0, 3)))
      .catch(console.error);
  }, []);

  const testimonials = [
    {
      name: 'Radhika Singhania',
      role: 'Fashion Editor, Vogue India',
      quote:
        'LUMIÈRE represents an overdue renaissance in salon care. Claire’s precision cut transformed not merely my silhouette, but how I present myself to the world.',
      service: 'Haircut & Styling',
    },
    {
      name: 'Aditi Rao',
      role: 'Classical Vocalist & Curator',
      quote:
        'The scalp spa ritual is transcendent. In a city of frantic noise, this atelier is a serene sanctuary of silence, aromatic herbs, and consummate craftsmanship.',
      service: 'Botanical Hair Spa',
    },
    {
      name: 'Meera Vasudevan',
      role: 'Architectural Digest Contributing Author',
      quote:
        'From the tactile travertine surfaces to the unhurried attention of the aestheticians, every second at LUMIÈRE reflects genuine quiet luxury.',
      service: 'Bridal Artistry',
    },
  ];

  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#EFEBE4] bg-[#F5F2EB]">
        {/* Background Visual */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1800&q=85"
            alt="LUMIÈRE Atelier Interior"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20 filter saturate-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/80 via-[#FAF8F5]/40 to-[#FAF8F5]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#9D8159] font-medium mb-6">
            <span>The Premier Atelier</span>
            <span aria-hidden="true">·</span>
            <span>Bengaluru</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-[#1A1918] tracking-[0.04em] leading-[1.1] mb-6 text-balance">
            LUXURY, REDEFINED.
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#55524E] font-light leading-relaxed mb-10 text-balance">
            "Personalized beauty experiences designed around you." Where bespoke color chemistry, structural haircutting, and restorative skincare harmonise into quiet perfection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onOpenBooking()}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#1A1918] hover:bg-[#362B28] text-[#FAF8F5] text-xs uppercase tracking-[0.18em] font-medium transition-colors rounded shadow-md"
            >
              Book an Appointment
            </button>
            <button
              onClick={() => onNavigate('services')}
              className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-white text-[#1A1918] border border-[#DFD7CB] text-xs uppercase tracking-[0.18em] font-medium transition-colors rounded"
            >
              Explore Services
            </button>
          </div>

          <div className="mt-14 pt-8 border-t border-[#DFD7CB]/60 flex flex-wrap items-center justify-center gap-8 text-xs text-stone-500 font-light">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Bespoke Formulations</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Dedicated Private Suites</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Master European Artistry</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED SERVICES */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-[#EFEBE4] pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#9D8159] font-medium">
              Curated Menu
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1918] mt-1">
              Featured Studio Rituals
            </h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-semibold text-[#1A1918] hover:text-[#C5A880] transition-colors"
          >
            <span>View Complete Menu (10 Services)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white border border-[#EFEBE4] rounded overflow-hidden flex flex-col group hover:shadow-md hover:border-[#DFD7CB] transition-all"
            >
              <div className="relative h-56 overflow-hidden bg-stone-100">
                <img
                  src={srv.imageUrl}
                  alt={srv.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-[#FAF8F5]/90 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-wider text-stone-700 font-medium rounded">
                  {srv.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-serif text-xl text-[#1A1918] font-normal">{srv.name}</h3>
                    <span className="text-sm font-semibold tabular-nums text-[#1A1918]">
                      ₹{srv.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-light leading-relaxed line-clamp-2 mb-4">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFEBE4] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 font-light">
                    <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>{srv.durationMinutes} min</span>
                  </div>
                  <button
                    onClick={() => onSelectService(srv)}
                    className="text-xs uppercase tracking-wider font-semibold text-[#1A1918] hover:text-[#C5A880] transition-colors"
                  >
                    Details & Book →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE US / THE LUMIÈRE STANDARD */}
      <section className="bg-[#F5F2EB] py-20 border-y border-[#EFEBE4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-[#9D8159] font-medium">
              The Standard
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1918] mt-1">
              Why Discerning Guests Choose Us
            </h2>
            <p className="text-xs md:text-sm text-stone-500 font-light mt-3 leading-relaxed">
              We reject the factory rush of conventional salons. Every touchpoint is engineered for tranquility and aesthetic precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-[#FAF8F5] border border-[#EFEBE4] rounded space-y-4">
              <div className="w-10 h-10 rounded bg-[#1A1918] text-[#C5A880] flex items-center justify-center font-serif text-lg">
                01
              </div>
              <h3 className="font-serif text-xl text-[#1A1918]">Unrushed 1-on-1 Sessions</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                We never double-book our artists. Your designated master stylist concentrates exclusively on your session from welcoming tea to final polish.
              </p>
            </div>

            <div className="p-8 bg-[#FAF8F5] border border-[#EFEBE4] rounded space-y-4">
              <div className="w-10 h-10 rounded bg-[#1A1918] text-[#C5A880] flex items-center justify-center font-serif text-lg">
                02
              </div>
              <h3 className="font-serif text-xl text-[#1A1918]">Botanical Purity & Chemistry</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Exclusively formulated with low-ammonia pigment complexes, organic cold-pressed argan oil, and dermatological peptide infusions.
              </p>
            </div>

            <div className="p-8 bg-[#FAF8F5] border border-[#EFEBE4] rounded space-y-4">
              <div className="w-10 h-10 rounded bg-[#1A1918] text-[#C5A880] flex items-center justify-center font-serif text-lg">
                03
              </div>
              <h3 className="font-serif text-xl text-[#1A1918]">Private Consultation Suites</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Acoustically buffered styling pavilions with frameless warm backlit mirrors ensure total privacy, comfort, and restorative quiet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MASTER ARTISTS SECTION */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-[#EFEBE4] pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#9D8159] font-medium">
              The Masters
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1918] mt-1">
              Meet Our Specialists
            </h2>
          </div>
          <button
            onClick={() => onNavigate('team')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-semibold text-[#1A1918] hover:text-[#C5A880] transition-colors"
          >
            <span>View Full Atelier Faculty</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div key={member.id} className="group text-left space-y-4">
              <div className="relative h-80 overflow-hidden rounded bg-stone-100 border border-[#EFEBE4]">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#9D8159] font-medium">
                  {member.title}
                </span>
                <h3 className="font-serif text-2xl text-[#1A1918] mt-0.5">{member.name}</h3>
                <p className="text-xs text-stone-500 font-light leading-relaxed mt-2 line-clamp-3">
                  {member.bio}
                </p>
                <button
                  onClick={() => onOpenBooking()}
                  className="mt-3 text-xs uppercase tracking-wider font-semibold text-[#1A1918] hover:text-[#C5A880] transition-colors"
                >
                  Book with {member.name.split(' ')[0]} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="bg-[#1A1918] text-[#FAF8F5] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-medium">
              Guest Impressions
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#FAF8F5] mt-1">
              Words From Our Patrons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-8 bg-[#23211F] border border-[#362B28] rounded flex flex-col justify-between space-y-6"
              >
                <p className="font-serif text-lg italic text-stone-300 leading-relaxed font-light">
                  "{t.quote}"
                </p>
                <div className="pt-4 border-t border-[#362B28]">
                  <div className="font-serif text-base text-[#FAF8F5]">{t.name}</div>
                  <div className="text-xs text-stone-400 font-light">{t.role}</div>
                  <div className="text-[11px] text-[#C5A880] font-medium mt-1">
                    Ritual: {t.service}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. EDITORIAL GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-b border-[#EFEBE4] pb-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#9D8159] font-medium">
              Visual Portfolio
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1A1918] mt-1">
              Atelier Moments & Artistry
            </h2>
          </div>
          <button
            onClick={() => onNavigate('gallery')}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] font-semibold text-[#1A1918] hover:text-[#C5A880] transition-colors"
          >
            <span>Explore Full Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-64 rounded overflow-hidden bg-stone-100 border border-[#EFEBE4]">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
              alt="Hair styling session"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="h-64 rounded overflow-hidden bg-stone-100 border border-[#EFEBE4]">
            <img
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80"
              alt="Facial skincare treatment"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="h-64 rounded overflow-hidden bg-stone-100 border border-[#EFEBE4]">
            <img
              src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80"
              alt="Artisanal manicure"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="h-64 rounded overflow-hidden bg-stone-100 border border-[#EFEBE4]">
            <img
              src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80"
              alt="Bridal makeup masterclass"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* 7. BOOKING CTA BANNER */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-[#F5F2EB] border border-[#DFD7CB] rounded p-8 sm:p-14 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-[0.25em] text-[#9D8159] font-medium">
              Begin Your Experience
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1A1918] font-light">
              Elevate Your Everyday Standard
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Appointments fill rapidly across weekends. Secure your preferred artist and time slot through our instant live booking engine.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => onOpenBooking()}
                className="px-8 py-3.5 bg-[#1A1918] hover:bg-[#362B28] text-[#FAF8F5] text-xs uppercase tracking-[0.18em] font-semibold transition-colors rounded shadow"
              >
                Reserve Your Date
              </button>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 bg-white hover:bg-stone-50 text-[#1A1918] border border-[#DFD7CB] text-xs uppercase tracking-[0.18em] font-medium transition-colors rounded"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LOCATION & HOURS */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white border border-[#EFEBE4] rounded p-8 md:p-12">
          <div className="space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#9D8159] font-medium">
                Visit The Atelier
              </span>
              <h2 className="font-serif text-3xl text-[#1A1918] mt-1">
                Where Beauty Meets Precision
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Situated in the leafy heritage precinct of Lavelle Road, our studio features dedicated valet parking, a tranquil botanical garden courtyard, and private dressing suites.
            </p>
            <div className="space-y-3 text-xs text-stone-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>74 Lavelle Road, Richmond Town, Bengaluru, Karnataka 560001</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>Monday through Sunday: 09:00 – 20:00 (By reservation)</span>
              </div>
            </div>
            <div>
              <button
                onClick={() => onNavigate('contact')}
                className="text-xs uppercase tracking-wider font-semibold text-[#1A1918] hover:text-[#C5A880] transition-colors"
              >
                Get Directions & Parking Guide →
              </button>
            </div>
          </div>

          <div className="h-72 rounded overflow-hidden bg-stone-100 border border-[#EFEBE4]">
            <img
              src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80"
              alt="Lumiere beauty salon interior lounge"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
