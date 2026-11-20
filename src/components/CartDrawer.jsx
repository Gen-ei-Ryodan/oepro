import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, Trash2, Plus, Minus, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import WhatsAppIcon from './WhatsAppIcon';
import { createWhatsAppOrderLink, formatRupiah } from '../utils/whatsapp';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItems,
  } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleOrderWhatsApp = () => {
    if (items.length === 0) return;
    const waUrl = createWhatsAppOrderLink(items, subtotal);
    window.open(waUrl, '_blank');
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 w-full justify-end">
        <div className="w-full sm:max-w-md bg-[#133129] shadow-2xl flex flex-col border-l border-[#24443B] h-full">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#24443B] flex items-center justify-between bg-[#0E2B26]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-white" />
              <h2 className="text-sm sm:text-base font-semibold text-white">
                Keranjang Belanja ({totalItems})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#AABBB3] hover:text-white rounded-lg hover:bg-[#1A3B33] transition min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Tutup Keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#AABBB3]">
                <div className="w-14 h-14 rounded-full bg-[#24443B] flex items-center justify-center mb-3 text-2xl">
                  <ShoppingBag className="w-6 h-6 text-[#8FA39B]" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1">Keranjang masih kosong</h3>
                <p className="text-xs text-[#AABBB3] max-w-xs mb-6">
                  Jelajahi koleksi kaos polos katun 24s dan polo pique berkualitas kami sekarang.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/catalog');
                  }}
                  className="px-5 py-2.5 bg-[#A8C4B5] text-[#081F1C] text-xs font-medium rounded-lg hover:bg-white transition min-h-[44px]"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              items.map((item) => {
                const img = item.product.images && item.product.images.length > 0
                  ? `/${item.product.images[0].replace(/^\//, '')}`
                  : '/assets/brand/oepro-logo.webp';

                return (
                  <div
                    key={item.cartItemId}
                    className="flex gap-3 p-3 rounded-lg border border-[#24443B] hover:border-[#2F5A4F] transition bg-[#0E2B26] shadow-2xs"
                  >
                    {/* Fixed Proportional Thumbnail */}
                    <div className="w-20 h-24 rounded-md overflow-hidden bg-[#F5F5F3] flex-shrink-0 border border-neutral-200/60 relative p-1.5 flex items-center justify-center">
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
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs sm:text-sm font-medium text-white line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.cartItemId)}
                            className="text-[#8FA39B] hover:text-red-400 transition p-1 min-w-[28px] min-h-[28px] flex items-center justify-center"
                            title="Hapus"
                            aria-label="Hapus Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[11px] font-bold text-white px-2 py-0.5 bg-[#24443B] rounded border border-[#24443B]">
                            {item.size}
                          </span>
                          <span className="text-[11px] font-medium text-[#AABBB3] px-2 py-0.5 bg-[#24443B] rounded flex items-center gap-1">
                            <span
                              className="w-2 h-2 rounded-full inline-block border border-neutral-300"
                              style={{ backgroundColor: item.color.hex || '#000' }}
                            />
                            <span>{item.color.name || item.color}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#24443B]">
                        {/* Stepper with touch target */}
                        <div className="flex items-center border border-[#24443B] rounded overflow-hidden bg-[#24443B]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="px-2 py-1 hover:bg-[#2F5A4F] text-[#DCE5E0] transition text-xs font-semibold"
                            aria-label="Kurangi kuantitas"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-medium text-white min-w-[24px] text-center font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="px-2 py-1 hover:bg-[#2F5A4F] text-[#DCE5E0] transition text-xs font-semibold"
                            aria-label="Tambah kuantitas"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs sm:text-sm font-semibold text-white font-mono">
                          {formatRupiah(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & WhatsApp Direct Action */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 pb-8 sm:pb-5 border-t border-[#24443B] bg-[#0E2B26] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#AABBB3]">
                <span>Subtotal ({totalItems} item)</span>
                <span className="text-base font-semibold text-white font-mono">
                  {formatRupiah(subtotal)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#DCE5E0] bg-[#24443B] px-2.5 py-1.5 rounded border border-[#24443B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#AABBB3] flex-shrink-0" />
                <span>Pemesanan langsung terhubung ke WhatsApp Admin OEPRO.</span>
              </div>

              <div className="space-y-2 pt-1">
                {/* Primary Action Button: Langsung ke WhatsApp sesuai pesanan */}
                <button
                  type="button"
                  onClick={handleOrderWhatsApp}
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg min-h-[48px]"
                >
                  <WhatsAppIcon className="w-5 h-5 fill-current" />
                  <span>Pesan Sekarang via WhatsApp</span>
                </button>

                <div className="flex items-center justify-between text-xs text-[#AABBB3] pt-0.5">
                  <button
                    type="button"
                    onClick={handleViewCart}
                    className="text-xs font-medium text-[#DCE5E0] hover:text-white hover:underline"
                  >
                    Rincian Keranjang &rarr;
                  </button>
                  <span className="text-[10px] text-[#8FA39B]">
                    Bebas Ongkir &amp; Cek Stok Realtime
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
