import React, { useState, useMemo } from 'react';
import {
  Layers,
  ArrowLeft,
  Camera,
  Maximize2,
  FolderOpen,
  Image as ImageIcon,
} from 'lucide-react';
import { GalleryPhoto, CategoryItem } from '../../types';
import { Lightbox } from './Lightbox';

interface GalleryProps {
  photos: GalleryPhoto[];
  categories: CategoryItem[];
  isLoading?: boolean;
}

export const Gallery: React.FC<GalleryProps> = ({ photos, categories, isLoading = false }) => {
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [viewMode, setViewMode] = useState<'categories' | 'all'>('categories');
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({});

  const publishedPhotos = useMemo(() => {
    return photos.filter((p) => p.is_published);
  }, [photos]);

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    publishedPhotos.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [publishedPhotos]);

  const activeCategoryPhotos = useMemo(() => {
    if (!selectedCategoryName) return [];
    return publishedPhotos.filter((p) => p.category === selectedCategoryName);
  }, [publishedPhotos, selectedCategoryName]);

  const activeCategoryObj = useMemo(() => {
    if (!selectedCategoryName) return null;
    return categories.find((c) => c.name === selectedCategoryName) || null;
  }, [categories, selectedCategoryName]);

  const handleImageError = (id: string) => {
    setFailedImageIds((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="gallery" className="py-14 sm:py-20 relative bg-[#060607]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= VIEW 1: Specific Category Gallery ================= */}
        {selectedCategoryName ? (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            {/* Category Header with Back Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div>
                <button
                  onClick={() => setSelectedCategoryName(null)}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-400 hover:text-amber-300 font-medium mb-3 cursor-pointer group py-1"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  <span>Back to Collections</span>
                </button>

                <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-white font-normal uppercase tracking-tight">
                  {selectedCategoryName}
                </h2>
                {activeCategoryObj?.description && (
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl font-light">
                    {activeCategoryObj.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 self-start sm:self-auto">
                <span className="text-amber-400 font-semibold tabular-nums">
                  {activeCategoryPhotos.length}
                </span>
                <span>Photographs</span>
              </div>
            </div>

            {/* Photos in this category */}
            {activeCategoryPhotos.length === 0 ? (
              <div className="text-center py-16 sm:py-20 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/40 px-4">
                <Camera className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                <h3 className="font-serif-luxury text-lg sm:text-xl text-white">No photographs in this collection yet</h3>
                <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                  The studio administrator can upload photos to the "{selectedCategoryName}" category from the Admin Dashboard.
                </p>
                <button
                  onClick={() => setSelectedCategoryName(null)}
                  className="mt-4 px-4 py-2 text-xs uppercase tracking-wider text-amber-400 border border-amber-400/40 rounded hover:bg-amber-400/10 transition-colors cursor-pointer"
                >
                  View Other Collections
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {activeCategoryPhotos.map((photo, index) => {
                  const hasError = failedImageIds[photo.id];
                  const isLead = index === 0 && activeCategoryPhotos.length > 2;

                  return (
                    <div
                      key={photo.id}
                      onClick={() => setSelectedPhoto(photo)}
                      className={`group relative rounded-lg overflow-hidden border border-zinc-800/80 bg-zinc-950 transition-all duration-300 hover:border-amber-400/50 hover:shadow-2xl cursor-pointer ${
                        isLead ? 'sm:col-span-2 aspect-[4/3] sm:aspect-[16/10]' : 'aspect-[4/5]'
                      }`}
                    >
                      {!hasError ? (
                        <img
                          src={photo.image_url}
                          alt={photo.title}
                          referrerPolicy="no-referrer"
                          onError={() => handleImageError(photo.id)}
                          className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/80 p-6 text-center">
                          <Camera className="w-8 h-8 text-amber-400/70 mb-2" />
                          <p className="font-serif-luxury text-base sm:text-lg text-white font-medium">{photo.title}</p>
                        </div>
                      )}

                      {/* Scrim Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                      {/* Quick Expand Icon */}
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-black/60 text-zinc-300 group-hover:text-amber-300 group-hover:bg-black/90 backdrop-blur-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-4 h-4" />
                      </div>

                      {/* Photo Title and Metadata */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 transform translate-y-0 transition-transform">
                        <div className="text-[10px] tracking-wider uppercase text-amber-400/90 font-mono mb-1">
                          {new Date(photo.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                          })}
                        </div>
                        <h3 className="font-serif-luxury text-base sm:text-xl text-white font-medium tracking-wide">
                          {photo.title}
                        </h3>
                        {photo.description && (
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 font-light leading-relaxed">
                            {photo.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ================= VIEW 2: Category Albums Collection ================= */
          <div className="space-y-8 sm:space-y-10">
            {/* Header with Responsive Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-zinc-800/80 pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-400 font-medium mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Portfolio Collections</span>
                </div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-white font-normal uppercase tracking-tight">
                  Explore by Category
                </h2>
                <p className="text-xs text-zinc-400 mt-1 font-light">
                  Click on any category album to view its curated photography gallery.
                </p>
              </div>

              {/* View Switcher: Responsive on mobile */}
              <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-800 w-full sm:w-auto">
                <button
                  onClick={() => setViewMode('categories')}
                  className={`flex-1 sm:flex-none px-3.5 py-2 text-xs uppercase tracking-wider font-medium rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    viewMode === 'categories'
                      ? 'bg-amber-400 text-black font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Categories</span>
                </button>
                <button
                  onClick={() => setViewMode('all')}
                  className={`flex-1 sm:flex-none px-3.5 py-2 text-xs uppercase tracking-wider font-medium rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                    viewMode === 'all'
                      ? 'bg-amber-400 text-black font-semibold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>All ({publishedPhotos.length})</span>
                </button>
              </div>
            </div>

            {/* Categories Album Cards Grid */}
            {viewMode === 'categories' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                {categories.map((category) => {
                  const count = categoryStats[category.name] || 0;
                  const categoryPhoto = publishedPhotos.find((p) => p.category === category.name);
                  const coverImage = category.cover_image || categoryPhoto?.image_url;

                  return (
                    <div
                      key={category.id}
                      onClick={() => setSelectedCategoryName(category.name)}
                      className="group relative rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950 aspect-[4/3] cursor-pointer transition-all duration-300 hover:border-amber-400/50 hover:shadow-2xl"
                    >
                      {coverImage ? (
                        <img
                          src={coverImage}
                          alt={category.name}
                          className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                          <Camera className="w-10 h-10 text-zinc-700" />
                        </div>
                      )}

                      {/* Scrim Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity" />

                      {/* Photo Count Badge */}
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-zinc-700/60 text-[10px] font-mono text-amber-300 uppercase tracking-wider">
                        {count} Photos
                      </div>

                      {/* Category Title & Description */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 transform translate-y-0 transition-transform">
                        <h3 className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl text-white font-medium tracking-wide uppercase group-hover:text-amber-300 transition-colors">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-xs text-zinc-400 mt-1 font-light line-clamp-2">
                            {category.description}
                          </p>
                        )}
                        <span className="inline-block mt-2.5 text-[11px] font-semibold uppercase tracking-widest text-amber-400 group-hover:underline">
                          View Gallery →
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* All Photos Grid */}
            {viewMode === 'all' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {publishedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className="group relative rounded-lg overflow-hidden border border-zinc-800/80 bg-zinc-950 aspect-[4/5] cursor-pointer hover:border-amber-400/50 transition-all duration-300 hover:shadow-2xl"
                  >
                    <img
                      src={photo.image_url}
                      alt={photo.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block mb-1">
                        {photo.category}
                      </span>
                      <h4 className="font-serif-luxury text-base sm:text-lg text-white font-medium">{photo.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        photo={selectedPhoto}
        photos={selectedCategoryName ? activeCategoryPhotos : publishedPhotos}
        onClose={() => setSelectedPhoto(null)}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
      />
    </section>
  );
};
