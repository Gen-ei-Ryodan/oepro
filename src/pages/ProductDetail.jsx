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
  const hasVariants = Array.isArray(product?.variants) && product.variants.length > 0;
  const has2LevelVariants = hasVariants && product.variants.some((variant) => Array.isArray(variant.options) && variant.options.length > 0);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('L');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [userSelectedThumb, setUserSelectedThumb] = useState(null);
  const [activeTab, setActiveTab] = useState('desc');
  const [sizeChartOpen, setSizeChartOpen] = useState(false);

  useEffect(() => {
    if (product) {
      if (has2LevelVariants) {
        const firstV1 = product.variants[0];
        setSelectedColor({ name: firstV1.name, hex: firstV1.hex });
        if (firstV1.options?.length > 0) {
          setSelectedSize(firstV1.options[0].name);
        }
      } else {
        if (product.colors && product.colors.length > 0) {
          setSelectedColor(product.colors[0]);
        }
        if (hasVariants) {
          setSelectedSize(product.variants[0].name);
        } else if (product.sizes && product.sizes.length > 0) {
          setSelectedSize(product.sizes[0]);
        }
      }
      setSelectedImageIndex(0);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product, id, has2LevelVariants, hasVariants]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-sm text-white mb-6">Produk yang Anda cari mungkin sudah tidak tersedia.</p>
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

  const activeLevel1 = has2LevelVariants
    ? product.variants.find((v) => v.name === (selectedColor?.name || selectedColor)) || product.variants[0]
    : null;
  const activeLevel2 = (activeLevel1 && Array.isArray(activeLevel1.options))
    ? activeLevel1.options.find((o) => o.name === selectedSize) || activeLevel1.options[0]
    : null;

  const activeFlatVariant = hasVariants && !has2LevelVariants
    ? product.variants.find((variant) => variant.name === selectedSize) || product.variants[0]
    : null;

  const currentPrice = (activeLevel2 && activeLevel2.price !== undefined)
    ? activeLevel2.price
    : (activeFlatVariant && activeFlatVariant.price !== undefined)
      ? activeFlatVariant.price
    : getProductPriceBySize(product, selectedSize);

  const currentOriginalPrice = (activeLevel2 && activeLevel2.original_price !== undefined)
    ? activeLevel2.original_price
    : (activeFlatVariant && activeFlatVariant.original_price !== undefined)
      ? activeFlatVariant.original_price
      : getProductOriginalPriceBySize(product, selectedSize);

  const currentStock = (activeLevel2 && activeLevel2.stock !== undefined)
    ? activeLevel2.stock
    : (activeFlatVariant && activeFlatVariant.stock !== undefined)
      ? activeFlatVariant.stock
      : (product.stock || 50);

  const isOutOfStock = currentStock <= 0;

  const currentDiscountPercent = currentOriginalPrice > currentPrice
    ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
    : 0;

  const activeVariantImage = (activeLevel2 && activeLevel2.image)
    ? (activeLevel2.image.startsWith("http") || activeLevel2.image.startsWith("data:") ? activeLevel2.image : `/${activeLevel2.image.replace(/^\//, "")}`)
    : (activeFlatVariant && activeFlatVariant.image)
      ? (activeFlatVariant.image.startsWith("http") || activeFlatVariant.image.startsWith("data:") ? activeFlatVariant.image : `/${activeFlatVariant.image.replace(/^\//, "")}`)
    : (activeLevel1 && activeLevel1.image)
      ? (activeLevel1.image.startsWith("http") || activeLevel1.image.startsWith("data:") ? activeLevel1.image : `/${activeLevel1.image.replace(/^\//, "")}`)
      : null;

  const currentDisplayImage = userSelectedThumb || activeVariantImage || images[selectedImageIndex] || images[0];

  const handleAddToCart = () => {
    if (isOutOfStock) {
      alert("Maaf, stok varian kombinasi ini sedang habis.");
      return;
    }
    const success = addToCart(product, selectedColor, selectedSize, quantity, currentPrice);
    if (success) {
      setIsCartOpen(true);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) {
      alert("Maaf, stok varian kombinasi ini sedang habis.");
      return;
    }
    addToCart(product, selectedColor, selectedSize, quantity, currentPrice);
    const waUrl = createWhatsAppProductLink(product, selectedColor, selectedSize, quantity, currentPrice);
    window.open(waUrl, "_blank");
  };

  const handleColorChange = (c) => {
    setSelectedColor(c);
    setUserSelectedThumb(null);
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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8 pb-32 sm:pb-16 bg-[#081F1C]">
      
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

        <span className="text-sm font-bold text-white">Detail Produk</span>

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
      <nav className="hidden sm:flex items-center gap-2 text-xs text-white mb-6">
        <Link to="/" className="hover:text-white transition">Beranda</Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-white transition">Katalog</Link>
        <span>/</span>
        <Link to={`/catalog?cat=${product.category_slug}`} className="hover:text-white font-medium text-[#DCE5E0] transition">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-white font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14">
        
        {/* Left: Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
          
          {/* Main Large Image */}
          <div className="relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F8F8F7] border border-neutral-200/70 shadow-2xs p-4 sm:p-8 flex items-center justify-center">
            <img
              src={currentDisplayImage}
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
                  onClick={() => { setSelectedImageIndex(idx); setUserSelectedThumb(images[idx]); }}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border transition-all flex-shrink-0 bg-[#F8F8F7] relative p-1 flex items-center justify-center ${
                    selectedImageIndex === idx
                      ? 'border-neutral-900 ring-2 ring-[#A8C4B5]'
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#24443B] border border-[#2E5147] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>{product.category_slug === 'polo-shirt' ? 'pique hexagon premium' : '100% Cotton Combed 24s'}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Rating & SKU */}
            <div className="flex items-center gap-3 mt-2 text-xs text-white">
              <div className="flex items-center gap-1 font-semibold text-white">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{product.rating}</span>
                <span className="text-[#8FA39B] font-normal">({product.reviews_count || 120} ulasan)</span>
              </div>
              <span>&bull;</span>
              <span className="text-white">Terjual {product.sold_count} pcs</span>
              <span>&bull;</span>
              <span className="font-mono text-[#8FA39B]">SKU: {product.sku}</span>
            </div>

            {/* Price Display */}
            <div className="mt-3 sm:mt-4 flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-bold text-white font-mono">
                {formatRupiah(currentPrice)}
              </span>
              {currentOriginalPrice > currentPrice && (
                <span className="text-sm sm:text-base text-[#8FA39B] line-through font-mono">
                  {formatRupiah(currentOriginalPrice)}
                </span>
              )}
              {currentDiscountPercent > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-xs">
                  -{currentDiscountPercent}%
                </span>
              )}
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#24443B] text-[#DCE5E0] border border-[#2E5147]">
                Size {selectedSize}
              </span>
              {isOutOfStock && (
                <span className="px-2.5 py-0.5 rounded-md bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider">
                  Habis
                </span>
              )}
            </div>
          </div>

          {/* Color Selector */}
          <div className="space-y-2 pt-2 border-t border-[#24443B]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">
                Pilihan Warna: <span className="font-normal text-white">{selectedColor ? (selectedColor.name || selectedColor) : ''}</span>
              </span>
              <span className="text-[11px] text-[#8FA39B]">{product.colors ? product.colors.length : 0} Warna</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-0.5">
              {has2LevelVariants ? (
                product.variants.map((v1, i) => {
                  const isSelected = selectedColor && (selectedColor.name || selectedColor) === v1.name;
                  return (
                    <button
                      key={v1.id || i}
                      type="button"
                      onClick={() => {
                        setSelectedColor({ name: v1.name, hex: v1.hex });
                        setUserSelectedThumb(null);
                        if (v1.options && v1.options.length > 0 && !v1.options.some((o) => o.name === selectedSize)) {
                          setSelectedSize(v1.options[0].name);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition border ${
                        isSelected
                          ? 'bg-[#A8C4B5] text-[#081F1C] border-[#A8C4B5] shadow-xs'
                          : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-neutral-300"
                        style={{ backgroundColor: v1.hex }}
                      />
                      <span className="text-[11px] font-medium">{v1.name}</span>
                    </button>
                  );
                })
              ) : (
                product.colors && product.colors.map((c, i) => {
                  const colorName = c.name || c;
                  const isSelected = selectedColor && (selectedColor.name || selectedColor) === colorName;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleColorChange(c)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition border ${
                        isSelected
                          ? 'bg-[#A8C4B5] text-[#081F1C] border-[#A8C4B5] shadow-xs'
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
                })
              )}
            </div>
          </div>

          {/* Size Selector (Pill buttons - matches reference Screen 3) */}
          <div className="space-y-2 pt-2 border-t border-[#24443B]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">
                Pilih Ukuran: <span className="font-mono text-white font-bold">{selectedSize}</span>
              </span>

              <button
                type="button"
                onClick={() => setSizeChartOpen(true)}
                className="text-white hover:text-white font-semibold underline flex items-center gap-1 text-xs"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Panduan Ukuran</span>
              </button>
            </div>

            <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-6 gap-2">
              {hasVariants && activeLevel1 ? (
                activeLevel1.options.map((v2) => {
                  const isSelected = selectedSize === v2.name;
                  return (
                    <button
                      key={v2.id || v2.name}
                      type="button"
                      onClick={() => { setSelectedSize(v2.name); setUserSelectedThumb(null); }}
                      className={`py-2 px-1 text-xs font-mono rounded-xl border transition flex flex-col items-center justify-center min-h-[48px] ${
                        isSelected
                          ? 'bg-[#A8C4B5] text-[#081F1C] border-[#A8C4B5] shadow-xs ring-1 ring-[#A8C4B5]'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                      }`}
                    >
                      <span className="font-bold">{v2.name}</span>
                      <span className={`text-[10px] tracking-tight ${isSelected ? 'text-[#081F1C]/70' : 'text-neutral-500'}`}>
                        {formatRupiah(v2.price || currentPrice)}
                      </span>
                    </button>
                  );
                })
              ) : (
                (activeFlatVariant ? product.variants.map((variant) => variant.name) : product.sizes || []).map((sz) => {
                  const variant = activeFlatVariant && product.variants.find((item) => item.name === sz);
                  const szPrice = variant?.price ?? getProductPriceBySize(product, sz);
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => { setSelectedSize(sz); setUserSelectedThumb(null); }}
                      className={`py-2 px-1 text-xs font-mono rounded-xl border transition flex flex-col items-center justify-center min-h-[48px] ${
                        isSelected
                          ? 'bg-[#A8C4B5] text-[#081F1C] border-[#A8C4B5] shadow-xs ring-1 ring-[#A8C4B5]'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                      }`}
                    >
                      <span className="font-bold">{sz}</span>
                      <span className={`text-[10px] tracking-tight ${isSelected ? 'text-[#081F1C]/70' : 'text-neutral-500'}`}>
                        {formatRupiah(szPrice)}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Quantity & Stock (Desktop & Tablet) */}
          <div className="space-y-2 pt-2 border-t border-[#24443B]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Jumlah:</span>
              <span className="text-xs text-white font-normal">
                Stok Ready: {isOutOfStock ? (
                  <strong className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-md border border-red-200">Stok Habis (0 pcs)</strong>
                ) : (
                  <strong className="text-white font-medium">{currentStock} pcs</strong>
                )}
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
                  onClick={() => setQuantity(Math.min(currentStock || 50, quantity + 1))}
                  className="px-3.5 py-2 hover:bg-neutral-100 text-neutral-700 font-bold transition text-sm min-h-[40px] min-w-[40px] flex items-center justify-center"
                >
                  +
                </button>
              </div>

              {/* Desktop action buttons */}
              <div className="hidden sm:grid grid-cols-2 gap-2.5 flex-1">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`py-3 px-4 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 min-h-[44px] ${
                    isOutOfStock
                      ? "bg-neutral-200 text-neutral-400 border border-neutral-300 cursor-not-allowed"
                      : "bg-white border border-neutral-900 hover:bg-neutral-50 text-neutral-950 cursor-pointer shadow-xs"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? "Stok Habis" : "+ Keranjang"}</span>
                </button>
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleBuyNow}
                  className={`py-3 px-4 text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 min-h-[44px] shadow-sm ${
                    isOutOfStock
                      ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                      : "bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white cursor-pointer"
                  }`}
                >
                  <WhatsAppIcon className="w-4 h-4 fill-current" />
                  <span>{isOutOfStock ? "Stok Habis" : "Pesan via WhatsApp"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Guarantees Strip */}
          <div className="p-3.5 rounded-xl bg-[#24443B] border border-[#2E5147] text-xs text-white space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span><strong>Garansi Tukar Ukuran 7 Hari:</strong> Tidak pas? Kami tukar tanpa dipersulit.</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#DCE5E0] flex-shrink-0" />
              <span><strong>Pengiriman Cepat Surabaya:</strong> Siap kirim hari ini pukul 15.00 WIB.</span>
            </div>
          </div>

        </div>
      </div>

      {/* Tabs: Description, Specs, Shipping */}
      <div className="mt-10 sm:mt-16 pt-6 border-t border-[#24443B]">
        <div className="flex items-center gap-3 sm:gap-6 border-b border-[#24443B] text-xs sm:text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('desc')}
            className={`pb-3 transition relative ${
              activeTab === 'desc' ? 'text-white border-b-2 border-[#A8C4B5] font-bold' : 'text-[#8FA39B] hover:text-white'
            }`}
          >
            Deskripsi Produk
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`pb-3 transition relative ${
              activeTab === 'specs' ? 'text-white border-b-2 border-[#A8C4B5] font-bold' : 'text-[#8FA39B] hover:text-white'
            }`}
          >
            Spesifikasi Bahan
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shipping')}
            className={`pb-3 transition relative ${
              activeTab === 'shipping' ? 'text-white border-b-2 border-[#A8C4B5] font-bold' : 'text-[#8FA39B] hover:text-white'
            }`}
          >
            Garansi &amp; Retur
          </button>
        </div>

        <div className="py-4 text-xs sm:text-sm text-[#DCE5E0] leading-relaxed max-w-4xl space-y-3">
          {activeTab === 'desc' && (
            <div className="space-y-3">
              <p>{product.description}</p>
              {product.features && (
                <ul className="space-y-1 pl-4 list-disc text-white">
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
            <p className="text-xs text-white">
              Garansi penukaran ukuran berlaku 7 hari kerja sejak barang diterima dengan syarat tag masih terpasang dan baju belum dicuci.
            </p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-10 sm:mt-14 pt-8 border-t border-[#24443B]">
          <h2 className="text-base sm:text-xl font-bold text-white mb-4">
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
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={`flex-1 h-12 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
            isOutOfStock
              ? "bg-neutral-200 text-neutral-400 border border-neutral-300 cursor-not-allowed"
              : "bg-white border border-neutral-900 text-neutral-950 shadow-2xs hover:bg-neutral-50 active:scale-[0.98]"
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{isOutOfStock ? "Stok Habis" : "+ Keranjang"}</span>
        </button>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleBuyNow}
          className={`flex-1 h-12 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
            isOutOfStock
              ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
              : "bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.98] text-white shadow-md"
          }`}
        >
          <WhatsAppIcon className="w-4 h-4 fill-current" />
          <span>{isOutOfStock ? "Stok Habis" : "Pesan WA"}</span>
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
