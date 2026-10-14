import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Images,
  UploadCloud,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Database,
  X,
} from 'lucide-react';
import { MandavkarLogo } from '../common/MandavkarLogo';

export type AdminTab =
  | 'dashboard'
  | 'manage-categories'
  | 'manage-gallery'
  | 'upload-photos'
  | 'client-enquiries'
  | 'website-settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
  onOpenSupabaseSetup: () => void;
  isSupabaseConnected: boolean;
  unreadEnquiriesCount: number;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  onViewPublicSite,
  onOpenSupabaseSetup,
  isSupabaseConnected,
  unreadEnquiriesCount,
  isOpen,
  onCloseMobile,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'manage-categories' as AdminTab,
      label: 'Manage Categories',
      icon: Layers,
    },
    {
      id: 'manage-gallery' as AdminTab,
      label: 'Manage Gallery',
      icon: Images,
    },
    {
      id: 'upload-photos' as AdminTab,
      label: 'Upload Photos',
      icon: UploadCloud,
    },
    {
      id: 'client-enquiries' as AdminTab,
      label: 'Client Enquiries',
      icon: Mail,
      badge: unreadEnquiriesCount > 0 ? unreadEnquiriesCount : undefined,
    },
    {
      id: 'website-settings' as AdminTab,
      label: 'Website Settings',
      icon: Settings,
    },
  ];

  const handleItemClick = (tab: AdminTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0a0c] border-r border-zinc-800/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header with authentic brand logo */}
          <div className="h-24 flex items-center justify-between px-5 border-b border-zinc-800/80">
            <div className="flex items-center gap-2">
              <MandavkarLogo size="sm" showSubtitle={false} />
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-amber-400 text-black rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-zinc-800/80 space-y-2">
          {/* Supabase Status Button */}
          <button
            onClick={onOpenSupabaseSetup}
            className="w-full flex items-center justify-between px-3 py-2 text-xs rounded bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-mono">Supabase Setup</span>
            </div>
            <span
              className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded ${
                isSupabaseConnected
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                  : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {isSupabaseConnected ? 'Connected' : 'Local Mode'}
            </span>
          </button>

          {/* View Public Website */}
          <button
            onClick={onViewPublicSite}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            <span className="uppercase tracking-wider text-[11px]">View Portfolio Site</span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span className="uppercase tracking-wider text-[11px] font-medium">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
