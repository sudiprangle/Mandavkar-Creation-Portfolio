import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';
import { GalleryPhoto } from '../../types';

interface LightboxProps {
  photo: GalleryPhoto | null;
  photos: GalleryPhoto[];
  onClose: () => void;
  onSelectPhoto: (photo: GalleryPhoto) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  photo,
  photos,
  onClose,
  onSelectPhoto,
}) => {
  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1;

  const handleNext = useCallback(() => {
    if (photos.length <= 1 || currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % photos.length;
    onSelectPhoto(photos[nextIndex]);
  }, [currentIndex, photos, onSelectPhoto]);

  const handlePrev = useCallback(() => {
    if (photos.length <= 1 || currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    onSelectPhoto(photos[prevIndex]);
  }, [currentIndex, photos, onSelectPhoto]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photo, onClose, handleNext, handlePrev]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-6 transition-all"
      onClick={onClose}
    >
      {/* Top Bar with counter & close button */}
      <div
        className="absolute top-3 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 flex items-center justify-between text-white z-20 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 bg-black/50 px-2.5 py-1 rounded-full border border-zinc-800">
          <span className="text-amber-400 font-semibold">{currentIndex + 1}</span>
          <span>/</span>
          <span>{photos.length}</span>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 text-zinc-300 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 rounded-full border border-zinc-800 transition-colors cursor-pointer"
          aria-label="Close fullscreen lightbox"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Navigation Arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-1 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full text-zinc-300 hover:text-white bg-black/70 hover:bg-zinc-800 border border-zinc-700/60 backdrop-blur-sm transition-all cursor-pointer"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-1 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full text-zinc-300 hover:text-white bg-black/70 hover:bg-zinc-800 border border-zinc-700/60 backdrop-blur-sm transition-all cursor-pointer"
            aria-label="Next photograph"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Main Image Frame */}
      <div
        className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center pointer-events-auto px-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-lg overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl flex items-center justify-center max-h-[62vh] sm:max-h-[72vh] w-full">
          <img
            src={photo.image_url}
            alt={photo.title}
            referrerPolicy="no-referrer"
            className="max-h-[62vh] sm:max-h-[72vh] w-auto max-w-full object-contain select-none"
          />
        </div>

        {/* Captions and Metadata Overlay */}
        <div className="w-full mt-3 sm:mt-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-zinc-300 px-1">
          <div className="min-w-0 max-w-full">
            <h3 className="font-serif-luxury text-lg sm:text-2xl text-white font-medium truncate">
              {photo.title}
            </h3>
            {photo.description && (
              <p className="text-xs text-zinc-400 mt-0.5 line-clamp-2 max-w-2xl leading-relaxed">
                {photo.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 text-xs text-zinc-400 shrink-0">
            <span className="flex items-center gap-1.5 text-amber-300/90 font-medium tracking-wider uppercase text-[11px]">
              <Tag className="w-3 h-3" />
              {photo.category}
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Calendar className="w-3 h-3" />
              {new Date(photo.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
