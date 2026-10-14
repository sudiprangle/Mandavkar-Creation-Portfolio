import React, { useState } from 'react';
import { Phone, Mail, Instagram, MessageCircle, Send, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { submitEnquiry } from '../../services/store';

interface ContactProps {
  settings: WebsiteSettings;
  onEnquirySubmitted?: () => void;
}

export const Contact: React.FC<ContactProps> = ({ settings, onEnquirySubmitted }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const cleanPhone = (settings.whatsapp_number || '+919823456789').replace(/[^0-9]/g, '');
  const prefilledText = encodeURIComponent(
    `Hello ${settings.business_name || 'Mandavkar Creation'}, I would like to inquire about booking a photography session for an upcoming event.`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${prefilledText}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMessage('Please fill in your name, phone number, and message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitEnquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: formData.message,
      });

      setSubmittedSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
      if (onEnquirySubmitted) onEnquirySubmitted();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-14 sm:py-20 relative bg-[#09090b] border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column: Direct Contact & WhatsApp */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-400 font-medium mb-2">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Get In Touch</span>
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl text-white font-normal uppercase tracking-tight">
                Reserve Your Date
              </h2>
              <p className="text-zinc-400 text-xs sm:text-sm mt-3 leading-relaxed font-light">
                Every story is unique. Tell us about your celebration, date, and envisioned aesthetic. We accept a limited number of commissions each season to ensure uncompromising artistic quality.
              </p>
            </div>

            {/* Quick Action WhatsApp Button with prefilled message */}
            <div className="p-4 sm:p-5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-medium">
                  Instant Direct Chat
                </span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs tracking-wider uppercase rounded transition-colors flex items-center justify-center gap-2 group cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            {/* Studio Contact Channels */}
            <div className="space-y-3 pt-2 border-t border-zinc-800/80">
              <a
                href={`tel:${settings.phone_number || '+919823456789'}`}
                className="flex items-center gap-3.5 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-amber-400/50 text-zinc-300 hover:text-white transition-colors group cursor-pointer"
              >
                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 group-hover:border-amber-400/50 shrink-0">
                  <Phone className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                    Direct Studio Phone
                  </span>
                  <span className="text-xs sm:text-sm font-medium tracking-wide truncate block">
                    {settings.phone_number || '+91 98234 56789'}
                  </span>
                </div>
              </a>

              <a
                href={`mailto:${settings.business_email || 'contact@mandavkarcreation.com'}`}
                className="flex items-center gap-3.5 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-amber-400/50 text-zinc-300 hover:text-white transition-colors group cursor-pointer"
              >
                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 group-hover:border-amber-400/50 shrink-0">
                  <Mail className="w-4 h-4 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                    Official Email
                  </span>
                  <span className="text-xs sm:text-sm font-medium tracking-wide truncate block">
                    {settings.business_email || 'info@mandavkarcreation.com'}
                  </span>
                </div>
              </a>

              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 hover:border-amber-400/50 text-zinc-300 hover:text-white transition-colors group cursor-pointer"
                >
                  <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 group-hover:border-amber-400/50 shrink-0">
                    <Instagram className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-wider text-zinc-500 font-mono">
                      Instagram Showcase
                    </span>
                    <span className="text-xs sm:text-sm font-medium tracking-wide truncate block">
                      @mandavkarcreation
                    </span>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Booking Enquiry Form */}
          <div className="lg:col-span-7 w-full">
            <div className="rounded-xl border border-zinc-800 bg-[#0d0d10] p-5 sm:p-8 shadow-xl">
              <h3 className="font-serif-luxury text-xl sm:text-2xl text-white font-medium mb-1">
                Send an Enquiry
              </h3>
              <p className="text-xs text-zinc-400 mb-6 font-light">
                Fill out the form below. We will review your request and get in touch via phone or WhatsApp.
              </p>

              {submittedSuccess ? (
                <div className="py-8 sm:py-10 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="font-serif-luxury text-xl sm:text-2xl text-white">Thank You for Inquiring</h4>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    Your message has been securely submitted to Mandavkar Creation. Our studio director will contact you promptly.
                  </p>
                  <button
                    onClick={() => setSubmittedSuccess(false)}
                    className="mt-4 px-5 py-2.5 text-xs uppercase tracking-wider font-medium text-amber-400 border border-amber-400/40 rounded hover:bg-amber-400/10 transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-mono mb-1.5">
                        Your Full Name <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full px-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-mono mb-1.5">
                        Phone Number <span className="text-amber-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-mono mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. name@example.com"
                      className="w-full px-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-mono mb-1.5">
                      Event Details & Message <span className="text-amber-400">*</span>
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about the event date, venue location, photography style, and any special requests..."
                      className="w-full px-3.5 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    {isSubmitting ? (
                      <span>Submitting Enquiry...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Booking Enquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
