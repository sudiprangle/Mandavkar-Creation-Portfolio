import React, { useState } from 'react';
import { Menu, ExternalLink } from 'lucide-react';
import { AdminUser, GalleryPhoto, CategoryItem, ContactEnquiry, WebsiteSettings } from '../../types';
import { AdminSidebar, AdminTab } from './AdminSidebar';
import { DashboardOverview } from './DashboardOverview';
import { ManageCategories } from './ManageCategories';
import { ManageGallery } from './ManageGallery';
import { UploadPhotos } from './UploadPhotos';
import { ClientEnquiries } from './ClientEnquiries';
import { WebsiteSettingsPanel } from './WebsiteSettingsPanel';
import { SupabaseSetupModal } from './SupabaseSetupModal';
import { getSupabase } from '../../services/store';

interface AdminDashboardProps {
  user: AdminUser;
  photos: GalleryPhoto[];
  categories: CategoryItem[];
  enquiries: ContactEnquiry[];
  settings: WebsiteSettings;
  onLogout: () => void;
  onViewPublicSite: () => void;
  onPhotosUpdated: (photos: GalleryPhoto[]) => void;
  onPhotoAdded: (photo: GalleryPhoto) => void;
  onCategoriesUpdated: (categories: CategoryItem[]) => void;
  onEnquiriesUpdated: (enquiries: ContactEnquiry[]) => void;
  onSettingsUpdated: (settings: WebsiteSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  photos,
  categories,
  enquiries,
  settings,
  onLogout,
  onViewPublicSite,
  onPhotosUpdated,
  onPhotoAdded,
  onCategoriesUpdated,
  onEnquiriesUpdated,
  onSettingsUpdated,
}) => {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [selectedGalleryCategoryFilter, setSelectedGalleryCategoryFilter] = useState('All');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);

  const isSupabaseConnected = Boolean(getSupabase());
  const unreadEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  const handleOpenEnquiryFromOverview = (enquiry: ContactEnquiry) => {
    setCurrentTab('client-enquiries');
  };

  const handleFilterCategoryInGallery = (categoryName: string) => {
    setSelectedGalleryCategoryFilter(categoryName);
    setCurrentTab('manage-gallery');
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 flex">
      {/* Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'manage-gallery') setSelectedGalleryCategoryFilter('All');
          setCurrentTab(tab);
        }}
        onLogout={onLogout}
        onViewPublicSite={onViewPublicSite}
        onOpenSupabaseSetup={() => setSupabaseModalOpen(true)}
        isSupabaseConnected={isSupabaseConnected}
        unreadEnquiriesCount={unreadEnquiriesCount}
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-zinc-800/80 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs uppercase font-mono tracking-wider text-zinc-400 hidden sm:inline">
              Mandavkar Creation / Studio Management
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Supabase status indicator */}
            <button
              onClick={() => setSupabaseModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSupabaseConnected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span>{isSupabaseConnected ? 'Supabase Live' : 'Local Storage Mode'}</span>
            </button>

            {/* Quick Visit Public Website */}
            <button
              onClick={onViewPublicSite}
              className="px-3 py-1.5 text-xs text-zinc-300 hover:text-amber-400 hover:bg-zinc-900 rounded border border-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Site</span>
            </button>

            {/* Admin identity pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800 text-xs">
              <div className="w-7 h-7 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold text-xs">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <span className="text-zinc-300 hidden md:inline truncate max-w-[140px] font-mono text-[11px]">
                {user.email}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Body Component */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <DashboardOverview
              photos={photos}
              categories={categories}
              enquiries={enquiries}
              settings={settings}
              onNavigateTab={setCurrentTab}
              onOpenEnquiry={handleOpenEnquiryFromOverview}
              onSettingsUpdated={onSettingsUpdated}
            />
          )}

          {currentTab === 'manage-categories' && (
            <ManageCategories
              categories={categories}
              photos={photos}
              onCategoriesUpdated={onCategoriesUpdated}
              onSelectCategoryFilter={handleFilterCategoryInGallery}
            />
          )}

          {currentTab === 'manage-gallery' && (
            <ManageGallery
              photos={photos}
              categories={categories}
              initialCategoryFilter={selectedGalleryCategoryFilter}
              onPhotosUpdated={onPhotosUpdated}
              onNavigateUpload={() => setCurrentTab('upload-photos')}
            />
          )}

          {currentTab === 'upload-photos' && (
            <UploadPhotos
              categories={categories}
              onPhotoAdded={onPhotoAdded}
              onViewGallery={onViewPublicSite}
            />
          )}

          {currentTab === 'client-enquiries' && (
            <ClientEnquiries
              enquiries={enquiries}
              onEnquiriesUpdated={onEnquiriesUpdated}
            />
          )}

          {currentTab === 'website-settings' && (
            <WebsiteSettingsPanel
              settings={settings}
              onSettingsUpdated={onSettingsUpdated}
              onViewPublicSite={onViewPublicSite}
            />
          )}
        </main>
      </div>

      {/* Supabase Setup Modal */}
      <SupabaseSetupModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
        onConfigUpdated={() => {}}
      />
    </div>
  );
};
