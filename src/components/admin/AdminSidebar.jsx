import React from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Layers,
  Tag,
  Image,
  ExternalLink,
  LogOut,
  X,
  ChevronRight,
  ShieldCheck,
  Store,
} from 'lucide-react';

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  onLogout,
  counts = {},
}) {
  const menuItems = [
    {
      id: 'products',
      label: 'Produk & Varian',
      description: 'Katalog & varian 2-level',
      icon: Package,
      count: counts.products !== undefined ? counts.products : null,
    },
    {
      id: 'categories',
      label: 'Master Kategori',
      description: 'Kelola kategori produk',
      icon: Tag,
      count: counts.categories !== undefined ? counts.categories : null,
    },
    {
      id: 'banners',
      label: 'Banner Depan',
      description: 'Hero slider & promo',
      icon: Image,
      count: counts.banners !== undefined ? counts.banners : null,
    },
  ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (setIsMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#3A3732] text-[#F0EDDF] select-none border-r border-[#655F58]/30">
      {/* Brand & Admin Title */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/assets/brand/oepro-logo.webp"
            alt="OEPRO Logo"
            className="w-9 h-9 rounded-xl object-contain bg-white p-0.5 border border-white/20 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white group-hover:text-[#E7E2CE] transition">
                OEPRO
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-[#075E54] text-white rounded-md tracking-wider uppercase">
                Admin
              </span>
            </div>
            <p className="text-[10px] text-[#D0D5D5] font-medium tracking-wide">
              Management Portal
            </p>
          </div>
        </Link>

        {/* Mobile Close Button */}
        {setIsMobileOpen && (
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#979188]">
          Menu Utama
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-left transition-all group ${
                isActive
                  ? 'bg-[#075E54] text-white shadow-md font-semibold'
                  : 'text-[#D0D5D5] hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-[#D0D5D5] group-hover:bg-white/10 group-hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs truncate">{item.label}</div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-white/80' : 'text-[#979188]'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </div>

              {item.count !== null && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-[#D0D5D5]'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          to="/"
          target="_blank"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-[#D0D5D5] hover:bg-white/5 hover:text-white transition"
        >
          <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
            <Store className="w-3.5 h-3.5 text-[#E7E2CE]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate font-medium">Buka Toko Live</div>
            <div className="text-[10px] text-[#979188] truncate">oepro.id</div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-[#979188]" />
        </Link>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs text-red-300 hover:bg-red-500/10 hover:text-red-200 transition"
        >
          <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
            <LogOut className="w-3.5 h-3.5 text-red-300" />
          </div>
          <span className="font-semibold">Keluar Akun Admin</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-fade-in"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-slide-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
