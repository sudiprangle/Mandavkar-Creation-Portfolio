import React, { useState } from 'react';
import { ArrowDown, Camera, ChevronRight } from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { MandavkarLogo } from '../common/MandavkarLogo';

interface HeroProps {
  settings: WebsiteSettings;
  onExploreWork: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ settings, onExploreWork, onContactClick }) => {
  const [imageError, setImageError] = useState(false);

  const heroImageSrc =
    settings.hero_image_url ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85';

  return (
    <section id="home" className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden py-8 sm:py-16">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] sm:w-[600px] h-[250px] sm:h-[300px] bg-amber-500/5 blur-[100px] sm:blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Responsive Grid: Left Column Typography, Right Column Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-14 items-center">
          {/* Typography Column */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6 lg:space-y-8 z-10 text-center lg:text-left flex flex-col items-center lg:items-start">
            {/* Display authentic brand camera logo */}
            <div className="pt-1 flex justify-center lg:justify-start w-full">
              <MandavkarLogo size="lg" showSubtitle={true} />
            </div>

            {/* Tagline */}
            <div className="space-y-2 max-w-xl">
              <p className="font-serif-luxury italic text-xl sm:text-2xl lg:text-3xl text-amber-300/90 tracking-wide font-light leading-snug">
                “{settings.tagline || 'Capturing Moments, Creating Memories.'}”
              </p>
            </div>

            {/* Introduction copy */}
            <p className="text-zinc-400 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl font-light">
              {settings.introduction ||
                'We are fine-art visual storytellers specializing in luxury wedding documentation, emotive black-and-white portraits, and timeless candid moments. Based in Maharashtra and capturing celebrations worldwide.'}
            </p>

            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 w-full sm:w-auto">
              <button
                onClick={onExploreWork}
                className="w-full sm:w-auto px-6 py-3.5 text-xs font-semibold tracking-widest uppercase bg-gradient-to-r from-amber-400 to-amber-300 text-black rounded hover:from-amber-300 hover:to-amber-200 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-amber-950/20 cursor-pointer"
              >
                <span>Explore Our Work</span>
                <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" />
              </button>

              <button
                onClick={onContactClick}
                className="w-full sm:w-auto px-6 py-3.5 text-xs font-semibold tracking-widest uppercase text-zinc-300 hover:text-white border border-zinc-800 hover:border-amber-400/50 rounded transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Inquire Date</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-amber-400/80" />
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase (Admin-Editable Side Photo) */}
          <div className="lg:col-span-6 relative w-full mt-4 lg:mt-0">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] w-full rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950 shadow-2xl group">
              {!imageError ? (
                <img
                  key={heroImageSrc}
                  src={heroImageSrc}
                  alt="Fine Art Photography by Mandavkar Creation"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full object-cover object-center grayscale contrast-110 brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-6 sm:p-8 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400">
                    <Camera className="w-7 h-7 sm:w-8 sm:h-8" />
                  </div>
                  <h3 className="font-serif-luxury text-xl sm:text-2xl text-white font-medium mb-1">
                    {settings.business_name || 'Mandavkar Creation'}
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-amber-300/80">
                    Fine Art Studio
                  </p>
                </div>
              )}

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

              {/* Monogram / Studio Tag at bottom corner */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex items-end justify-between text-white pointer-events-none">
                <div>
                  <span className="block text-[10px] tracking-[0.2em] uppercase text-amber-400/90 font-medium">
                    {settings.hero_badge_label || 'Signature Visual Series'}
                  </span>
                  <p className="font-serif-luxury text-sm sm:text-base text-zinc-200">
                    {settings.hero_subtitle || 'Mandavkar Creation'}
                  </p>
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono tabular-nums text-zinc-400">ISO 100 · 85mm</span>
              </div>
            </div>

            {/* Subtle decorative gold corner accent */}
            <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-16 h-16 sm:w-20 sm:h-20 border-r-2 border-b-2 border-amber-400/40 rounded-br-lg pointer-events-none hidden sm:block" />
          </div>
        </div>
      </div>
    </section>
  );
};
