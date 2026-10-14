import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { MandavkarLogo } from '../common/MandavkarLogo';

interface NavbarProps {
  settings: WebsiteSettings;
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeSection,
  onNavigate,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080808]/95 backdrop-blur-md border-b border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-18 sm:h-22">
          {/* Zone 1: Brand Wordmark / Official Marathi Camera Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 text-left focus:outline-none cursor-pointer group py-1 min-w-0"
            aria-label="Go to home"
          >
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt={settings.business_name || 'Mandavkar Creation'}
                className="h-10 sm:h-14 w-auto object-contain max-w-[200px] sm:max-w-[280px]"
              />
            ) : (
              <MandavkarLogo
                size="sm"
                showSubtitle={false}
                className="group-hover:opacity-90 transition-opacity"
              />
            )}
          </button>

          {/* Zone 2: Navigation Links (Desktop 4-5 clean links) */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-medium text-zinc-400">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'home' ? 'text-amber-400 border-b border-amber-400 pb-1' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('gallery')}
              className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'gallery' ? 'text-amber-400 border-b border-amber-400 pb-1' : ''
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeSection === 'contact' ? 'text-amber-400 border-b border-amber-400 pb-1' : ''
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('contact')}
              className="px-5 py-2.5 text-xs font-medium uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 transition-all rounded shadow-sm hover:shadow-amber-500/20 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Book Session
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-zinc-300 hover:text-white bg-zinc-900/80 border border-zinc-800 rounded-lg focus:outline-none transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#0d0d10] px-5 py-6 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex flex-col space-y-2 text-sm font-medium tracking-wider uppercase text-zinc-300">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left py-2.5 px-3 rounded-lg hover:text-amber-400 hover:bg-zinc-900/60 transition-colors ${
                activeSection === 'home' ? 'text-amber-400 bg-amber-400/10 font-semibold' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('gallery')}
              className={`text-left py-2.5 px-3 rounded-lg hover:text-amber-400 hover:bg-zinc-900/60 transition-colors ${
                activeSection === 'gallery' ? 'text-amber-400 bg-amber-400/10 font-semibold' : ''
              }`}
            >
              Gallery
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`text-left py-2.5 px-3 rounded-lg hover:text-amber-400 hover:bg-zinc-900/60 transition-colors ${
                activeSection === 'contact' ? 'text-amber-400 bg-amber-400/10 font-semibold' : ''
              }`}
            >
              Contact Us
            </button>
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex flex-col gap-2.5">
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 to-amber-300 rounded shadow-md cursor-pointer"
            >
              Book Photography Session
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 text-center text-xs tracking-wider uppercase text-zinc-400 hover:text-white border border-zinc-800 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              Admin Portal
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
