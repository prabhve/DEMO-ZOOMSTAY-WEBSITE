import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  images?: Array<{ url: string; title?: string; alt?: string }>;
  initialIndex?: number;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  images = [],
  initialIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const imageList = Array.isArray(images) ? images : [];

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex, imageList.length]);

  if (!isOpen || imageList.length === 0) return null;

  const safeIndex = Math.min(Math.max(0, currentIndex), imageList.length - 1);
  const currentImage = imageList[safeIndex] || imageList[0];

  const handleNext = () => {
    setIsZoomed(false);
    if (imageList.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % imageList.length);
  };

  const handlePrev = () => {
    setIsZoomed(false);
    if (imageList.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      {/* Top Bar Controls */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between p-4 md:p-6 text-white z-20 bg-gradient-to-b from-black/70 to-transparent">
        <div className="text-sm font-medium tracking-wider text-stone-300">
          <span className="text-white font-semibold">{currentIndex + 1}</span> / {images.length}
          {currentImage.title && <span className="ml-3 pl-3 border-l border-white/20 text-white">{currentImage.title}</span>}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            title={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            title="Close viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition backdrop-blur-sm"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Main Image Container */}
      <div
        className="relative max-w-6xl max-h-[85vh] w-full h-full flex items-center justify-center p-4 cursor-pointer"
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <img
          src={currentImage.url}
          alt={currentImage.alt || currentImage.title || 'ZoomStay photograph'}
          className={`max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-transform duration-300 select-none ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
        />
      </div>

      {/* Bottom Caption */}
      {currentImage.alt && (
        <div className="absolute bottom-4 inset-x-0 text-center text-xs md:text-sm text-stone-300 px-4 pointer-events-none">
          {currentImage.alt}
        </div>
      )}
    </div>
  );
};
