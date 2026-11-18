import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import WhatsAppIcon from './WhatsAppIcon';
import { createWhatsAppGeneralLink } from '../utils/whatsapp';
import { useCart } from '../context/CartContext';

export default function FloatingWhatsApp() {
  const location = useLocation();
  const { isCartOpen } = useCart();
  const [hovered, setHovered] = useState(false);

  // Auto-hide saat cart drawer aktif, di halaman PDP (karena sudah ada tombol 'Pesan WA' di sticky bar),
  // atau di checkout agar tidak menutupi thumbnail foto produk atau tombol aksi
  if (
    isCartOpen ||
    location.pathname.startsWith('/product/') ||
    location.pathname.startsWith('/checkout')
  ) {
    return null;
  }

  return (
    <aside
      aria-label="Kontak WhatsApp"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center group"
    >
      <a
        href={createWhatsAppGeneralLink()}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3.5 py-3 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        title="Chat WhatsApp OEPRO"
        aria-label="Chat WhatsApp Admin OEPRO"
      >
        <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 fill-current flex-shrink-0" />
        <span className="hidden sm:inline font-bold text-xs tracking-wide">
          Chat WhatsApp
        </span>
        <span className="sm:hidden font-bold text-[11px] tracking-wide">
          Chat WA
        </span>
      </a>
    </aside>
  );
}
