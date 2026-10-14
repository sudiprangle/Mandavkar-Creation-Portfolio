import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GalleryPhoto, CategoryItem, ContactEnquiry, WebsiteSettings, AdminUser } from '../types';
import { INITIAL_PHOTOS, INITIAL_CATEGORIES, INITIAL_ENQUIRIES, INITIAL_SETTINGS } from '../data/initialData';

const STORAGE_KEYS = {
  PHOTOS: 'mandavkar_photos_v1',
  CATEGORIES: 'mandavkar_categories_v1',
  ENQUIRIES: 'mandavkar_enquiries_v1',
  SETTINGS: 'mandavkar_settings_v1',
  ADMIN_SESSION: 'mandavkar_admin_session_v1',
  SUPABASE_CONFIG: 'mandavkar_supabase_config_v1',
};

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export function getStoredSupabaseConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPABASE_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.url && parsed.anonKey) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  return {
    url: envUrl && !envUrl.includes('your-project-id') ? envUrl : 'https://wmnmvpxwzrjfrzexpxsn.supabase.co',
    anonKey: envKey && !envKey.includes('your-anon-key') ? envKey : 'sb_publishable_C6azA_MJrAiCX-IFeq3uIA_aY4fJBug',
  };
}

export function saveStoredSupabaseConfig(config: SupabaseConfig) {
  localStorage.setItem(STORAGE_KEYS.SUPABASE_CONFIG, JSON.stringify(config));
  initSupabaseClient();
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  return initSupabaseClient();
}

export function initSupabaseClient(): SupabaseClient | null {
  const config = getStoredSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
      return supabaseInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      supabaseInstance = null;
    }
  } else {
    supabaseInstance = null;
  }
  return null;
}

// ================= Local Storage Fallback Helpers =================

function getLocalCategories(): CategoryItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  return INITIAL_CATEGORIES;
}

function saveLocalCategories(categories: CategoryItem[]) {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

function getLocalPhotos(): GalleryPhoto[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.PHOTOS);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(INITIAL_PHOTOS));
  return INITIAL_PHOTOS;
}

function saveLocalPhotos(photos: GalleryPhoto[]) {
  localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
}

function getLocalEnquiries(): ContactEnquiry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(INITIAL_ENQUIRIES));
  return INITIAL_ENQUIRIES;
}

function saveLocalEnquiries(enquiries: ContactEnquiry[]) {
  localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
}

export function getLocalSettings(): WebsiteSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
  return INITIAL_SETTINGS;
}

export function saveLocalSettings(settings: WebsiteSettings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// ================= API Operations: Categories =================

export async function fetchCategories(): Promise<CategoryItem[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('gallery_categories')
        .select('*')
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as CategoryItem[];
      }
    } catch (e) {
      console.warn('Supabase fetch categories fallback:', e);
    }
  }
  return getLocalCategories();
}

export async function addCategory(category: Omit<CategoryItem, 'id' | 'created_at'>): Promise<CategoryItem> {
  const slug = category.slug || category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const newCat: CategoryItem = {
    ...category,
    id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    slug,
    created_at: new Date().toISOString(),
  };

  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('gallery_categories')
        .insert([newCat])
        .select()
        .single();
      if (!error && data) return data as CategoryItem;
    } catch (e) {
      console.warn('Supabase insert category fallback:', e);
    }
  }

  const current = getLocalCategories();
  const updated = [...current, newCat];
  saveLocalCategories(updated);
  return newCat;
}

export async function updateCategory(id: string, updates: Partial<CategoryItem>): Promise<CategoryItem> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('gallery_categories')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (!error && data) return data as CategoryItem;
    } catch (e) {
      console.warn('Supabase update category fallback:', e);
    }
  }

  const current = getLocalCategories();
  const index = current.findIndex((c) => c.id === id);
  if (index === -1) throw new Error('Category not found');

  const oldName = current[index].name;
  const updatedCat = { ...current[index], ...updates, updated_at: new Date().toISOString() };
  current[index] = updatedCat;
  saveLocalCategories(current);

  // If category name changed, update existing photos using that category name
  if (updates.name && updates.name !== oldName) {
    const photos = getLocalPhotos();
    const updatedPhotos = photos.map((p) =>
      p.category === oldName ? { ...p, category: updates.name! } : p
    );
    saveLocalPhotos(updatedPhotos);
  }

  return updatedCat;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { error } = await sb.from('gallery_categories').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase delete category fallback:', e);
    }
  }

  const current = getLocalCategories();
  const target = current.find((c) => c.id === id);
  const filtered = current.filter((c) => c.id !== id);
  saveLocalCategories(filtered);

  // Keep photos safe: reassign to 'General' or first remaining category
  if (target) {
    const fallbackCategory = filtered.length > 0 ? filtered[0].name : 'General';
    const photos = getLocalPhotos();
    const updatedPhotos = photos.map((p) =>
      p.category === target.name ? { ...p, category: fallbackCategory } : p
    );
    saveLocalPhotos(updatedPhotos);
  }

  return true;
}

