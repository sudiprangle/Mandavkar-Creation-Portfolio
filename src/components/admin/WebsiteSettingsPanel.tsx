import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  Camera,
  UploadCloud,
} from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { updateWebsiteSettings, uploadImageFile } from '../../services/store';

interface WebsiteSettingsPanelProps {
  settings: WebsiteSettings;
  onSettingsUpdated: (newSettings: WebsiteSettings) => void;
  onViewPublicSite: () => void;
}

export const WebsiteSettingsPanel: React.FC<WebsiteSettingsPanelProps> = ({
  settings,
  onSettingsUpdated,
  onViewPublicSite,
}) => {
  const [formData, setFormData] = useState<WebsiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImageFile(file);
      setFormData((prev) => ({ ...prev, hero_image_url: url }));
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload hero image');
    }
  };

  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await uploadImageFile(file);
      setFormData((prev) => ({ ...prev, logo_url: url }));
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload logo image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const updated = await updateWebsiteSettings(formData);
      onSettingsUpdated(updated);
      setSuccessMessage('Website settings successfully saved and applied to public portfolio!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="font-serif-luxury text-3xl text-white font-normal uppercase tracking-wide">
            Website & Home Settings
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure home page side photo, brand naming, hero copy, direct phone numbers, and WhatsApp booking credentials.
          </p>
        </div>

        <button
          onClick={onViewPublicSite}
          className="text-xs text-amber-400 hover:text-amber-300 uppercase tracking-wider font-medium cursor-pointer"
        >
          View Public Website →
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-lg flex items-center gap-3 text-emerald-300 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-950/40 border border-red-800/60 rounded-lg flex items-center gap-3 text-red-300 text-xs">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Home Page Hero Side Photo & Visuals */}
        <div className="p-6 rounded-xl bg-[#0f0f13] border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-amber-400">
            <Camera className="w-4 h-4" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              Home Page Side Photograph (Admin-Editable)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            {/* Preview */}
            <div className="sm:col-span-4">
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-zinc-700 bg-black">
                <img
                  src={formData.hero_image_url}
                  alt="Home Side Photo Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Inputs */}
            <div className="sm:col-span-8 space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                  Hero Side Photo URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.hero_image_url}
                  onChange={(e) => setFormData({ ...formData, hero_image_url: e.target.value })}
                  className="w-full px-3.5 py-2 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400 mb-2"
                />

                <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded cursor-pointer transition-colors">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload Photo from Device</span>
                  <input type="file" accept="image/*" onChange={handleHeroFileUpload} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Photo Kicker Tag
                  </label>
                  <input
                    type="text"
                    value={formData.hero_badge_label || ''}
                    onChange={(e) => setFormData({ ...formData, hero_badge_label: e.target.value })}
                    placeholder="Signature Wedding Series"
                    className="w-full px-3.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                    Photo Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.hero_subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                    placeholder="The Royal Heritage Union"
                    className="w-full px-3.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Brand & Hero Identity */}
        <div className="p-6 rounded-xl bg-[#0f0f13] border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-amber-400">
            <Globe className="w-4 h-4" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              Brand & Hero Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Business Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                placeholder="MANDAVKAR CREATION"
                className="w-full px-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Tagline <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                placeholder="Capturing Moments, Creating Memories."
                className="w-full px-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
              Introduction Bio (Hero & About) <span className="text-amber-400">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={formData.introduction}
              onChange={(e) => setFormData({ ...formData, introduction: e.target.value })}
              placeholder="Introduce your studio aesthetic, experience, and artistic approach..."
              className="w-full px-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Section 3: Contact Channels & WhatsApp */}
        <div className="p-6 rounded-xl bg-[#0f0f13] border border-zinc-800/80 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800 text-amber-400">
            <Phone className="w-4 h-4" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
              Studio Contact & Booking Channels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Contact Phone Number
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  placeholder="+91 98234 56789"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Official Studio Email
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={formData.business_email}
                  onChange={(e) => setFormData({ ...formData, business_email: e.target.value })}
                  placeholder="contact@mandavkarcreation.com"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                WhatsApp Booking Number
              </label>
              <div className="relative">
                <MessageCircle className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" />
                <input
                  type="text"
                  required
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  placeholder="+919823456789 (with country code)"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                Used to construct the instant prefilled WhatsApp booking link.
              </p>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                Instagram Profile URL
              </label>
              <div className="relative">
                <Instagram className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-pink-400" />
                <input
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                  placeholder="https://instagram.com/mandavkarcreation"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save & Publish Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
