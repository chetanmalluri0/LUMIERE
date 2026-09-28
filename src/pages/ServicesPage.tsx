import React, { useState, useEffect } from 'react';
import { Service } from '../types/index.ts';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';

interface ServicesPageProps {
  onOpenBooking: (serviceId?: string) => void;
  onSelectService: (service: Service) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onOpenBooking,
  onSelectService,
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  const categories = [
    'All',
    'Hair',
    'Hair Care',
    'Color',
    'Treatments',
    'Skincare',
    'Nails',
    'Bridal & Luxury',
  ];

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => setServices(data.services || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    selectedCategory === 'All'
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#9D8159] font-medium">
          The Treatment Collection
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1918] font-light">
          Bespoke Atelier Services
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
          Every ritual is preceded by an in-depth sensory consultation to analyze your scalp porosity, bone architecture, or dermal hydration levels.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 pt-2 border-b border-[#EFEBE4] pb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium rounded transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#1A1918] text-[#FAF8F5] shadow-sm'
                : 'text-stone-600 hover:text-[#1A1918] hover:bg-[#F5F2EB]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-24 text-center text-xs text-stone-400 font-light">
          Loading treatment menu...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-24 text-center text-xs text-stone-400">
          No services in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-[#EFEBE4] rounded overflow-hidden flex flex-col group hover:shadow-lg hover:border-[#DFD7CB] transition-all"
            >
              <div className="relative h-60 overflow-hidden bg-stone-100">
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-3 left-3 bg-[#FAF8F5]/90 backdrop-blur-sm px-2.5 py-1 text-[10px] uppercase tracking-wider text-stone-700 font-medium rounded">
                  {service.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-serif text-2xl text-[#1A1918] font-normal leading-snug">
                      {service.name}
                    </h3>
                    <span className="text-base font-semibold tabular-nums text-[#1A1918]">
                      ₹{service.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 font-light leading-relaxed line-clamp-3">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EFEBE4] flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#9D8159] font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.durationMinutes} Minutes</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onSelectService(service)}
                      className="text-xs uppercase tracking-wider text-stone-500 hover:text-[#1A1918] transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => onOpenBooking(service.id)}
                      className="px-4 py-2 bg-[#1A1918] hover:bg-[#362B28] text-[#FAF8F5] text-xs uppercase tracking-wider font-semibold rounded transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Consultation note banner */}
      <div className="bg-[#F5F2EB] border border-[#DFD7CB] rounded p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-serif text-xl text-[#1A1918]">Unsure which treatment suits you?</h4>
          <p className="text-xs text-stone-600 font-light">
            Connect directly with our senior concierge over WhatsApp for customized advice and package pricing.
          </p>
        </div>
        <a
          href="https://wa.me/919876543210?text=Hello%20LUMIÈRE,%20I%20would%20like%20guidance%20on%20which%20service%20to%20select."
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap px-6 py-2.5 bg-[#C5A880] hover:bg-[#b39366] text-[#1A1918] text-xs uppercase tracking-[0.15em] font-semibold rounded transition-colors"
        >
          Consult Specialist
        </a>
      </div>
    </div>
  );
};
