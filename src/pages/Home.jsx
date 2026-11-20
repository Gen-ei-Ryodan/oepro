import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Check, Star, ShieldCheck, Ruler, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SizeChartModal from '../components/SizeChartModal';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { createWhatsAppGeneralLink } from '../utils/whatsapp';
import { useProducts } from '../context/ProductContext';
import reviewsData from '../data/reviews.json';
import storeInfo from '../data/store_info.json';
import { resolveImageUrl } from '../services/api';

export default function Home() {
  const { products: productsData, categories: categoriesData, banners: bannersData, bannerLayout } = useProducts();
  const [selectedCat, setSelectedCat] = useState('all');
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(12);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  const activeBanners = (bannersData && bannersData.length > 0)
    ? bannersData.filter((b) => b.isActive !== false)
    : [
        {
          id: 'banner-1',
          headline: 'Nyaman Dipakai, Mudah Dipadukan.',
          subheadline: 'Kaos berbahan Cotton Combed 24s, 100% katun dengan potongan regular fit yang nyaman untuk semua.',
          tag: 'Koleksi Katun 100%',
          ctaText: 'Belanja',
          ctaLink: '/catalog',
          image: '/assets/products/polo/black-stone/black-stone-oepro.webp',
        }
      ];

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBannerIdx((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const currentBanner = activeBanners[currentBannerIdx] || activeBanners[0];
  const heroImage = currentBanner.image ? resolveImageUrl(currentBanner.image) : '/assets/products/polo/black-stone/black-stone-oepro.webp';
  const heroLayout = currentBanner.imageLayout || currentBanner.layout || bannerLayout;
  const isHeroFull = heroLayout === 'full';
  const isHeroBg = heroLayout === 'background';
  const fabricCombedImage = '/assets/fabric/material-combed-24s.jpg';
  const fabricPiqueImage = '/assets/fabric/material-pique-hexagon.jpg';

  const filteredProducts = selectedCat === 'all'
    ? productsData
    : productsData.filter((p) => p.category_slug === selectedCat);

  const displayedProducts = filteredProducts.slice(0, displayCount);

  return (
    <div className="space-y-6 sm:space-y-12 pb-24 sm:pb-16 bg-[#081F1C]">
      
      {/* 1. COMPACT HERO SECTION (MULTIPLE BANNER SUPPORT - FULL WIDTH / CONTAINED / BACKGROUND) */}
      <div className={isHeroFull ? "w-full pt-0" : "max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6"}>
        <div className={`relative ${isHeroFull ? 'w-full rounded-none border-y sm:min-h-[280px]' : 'rounded-2xl sm:rounded-3xl border sm:min-h-[250px]'} bg-[#133129] text-white overflow-hidden border-[#AABBB3]/30 shadow-md h-[160px] xs:h-[180px] sm:h-auto group/banner`}>

          {/* Background banner mode: image fills the whole hero + dark scrim on the left */}
          {isHeroBg && (
            <>
              <img
                key={heroImage}
                src={heroImage}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-[70%_center] sm:object-[center] transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#081F1C] via-[#081F1C]/85 to-[#081F1C]/10 sm:via-[#081F1C]/70 sm:to-transparent" />
            </>
          )}

          <div className={isHeroFull ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-12 items-center h-full relative" : "grid grid-cols-12 items-center h-full relative"}>
            
            {/* Left Content (7 cols on mobile, 7 on desktop) */}
            <div className={`${isHeroBg ? 'col-span-12 sm:col-span-7' : 'col-span-7 sm:col-span-7'} p-3 xs:p-4 sm:p-8 lg:p-12 space-y-1 xs:space-y-1.5 sm:space-y-4 z-10 flex flex-col justify-center h-full`}>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#A8C4B5] border border-[#A8C4B5]/40 text-[#081F1C] text-[8px] xs:text-[9px] sm:text-xs tracking-wider uppercase font-semibold w-fit shadow-xs">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#C9A24D]" />
                <span>{currentBanner.tag || 'Koleksi Katun 100%'}</span>
              </div>

              <h1 className="text-xs xs:text-sm sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-snug line-clamp-2 sm:line-clamp-none">
                {currentBanner.headline || 'Nyaman Dipakai, Mudah Dipadukan.'}
              </h1>

              <p className="hidden sm:block text-xs sm:text-sm text-[#DCE5E0] font-normal leading-relaxed max-w-lg">
                {currentBanner.subheadline || 'Kaos berbahan Cotton Combed 24s, 100% katun dengan potongan regular fit yang nyaman untuk semua.'}
              </p>

              <div className="flex items-center gap-1.5 sm:gap-2.5 pt-0.5 sm:pt-1">
                <Link
                  to={currentBanner.ctaLink || '/catalog'}
                  className="px-2.5 py-1 xs:px-3 xs:py-1.5 sm:px-6 sm:py-2.5 bg-[#A8C4B5] text-[#081F1C] font-bold text-[9px] xs:text-[10px] sm:text-sm rounded-full hover:bg-[#97b5a5] transition shadow-sm flex items-center gap-1 sm:gap-2 group whitespace-nowrap"
                >
                  <span>{currentBanner.ctaText || 'Belanja'}</span>
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>

                <button
                  type="button"
                  onClick={() => setSizeChartOpen(true)}
                  className="px-2 py-1 xs:px-2.5 xs:py-1.5 sm:px-4 sm:py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-[9px] xs:text-[10px] sm:text-sm rounded-full border border-white/25 transition flex items-center gap-1 whitespace-nowrap backdrop-blur-xs"
                >
                  <Ruler className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                  <span className="hidden sm:inline">Panduan</span> Ukuran
                </button>
              </div>

              {/* Micro USPs */}
              <div className="hidden sm:flex items-center gap-4 text-xs text-white pt-2">
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#E0BC66]" /> 100% Cotton
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#E0BC66]" /> Size XS - 8XL
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#E0BC66]" /> Garansi 7 Hari
                </span>
              </div>
            </div>

            {/* Right Hero Image (5 cols) - hidden in background mode (image already fills hero) */}
            {!isHeroBg && (
              <div className="col-span-5 sm:col-span-5 h-full relative flex items-center justify-center p-1.5 xs:p-2 sm:p-4 bg-gradient-to-l from-[#133129] via-transparent to-transparent overflow-hidden">
                <img
                  key={heroImage}
                  src={heroImage}
                  alt={currentBanner.headline || 'OEPRO Model'}
                  className={isHeroFull
                    ? "h-full w-full object-cover sm:max-h-80 transition-opacity duration-500"
                    : "h-[135px] xs:h-[150px] sm:h-auto sm:max-h-72 lg:max-h-80 w-auto object-contain rounded-lg drop-shadow-md transition-opacity duration-500"}
                />
              </div>
            )}

          </div>

          {/* Multiple Banners Navigation & Dots */}
          {activeBanners.length > 1 && (
            <>
              {/* Previous / Next Arrows */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentBannerIdx((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover/banner:opacity-100 transition z-20"
                aria-label="Banner Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentBannerIdx((prev) => (prev + 1) % activeBanners.length);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover/banner:opacity-100 transition z-20"
                aria-label="Banner Selanjutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Indicator Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
                {activeBanners.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    onClick={() => setCurrentBannerIdx(dotIdx)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentBannerIdx === dotIdx ? 'w-5 bg-[#A8C4B5]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Ke Banner ${dotIdx + 1}`}
                  />
                ))}
              </div>
            </>
          )}

        </div>
      </div>

      {/* 2. CATEGORY PILLS BAR (INTERACTIVE FILTER TABS) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-1 border-b border-[#133129]">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => { setSelectedCat('all'); setDisplayCount(12); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                selectedCat === 'all'
                  ? 'bg-[#A8C4B5] text-[#081F1C] shadow-xs'
                  : 'bg-[#133129] text-[#DCE5E0] hover:bg-[#24443B]'
              }`}
            >
              Semua ({productsData.length})
            </button>
            <button
              type="button"
              onClick={() => { setSelectedCat('polo-shirt'); setDisplayCount(12); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                selectedCat === 'polo-shirt'
                  ? 'bg-[#A8C4B5] text-[#081F1C] shadow-xs'
                  : 'bg-[#133129] text-[#DCE5E0] hover:bg-[#24443B]'
              }`}
            >
              Kaos Polo (31)
            </button>
            <button
              type="button"
              onClick={() => { setSelectedCat('basic-tshirt'); setDisplayCount(12); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                selectedCat === 'basic-tshirt'
                  ? 'bg-[#A8C4B5] text-[#081F1C] shadow-xs'
                  : 'bg-[#133129] text-[#DCE5E0] hover:bg-[#24443B]'
              }`}
            >
              Basic T-Shirt (36)
            </button>
            <button
              type="button"
              onClick={() => { setSelectedCat('basic-longsleeve'); setDisplayCount(12); }}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                selectedCat === 'basic-longsleeve'
                  ? 'bg-[#A8C4B5] text-[#081F1C] shadow-xs'
                  : 'bg-[#133129] text-[#DCE5E0] hover:bg-[#24443B]'
              }`}
            >
              Longsleeve (32)
            </button>
          </div>

          <Link
            to="/catalog"
            className="text-xs font-semibold text-[#DCE5E0] hover:text-[#A8C4B5] hidden sm:flex items-center gap-1 whitespace-nowrap transition-colors"
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
            <h2 className="text-base sm:text-2xl font-bold text-white tracking-tight">
              {selectedCat === 'all'
                ? 'Katalog Produk OEPRO'
                : selectedCat === 'polo-shirt'
                ? 'Koleksi Kaos Polo Premium'
                : selectedCat === 'basic-tshirt'
                ? 'Koleksi Basic T-Shirt 24s'
                : 'Koleksi Basic Longsleeve'}
            </h2>
            <span className="text-xs text-white font-medium font-mono">
              ({filteredProducts.length} varian)
            </span>
          </div>

          <Link
            to="/catalog"
            className="text-xs font-medium text-white hover:text-[#DCE5E0] sm:hidden"
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
              className="px-6 py-2.5 bg-[#A8C4B5] hover:bg-[#97b5a5] text-[#081F1C] text-xs sm:text-sm font-semibold rounded-full shadow-xs transition"
            >
              Tampilkan Lebih Banyak ({filteredProducts.length - displayCount} tersisa)
            </button>
          </div>
        )}

      </section>

      {/* 4. BANNER PANDUAN UKURAN RESMI OEPRO */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-6 rounded-2xl bg-[#133129] border border-[#24443B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#081F1C] flex items-center justify-center text-[#A8C4B5] shadow-2xs flex-shrink-0">
              <Ruler className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Bingung Menentukan Ukuran Kaos atau Polo?
              </h3>
              <p className="text-[11px] sm:text-xs text-white">
                Gunakan tabel metrik LD &amp; PB centimeter serta foto panduan ukuran resmi OEPRO.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSizeChartOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#A8C4B5] hover:bg-[#97b5a5] text-[#081F1C] text-xs font-semibold rounded-full transition flex items-center justify-center gap-2 shadow-xs whitespace-nowrap"
          >
            <span>Buka Panduan Ukuran</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 5. MATERIAL LAB & VALUE PROPOSITION */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-b from-[#153528] to-[#0F2A24] border border-[#24443B] shadow-2xs">
          
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8 space-y-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#E0BC66]">
              Standar Mutu OEPRO
            </span>
            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight">
              Dua Pilihan Material Katun Esensial
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Combed 24s */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#081F1C]/60 border border-[#24443B] flex gap-4 items-center">
              <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-lg overflow-hidden bg-white p-1 flex-shrink-0 border border-[#24443B]">
                <img
                  src={fabricCombedImage}
                  alt="Katun Combed 24s"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-white">100% Katun Combed 24s</h4>
                <p className="text-[11px] sm:text-xs text-white leading-relaxed">
                  Gramasi seimbang 175-185 gsm, serat katun disisir halus, tidak menerawang dan sangat adem dipakai harian di iklim tropis.
                </p>
                <Link to="/catalog?cat=basic-tshirt" className="text-[11px] font-semibold text-[#E0BC66] hover:underline inline-block pt-1">
                  Lihat Kaos Combed 24s &rarr;
                </Link>
              </div>
            </div>

            {/* Pique Hexagon */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#081F1C]/60 border border-[#24443B] flex gap-4 items-center">
              <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-lg overflow-hidden bg-white p-1 flex-shrink-0 border border-[#24443B]">
                <img
                  src={fabricPiqueImage}
                  alt="Lacoste Pique Hexagon"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs sm:text-sm font-bold text-white">Lacoste Pique Hexagon</h4>
                <p className="text-[11px] sm:text-xs text-white leading-relaxed">
                  Rajutan pori hexagon dengan kerah rajut 4 lapis anti-melar. Tampilan rapi untuk kerja maupun hangout santai.
                </p>
                <Link to="/catalog?cat=polo-shirt" className="text-[11px] font-semibold text-[#E0BC66] hover:underline inline-block pt-1">
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
          <h3 className="text-sm sm:text-xl font-bold text-white">
            Ulasan Pembeli Terverifikasi
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {reviewsData.map((rev) => (
            <div
              key={rev.id}
              className="p-3.5 sm:p-4 rounded-xl bg-[#133129] border border-[#24443B] shadow-2xs space-y-2 text-xs"
            >
              <div className="flex items-center gap-1 text-[#E0BC66]">
                {[...Array(rev.rating)].map((_, idx) => (
                  <Star key={idx} className="w-3 h-3 fill-[#E0BC66] text-[#E0BC66]" />
                ))}
              </div>
              <p className="text-[#DCE5E0] leading-relaxed text-[11px] sm:text-xs">
                &ldquo;{rev.comment}&rdquo;
              </p>
              <div className="pt-2 border-t border-[#24443B] flex items-center justify-between text-[10px] text-white">
                <span className="font-semibold text-white">{rev.user}</span>
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
