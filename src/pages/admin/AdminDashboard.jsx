import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  LogOut,
  Layers,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Tag,
  ArrowUpDown,
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import ProductFormModal from '../../components/admin/ProductFormModal';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { products, categories, addProduct, updateProduct, deleteProduct, resetToDefault } = useProducts();

  // Auth Guard
  useEffect(() => {
    const auth = localStorage.getItem('oepro_admin_auth');
    if (!auth) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('oepro_admin_auth');
    navigate('/admin/login');
  };

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' ||
      p.category === selectedCategory ||
      p.category_slug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Metrics
  const totalProducts = products.length;
  const activeCategoriesCount = new Set(products.map((p) => p.category)).size;
  const lowStockCount = products.filter((p) => (p.stock || 0) < 15).length;

  // Handlers
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus produk "${name}" dari katalog OEPRO?`)) {
      deleteProduct(id);
      showToast(`Produk "${name}" berhasil dihapus.`);
    }
  };

  const handleSaveProduct = (prodData) => {
    if (editingProduct && editingProduct.id) {
      updateProduct(editingProduct.id, prodData);
      showToast(`Produk "${prodData.name}" berhasil diperbarui.`);
    } else {
      addProduct(prodData);
      showToast(`Produk baru "${prodData.name}" berhasil ditambahkan.`);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Kembalikan seluruh produk ke database master awal? Perubahan kustom akan direset.')) {
      resetToDefault();
      showToast('Database katalog berhasil direset ke data master.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#171717] pb-16 selection:bg-neutral-900 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-neutral-950 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-white/10 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E0] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-neutral-950 font-sans">
                OEPRO
              </span>
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-950 text-white px-2 py-0.5 rounded-md">
              ADMIN CMS
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Web Buyer</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-6">
        {/* Title & Quick Stats */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
                Manajemen Produk OEPRO
              </h1>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Atur nama produk, foto gambar, harga diskon, varian ukuran (XS–8XL), dan stok katalog pembeli.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleResetData}
                className="px-3.5 py-2.5 bg-white border border-[#E5E5E0] hover:bg-neutral-100 text-neutral-600 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                title="Reset ke data master"
              >
                <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden md:inline">Reset Master</span>
              </button>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-neutral-950/15 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Tambah Produk Baru</span>
              </button>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-[#E5E5E0] rounded-2xl p-4.5 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Total SKU Produk
                </span>
                <p className="text-2xl font-black text-neutral-950 mt-1">{totalProducts}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
                <Package className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E0] rounded-2xl p-4.5 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Kategori Aktif
                </span>
                <p className="text-2xl font-black text-neutral-950 mt-1">{activeCategoriesCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white border border-[#E5E5E0] rounded-2xl p-4.5 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Stok Terbatas (&lt; 15 pcs)
                </span>
                <p className="text-2xl font-black text-amber-600 mt-1">{lowStockCount}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Action Bar */}
        <div className="bg-white border border-[#E5E5E0] rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between shadow-xs">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama produk, SKU, atau deskripsi..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#FBFBFA] border border-[#E5E5E0] rounded-xl focus:bg-white focus:border-neutral-950 focus:outline-hidden transition"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs bg-[#FBFBFA] border border-[#E5E5E0] rounded-xl focus:bg-white focus:border-neutral-950 focus:outline-hidden font-medium"
            >
              <option value="ALL">Semua Kategori ({totalProducts})</option>
              {categories.map((c) => (
                <option key={c.id || c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Table (Desktop) & Card Stack (Mobile) */}
        <div className="bg-white border border-[#E5E5E0] rounded-2xl overflow-hidden shadow-xs">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-neutral-800">Tidak ada produk yang cocok</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Coba ubah kata kunci pencarian atau filter kategori.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#E5E5E0] bg-[#F5F5F3] text-neutral-600 uppercase tracking-wider text-[10px] font-bold">
                      <th className="py-3 px-4">Produk</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Harga &amp; Diskon</th>
                      <th className="py-3 px-4">Varian Ukuran</th>
                      <th className="py-3 px-4">Stok</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E5E0]">
                    {filteredProducts.map((prod) => {
                      const thumb =
                        prod.images && prod.images.length > 0
                          ? prod.images[0]
                          : 'assets/products/polo/black-stone/black-stone-oepro.webp';

                      return (
                        <tr key={prod.id} className="hover:bg-neutral-50/80 transition">
                          {/* Nama & Thumbnail */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={thumb}
                                alt={prod.name}
                                className="w-12 h-14 object-cover rounded-lg bg-[#F5F5F3] border border-neutral-200 shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-neutral-950 text-xs line-clamp-1">
                                  {prod.name}
                                </h4>
                                <span className="font-mono text-[10px] text-neutral-400 uppercase">
                                  {prod.sku || '-'}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Kategori */}
                          <td className="py-3 px-4 text-neutral-600 font-medium whitespace-nowrap">
                            {prod.category}
                          </td>

                          {/* Harga */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="font-bold text-neutral-950 text-xs">
                              Rp{(prod.price || 0).toLocaleString('id-ID')}
                            </div>
                            {prod.original_price && prod.original_price > prod.price && (
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <span className="text-neutral-400 line-through">
                                  Rp{prod.original_price.toLocaleString('id-ID')}
                                </span>
                                <span className="text-amber-700 font-bold bg-amber-100 px-1 py-0.2 rounded-xs">
                                  -{prod.discount_percent}%
                                </span>
                              </div>
                            )}
                          </td>

                          {/* Ukuran */}
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1 max-w-[180px]">
                              {(prod.sizes || []).slice(0, 4).map((sz) => (
                                <span
                                  key={sz}
                                  className="px-1.5 py-0.5 bg-neutral-100 text-neutral-700 text-[9px] font-semibold rounded-sm"
                                >
                                  {sz}
                                </span>
                              ))}
                              {(prod.sizes || []).length > 4 && (
                                <span className="text-[10px] text-neutral-400 font-semibold">
                                  +{(prod.sizes || []).length - 4}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Stok */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                (prod.stock || 0) < 15
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {prod.stock || 0} pcs
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              {prod.is_best_seller && (
                                <span className="text-[9px] font-bold text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded-sm w-fit">
                                  BEST SELLER
                                </span>
                              )}
                              {prod.is_featured && (
                                <span className="text-[9px] font-bold text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded-sm w-fit">
                                  FEATURED
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Aksi */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                to={`/product/${prod.id}`}
                                target="_blank"
                                className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition"
                                title="Lihat di Web"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(prod)}
                                className="p-1.5 text-neutral-600 hover:text-neutral-950 rounded-lg hover:bg-neutral-100 transition"
                                title="Edit Produk"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(prod.id, prod.name)}
                                className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                                title="Hapus Produk"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Stack */}
              <div className="md:hidden divide-y divide-[#E5E5E0]">
                {filteredProducts.map((prod) => {
                  const thumb =
                    prod.images && prod.images.length > 0
                      ? prod.images[0]
                      : 'assets/products/polo/black-stone/black-stone-oepro.webp';

                  return (
                    <div key={prod.id} className="p-4 flex gap-3 items-start">
                      <img
                        src={thumb}
                        alt={prod.name}
                        className="w-16 h-20 object-cover rounded-xl bg-[#F5F5F3] border border-neutral-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-neutral-950 text-xs line-clamp-2">
                            {prod.name}
                          </h4>
                          <span
                            className={`shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                              (prod.stock || 0) < 15
                                ? 'bg-red-100 text-red-700'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {prod.stock || 0} pcs
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-neutral-400 uppercase">
                          {prod.sku || '-'} &bull; {prod.category}
                        </span>

                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="font-bold text-neutral-950 text-xs">
                            Rp{(prod.price || 0).toLocaleString('id-ID')}
                          </span>
                          {prod.original_price && prod.original_price > prod.price && (
                            <span className="text-[10px] text-neutral-400 line-through">
                              Rp{prod.original_price.toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>

                        {/* Mobile Actions */}
                        <div className="mt-2.5 flex items-center justify-between border-t border-neutral-100 pt-2">
                          <div className="flex gap-1 text-[9px] font-semibold text-neutral-500">
                            <span>{(prod.sizes || []).length} Ukuran</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(prod)}
                              className="px-2.5 py-1 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 text-xs font-semibold rounded-lg flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(prod.id, prod.name)}
                              className="p-1 text-neutral-400 hover:text-red-600 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
      />
    </div>
  );
}
