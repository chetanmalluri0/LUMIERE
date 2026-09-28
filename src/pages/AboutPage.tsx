import React from 'react';
import { Sparkles, Shield, HeartHandshake, Compass } from 'lucide-react';

interface AboutPageProps {
  onOpenBooking: () => void;
  onNavigate: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenBooking, onNavigate }) => {
  return (
    <div className="space-y-20 md:space-y-28 pb-20">
      {/* Hero Header */}
      <section className="bg-[#F5F2EB] border-b border-[#EFEBE4] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#9D8159] font-medium">
            Our Heritage & Ethos
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#1A1918] font-light leading-tight">
            Where Beauty Meets Precision.
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-600 font-light leading-relaxed">
            Founded on the belief that beauty is neither accidental nor rushed, LUMIÈRE was created as a modern sanctuary where architectural discipline intersects with couture styling.
          </p>
        </div>
      </section>

      {/* Narrative Section 1: The Origin */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs uppercase tracking-[0.2em] text-[#9D8159] font-medium">
              The Atelier Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1918] font-normal leading-snug">
              Crafted in Silence. Perfected with Care.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              We conceived LUMIÈRE as an intentional antidote to the bustling, hyper-commercialized salons that dominate contemporary urban life. Instead of 20 chairs squeezed in a noisy room, we designed six expansive private pavilions partitioned by textured linen and acoustically buffered limestone.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Here, every stylist is an artisan. Every product is selected for pure chemical integrity and physiological resonance. From custom-mixed balayage shades to deep scalp steam rituals, each session is unhurried and uniquely tailored to your individual anatomy.
            </p>
          </div>
          <div className="h-96 rounded overflow-hidden bg-stone-100 border border-[#EFEBE4]">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80"
              alt="Lumiere atelier styling pavilion"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4 Pillars of LUMIÈRE */}
      <section className="bg-[#FAF8F5] py-16 border-y border-[#EFEBE4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-[0.2em] text-[#9D8159] font-medium">
              Core Pillars
            </span>
            <h3 className="font-serif text-3xl text-[#1A1918] mt-1">The Four Commitments</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 bg-white border border-[#EFEBE4] rounded space-y-3">
              <Compass className="w-6 h-6 text-[#C5A880]" />
              <h4 className="font-serif text-lg text-[#1A1918]">Architectural Precision</h4>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Haircut angles cut to your skull structure, jawline balance, and natural growth cowlicks.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#EFEBE4] rounded space-y-3">
              <Sparkles className="w-6 h-6 text-[#C5A880]" />
              <h4 className="font-serif text-lg text-[#1A1918]">Pure Formulations</h4>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Clean organic active botanicals, formaldehyde-free smoothing treatments, and 100% cruelty-free.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#EFEBE4] rounded space-y-3">
              <Shield className="w-6 h-6 text-[#C5A880]" />
              <h4 className="font-serif text-lg text-[#1A1918]">Uncompromising Hygiene</h4>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Hospital-grade autoclave sterilization for all metal instruments and single-use Egyptian cotton towels.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#EFEBE4] rounded space-y-3">
              <HeartHandshake className="w-6 h-6 text-[#C5A880]" />
              <h4 className="font-serif text-lg text-[#1A1918]">Client Sovereignty</h4>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                No upsells or pressure. We listen first, understand your lifestyle, and formulate accordingly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable & Ethical Sourcing */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-[#F5F2EB] border border-[#DFD7CB] rounded p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#9D8159] font-medium">
            Sustainable Luxury
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1918]">
            Responsible Beauty for Conscious Living
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            All wash basin water passes through custom micro-filtration to eliminate heavy metals and chlorine before touching your hair. 98% of all foil, hair clippings, and chemical residues are ethically diverted through certified circular recycling programs.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenBooking}
              className="px-8 py-3 bg-[#1A1918] hover:bg-[#362B28] text-[#FAF8F5] text-xs uppercase tracking-[0.15em] font-semibold rounded transition-colors"
            >
              Experience The Atelier
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
