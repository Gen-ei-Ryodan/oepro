import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Check, Star, ShieldCheck, Ruler } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SizeChartModal from '../components/SizeChartModal';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { createWhatsAppGeneralLink } from '../utils/whatsapp';
import { useProducts } from '../context/ProductContext';
import categoriesData from '../data/categories.json';
import reviewsData from '../data/reviews.json';
import storeInfo from '../data/store_info.json';

export default function Home() {
  const { products: productsData, categories: categoriesData } = useProducts();
  const [selectedCat, setSelectedCat] = useState('all');
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);

  const heroImage = '/assets/products/polo/black-stone/black-stone-worxt.webp';
  const fabricCombedImage = '/assets/products/tshirt/black-stone/black-stone-detail-1.webp';
  const fabricPiqueImage = '/assets/products/polo/black-stone/black-stone-detail-1.webp';

  const filteredProducts = selectedCat === 'all'
    ? productsData
    : productsData.filter((p) => p.category_slug === selectedCat);

  const displayedProducts = filteredProducts.slice(0, displayCount);

  return (
    <div className="space-y-6 sm:space-y-12 pb-24 sm:pb-16 bg-[#FBFBFA]">
      
      {/* 1. COMPACT HERO SECTION (STRICTLY LANDSCAPE ON MOBILE & DESKTOP) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6">
        <div className="relative rounded-2xl sm:rounded-3xl bg-neutral-950 text-white overflow-hidden border border-neutral-800 shadow-md h-[155px] xs:h-[170px] sm:h-auto sm:min-h-[250px]">
          
          <div className="grid grid-cols-12 items-center h-full">
            
            {/* Left Content (7 cols on mobile, 7 on desktop) */}
            <div className="col-span-7 sm:col-span-7 p-3 xs:p-4 sm:p-8 lg:p-12 space-y-1 xs:space-y-1.5 sm:space-y-4 z-10 flex flex-col justify-center h-full">
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 text-neutral-200 text-[8px] xs:text-[9px] sm:text-xs tracking-wider uppercase font-medium w-fit">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300" />
                <span>Koleksi Katun 100%</span>
              </div>

              <h1 className="text-xs xs:text-sm sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-snug line-clamp-2 sm:line-clamp-none">
                Pakaian Harian Nyaman, <br className="hidden sm:inline" />
                Katun Murni Esensial.
              </h1>

              <p className="hidden sm:block text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed max-w-lg">
                Polo rajut pique berpori halus dan kaos combed 24s sejuk tanpa campuran poliester gerah.
              </p>

              <div className="flex items-center gap-1.5 sm:gap-2.5 pt-0.5 sm:pt-1">
                <Link
                  to="/catalog"
                  className="px-2.5 py-1 xs:px-3 xs:py-1.5 sm:px-6 sm:py-2.5 bg-white text-neutral-950 font-bold text-[9px] xs:text-[10px] sm:text-sm rounded-full hover:bg-neutral-100 transition shadow-sm flex items-center gap-1 sm:gap-2 group whitespace-nowrap"
                >
                  <span>Belanja</span>
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  type="button"
                  onClick={() => setSizeChartOpen(true)}
                  className="px-2 py-1 xs:px-2.5 xs:py-1.5 sm:px-4 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-[9px] xs:text-[10px] sm:text-sm rounded-full border border-white/20 transition flex items-center gap-1 whitespace-nowrap"
                >
                  <Ruler className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Panduan</span> Ukuran
                </button>
              </div>

              {/* Micro USPs */}
              <div className="hidden sm:flex items-center gap-4 text-xs text-neutral-400 pt-2">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> 100% Cotton
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> Size XS - 8XL
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" /> Garansi 7 Hari
                </span>
              </div>
            </div>

            {/* Right Hero Image (5 cols) */}
            <div className="col-span-5 sm:col-span-5 h-full relative flex items-center justify-center p-1.5 xs:p-2 sm:p-4 bg-gradient-to-l from-neutral-900/80 via-transparent to-transparent overflow-hidden">
              <img
                src={heroImage}
                alt="OEPRO Model"
                className="h-[135px] xs:h-[150px] sm:h-auto sm:max-h-72 lg:max-h-80 w-auto object-contain rounded-lg drop-shadow-md"
              />
            </div>

          </div>
        </div>
      </div>

      {/* 2. CATEGORY PILLS BAR (INTERACTIVE FILTER TABS) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-1 border-b border-neutral-200">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => { setSelectedCat('all'); setDisplayCount(12); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                selectedCat === 'all'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Semua ({productsData.length})
            </button>
            <button
              type="button"
              onClick={() => { setSelectedCat('polo-shirt'); setDisplayCount(12); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                selectedCat === 'polo-shirt'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Kaos Polo (31)
            </button>
            <button
              type="button"
              onClick={() => { setSelectedCat('basic-tshirt'); setDisplayCount(12); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                selectedCat === 'basic-tshirt'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Basic T-Shirt (36)
            </button>
            <button
              type="button"
              onClick={() => { setSelectedCat('basic-longsleeve'); setDisplayCount(12); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                selectedCat === 'basic-longsleeve'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Longsleeve (32)
            </button>
          </div>

          <Link
            to="/catalog"
            className="text-xs font-semibold text-neutral-800 hover:text-neutral-950 hidden sm:flex items-center gap-1 whitespace-nowrap"
          >
            <span>Semua Katalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. KATALOG PRODUK (2 KOLOM DI MOBILE - MATCHES REFERENCE) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <div className="flex items-baseline gap-2">
            <h2 className="text-base sm:text-2xl font-bold text-neutral-900 tracking-tight">
              {selectedCat === 'all'
                ? 'Katalog Produk OEPRO'
                : selectedCat === 'polo-shirt'
                ? 'Koleksi Kaos Polo Premium'
                : selectedCat === 'basic-tshirt'
                ? 'Koleksi Basic T-Shirt 24s'
                : 'Koleksi Basic Longsleeve'}
            </h2>
            <span className="text-xs text-neutral-500 font-medium font-mono">
              ({filteredProducts.length} varian)
            </span>
          </div>

          <Link
            to="/catalog"
            className="text-xs font-medium text-neutral-600 hover:text-neutral-900 sm:hidden"
          >
            Filter &amp; Urutkan &rarr;
          </Link>
        </div>

        {/* Product Grid: 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        {displayCount < filteredProducts.length && (
          <div className="pt-6 sm:pt-8 text-center">
            <button
              type="button"
              onClick={() => setDisplayCount((prev) => prev + 12)}
              className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs sm:text-sm font-medium rounded-full shadow-xs transition"
            >
              Tampilkan Lebih Banyak ({filteredProducts.length - displayCount} tersisa)
            </button>
          </div>
        )}

      </section>

      {/* 4. BANNER PANDUAN UKURAN RESMI OEPRO */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-6 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white flex items-center justify-center text-neutral-800 shadow-2xs flex-shrink-0">
              <Ruler className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-neutral-900">
                Bingung Menentukan Ukuran Kaos atau Polo?
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-500">
                Gunakan tabel metrik LD &amp; PB centimeter serta foto panduan ukuran resmi OEPRO.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSizeChartOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-full transition flex items-center justify-center gap-2 shadow-xs whitespace-nowrap"
          >
            <span>Buka Panduan Ukuran</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 5. MATERIAL LAB & VALUE PROPOSITION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="p-5 sm:p-8 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
          
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8 space-y-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500">
              Standar Mutu OEPRO
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-neutral-900 tracking-tight">
              Dua Pilihan Material Katun Esensial
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Combed 24s */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#F8F8F7] border border-neutral-200/60 flex gap-4 items-center">
              <div className="w-20 h-24 rounded-lg overflow-hidden bg-white p-1 flex-shrink-0 border border-neutral-200">
                <img
                  src={fabricCombedImage}
                  alt="Katun Combed 24s"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900">100% Katun Combed 24s</h4>
                <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed">
                  Gramasi seimbang 175-185 gsm, serat katun disisir halus, tidak menerawang dan sangat adem dipakai harian di iklim tropis.
                </p>
                <Link to="/catalog?cat=basic-tshirt" className="text-[11px] font-semibold text-neutral-900 hover:underline inline-block pt-1">
                  Lihat Kaos Combed 24s &rarr;
                </Link>
              </div>
            </div>

            {/* Pique Hexagon */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#F8F8F7] border border-neutral-200/60 flex gap-4 items-center">
              <div className="w-20 h-24 rounded-lg overflow-hidden bg-white p-1 flex-shrink-0 border border-neutral-200">
                <img
                  src={fabricPiqueImage}
                  alt="Lacoste Pique Hexagon"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Lacoste Pique Hexagon</h4>
                <p className="text-[11px] sm:text-xs text-neutral-600 leading-relaxed">
                  Rajutan pori hexagon dengan kerah rajut 4 lapis anti-melar. Tampilan rapi untuk kerja maupun hangout santai.
                </p>
                <Link to="/catalog?cat=polo-shirt" className="text-[11px] font-semibold text-neutral-900 hover:underline inline-block pt-1">
                  Lihat Kaos Polo Pique &rarr;
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-xl font-bold text-neutral-900">
            Ulasan Pembeli Terverifikasi
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {reviewsData.map((rev) => (
            <div
              key={rev.id}
              className="p-3.5 sm:p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-2 text-xs"
            >
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(rev.rating)].map((_, idx) => (
                  <Star key={idx} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-neutral-700 leading-relaxed text-[11px] sm:text-xs">
                &ldquo;{rev.comment}&rdquo;
              </p>
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400">
                <span className="font-semibold text-neutral-800">{rev.user}</span>
                <span>{rev.city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Size Chart */}
      <SizeChartModal
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        initialTab="polo"
      />

    </div>
  );
}
