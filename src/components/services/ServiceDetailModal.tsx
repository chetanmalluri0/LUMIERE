import React from 'react';
import { Service } from '../../types/index.ts';
import { X, Clock, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface ServiceDetailModalProps {
  service: Service | null;
  onClose: () => void;
  onBook: (serviceId: string) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBook,
}) => {
  if (!service) return null;

  const inclusions: Record<string, string[]> = {
    Hair: [
      'Personal face-shape and silhouette consultation',
      'Botanical conditioning scalp massage and bath',
      'Artisanal thermal finish and styling direction',
      'At-home maintenance formulation guide',
    ],
    'Hair Care': [
      'Deep micro-steam cuticle opening ritual',
      'Plant keratin and marine amino acid infusion',
      'High-frequency scalp stimulation',
      'Restorative cold seal rinse for glass shine',
    ],
    Color: [
      'Custom color harmony and skin undertone test',
      'Bond-protecting pre-lightening formulation',
      'French gloss toner and neutralizing glaze',
      'Moisture locking treatment and editorial blow-out',
    ],
    Treatments: [
      'Comprehensive hair porosity analysis',
      'Formaldehyde-free smoothing nano-infusion',
      'Precision thermal sealing at 210°C',
      'Long-lasting humidity defensive barrier',
    ],
    Skincare: [
      'Dermatological skin texture assessment',
      'Enzymatic ultrasonic peel and pore clearing',
      'Bio-peptide serum galvanic iontophoresis',
      'Cryo-globe lymphatic drainage massage',
    ],
    Nails: [
      'Delicate cuticle grooming and organic balm',
      'Exfoliating Himalayan salt and honey scrub',
      'Restorative deep thermal hand wrap',
      'Long-wear high-luster polish application',
    ],
    'Bridal & Luxury': [
      'Pre-wedding preview consultation and trial notes',
      '24K gold active collagen pre-makeup canvas preparation',
      'Waterproof high-definition contour and eye sculpting',
      'Veil placement and complimentary touch-up bridal kit',
    ],
  };

  const featureList = inclusions[service.category] || inclusions['Hair'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1918]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF8F5] border border-[#EFEBE4] w-full max-w-2xl rounded shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        {/* Header */}
        <div className="relative h-64 overflow-hidden bg-[#1A1918]">
          <img
            src={service.imageUrl}
            alt={service.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1918] via-transparent to-black/30" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-[#1A1918]/60 hover:bg-[#1A1918] text-[#FAF8F5] p-2 rounded-full transition-colors backdrop-blur-sm"
            aria-label="Close service modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880] font-semibold">
              {service.category}
            </span>
            <h3 className="font-serif text-2xl md:text-3xl text-[#FAF8F5] font-normal leading-tight">
              {service.name}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#EFEBE4]">
            <div className="flex items-center gap-2 text-xs text-[#9D8159] font-medium">
              <Clock className="w-4 h-4" />
              <span>{service.durationMinutes} Minutes Session</span>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-stone-400 font-light">Investment</div>
              <div className="font-serif text-2xl font-normal text-[#1A1918]">
                ₹{service.price.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] font-semibold text-stone-700 mb-2">
              The Experience
            </h4>
            <p className="text-xs md:text-sm text-stone-600 font-light leading-relaxed">
              {service.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.15em] font-semibold text-stone-700 mb-3">
              Included in this Ritual
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {featureList.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-600 font-light">
                  <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[#F5F2EB] rounded border border-[#EFEBE4] flex items-center gap-3 text-xs text-stone-600">
            <ShieldCheck className="w-5 h-5 text-[#C5A880] shrink-0" />
            <p className="font-light">
              All rituals at LUMIÈRE use dermatologically-tested, cruelty-free European formulations and distilled botanical essences.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[#EFEBE4] bg-[#F5F2EB] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-wider text-stone-500 hover:text-[#1A1918] transition-colors"
          >
            Back to Services
          </button>
          <button
            onClick={() => {
              onClose();
              onBook(service.id);
            }}
            className="px-6 py-2.5 bg-[#1A1918] hover:bg-[#362B28] text-[#FAF8F5] text-xs uppercase tracking-[0.15em] font-semibold rounded transition-colors shadow-sm"
          >
            Reserve This Service
          </button>
        </div>
      </div>
    </div>
  );
};