// ================= API Operations: Photos =================

export async function fetchPublishedPhotos(): Promise<GalleryPhoto[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('gallery_photos')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as GalleryPhoto[];
      }
    } catch (e) {
      console.warn('Supabase fetch published photos fallback:', e);
    }
  }
  return getLocalPhotos().filter((p) => p.is_published);
}

export async function fetchAllPhotos(): Promise<GalleryPhoto[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('gallery_photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as GalleryPhoto[];
      }
    } catch (e) {
      console.warn('Supabase fetch all photos fallback:', e);
    }
  }
  return getLocalPhotos();
}

export async function addPhoto(photo: Omit<GalleryPhoto, 'id' | 'created_at'>): Promise<GalleryPhoto> {
  const newPhoto: GalleryPhoto = {
    ...photo,
    id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    created_at: new Date().toISOString(),
  };

  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('gallery_photos')
        .insert([
          {
            title: photo.title,
            description: photo.description || '',
            category: photo.category || 'Weddings',
            image_url: photo.image_url,
            storage_path: photo.storage_path || null,
            is_published: photo.is_published,
            featured: photo.featured || false,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        return data as GalleryPhoto;
      }
    } catch (e) {
      console.warn('Supabase insert photo fallback:', e);
    }
  }

  const current = getLocalPhotos();
  const updated = [newPhoto, ...current];
  saveLocalPhotos(updated);
  return newPhoto;
}

