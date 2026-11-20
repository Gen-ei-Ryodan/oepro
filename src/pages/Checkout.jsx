import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, ArrowRight, User, MapPin, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import WhatsAppIcon from '../components/WhatsAppIcon';
import { createWhatsAppOrderLink, formatRupiah } from '../utils/whatsapp';

export default function Checkout() {
  const { items, subtotal, discountAmount, coupon } = useCart();
  const { profile } = useOrders();
  const navigate = useNavigate();

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Keranjang Anda masih kosong</h2>
        <p className="text-xs text-[#DCE5E0] mb-6">Silakan pilih produk terlebih dahulu sebelum memesan.</p>
        <Link to="/catalog" className="px-5 py-2.5 bg-[#A8C4B5] text-[#081F1C] font-medium text-xs rounded-lg min-h-[44px] inline-flex items-center">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const defaultAddr = profile.addresses?.find((a) => a.isDefault) || profile.addresses?.[0];

  const [formData, setFormData] = useState({
    name: profile.name || '',
    phone: profile.phone || '',
    address: defaultAddr?.address || '',
    city: defaultAddr?.city || 'Surabaya',
    notes: '',
  });

  const finalSubtotal = Math.max(0, subtotal - discountAmount);

  const handleSendToWhatsApp = (e) => {
    if (e) e.preventDefault();
    let note = '';
    if (formData.name) note += `Nama: ${formData.name}\n`;
    if (formData.phone) note += `No. HP: ${formData.phone}\n`;
    if (formData.address) note += `Alamat: ${formData.address}, ${formData.city}\n`;
    if (formData.notes) note += `Catatan: ${formData.notes}\n`;
    if (coupon) note += `Promo: ${coupon.code} (-${coupon.discountPercent}%)`;

    const waUrl = createWhatsAppOrderLink(items, finalSubtotal, note);
    window.open(waUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-32">
      {/* Back button & Title */}
      <div className="mb-6 pb-4 border-b border-[#24443B]">
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#DCE5E0] hover:text-white mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Keranjang</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Pemesanan Langsung via WhatsApp
        </h1>
        <p className="text-xs text-[#AABBB3] mt-1">
          Pesanan diteruskan ke WhatsApp Admin OEPRO untuk konfirmasi stok, ongkos kirim, dan pembayaran.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Optional Customer Details */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
            <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <User className="w-4 h-4 text-neutral-700" />
              <span>Data Pembeli (Opsional)</span>
            </h2>
            <p className="text-[11px] text-neutral-500">
              Isi data berikut agar otomatis tercantum dalam pesan WhatsApp Anda:
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Nama Penerima
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap Anda"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-hidden focus:border-neutral-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Nomor WhatsApp / HP
                </label>
                <input
                  type="tel"
                  placeholder="Contoh: 08123456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-hidden focus:border-neutral-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Alamat Pengiriman &amp; Kota
                </label>
                <textarea
                  rows="2"
                  placeholder="Alamat jalan, kelurahan, kecamatan, kota..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-hidden focus:border-neutral-900 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                  Catatan Tambahan
                </label>
                <input
                  type="text"
                  placeholder="Warna cadangan, request packaging, dll."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-neutral-900 focus:outline-hidden focus:border-neutral-900 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Items Summary & Send WA Button */}
        <div className="md:col-span-5 space-y-4">
          <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs space-y-4 sticky top-24">
            <h3 className="text-sm font-bold text-neutral-900 pb-2 border-b border-neutral-100">
              Rincian Pesanan ({items.length} produk)
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between text-xs py-1 border-b border-neutral-50">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="font-semibold text-neutral-900 truncate">{item.product.name}</p>
                    <p className="text-[11px] text-neutral-500">
                      Ukuran: <strong>{item.size}</strong> • {item.color.name || item.color} ({item.quantity} pcs)
                    </p>
                  </div>
                  <span className="font-mono font-semibold text-neutral-900">
                    {formatRupiah(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-neutral-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-mono">{formatRupiah(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-600 font-medium">
                  <span>Diskon Kupon</span>
                  <span className="font-mono">- {formatRupiah(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-700">
                <span>Ongkos Kirim</span>
                <span className="text-[11px] font-semibold">Dihitung oleh Admin via WA</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-neutral-950 pt-2 border-t border-neutral-200">
                <span>Total Estimasi</span>
                <span className="font-mono">{formatRupiah(finalSubtotal)}</span>
              </div>
            </div>

            {/* Direct WhatsApp Button */}
            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg min-h-[48px]"
            >
              <WhatsAppIcon className="w-5 h-5 fill-current" />
              <span>Kirim Pesanan ke WhatsApp</span>
            </button>

            <div className="p-3 bg-[#F5F5F3] rounded-lg border border-neutral-200/60 flex items-start gap-2 text-[11px] text-neutral-600">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
              <span>Garansi tukar ukuran 7 hari. Admin kami siap melayani pesanan Anda setiap hari.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
