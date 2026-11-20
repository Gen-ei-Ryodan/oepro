import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ShieldCheck, Tag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { createWhatsAppOrderLink, formatRupiah } from '../utils/whatsapp';

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
    coupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const navigate = useNavigate();

  const [inputCoupon, setInputCoupon] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon.trim());
      setInputCoupon('');
    }
  };

  const finalSubtotal = Math.max(0, subtotal - discountAmount);

  const handleOrderWhatsApp = () => {
    if (items.length === 0) return;
    const note = coupon ? `Kupon Diskon: ${coupon.code} (-${coupon.discountPercent}%)` : '';
    const waUrl = createWhatsAppOrderLink(items, finalSubtotal, note);
    window.open(waUrl, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-[#24443B] flex items-center justify-center mx-auto mb-4 text-[#E0BC66]">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Keranjang Belanja Kosong</h1>
          <p className="text-xs sm:text-sm text-[#DCE5E0] mb-8 leading-relaxed">
            Anda belum menambahkan produk kaos polos combed 24s atau polo pique ke keranjang.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#A8C4B5] text-[#081F1C] text-xs sm:text-sm font-medium rounded-lg hover:bg-white transition min-h-[44px]"
          >
            Mulai Belanja Produk OEPRO
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-32">
      {/* Title */}
      <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-[#24443B]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Keranjang Belanja
          </h1>
          <p className="text-xs text-white mt-0.5">
            Total {totalItems} item siap diproses langsung ke Admin WhatsApp
          </p>
        </div>
        <Link
          to="/catalog"
          className="text-xs font-medium text-[#DCE5E0] hover:text-white hidden sm:inline"
        >
          &larr; Lanjutkan belanja
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {items.map((item) => {
            const img = item.product.images && item.product.images.length > 0
              ? `/${item.product.images[0].replace(/^\//, '')}`
              : '/assets/brand/oepro-logo.webp';

            return (
              <div
                key={item.cartItemId}
                className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs flex gap-4 transition hover:border-neutral-300"
              >
                {/* Proportional Thumbnail */}
                <div className="w-24 h-28 rounded-lg overflow-hidden bg-[#F5F5F3] flex-shrink-0 border border-neutral-200/60 p-2 flex items-center justify-center">
                  <img
                    src={img}
                    alt={item.product.name}
                    className="w-full h-full object-contain object-center"
                    onError={(e) => {
                      e.target.src = '/assets/brand/oepro-logo.webp';
                    }}
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-600 block">
                        {item.product.category_title || 'OEPRO Basic'}
                      </span>
                      <h3 className="text-sm font-semibold text-neutral-900">
                        <Link to={`/product/${item.product.id}`} className="hover:text-neutral-600 transition">
                          {item.product.name}
                        </Link>
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-neutral-400 hover:text-red-700 p-1 transition min-w-[32px] min-h-[32px] flex items-center justify-center"
                      title="Hapus"
                      aria-label="Hapus Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <span className="px-2 py-0.5 bg-neutral-100 rounded text-[11px] font-bold border border-neutral-200 text-neutral-900">
                      Ukuran: {item.size}
                    </span>
                    <span className="px-2 py-0.5 bg-neutral-100 rounded text-[11px] font-medium flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full inline-block border border-neutral-300"
                        style={{ backgroundColor: item.color.hex || '#000' }}
                      />
                      <span>{item.color.name || item.color}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-neutral-100">
                    <div className="flex items-center border border-neutral-200 rounded overflow-hidden bg-neutral-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-2.5 py-1 hover:bg-neutral-200 text-neutral-700 transition text-xs font-semibold"
                        aria-label="Kurangi kuantitas"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-medium text-neutral-900 min-w-[28px] text-center font-mono">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-2.5 py-1 hover:bg-neutral-200 text-neutral-700 transition text-xs font-semibold"
                        aria-label="Tambah kuantitas"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-semibold text-neutral-950 font-mono">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="block text-[11px] text-neutral-400">
                          @{formatRupiah(item.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#DCE5E0] hover:text-white py-2"
            >
              &larr; Lanjutkan belanja produk lain
            </Link>
          </div>
        </div>

        {/* Right: Summary Card (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-2xs space-y-5 sticky top-24">
            <h2 className="text-sm font-semibold text-neutral-900 pb-3 border-b border-neutral-100">
              Ringkasan Belanja
            </h2>

            {/* Promo Code Form */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Kode promo (cth: OEPRO10)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 text-xs border border-neutral-200 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-mono"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition min-h-[38px]"
                >
                  Gunakan
                </button>
              </form>

              {coupon && (
                <div className="flex items-center justify-between mt-2.5 p-2 bg-neutral-50 rounded-lg text-xs border border-neutral-200 text-neutral-700">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Kupon: <strong className="font-mono">{coupon.code}</strong> (-{coupon.discountPercent}%)</span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-neutral-400 hover:text-neutral-700 p-0.5"
                    aria-label="Hapus kupon"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} item)</span>
                <span className="font-semibold text-neutral-900 font-mono">{formatRupiah(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-800 font-medium">
                  <span>Diskon Promo</span>
                  <span className="font-mono">- {formatRupiah(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-700">
                <span>Ongkos Kirim &amp; Ekspedisi</span>
                <span className="text-[11px] font-semibold">Dikonfirmasi via WA</span>
              </div>

              <div className="flex justify-between text-sm font-semibold text-neutral-950 pt-3 border-t border-neutral-200">
                <span>Total Estimasi</span>
                <span className="font-mono">{formatRupiah(finalSubtotal)}</span>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <button
              type="button"
              onClick={handleOrderWhatsApp}
              className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg min-h-[48px]"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current" />
              <span>Pesan Sekarang via WhatsApp</span>
            </button>

            {/* Guarantee Tag */}
            <div className="p-3 bg-[#F5F5F3] rounded-lg border border-neutral-200/60 flex items-start gap-2.5 text-xs text-neutral-600">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <span>Garansi tukar ukuran 7 hari &amp; pengiriman cepat langsung dari gudang OEPRO Surabaya.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
