import React, { useState, useMemo } from 'react';
import { Sparkles, Filter, Maximize2 } from 'lucide-react';
import { useCms } from '../context/CmsContext';
import { LightboxModal } from '../components/ui/LightboxModal';

interface GalleryPageProps {
  onNavigate: (path: string) => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = () => {
  const { store } = useCms();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);

  const galleryItems = store.gallery;

  const filteredGallery = useMemo(() => {
    if (selectedFilter === 'all') return galleryItems;
    return galleryItems.filter(
      (item) =>
        item.category?.toLowerCase() === selectedFilter.toLowerCase() ||
        item.destinationId?.toLowerCase() === selectedFilter.toLowerCase()
    );
  }, [galleryItems, selectedFilter]);

  const categories = [
    { label: 'All Photos', value: 'all' },
    { label: 'Varanasi', value: 'varanasi' },
    { label: 'Lucknow', value: 'lucknow' },
    { label: 'Living Rooms', value: 'living' },
    { label: 'Bedrooms', value: 'bedroom' },
    { label: 'Kitchens', value: 'kitchen' },
  ];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE4DC] text-xs font-semibold tracking-widest uppercase text-[#735D43]">
            <Sparkles className="w-3.5 h-3.5 text-[#8C7355]" />
            <span>VISUAL PORTFOLIO</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1E2229]">
            ZoomStay Gallery
          </h1>
          <p className="text-sm sm:text-base text-[#555C66]">
            Explore real photographs of our apartments, king master bedrooms, modern kitchens, and scenic city vistas across Varanasi and Lucknow.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const isActive = selectedFilter === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedFilter(cat.value)}
                className={`px-5 py-2 rounded-xl text-xs font-semibold tracking-wider transition uppercase ${
                  isActive
                    ? 'bg-[#1E2229] text-white shadow-md'
                    : 'bg-white hover:bg-stone-100 text-[#4A4238] border border-[#EBE4DC]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Masonry / Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 bg-stone-100"
            >
              <img
                src={item.url}
                alt={item.alt || item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold">{item.title}</h4>
                    {item.alt && <p className="text-xs text-stone-300 mt-0.5">{item.alt}</p>}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      <LightboxModal
        isOpen={lightboxOpen}
        images={filteredGallery}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
