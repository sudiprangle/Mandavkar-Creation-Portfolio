import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/public/Navbar';
import { Hero } from './components/public/Hero';
import { Gallery } from './components/public/Gallery';
import { Contact } from './components/public/Contact';
import { Footer } from './components/public/Footer';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import {
  fetchPublishedPhotos,
  fetchAllPhotos,
  fetchCategories,
  fetchEnquiries,
  fetchWebsiteSettings,
  getAdminSession,
  adminLogout,
} from './services/store';
import { GalleryPhoto, CategoryItem, ContactEnquiry, WebsiteSettings, AdminUser } from './types';
import { INITIAL_SETTINGS } from './data/initialData';

export default function App() {
  // Navigation & View State
  const [isAdminView, setIsAdminView] = useState(() => {
    return (
      window.location.hash === '#admin' ||
      window.location.pathname.startsWith('/admin')
    );
  });
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => getAdminSession());
  const [activeSection, setActiveSection] = useState('home');

  // Core Data States
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const isHashAdmin = window.location.hash === '#admin';
      setIsAdminView(isHashAdmin);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch initial data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedSettings, fetchedPhotos, fetchedCategories, fetchedEnquiries] =
        await Promise.all([
          fetchWebsiteSettings(),
          fetchAllPhotos(),
          fetchCategories(),
          fetchEnquiries(),
        ]);

      setSettings(fetchedSettings);
      setPhotos(fetchedPhotos);
      setCategories(fetchedCategories);
      setEnquiries(fetchedEnquiries);
    } catch (err) {
      console.error('Error loading portfolio data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Section navigation helper
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (isAdminView) {
      setIsAdminView(false);
      window.location.hash = '';
    }
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleOpenAdmin = () => {
    setIsAdminView(true);
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPublicSite = () => {
    setIsAdminView(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    loadData();
  };

  const handleLogout = async () => {
    await adminLogout();
    setAdminUser(null);
  };

  // Callback handlers for Admin changes
  const handlePhotoAdded = (newPhoto: GalleryPhoto) => {
    setPhotos((prev) => [newPhoto, ...prev.filter((p) => p.id !== newPhoto.id)]);
  };

  const handlePhotosUpdated = (updatedPhotos: GalleryPhoto[]) => {
    setPhotos(updatedPhotos);
  };

  const handleCategoriesUpdated = (updatedCategories: CategoryItem[]) => {
    setCategories(updatedCategories);
  };

  const handleEnquiriesUpdated = (updatedEnquiries: ContactEnquiry[]) => {
    setEnquiries(updatedEnquiries);
  };

  const handleSettingsUpdated = (newSettings: WebsiteSettings) => {
    setSettings(newSettings);
  };

  // 1. ADMIN VIEW
  if (isAdminView) {
    if (!adminUser) {
      return (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onBackToSite={handleBackToPublicSite}
        />
      );
    }

    return (
      <AdminDashboard
        user={adminUser}
        photos={photos}
        categories={categories}
        enquiries={enquiries}
        settings={settings}
        onLogout={handleLogout}
        onViewPublicSite={handleBackToPublicSite}
        onPhotosUpdated={handlePhotosUpdated}
        onPhotoAdded={handlePhotoAdded}
        onCategoriesUpdated={handleCategoriesUpdated}
        onEnquiriesUpdated={handleEnquiriesUpdated}
        onSettingsUpdated={handleSettingsUpdated}
      />
    );
  }

  // 2. PUBLIC PORTFOLIO WEBSITE
  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 flex flex-col font-sans-clean selection:bg-amber-400 selection:text-black">
      {/* 3-Zone Top Bar Navbar */}
      <Navbar
        settings={settings}
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenAdmin={handleOpenAdmin}
      />

      <main className="flex-1">
        {/* Section 1: Home / Hero with admin-editable side photo */}
        <Hero
          settings={settings}
          onExploreWork={() => scrollToSection('gallery')}
          onContactClick={() => scrollToSection('contact')}
        />

        {/* Section 2: Category-First Gallery */}
        <Gallery photos={photos} categories={categories} isLoading={isLoading} />

        {/* Section 3: Contact Us */}
        <Contact
          settings={settings}
          onEnquirySubmitted={() => {
            fetchEnquiries().then(setEnquiries);
          }}
        />
      </main>

      {/* Clean Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={handleOpenAdmin}
        onNavigate={scrollToSection}
      />
    </div>
  );
}
