import React, { useState } from 'react';
import { X } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeImage, setActiveImage] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'gal-01',
      title: 'Architectural Styling Pavilion',
      category: 'Atelier',
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'gal-02',
      title: 'Dimensional French Balayage',
      category: 'Color',
      imageUrl: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'gal-03',
      title: 'Editorial Runway Styling',
      category: 'Hair',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'gal-04',
      title: 'Hydra-Infusion Facial Therapy',
      category: 'Skincare',
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'gal-05',
      title: 'Haute Bridal Sculpting & Glow',
      category: 'Bridal',
      imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'gal-06',
      title: 'Minimalist Manicure & Nail Art',
      category: 'Nails',
      imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'gal-07',
      title: 'Keratin Glass-Shine Reflection',
      category: 'Hair',
      imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'gal-08',
      title: 'Atelier Botanical Consultation Lounge',
      category: 'Atelier',
      imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 'gal-09',
      title: 'Aromatic Spa Therapy Ritual',
      category: 'Skincare',
      imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f02e6a0d4c8?auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const categories = ['All', 'Atelier', 'Hair', 'Color', 'Skincare', 'Bridal', 'Nails'];

  const filtered =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#9D8159] font-medium">
          Editorial Portfolio
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1A1918] font-light">
          Atelier Visual Archive
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
          A glimpse into the architectural serenity of our spaces and the bespoke transformations curated by our specialists.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center flex-wrap gap-2 pt-2 border-b border-[#EFEBE4] pb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium rounded transition-all whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-[#1A1918] text-[#FAF8F5] shadow-sm'
                : 'text-stone-600 hover:text-[#1A1918] hover:bg-[#F5F2EB]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveImage(item)}
            className="group cursor-pointer bg-white border border-[#EFEBE4] rounded overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="relative h-72 overflow-hidden bg-stone-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg text-white font-normal">{item.title}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 bg-[#1A1918]/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#1A1918] rounded overflow-hidden border border-[#362B28] shadow-2xl animate-scale-up"
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/40 p-2 rounded-full z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeImage.imageUrl}
              alt={activeImage.title}
              referrerPolicy="no-referrer"
              className="w-full max-h-[75vh] object-contain bg-black"
            />
            <div className="p-6 bg-[#23211F] border-t border-[#362B28] flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A880] font-semibold">
                  {activeImage.category}
                </span>
                <h3 className="font-serif text-xl text-[#FAF8F5]">{activeImage.title}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