export async function updatePhoto(id: string, updates: Partial<GalleryPhoto>): Promise<GalleryPhoto> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('gallery_photos')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as GalleryPhoto;
      }
    } catch (e) {
      console.warn('Supabase update photo fallback:', e);
    }
  }

  const current = getLocalPhotos();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Photo not found');

  const updatedItem = {
    ...current[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  current[index] = updatedItem;
  saveLocalPhotos(current);
  return updatedItem;
}

export async function deletePhoto(id: string, storagePath?: string): Promise<boolean> {
  const sb = getSupabase();
  if (sb) {
    try {
      if (storagePath) {
        await sb.storage.from('gallery-images').remove([storagePath]);
      }
      const { error } = await sb.from('gallery_photos').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase delete photo fallback:', e);
    }
  }

  const current = getLocalPhotos();
  const filtered = current.filter((p) => p.id !== id);
  saveLocalPhotos(filtered);
  return true;
}

// ================= API Operations: Enquiries =================

export async function submitEnquiry(enquiry: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}): Promise<ContactEnquiry> {
  const newEnquiry: ContactEnquiry = {
    id: `enquiry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name: enquiry.name.trim(),
    phone: enquiry.phone.trim(),
    email: enquiry.email?.trim() || '',
    message: enquiry.message.trim(),
    status: 'new',
    created_at: new Date().toISOString(),
  };

  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('contact_enquiries')
        .insert([
          {
            name: newEnquiry.name,
            phone: newEnquiry.phone,
            email: newEnquiry.email || null,
            message: newEnquiry.message,
            status: 'new',
          },
        ])
        .select()
        .single();

      if (!error && data) {
        return data as ContactEnquiry;
      }
    } catch (e) {
      console.warn('Supabase insert enquiry fallback:', e);
    }
  }

  const current = getLocalEnquiries();
  const updated = [newEnquiry, ...current];
  saveLocalEnquiries(updated);
  return newEnquiry;
}

export async function fetchEnquiries(): Promise<ContactEnquiry[]> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('contact_enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as ContactEnquiry[];
      }
    } catch (e) {
      console.warn('Supabase fetch enquiries fallback:', e);
    }
  }
  return getLocalEnquiries();
}

export async function updateEnquiryStatus(
  id: string,
  status: 'new' | 'contacted' | 'completed',
  notes?: string
): Promise<ContactEnquiry> {
  const sb = getSupabase();
  if (sb) {
    try {
      const updatePayload: Record<string, any> = { status, updated_at: new Date().toISOString() };
      if (notes !== undefined) updatePayload.notes = notes;

      const { data, error } = await sb
        .from('contact_enquiries')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return data as ContactEnquiry;
      }
    } catch (e) {
      console.warn('Supabase update enquiry status fallback:', e);
    }
  }

  const current = getLocalEnquiries();
  const index = current.findIndex((e) => e.id === id);
  if (index === -1) throw new Error('Enquiry not found');

  const updatedItem: ContactEnquiry = {
    ...current[index],
    status,
    ...(notes !== undefined ? { notes } : {}),
    updated_at: new Date().toISOString(),
  };
  current[index] = updatedItem;
  saveLocalEnquiries(current);
  return updatedItem;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { error } = await sb.from('contact_enquiries').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase delete enquiry fallback:', e);
    }
  }

  const current = getLocalEnquiries();
  const filtered = current.filter((e) => e.id !== id);
  saveLocalEnquiries(filtered);
  return true;
}

// ================= API Operations: Settings =================

export async function fetchWebsiteSettings(): Promise<WebsiteSettings> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('website_settings')
        .select('*')
        .eq('id', 'current')
        .single();

      if (!error && data) {
        return {
          ...getLocalSettings(),
          ...data,
        } as WebsiteSettings;
      }
    } catch (e) {
      console.warn('Supabase fetch settings fallback:', e);
    }
  }
  return getLocalSettings();
}

export async function updateWebsiteSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('website_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 'current')
        .select()
        .single();

      if (!error && data) {
        return data as WebsiteSettings;
      }
    } catch (e) {
      console.warn('Supabase update settings fallback:', e);
    }
  }

  const current = getLocalSettings();
  const updated: WebsiteSettings = {
    ...current,
    ...settings,
    updated_at: new Date().toISOString(),
  };
  saveLocalSettings(updated);
  return updated;
}

// ================= File Upload =================

export async function uploadImageFile(file: File): Promise<{ url: string; path?: string }> {
  const sb = getSupabase();
  if (sb) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      const { data, error } = await sb.storage.from('gallery-images').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

      if (!error && data) {
        const { data: publicUrlData } = sb.storage.from('gallery-images').getPublicUrl(filePath);
        return {
          url: publicUrlData.publicUrl,
          path: filePath,
        };
      }
    } catch (e) {
      console.warn('Supabase storage upload fallback:', e);
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({ url: reader.result as string });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

// ================= Admin Auth =================

export async function adminLogin(email: string, password: string): Promise<AdminUser> {
  const trimmedEmail = email.trim().toLowerCase();
  const sb = getSupabase();

  if (!sb) {
    throw new Error('Supabase client is not connected. Please verify your Supabase configuration.');
  }

  const { data, error } = await sb.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  });

  if (error || !data.user) {
    throw new Error(error?.message || 'Invalid email or password.');
  }

  // Check admin_profiles table to ensure this user has admin role
  try {
    const { data: profile } = await sb
      .from('admin_profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profile && profile.role !== 'admin' && profile.role !== 'superadmin') {
      await sb.auth.signOut();
      throw new Error('Access denied: this account does not have admin privileges.');
    }
  } catch (profileErr: any) {
    // If table check fails, log warning
    console.warn('Admin profile check warning:', profileErr);
  }

  const adminUser: AdminUser = {
    id: data.user.id,
    email: data.user.email || trimmedEmail,
    role: 'admin',
    name: data.user.user_metadata?.full_name || 'Admin',
  };

  localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(adminUser));
  return adminUser;
}

export function getAdminSession(): AdminUser | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    if (saved) return JSON.parse(saved);
  } catch {
    // fallback
  }
  return null;
}

export async function adminLogout(): Promise<void> {
  const sb = getSupabase();
  if (sb) {
    try {
      await sb.auth.signOut();
    } catch {
      // ignore
    }
  }
  localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
}
