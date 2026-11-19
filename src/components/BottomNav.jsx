import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function BottomNav() {
  const location = useLocation();
  const { totalItems, setIsCartOpen, isCartOpen } = useCart();

  // Sembunyikan bottom dock saat cart drawer aktif, di halaman detail produk (karena ada sticky action bar tersendiri),
  // atau di halaman checkout agar tidak menutupi tombol transaksi
  if (
    isCartOpen ||
    location.pathname.startsWith('/product/') ||
    location.pathname.startsWith('/checkout')
  ) {
    return null;
  }

  const isHome = location.pathname === '/';
  const isCatalog = location.pathname.startsWith('/catalog');

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#133129]/95 backdrop-blur-md text-[#081F1C] rounded-full px-6 py-2.5 shadow-2xl flex items-center gap-8 border border-[#AABBB3]/40"
    >
      {/* 1. Beranda */}
      <Link
        to="/"
        className={`flex flex-col items-center justify-center transition-all p-1.5 rounded-full ${
          isHome ? 'text-[#133129] scale-110' : 'text-[#24443B] hover:text-white'
        }`}
        title="Beranda"
        aria-label="Beranda"
      >
        <Home className="w-5 h-5" />
      </Link>

      {/* 2. Katalog */}
      <Link
        to="/catalog"
        className={`flex flex-col items-center justify-center transition-all p-1.5 rounded-full ${
          isCatalog ? 'text-[#133129] scale-110' : 'text-[#24443B] hover:text-white'
        }`}
        title="Katalog Produk"
        aria-label="Katalog"
      >
        <Compass className="w-5 h-5" />
      </Link>

      {/* 3. Keranjang */}
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center justify-center transition-all p-1.5 rounded-full text-[#24443B] hover:text-white"
        title="Keranjang Belanja"
        aria-label="Keranjang"
      >
        <ShoppingBag className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#A8C4B5] text-[#081F1C] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
            {totalItems}
          </span>
        )}
      </button>
    </nav>
  );
}
