import React, { useState } from 'react';
import {
  Images,
  Eye,
  FileEdit,
  Mail,
  UploadCloud,
  ArrowRight,
  Clock,
  Layers,
  Edit3,
  Camera,
  CheckCircle2,
} from 'lucide-react';
import { GalleryPhoto, CategoryItem, ContactEnquiry, WebsiteSettings } from '../../types';
import { AdminTab } from './AdminSidebar';
import { uploadImageFile, updateWebsiteSettings } from '../../services/store';

interface DashboardOverviewProps {
  photos: GalleryPhoto[];
  categories: CategoryItem[];
  enquiries: ContactEnquiry[];
  settings: WebsiteSettings;
  onNavigateTab: (tab: AdminTab) => void;
  onOpenEnquiry: (enquiry: ContactEnquiry) => void;
  onSettingsUpdated: (settings: WebsiteSettings) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  photos,
  categories,
  enquiries,
  settings,
  onNavigateTab,
  onOpenEnquiry,
  onSettingsUpdated,
}) => {
  const [editingHero, setEditingHero] = useState(false);
  const [heroImageInput, setHeroImageInput] = useState(settings.hero_image_url || '');
  const [heroBadgeInput, setHeroBadgeInput] = useState(settings.hero_badge_label || '');
  const [heroSubtitleInput, setHeroSubtitleInput] = useState(settings.hero_subtitle || '');
  const [isSavingHero, setIsSavingHero] = useState(false);
  const [heroSavedMsg, setHeroSavedMsg] = useState(false);

  const totalPhotos = photos.length;
  const publishedPhotos = photos.filter((p) => p.is_published).length;
  const draftPhotos = photos.filter((p) => !p.is_published).length;
  const totalEnquiries = enquiries.length;
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  const recentPhotos = photos.slice(0, 4);
  const recentEnquiries = enquiries.slice(0, 5);

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImageFile(file);
      setHeroImageInput(url);
    } catch (err) {
      console.error('Failed to upload hero image:', err);
    }
  };

  const handleSaveHeroSidePhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHero(true);
    try {
      const updated = await updateWebsiteSettings({
        hero_image_url: heroImageInput.trim(),
        hero_badge_label: heroBadgeInput.trim(),
        hero_subtitle: heroSubtitleInput.trim(),
      });
      onSettingsUpdated(updated);
      setHeroSavedMsg(true);
      setTimeout(() => {
        setHeroSavedMsg(false);
        setEditingHero(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingHero(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="font-serif-luxury text-3xl text-white font-normal uppercase tracking-wide">
            Studio Dashboard
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time management for Mandavkar Creation portfolio, categories, and client bookings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setEditingHero(!editingHero)}
            className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>Edit Home Hero Photo</span>
          </button>

          <button
            onClick={() => onNavigateTab('upload-photos')}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Photos</span>
          </button>
        </div>
      </div>

      {/* Hero Photo Direct Inline Editor (when toggled) */}
      {editingHero && (
        <div className="p-6 rounded-xl bg-[#0f0f13] border border-amber-500/40 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-amber-400">
              <Edit3 className="w-4 h-4" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                Customize Home Page Side Photo & Frame
              </h3>
            </div>
            <button
              onClick={() => setEditingHero(false)}
              className="text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSaveHeroSidePhoto} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Image Preview */}
              <div className="md:col-span-4">
                <div className="aspect-[4/3] rounded-lg overflow-hidden border border-zinc-700 bg-black relative">
                  <img
                    src={heroImageInput}
                    alt="Home Side Photo Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm text-[10px] text-zinc-300 font-mono truncate">
                    {heroBadgeInput || 'Signature Series'}
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="md:col-span-8 space-y-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Side Photo URL
                  </label>
                  <input
                    type="url"
                    required
                    value={heroImageInput}
                    onChange={(e) => setHeroImageInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400 mb-2"
                  />

                  <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded cursor-pointer transition-colors">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload New Photo from Device</span>
                    <input type="file" accept="image/*" onChange={handleHeroFileUpload} className="hidden" />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Kicker Label
                    </label>
                    <input
                      type="text"
                      value={heroBadgeInput}
                      onChange={(e) => setHeroBadgeInput(e.target.value)}
                      placeholder="e.g. Signature Wedding Series"
                      className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Subtitle / Frame Tag
                    </label>
                    <input
                      type="text"
                      value={heroSubtitleInput}
                      onChange={(e) => setHeroSubtitleInput(e.target.value)}
                      placeholder="e.g. The Royal Heritage Union"
                      className="w-full px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  {heroSavedMsg && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Saved to Home Page!
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={isSavingHero}
                    className="px-4 py-2 bg-amber-400 text-black text-xs font-semibold uppercase tracking-wider rounded hover:bg-amber-300 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSavingHero ? 'Saving...' : 'Apply to Home Page'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* 5 Essential Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Photos */}
        <div className="p-5 rounded-xl bg-[#0f0f12] border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Total Photos</span>
            <Images className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-3xl font-bold text-white tabular-nums">
            {totalPhotos}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">All catalogued media</p>
        </div>

        {/* Categories */}
        <div
          onClick={() => onNavigateTab('manage-categories')}
          className="p-5 rounded-xl bg-[#0f0f12] border border-zinc-800/80 hover:border-amber-400/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider group-hover:text-amber-400 transition-colors">
              Categories
            </span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-mono text-3xl font-bold text-amber-300 tabular-nums">
            {categories.length}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Manage & add collections →</p>
        </div>

        {/* Published Photos */}
        <div className="p-5 rounded-xl bg-[#0f0f12] border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Published</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-3xl font-bold text-emerald-400 tabular-nums">
            {publishedPhotos}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Live in public gallery</p>
        </div>

        {/* Draft Photos */}
        <div className="p-5 rounded-xl bg-[#0f0f12] border border-zinc-800/80">
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider">Drafts</span>
            <FileEdit className="w-4 h-4 text-amber-400/70" />
          </div>
          <div className="font-mono text-3xl font-bold text-amber-300/90 tabular-nums">
            {draftPhotos}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Unpublished media</p>
        </div>

        {/* Client Enquiries */}
        <div
          onClick={() => onNavigateTab('client-enquiries')}
          className="p-5 rounded-xl bg-[#0f0f12] border border-zinc-800/80 hover:border-sky-400/40 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-zinc-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider group-hover:text-sky-300 transition-colors">
              Enquiries
            </span>
            <Mail className="w-4 h-4 text-sky-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold text-white tabular-nums">
              {totalEnquiries}
            </span>
            {newEnquiriesCount > 0 && (
              <span className="text-xs font-mono text-amber-400 font-semibold">
                ({newEnquiriesCount} new)
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1">Booking inquiries →</p>
        </div>
      </div>

      {/* Two-Column Split: Recent Uploads & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Uploads */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h2 className="font-serif-luxury text-xl text-white font-medium">Recent Uploads</h2>
            <button
              onClick={() => onNavigateTab('manage-gallery')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer uppercase tracking-wider"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentPhotos.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">No photos uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {recentPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => onNavigateTab('manage-gallery')}
                  className="group relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 aspect-[4/5] cursor-pointer"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <p className="text-[11px] font-medium truncate">{photo.title}</p>
                    <div className="flex items-center gap-1.5 text-[9px] text-zinc-400">
                      <span>{photo.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className={photo.is_published ? 'text-emerald-400' : 'text-amber-400'}>
                        {photo.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Client Enquiries */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h2 className="font-serif-luxury text-xl text-white font-medium">Recent Enquiries</h2>
            <button
              onClick={() => onNavigateTab('client-enquiries')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer uppercase tracking-wider"
            >
              <span>Manage Enquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentEnquiries.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">No enquiries received yet.</p>
          ) : (
            <div className="space-y-2.5">
              {recentEnquiries.map((enquiry) => (
                <div
                  key={enquiry.id}
                  onClick={() => onOpenEnquiry(enquiry)}
                  className="p-3.5 rounded-lg bg-[#0e0e11] border border-zinc-800/80 hover:border-zinc-700 transition-colors flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-white truncate">{enquiry.name}</h4>
                      <span
                        className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          enquiry.status === 'new'
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800/50'
                            : enquiry.status === 'contacted'
                            ? 'bg-blue-950/60 text-blue-400 border border-blue-800/50'
                            : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate mt-1">{enquiry.message}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(enquiry.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400 block mt-0.5 font-mono">
                      {enquiry.phone}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
