import React from 'react';
import { Clock, Check, Sparkles } from 'lucide-react';

interface PricingPageProps {
  onOpenBooking: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onOpenBooking }) => {
  const serviceTiers = [
    {
      category: 'Hair Design & Cut',
      items: [
        { name: 'Precision Haircut & Sculpting', price: '₹799', duration: '45 mins', desc: 'Bespoke consultation, scalp massage, custom line cut, and blow-dry.' },
        { name: 'Artisanal Blow-dry & Styling', price: '₹999', duration: '45 mins', desc: 'Thermal wave, glass sleek, or dimensional editorial styling.' },
        { name: 'Botanical Hair Spa Ritual', price: '₹1,499', duration: '60 mins', desc: 'Micro-steam peptide infusion with botanical argan conditioning.' },
      ],
    },
    {
      category: 'Color Chemistry & Smoothing',
      items: [
        { name: 'Couture Hair Coloring (Balayage / Global)', price: '₹2,999+', duration: '120 mins', desc: 'Custom tone balancing, bond protection, and gloss glaze.' },
        { name: 'Keratin Complex Infusion Treatment', price: '₹3,999+', duration: '150 mins', desc: 'Nano-smoothing glass shine seal lasting up to 16 weeks.' },
      ],
    },
    {
      category: 'Dermal & Skin Therapy',
      items: [
        { name: 'Signature Rejuvenating Facial', price: '₹1,499', duration: '60 mins', desc: 'Multi-acid peel, lymphatic drainage, and cryo-globe finish.' },
        { name: 'Clarifying Deep Pore Cleanup', price: '₹799', duration: '30 mins', desc: 'Ultrasonic extraction, purifying clay, and hyaluronic hydration.' },
      ],
    },
    {
      category: 'Hand & Foot Care',
      items: [
        { name: 'Deluxe Restorative Manicure', price: '₹699', duration: '40 mins', desc: 'Botanical scrub, cuticle detailing, and high-shine gel polish.' },
        { name: 'Aromatic Mineral Pedicure', price: '₹899', duration: '50 mins', desc: 'Dead Sea salt soak, callous refinement, and deep foot massage.' },
      ],
    },
    {
      category: 'Haute Bridal & Red Carpet',
      items: [
        { name: 'High-Definition Bridal Artistry', price: '₹7,999+', duration: '180 mins', desc: 'Airbrush HD foundation, eye sculpting, 24K gold prep, veil draping.' },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#9D8159] font-medium">
          Transparent Rates
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1918] font-light">
          Investment in Yourself
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
          Honest pricing with no hidden surcharges. All prices include our signature consultation, beverage service, and post-treatment maintenance guidance.
        </p>
      </div>

      {/* Pricing Sections */}
      <div className="space-y-12">
        {serviceTiers.map((tier, idx) => (
          <div key={idx} className="bg-white border border-[#EFEBE4] rounded p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#EFEBE4] pb-3 flex justify-between items-center">
              <h2 className="font-serif text-2xl text-[#1A1918]">{tier.category}</h2>
              <span className="text-xs uppercase tracking-wider text-[#9D8159] font-medium">
                Atelier Tariff
              </span>
            </div>

            <div className="divide-y divide-[#EFEBE4]">
              {tier.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-serif text-lg text-[#1A1918]">{item.name}</h3>
                      <span className="text-xs text-stone-400 font-light">({item.duration})</span>
                    </div>
                    <p className="text-xs text-stone-500 font-light max-w-xl">{item.desc}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                    <span className="font-serif text-xl font-normal text-[#1A1918] tabular-nums">
                      {item.price}
                    </span>
                    <button
                      onClick={onOpenBooking}
                      className="px-4 py-2 bg-[#1A1918] hover:bg-[#362B28] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded transition-colors"
                    >
                      Book
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bridal Tiers Card */}
      <div className="bg-[#1A1918] text-[#FAF8F5] rounded p-8 sm:p-12 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] font-medium">
            Exclusive Packages
          </span>
          <h3 className="font-serif text-3xl text-[#FAF8F5]">Couture Bridal Packages</h3>
          <p className="text-xs text-stone-400 font-light leading-relaxed">
            Curated 3-month and 6-month pre-wedding beauty regimes covering cellular skin brightening, keratin glossing, trial styling, and wedding day dressing.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="https://wa.me/919876543210?text=Hello%20LUMIÈRE,%20I%20would%20like%20to%20receive%20the%20Bridal%20Lookbook%20and%20Tariff."
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-[#C5A880] hover:bg-[#b39366] text-[#1A1918] text-xs uppercase tracking-[0.18em] font-bold rounded transition-colors text-center"
          >
            Inquire Bridal Dossier
          </a>
          <button
            onClick={onOpenBooking}
            className="px-8 py-3.5 bg-transparent border border-[#DFD7CB] hover:bg-white/10 text-[#FAF8F5] text-xs uppercase tracking-[0.18em] font-medium rounded transition-colors"
          >
            Schedule Consultation
          </button>
        </div>
      </div>
    </div>
  );
};
