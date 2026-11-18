import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  Share2,
  ShieldCheck,
  Truck,
  Ruler,
  Check,
  Heart,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SizeChartModal from '../components/SizeChartModal';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { createWhatsAppProductLink } from '../utils/whatsapp';
import { getProductPriceBySize, getProductOriginalPriceBySize } from '../utils/pricing';

export default function ProductDetail() {
  const { products: productsData } = useProducts();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen, totalItems } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = productsData.find((p) => p.id === id);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('desc');
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      setSelectedImageIndex(0);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product, id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-sm text-neutral-500 mb-6">Produk yang Anda cari mungkin sudah tidak tersedia.</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog</span>
        </Link>
      </div>
    );
  }

  const isFav = isInWishlist(product.id);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const images = product.images && product.images.length > 0
    ? product.images.map((img) => `/${img.replace(/^\//, '')}`)
    : ['/assets/brand/oepro-logo.webp'];

  const currentPrice = getProductPriceBySize(product, selectedSize);
  const currentOriginalPrice = getProductOriginalPriceBySize(product, selectedSize);

  const handleAddToCart = () => {
    const success = addToCart(product, selectedColor, selectedSize, quantity, currentPrice);
    if (success) {
      setIsCartOpen(true);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, selectedColor, selectedSize, quantity, currentPrice);
    const waUrl = createWhatsAppProductLink(product, selectedColor, selectedSize, quantity, currentPrice);
    window.open(waUrl, '_blank');
  };

  const handleColorChange = (c) => {
    setSelectedColor(c);
    if (c.productId && c.productId !== product.id) {
      navigate(`/product/${c.productId}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Lihat produk ${product.name} di OEPRO Official Store`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan produk berhasil disalin!');
    }
  };

  const relatedProducts = productsData
    .filter((p) => p.category_slug === product.category_slug && p.id !== product.id)
    .slice(0, 4);

  const initialSizeTab = product.category_slug === 'polo-shirt'
    ? 'polo'
    : product.category_slug === 'basic-longsleeve'
    ? 'longsleeve'
    : 'tshirt';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8 pb-32 sm:pb-16 bg-[#FBFBFA]">
      
      {/* 1. MOBILE TOP APP BAR (MATCHES REFERENCE SCREEN 3) */}
      <div className="sm:hidden flex items-center justify-between mb-3 py-1">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white border border-neutral-200/80 text-neutral-800 shadow-2xs"
          aria-label="Kembali"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-sm font-bold text-neutral-900">Detail Produk</span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            className="p-2 rounded-full bg-white border border-neutral-200/80 text-neutral-800 shadow-2xs"
            aria-label="Favorit"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'text-red-500 fill-red-500' : 'text-neutral-700'}`} />
          </button>
          
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full bg-white border border-neutral-200/80 text-neutral-800 shadow-2xs"
            aria-label="Keranjang"
          >
            <ShoppingBag className="w-4 h-4 text-neutral-700" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-neutral-950 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop Breadcrumb */}
      <nav className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 mb-6">
        <Link to="/" className="hover:text-neutral-900 transition">Beranda</Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-neutral-900 transition">Katalog</Link>
        <span>/</span>
        <Link to={`/catalog?cat=${product.category_slug}`} className="hover:text-neutral-900 font-medium text-neutral-700 transition">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-neutral-900 font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14">
        
        {/* Left: Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
          
          {/* Main Large Image */}
          <div className="relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F8F8F7] border border-neutral-200/70 shadow-2xs p-4 sm:p-8 flex items-center justify-center">
            <img
              src={images[selectedImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-contain object-center transition-all duration-300"
              onError={(e) => {
                e.target.src = '/assets/brand/oepro-logo.webp';
              }}
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
              {product.discount_percent > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-red-600 text-white rounded-md shadow-xs">
                  -{product.discount_percent}%
                </span>
              )}
              {product.is_best_seller && (
                <span className="px-2 py-0.5 text-[10px] font-medium uppercase bg-neutral-900/90 text-white rounded-md shadow-xs">
                  Best Seller
                </span>
              )}
              {!product.is_best_seller && product.is_new_arrival && (
                <span className="px-2 py-0.5 text-[10px] font-medium uppercase bg-[#2D4A3E] text-white rounded-md shadow-xs">
                  New
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-neutral-600 hover:text-neutral-950 hover:bg-white shadow-xs transition"
              title="Bagikan Tautan"
              aria-label="Bagikan Tautan"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border transition-all flex-shrink-0 bg-[#F8F8F7] relative p-1 flex items-center justify-center ${
                    selectedImageIndex === idx
                      ? 'border-neutral-900 ring-2 ring-neutral-900'
                      : 'border-neutral-200/80 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Lihat gambar ${idx + 1}`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain object-center" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchase Options (6 cols) */}
        <div className="lg:col-span-6 space-y-5 sm:space-y-6">
          
          <div>
            {/* Material Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>{product.category_slug === 'polo-shirt' ? '100% Lacoste Pique Cotton' : '100% Cotton Combed 24s'}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-neutral-950 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating & SKU */}
            <div className="flex items-center gap-3 mt-2 text-xs text-neutral-600">
              <div className="flex items-center gap-1 font-semibold text-neutral-900">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{product.rating}</span>
                <span className="text-neutral-400 font-normal">({product.reviews_count || 120} ulasan)</span>
              </div>
              <span>&bull;</span>
              <span className="text-neutral-500">Terjual {product.sold_count} pcs</span>
              <span>&bull;</span>
              <span className="font-mono text-neutral-400">SKU: {product.sku}</span>
            </div>

            {/* Price Display */}
            <div className="mt-3 sm:mt-4 flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-neutral-950 font-mono">
                {formatRupiah(currentPrice)}
              </span>
              {currentOriginalPrice > currentPrice && (
                <span className="text-sm sm:text-base text-neutral-400 line-through font-mono">
                  {formatRupiah(currentOriginalPrice)}
                </span>
              )}
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                Size {selectedSize}
              </span>
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-2 pt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-900">
                Pilihan Warna: <span className="font-normal text-neutral-600">{selectedColor ? (selectedColor.name || selectedColor) : ''}</span>
              </span>
              <span className="text-[11px] text-neutral-400">{product.colors ? product.colors.length : 0} Warna</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-0.5">
              {product.colors && product.colors.map((c, i) => {
                const colorName = c.name || c;
                const isSelected = selectedColor && (selectedColor.name || selectedColor) === colorName;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleColorChange(c)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition border ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-neutral-300"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[11px] font-medium">{colorName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector (Pill buttons - matches reference Screen 3) */}
          <div className="space-y-2 pt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-neutral-900">
                Pilih Ukuran: <span className="font-mono text-neutral-600 font-bold">{selectedSize}</span>
              </span>

              <button
                type="button"
                onClick={() => setSizeChartOpen(true)}
                className="text-neutral-900 hover:text-neutral-600 font-semibold underline flex items-center gap-1 text-xs"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Panduan Ukuran</span>
              </button>
            </div>

            <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-2">
              {product.sizes && product.sizes.map((sz) => {
                const szPrice = getProductPriceBySize(product, sz);
                const isSelected = selectedSize === sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 px-1 text-xs font-mono rounded-xl border transition flex flex-col items-center justify-center min-h-[48px] ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs ring-1 ring-neutral-900'
                        : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    <span className="font-bold">{sz}</span>
                    <span className={`text-[10px] tracking-tight ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {formatRupiah(szPrice)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Stock (Desktop & Tablet) */}
          <div className="space-y-2 pt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-900">Jumlah:</span>
              <span className="text-xs text-neutral-500 font-normal">
                Stok Ready: <strong className="text-neutral-900 font-medium">{product.stock || 50} pcs</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex items-center border border-neutral-300 rounded-xl bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2 hover:bg-neutral-100 text-neutral-700 font-bold transition text-sm min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold text-neutral-900 min-w-[36px] text-center font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 50, quantity + 1))}
                  className="px-3.5 py-2 hover:bg-neutral-100 text-neutral-700 font-bold transition text-sm min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  +
                </button>
              </div>

              {/* Desktop action buttons */}
              <div className="hidden sm:grid grid-cols-2 gap-2.5 flex-1">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="py-3 px-4 bg-white border border-neutral-900 hover:bg-neutral-50 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>+ Keranjang</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 min-h-[44px] shadow-sm"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current" />
                  <span>Pesan via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Guarantees Strip */}
          <div className="p-3.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-600 space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span><strong>Garansi Tukar Ukuran 7 Hari:</strong> Tidak pas? Kami tukar tanpa dipersulit.</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-neutral-700 flex-shrink-0" />
              <span><strong>Pengiriman Cepat Surabaya:</strong> Siap kirim hari ini pukul 15.00 WIB.</span>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs: Description, Specs, Shipping */}
      <div className="mt-10 sm:mt-16 pt-6 border-t border-neutral-200">
        <div className="flex items-center gap-3 sm:gap-6 border-b border-neutral-200 text-xs sm:text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('desc')}
            className={`pb-3 transition relative ${
              activeTab === 'desc' ? 'text-neutral-950 border-b-2 border-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Deskripsi Produk
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-3 transition relative ${
              activeTab === 'specs' ? 'text-neutral-950 border-b-2 border-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Spesifikasi Bahan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 transition relative ${
              activeTab === 'shipping' ? 'text-neutral-950 border-b-2 border-neutral-950 font-bold' : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Garansi &amp; Retur
          </button>
        </div>

        <div className="py-4 text-xs sm:text-sm text-neutral-700 leading-relaxed max-w-4xl space-y-3">
          {activeTab === 'desc' && (
            <div className="space-y-3">
              <p>{product.description}</p>
              {product.features && (
                <ul className="space-y-1 pl-4 list-disc text-neutral-600">
                  {product.features.map((feat, i) => (
                    <li key={i}>{feat}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-neutral-200">
                <span className="text-neutral-400 block text-[10px]">Material Katun</span>
                <strong className="text-neutral-900">{product.material}</strong>
              </div>
              <div className="p-3 bg-white rounded-xl border border-neutral-200">
                <span className="text-neutral-400 block text-[10px]">Fit / Potongan</span>
                <strong className="text-neutral-900">{product.fit || 'Regular Fit Unisex'}</strong>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <p className="text-xs text-neutral-600">
              Garansi penukaran ukuran berlaku 7 hari kerja sejak barang diterima dengan syarat tag masih terpasang dan baju belum dicuci.
            </p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-10 sm:mt-14 pt-8 border-t border-neutral-200">
          <h2 className="text-base sm:text-xl font-bold text-neutral-950 mb-4">
            Varian Lain yang Serupa
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* 2. STICKY BOTTOM ACTION BAR (MOBILE ONLY) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,16px))] z-50 flex items-center gap-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all flex-shrink-0 ${
            isFav ? "border-red-200 bg-red-50 text-red-500" : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
          }`}
          aria-label="Favorit"
        >
          <Heart className={`w-5 h-5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 h-12 bg-white border border-neutral-900 text-neutral-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs hover:bg-neutral-50 active:scale-[0.98] transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>+ Keranjang</span>
        </button>

        <button
          type="button"
          onClick={handleBuyNow}
          className="flex-1 h-12 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition"
        >
          <WhatsAppIcon className="w-4 h-4 fill-current" />
          <span>Pesan WA</span>
        </button>
      </div>

      <SizeChartModal
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        initialTab={initialSizeTab}
      />

    </div>
  );
}
