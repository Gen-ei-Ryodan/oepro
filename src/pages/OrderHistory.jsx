import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle2, ChevronRight, X, ExternalLink, RefreshCw, ShoppingBag } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';

export default function OrderHistory() {
  const { orders } = useOrders();
  const { addToCart, setIsCartOpen, showToast } = useCart();

  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const statusFilters = [
    { id: 'all', name: 'Semua Status' },
    { id: 'Menunggu Pembayaran', name: 'Menunggu Pembayaran' },
    { id: 'Diproses', name: 'Diproses' },
    { id: 'Dikirim', name: 'Dikirim' },
    { id: 'Selesai', name: 'Selesai' },
  ];

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Menunggu Pembayaran':
        return (
          <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Menunggu Pembayaran</span>
          </span>
        );
      case 'Diproses':
        return (
          <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            <span>Diproses</span>
          </span>
        );
      case 'Dikirim':
        return (
          <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
            <Truck className="w-3 h-3" />
            <span>Dikirim</span>
          </span>
        );
      case 'Selesai':
        return (
          <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Selesai</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-neutral-100 text-neutral-800 border border-neutral-200">
            {status}
          </span>
        );
    }
  };

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(item.product, item.color, item.size, item.quantity);
    });
    showToast('Item berhasil dimasukkan kembali ke keranjang!');
    setIsCartOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-32 sm:pb-16 bg-[#FBFBFA]">
      {/* Page Header */}
      <div className="mb-8 pb-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-neutral-950 tracking-tight">
            Riwayat Pesanan &amp; Pelacakan
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Pantau status proses packing, resi ekspedisi, dan riwayat belanja katun OEPRO Anda
          </p>
        </div>

        <Link
          to="/catalog"
          className="text-xs font-medium text-neutral-900 hover:underline flex items-center gap-1"
        >
          <span>Belanja Produk Lainnya</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        {statusFilters.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition min-h-[38px] ${
              statusFilter === tab.id
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-lg bg-white border border-neutral-200">
          <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-400">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 mb-1">
            Belum ada pesanan dengan status ini
          </h3>
          <p className="text-xs text-neutral-500 mb-4 max-w-sm mx-auto">
            Semua riwayat pesanan yang Anda checkout akan tercatat otomatis di halaman ini.
          </p>
          <Link
            to="/catalog"
            className="px-5 py-2.5 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition inline-block min-h-[44px] flex items-center justify-center max-w-xs mx-auto"
          >
            Mulai Belanja Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="p-5 sm:p-6 rounded-lg bg-white border border-neutral-200 shadow-2xs hover:border-neutral-300 transition space-y-4"
            >
              {/* Order Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-[#F5F5F3] flex items-center justify-center text-neutral-700">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-xs sm:text-sm font-semibold text-neutral-900 block font-mono">
                      {order.id}
                    </strong>
                    <span className="text-[11px] text-neutral-400">
                      Dipesan pada: {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(order.createdAt))}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Items in this order */}
              <div className="space-y-3">
                {order.items.map((item) => {
                  const img = item.product.images && item.product.images.length > 0
                    ? `/${item.product.images[0].replace(/^\//, '')}`
                    : '/assets/brand/oepro-logo.webp';

                  return (
                    <div key={item.cartItemId} className="flex items-center gap-3 text-xs">
                      <div className="w-14 h-16 rounded overflow-hidden bg-[#F5F5F3] flex-shrink-0 border border-neutral-200/60 p-1 flex items-center justify-center">
                        <img
                          src={img}
                          alt={item.product.name}
                          className="w-full h-full object-contain object-center"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-neutral-900 line-clamp-1">{item.product.name}</h4>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Size: <strong>{item.size}</strong> &bull; Warna: {item.color.name || item.color} &bull; Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-medium text-neutral-900 font-mono">
                        {formatRupiah(item.price * item.quantity)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Order Card Footer */}
              <div className="pt-3 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-neutral-500 block">Total Tagihan ({order.items.length} item):</span>
                  <span className="text-sm sm:text-base font-semibold text-neutral-950 font-mono">
                    {formatRupiah(order.summary.grandTotal)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-2 bg-white border border-neutral-200 hover:border-neutral-300 text-neutral-800 text-xs font-medium rounded-lg transition min-h-[38px]"
                  >
                    Rincian &amp; Resi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(order)}
                    className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition min-h-[38px] flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Beli Lagi</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TRACKING & DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <div className="w-screen max-w-md bg-[#FBFBFA] shadow-2xl flex flex-col border-l border-neutral-200">
              <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
                <div>
                  <h3 className="font-semibold text-sm text-neutral-900">Rincian &amp; Resi Pesanan</h3>
                  <span className="text-xs text-neutral-400 font-mono">{selectedOrder.id}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-neutral-400 hover:text-neutral-700 min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 text-xs">
                {/* Status Strip */}
                <div className="p-3.5 bg-white rounded-lg border border-neutral-200 space-y-1">
                  <span className="text-neutral-400 block text-[11px]">Status Pesanan:</span>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>

                {/* Shipping & Resi */}
                <div className="p-3.5 bg-white rounded-lg border border-neutral-200 space-y-2">
                  <h4 className="font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">Ekspedisi &amp; Resi</h4>
                  <p className="text-neutral-700">
                    Kurir: <strong>{selectedOrder.courier.name}</strong> ({selectedOrder.courier.service})
                  </p>
                  <div className="p-2 bg-[#F5F5F3] rounded text-neutral-800 font-mono text-xs flex justify-between items-center">
                    <span>Resi: {selectedOrder.trackingNumber || 'OEP-' + selectedOrder.id.replace('ORD-', '')}</span>
                    <span className="text-[10px] text-neutral-500 uppercase">Gudang Surabaya</span>
                  </div>
                </div>

                {/* Address */}
                <div className="p-3.5 bg-white rounded-lg border border-neutral-200 space-y-1">
                  <h4 className="font-semibold text-neutral-900 uppercase tracking-wider text-[11px]">Alamat Penerima</h4>
                  <p className="text-neutral-800 font-medium">{selectedOrder.customer.name} ({selectedOrder.customer.phone})</p>
                  <p className="text-neutral-600">{selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.province} {selectedOrder.shippingAddress.postalCode}</p>
                </div>
              </div>

              <div className="p-4 border-t border-neutral-200 bg-white">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-2.5 bg-neutral-900 text-white font-medium text-xs rounded-lg min-h-[44px]"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
