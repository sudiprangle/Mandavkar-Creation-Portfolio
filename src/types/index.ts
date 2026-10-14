export interface GalleryPhoto {
  id: string;
  title: string;
  description?: string;
  category: string;
  image_url: string;
  storage_path?: string;
  is_published: boolean;
  featured?: boolean;
  display_order?: number;
  created_at: string;
  updated_at?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cover_image: string;
  created_at: string;
  updated_at?: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: 'new' | 'contacted' | 'completed';
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface WebsiteSettings {
  business_name: string;
  tagline: string;
  introduction: string;
  phone_number: string;
  business_email: string;
  whatsapp_number: string;
  instagram_url: string;
  hero_image_url: string;
  hero_badge_label?: string;
  hero_subtitle?: string;
  logo_url?: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  name?: string;
}
