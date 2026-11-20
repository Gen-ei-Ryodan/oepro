import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, Copy, ArrowRight, Package, Truck, QrCode, CreditCard } from 'lucide-react';
import { useOrders } from '../context/OrderContext';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { getOrderById, updateOrderStatus } = useOrders();
  const [copied, setCopied] = useState(false);

  const order = getOrderById(orderId);

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleCopyVa = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    updateOrderStatus(order.id, 'Diproses');
  };

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Pesanan tidak ditemukan</h2>
        <Link to="/history" className="text-xs font-bold text-[#A8C4B5] hover:text-white underline">
          Lihat Riwayat Pesanan Saya
        </Link>
      </div>
    );
  }

  const isPaid = order.payment.isPaid || order.status !== 'Menunggu Pembayaran';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Top Banner */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md text-center space-y-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700">
            Order Confirmed &bull; {order.id}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
            Terima Kasih Atas Pesanan Anda!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
            Pesanan Anda telah berhasil dibuat dan dicatat dalam sistem OEPRO.
          </p>
        </div>

        {/* Payment simulator card if not paid */}
        {!isPaid ? (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-left max-w-lg mx-auto space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Menunggu Pembayaran: {order.payment.name}</span>
              </span>
              <span className="text-xs font-mono font-black text-slate-900">
                {formatRupiah(order.summary.grandTotal)}
              </span>
            </div>

            {order.payment.method === 'qris' ? (
              <div className="bg-white p-4 rounded-xl border border-amber-200 flex flex-col items-center text-center space-y-2">
                <div className="w-36 h-36 bg-slate-900 rounded-lg p-2 flex items-center justify-center text-white text-xs font-mono">
                  [ SIMULASI QRIS OEPRO ]
                </div>
                <span className="text-[11px] text-slate-500">
                  Scan QRIS di atas menggunakan e-wallet GoPay/OVO/DANA/BCA Mobile
                </span>
              </div>
            ) : (
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">Nomor Virtual Account Simulasi</span>
                  <strong className="text-sm font-mono font-bold text-slate-900">
                    8809 1092 8821 002
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyVa('880910928821002')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>
            )}

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleSimulatePayment}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                &check; Simulasi: Konfirmasi Pembayaran Berhasil
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold max-w-md mx-auto flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pembayaran Terverifikasi &bull; Status: {order.status}</span>
          </div>
        )}
      </div>

      {/* Invoice Details */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Rincian Faktur</span>
            <h3 className="text-base font-bold text-slate-900">No. Invoice: {order.id}</h3>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {order.timeline[0]?.time}
          </div>
        </div>

        {/* Customer & Shipping Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600">
          <div>
            <h4 className="font-bold text-slate-900 mb-1.5 uppercase tracking-wider text-[11px]">Penerima &amp; Alamat</h4>
            <p className="font-semibold text-slate-900">{order.customer.name} ({order.customer.phone})</p>
            <p>{order.customer.address}</p>
            <p>{order.customer.city}, {order.customer.province} {order.customer.postalCode}</p>
            {order.customer.notes && <p className="italic text-slate-400 mt-1">Catatan: {order.customer.notes}</p>}
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1.5 uppercase tracking-wider text-[11px]">Kurir &amp; Resi Pengiriman</h4>
            <p className="font-semibold text-slate-900">{order.courier.name} ({order.courier.service})</p>
            <p className="font-mono text-slate-700 mt-1">
              No. Resi: <strong>{order.courier.trackingNumber}</strong>
            </p>
            <p className="text-slate-400 mt-0.5">Dikirim dari Gudang OEPRO Surabaya</p>
          </div>
        </div>

        {/* Items List */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Item Pesanan</h4>
          <div className="divide-y divide-slate-100">
            {order.items.map((item) => (
              <div key={item.cartItemId} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-bold text-slate-900">{item.product.name}</h5>
                  <p className="text-slate-500">
                    Size: {item.size} &bull; Warna: {item.color.name || item.color} &bull; Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-black text-slate-900 font-mono">
                  {formatRupiah(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal Produk</span>
            <span className="font-semibold text-slate-900">{formatRupiah(order.summary.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Ongkos Kirim</span>
            <span className="font-semibold text-slate-900">{formatRupiah(order.summary.shippingCost)}</span>
          </div>
          {order.summary.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Potongan Promo ({order.summary.couponCode})</span>
              <span>- {formatRupiah(order.summary.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-950">
            <span>Total Akhir</span>
            <span className="text-base text-emerald-800">{formatRupiah(order.summary.grandTotal)}</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <Link
            to="/history"
            className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md transition text-center flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Lacak Status Pesanan di Riwayat</span>
          </Link>
          <Link
            to="/catalog"
            className="py-3 px-5 border border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold text-xs rounded-xl transition text-center"
          >
            Lanjut Belanja
          </Link>
        </div>
      </div>
    </div>
  );
}
