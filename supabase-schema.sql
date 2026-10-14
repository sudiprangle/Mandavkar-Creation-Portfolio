-- ==============================================================================
-- MANDAVKAR CREATION — PHOTOGRAPHY PORTFOLIO & ADMIN DATABASE SCHEMA
-- Target Engine: Supabase PostgreSQL with Row Level Security (RLS) & Storage
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ADMIN PROFILES TABLE
-- Maps authenticated users to authorized admin privileges
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view their own profile or all profiles"
    ON public.admin_profiles
    FOR SELECT
    USING (auth.uid() = id);

-- 3. GALLERY CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.gallery_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    cover_image TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories"
    ON public.gallery_categories
    FOR SELECT
    USING (true);

CREATE POLICY "Admins full access to categories"
    ON public.gallery_categories
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE public.admin_profiles.id = auth.uid()
        )
    );

-- 3. GALLERY PHOTOS TABLE
-- Holds photo metadata, categories, publish status and storage links
CREATE TABLE IF NOT EXISTS public.gallery_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'Weddings',
    image_url TEXT NOT NULL,
    storage_path TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- Public can ONLY view published photos
CREATE POLICY "Public can view published photos"
    ON public.gallery_photos
    FOR SELECT
    USING (is_published = true);

-- Authorized admins have full control over gallery photos
CREATE POLICY "Admins have full access to gallery photos"
    ON public.gallery_photos
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE public.admin_profiles.id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE public.admin_profiles.id = auth.uid()
        )
    );

-- 4. CONTACT ENQUIRIES TABLE
-- Stores booking enquiries submitted through public website
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;

-- Public visitors can submit (insert) enquiries, but CANNOT read, update or delete them
CREATE POLICY "Public can submit enquiries"
    ON public.contact_enquiries
    FOR INSERT
    WITH CHECK (true);

-- Only authorized admins can view and manage enquiries
CREATE POLICY "Admins can manage enquiries"
    ON public.contact_enquiries
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE public.admin_profiles.id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE public.admin_profiles.id = auth.uid()
        )
    );

-- 5. WEBSITE SETTINGS TABLE
-- Single row storage for dynamic branding, phone, email, and social links
CREATE TABLE IF NOT EXISTS public.website_settings (
    id TEXT PRIMARY KEY DEFAULT 'current',
    business_name TEXT NOT NULL DEFAULT 'MANDAVKAR CREATION',
    tagline TEXT NOT NULL DEFAULT 'Capturing Moments, Creating Memories.',
    introduction TEXT NOT NULL DEFAULT 'We are luxury wedding and portrait photographers dedicated to transforming your most heartfelt, spontaneous emotions into timeless visual art. Based in Maharashtra and traveling worldwide.',
    phone_number TEXT NOT NULL DEFAULT '+91 98765 43210',
    business_email TEXT NOT NULL DEFAULT 'contact@mandavkarcreation.com',
    whatsapp_number TEXT NOT NULL DEFAULT '+919876543210',
    instagram_url TEXT NOT NULL DEFAULT 'https://instagram.com/mandavkar_creation',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Public can view website settings
CREATE POLICY "Public can view website settings"
    ON public.website_settings
    FOR SELECT
    USING (true);

-- Only admins can update website settings
CREATE POLICY "Admins can update website settings"
    ON public.website_settings
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE public.admin_profiles.id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE public.admin_profiles.id = auth.uid()
        )
    );

-- Insert default website settings row if missing
INSERT INTO public.website_settings (id, business_name, tagline, introduction, phone_number, business_email, whatsapp_number, instagram_url)
VALUES (
    'current',
    'MANDAVKAR CREATION',
    'Capturing Moments, Creating Memories.',
    'We are luxury wedding and portrait photographers dedicated to transforming your most heartfelt, spontaneous emotions into timeless visual art. Based in Maharashtra and traveling worldwide.',
    '+91 98765 43210',
    'contact@mandavkarcreation.com',
    '+919876543210',
    'https://instagram.com/mandavkar_creation'
)
ON CONFLICT (id) DO NOTHING;

-- 6. STORAGE BUCKET CONFIGURATION
-- Ensure storage bucket 'gallery-images' exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-images', 'gallery-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies: Public read access
CREATE POLICY "Public can view gallery images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'gallery-images');

-- Storage policies: Authenticated admins can upload & delete
CREATE POLICY "Admins can upload gallery images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'gallery-images' AND
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE public.admin_profiles.id = auth.uid()
        )
    );

CREATE POLICY "Admins can update gallery images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'gallery-images' AND
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE public.admin_profiles.id = auth.uid()
        )
    );

CREATE POLICY "Admins can delete gallery images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'gallery-images' AND
        EXISTS (
            SELECT 1 FROM public.admin_profiles
            WHERE public.admin_profiles.id = auth.uid()
        )
    );

-- 7. INITIAL ADMIN CREATION HELPER
-- Run this function or insert statement after creating a user in Supabase Auth UI:
-- Example:
-- INSERT INTO public.admin_profiles (id, email, role)
-- SELECT id, email, 'admin' FROM auth.users WHERE email = 'your-admin@example.com'
-- ON CONFLICT (id) DO NOTHING;
