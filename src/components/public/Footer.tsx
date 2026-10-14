import React from 'react';
import { Lock } from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { MandavkarLogo } from '../common/MandavkarLogo';

interface FooterProps {
  settings: WebsiteSettings;
  onOpenAdmin: () => void;
  onNavigate: (section: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin, onNavigate }) => {
  return (
    <footer className="border-t border-zinc-800/80 bg-[#060607] py-10 sm:py-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-900 text-center md:text-left">
          {/* Brand mark with authentic Marathi camera logo */}
          <div className="flex items-center justify-center md:justify-start">
            <MandavkarLogo size="sm" showSubtitle={false} />
          </div>

          {/* Quick links */}
          <nav className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-xs uppercase tracking-wider">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-amber-400 transition-colors cursor-pointer py-1"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('gallery')}
              className="hover:text-amber-400 transition-colors cursor-pointer py-1"
            >
              Gallery
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="hover:text-amber-400 transition-colors cursor-pointer py-1"
            >
              Contact Us
            </button>
          </nav>

          {/* Admin portal access link */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer group py-1"
          >
            <Lock className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400" />
            <span>Admin Dashboard</span>
          </button>
        </div>

        {/* Clean copyright and unboxed metadata */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} {settings.business_name || 'Mandavkar Creation'}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span>Mandavkar Creation</span>
            <span aria-hidden="true">·</span>
            <span>Photography & Cinematics</span>
            <span aria-hidden="true">·</span>
            <span>Worldwide Commissions</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
