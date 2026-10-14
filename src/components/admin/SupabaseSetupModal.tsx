import React, { useState } from 'react';
import { X, Database, Check, Copy, ExternalLink, ShieldCheck, HardDrive, Key } from 'lucide-react';
import { getStoredSupabaseConfig, saveStoredSupabaseConfig, getSupabase } from '../../services/store';

interface SupabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigUpdated: () => void;
}

export const SupabaseSetupModal: React.FC<SupabaseSetupModalProps> = ({
  isOpen,
  onClose,
  onConfigUpdated,
}) => {
  const currentConfig = getStoredSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const isConnected = Boolean(getSupabase());

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSupabaseConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
    });
    setSavedSuccess(true);
    onConfigUpdated();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const sqlCode = `-- SQL setup for Mandavkar Creation in Supabase
-- 1. Create tables
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin'
);

CREATE TABLE IF NOT EXISTS public.gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Weddings',
  image_url TEXT NOT NULL,
  storage_path TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.website_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  business_name TEXT NOT NULL DEFAULT 'MANDAVKAR CREATION',
  tagline TEXT NOT NULL DEFAULT 'Capturing Moments, Creating Memories.',
  introduction TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  business_email TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  instagram_url TEXT NOT NULL
);

-- Enable RLS & Policies
ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published photos" ON public.gallery_photos FOR SELECT USING (is_published = true);
CREATE POLICY "Admins full access to photos" ON public.gallery_photos FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles));

ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can submit enquiries" ON public.contact_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins full access to enquiries" ON public.contact_enquiries FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles));

ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Admins update settings" ON public.website_settings FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles));`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0f0f13] border border-zinc-800 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative space-y-6 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif-luxury text-xl text-white font-medium">
                Supabase Backend Setup & Configuration
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                Connect your live Supabase project or continue using resilient local storage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Connection Status */}
        <div
          className={`p-4 rounded-lg border flex items-center justify-between ${
            isConnected
              ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
              : 'bg-zinc-900 border-zinc-800 text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <ShieldCheck
              className={`w-5 h-5 ${isConnected ? 'text-emerald-400' : 'text-zinc-500'}`}
            />
            <div>
              <span className="text-xs font-semibold block">
                {isConnected ? 'Supabase Connected' : 'Local Storage Mode Active'}
              </span>
              <p className="text-[11px] text-zinc-400">
                {isConnected
                  ? 'All photos, enquiries, and settings are synchronizing with your live Supabase PostgreSQL & Storage.'
                  : 'All features (upload, edit, enquiries, settings) are fully operational and persistent in browser local storage.'}
              </p>
            </div>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSaveConfig} className="space-y-4">
          <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-300">
            Configure Supabase Credentials
          </h4>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Project URL (<code className="text-amber-400">VITE_SUPABASE_URL</code>)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full px-3.5 py-2 rounded bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-zinc-400 mb-1">
              Anon Public API Key (<code className="text-amber-400">VITE_SUPABASE_ANON_KEY</code>)
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3.5 py-2 rounded bg-zinc-900 border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                <Check className="w-3.5 h-3.5" /> Saved & updated!
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 text-black text-xs font-semibold uppercase tracking-wider rounded hover:bg-amber-300 transition-colors cursor-pointer"
            >
              Save Credentials
            </button>
          </div>
        </form>

        {/* Quick SQL Copy & Storage Setup */}
        <div className="space-y-3 pt-3 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase font-mono tracking-wider text-zinc-300 flex items-center gap-1.5">
              <span>SQL Schema & RLS Policies</span>
            </h4>
            <button
              onClick={copyToClipboard}
              className="px-2.5 py-1 text-[11px] font-mono text-amber-400 border border-amber-400/30 hover:bg-amber-400/10 rounded flex items-center gap-1 cursor-pointer"
            >
              {copiedSql ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}</span>
            </button>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            Full SQL schema is also saved in root at <code className="text-amber-300">/supabase-schema.sql</code>. Paste it into your Supabase Dashboard <code className="text-zinc-200">SQL Editor</code>.
            In <code className="text-zinc-200">Storage</code>, create a public bucket named <code className="text-amber-300 font-mono">gallery-images</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
