import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Heart, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import WhatsAppIcon from './WhatsAppIcon';
import { createWhatsAppGeneralLink } from '../utils/whatsapp';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/catalog');
    }
  };

  const currentCat = new URLSearchParams(location.search).get('cat') || 'all';

  const categoryPills = [
    { label: 'Semua', slug: 'all', path: '/catalog' },
    { label: 'Polo Shirt', slug: 'polo-shirt', path: '/catalog?cat=polo-shirt' },
    { label: 'Basic T-Shirt', slug: 'basic-tshirt', path: '/catalog?cat=basic-tshirt' },
    { label: 'Longsleeve', slug: 'basic-longsleeve', path: '/catalog?cat=basic-longsleeve' },
  ];

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-neutral-950 text-neutral-300 text-[11px] sm:text-xs py-1.5 px-4 text-center font-normal tracking-wide flex items-center justify-center gap-2 sm:gap-3 border-b border-neutral-900">
        <span className="font-mono bg-neutral-800 text-amber-300 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] border border-neutral-700">
          OEPRO10
        </span>
        <span>Diskon 10% Koleksi Katun Murni</span>
        <span className="hidden sm:inline text-neutral-600">|</span>
        <a
          href={createWhatsAppGeneralLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 font-semibold"
        >
          <WhatsAppIcon className="w-3 h-3 fill-current" />
          <span>WA: 0811-3458-177</span>
        </a>
        <span className="hidden sm:inline text-neutral-600">|</span>
        <span className="hidden sm:inline text-neutral-400">Garansi Tukar Ukuran 7 Hari</span>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top row: Brand & Actions */}
          <div className="flex items-center justify-between h-14 sm:h-20 gap-3">
            
            {/* Logo Kiri */}
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group py-1" title="OEPRO Beranda">
              <img
                src="/assets/brand/oepro-logo.webp"
                alt="OEPRO Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain shadow-xs border border-neutral-200/80 bg-white p-0.5 group-hover:border-neutral-400 transition flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-base sm:text-xl font-bold tracking-tight text-neutral-950 group-hover:text-neutral-800 transition leading-none">
                  OEPRO
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.2em] font-semibold text-neutral-400 uppercase mt-0.5">
                  OEPRO COTTON BASIC
                </span>
              </div>
            </Link>

            {/* Desktop Search Center */}
            <div className="hidden md:block flex-1 max-w-xl mx-auto px-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari kaos polos, polo lacoste, longsleeve..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-neutral-100/80 border border-neutral-200 rounded-full text-neutral-900 placeholder:text-neutral-500 focus:bg-white focus:border-neutral-900 focus:outline-hidden focus:ring-1 focus:ring-neutral-900 transition shadow-2xs"
                />
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-2.5 sm:top-3 pointer-events-none" />
              </form>
            </div>

            {/* Right Action Icons (Wishlist, WhatsApp, Cart, Account) */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              
              {/* WhatsApp Quick Link */}
              <a
                href={createWhatsAppGeneralLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:px-3 sm:py-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full sm:rounded-xl transition flex items-center gap-1.5 min-w-[36px] min-h-[36px] justify-center"
                title="Hubungi WhatsApp"
                aria-label="WhatsApp OEPRO"
              >
                <WhatsAppIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current" />
                <span className="hidden lg:inline text-xs font-semibold text-emerald-700">WhatsApp</span>
              </a>

              {/* Wishlist Heart Icon */}
              <Link
                to="/catalog?wishlist=true"
                className="relative p-2 sm:p-2.5 rounded-full text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                title="Favorit"
                aria-label="Favorit"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-700 hover:text-red-500 transition" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 sm:px-3.5 sm:py-2 bg-neutral-950 text-white rounded-full sm:rounded-xl hover:bg-neutral-800 transition flex items-center gap-2 shadow-xs min-w-[36px] min-h-[36px] justify-center"
                aria-label="Keranjang Belanja"
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <span className="hidden sm:inline text-xs font-medium">Keranjang</span>
                {totalItems > 0 && (
                  <span className="bg-amber-400 text-neutral-950 text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center -ml-0.5 shadow-xs">
                    {totalItems}
                  </span>
                )}
              </button>


            </div>

          </div>

          {/* Mobile Search Row & Category Pills */}
          <div className="md:hidden pb-2.5 space-y-2">
            {/* Search Bar with filter icon */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Cari produk OEPRO..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-100/80 border border-neutral-200 rounded-full text-neutral-900 placeholder:text-neutral-500 focus:bg-white focus:border-neutral-900 focus:outline-hidden transition shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5 pointer-events-none" />
              </div>
              <button
                type="button"
                onClick={() => navigate('/catalog')}
                className="p-2 bg-neutral-100 border border-neutral-200 rounded-full text-neutral-700 hover:bg-neutral-200 transition flex-shrink-0"
                title="Filter Katalog"
                aria-label="Filter Katalog"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Category Segment Pills (Horizontal Scroll) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {categoryPills.map((pill) => {
                const isActive = (currentCat === pill.slug) || (pill.slug === 'all' && location.pathname === '/' && currentCat === 'all');
                return (
                  <Link
                    key={pill.slug}
                    to={pill.path}
                    className={`px-3.5 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200/50'
                    }`}
                  >
                    {pill.label}
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </header>
    </>
  );
}
