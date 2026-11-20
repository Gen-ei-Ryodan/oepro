import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, RefreshCw, Truck, Award, MapPin, Mail, ExternalLink } from 'lucide-react';
import storeInfo from '../data/store_info.json';
import WhatsAppIcon from './WhatsAppIcon';
import { createWhatsAppGeneralLink } from '../utils/whatsapp';

export default function Footer() {
  const valueProps = [
    {
      icon: <Award className="w-5 h-5 text-[#E0BC66]" />,
      title: '100% Full Cotton Pique & 24s',
      desc: 'Bahan katun alami bernapas halus tanpa campuran poliester licin.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#E0BC66]" />,
      title: 'Jahitan Rantai Standar Distro',
      desc: 'Kerah rajut 4 lapis anti-letoy dan jahitan obras rapi tahan lama.',
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-[#A8C4B5]" />,
      title: 'Garansi Tukar Ukuran 7 Hari',
      desc: 'Salah pilih ukuran? Tukar mudah tanpa ribet dalam 7 hari.',
    },
    {
      icon: <Truck className="w-5 h-5 text-[#E0BC66]" />,
      title: 'Pengiriman Cepat Seluruh RI',
      desc: 'Dukungan ekspedisi JNE, SiCepat, J&T, hingga GoSend instan.',
    },
  ];

  return (
    <footer className="bg-[#133129] text-[#DCE5E0] pt-16 pb-24 lg:pb-12 border-t border-[#AABBB3]/30">
      {/* Value Propositions Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-2xl bg-[#78866B]/20 border border-[#78866B]/50">
          {valueProps.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#081F1C] border border-[#24443B] flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-0.5">{item.title}</h4>
                <p className="text-xs text-white leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#AABBB3]/30">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/brand/oepro-logo.webp"
                alt="OEPRO Brand"
                className="h-9 w-9 rounded-lg object-contain bg-[#081F1C] p-0.5 border border-[#AABBB3]/50 shadow-xs flex-shrink-0"
              />
              <span className="font-extrabold text-2xl tracking-tight text-white">
                OEPRO<span className="text-[#E0BC66]">.</span>
              </span>
            </div>
            <p className="text-sm text-white max-w-sm leading-relaxed">
              {storeInfo.tagline}. Menghadirkan pakaian esensial kasual berkelas dengan standar katun terbaik untuk kenyamanan aktivitas harian Anda sejak {storeInfo.established}.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://instagram.com/${storeInfo.contact.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:text-white hover:bg-white/10 transition"
                aria-label="Instagram OEPRO"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={storeInfo.contact.shopee}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-600/20 text-white hover:bg-orange-600/30 transition flex items-center gap-1 border border-orange-500/30"
              >
                <span>Shopee Official</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href={storeInfo.contact.tokopedia}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#A8C4B5]/30 text-white hover:bg-[#A8C4B5]/50 hover:text-[#081F1C] transition flex items-center gap-1 border border-[#A8C4B5]/40"
              >
                <span>Tokopedia</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Nav Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Kategori Produk</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/catalog?cat=polo-shirt" className="hover:text-white transition">
                  Kaos Polo Lacoste
                </Link>
              </li>
              <li>
                <Link to="/catalog?cat=basic-tshirt" className="hover:text-white transition">
                  Basic T-Shirt 24s
                </Link>
              </li>
              <li>
                <Link to="/catalog?cat=basic-longsleeve" className="hover:text-white transition">
                  Basic Longsleeve
                </Link>
              </li>
              <li>
                <Link to="/catalog" className="text-[#E0BC66] hover:text-white font-semibold transition">
                  Semua Koleksi &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Bantuan &amp; Layanan</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://wa.me/628113458177?text=Halo%20Admin%20OEPRO%2C%20saya%20ingin%20cek%20status%20pesanan%20saya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  Lacak Pesanan via WhatsApp
                </a>
              </li>
              <li>
                <span className="text-white">Garansi &amp; Retur Ukuran</span>
              </li>
              <li>
                <span className="text-white">Panduan Ukuran (Size Guide)</span>
              </li>
              <li>
                <span className="text-white">Syarat &amp; Ketentuan</span>
              </li>
            </ul>
          </div>

          {/* Store Info */}
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-white mb-4">Studio &amp; Workshop</h4>
            <div className="space-y-2.5 text-xs text-white">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                <span>
                  {storeInfo.location.address}, {storeInfo.location.city}, {storeInfo.location.province} {storeInfo.location.postal_code}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={createWhatsAppGeneralLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#A8C4B5] hover:text-white transition font-medium"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current text-[#A8C4B5] flex-shrink-0" />
                  <span>{storeInfo.contact.whatsapp} (Chat WhatsApp)</span>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white flex-shrink-0" />
                <span>{storeInfo.contact.email}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#AABBB3]/30">
              <span className="text-[11px] font-semibold text-white uppercase tracking-wider block mb-2">
                Metode Pembayaran
              </span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-white font-semibold">
                <span className="px-2 py-1 bg-[#696969]/30 rounded border border-[#696969]/70">QRIS</span>
                <span className="px-2 py-1 bg-[#696969]/30 rounded border border-[#696969]/70">BCA VA</span>
                <span className="px-2 py-1 bg-[#696969]/30 rounded border border-[#696969]/70">MANDIRI</span>
                <span className="px-2 py-1 bg-[#696969]/30 rounded border border-[#696969]/70">GOPAY</span>
                <span className="px-2 py-1 bg-[#696969]/30 rounded border border-[#696969]/70">COD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white gap-4">
          <p>&copy; {new Date().getFullYear()} {storeInfo.legal_name}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Dirancang khusus untuk pengalaman belanja nyaman &amp; minimalis</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
