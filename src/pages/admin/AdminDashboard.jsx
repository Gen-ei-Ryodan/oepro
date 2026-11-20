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
  Menu,
  Image as ImageIcon,
  Store,
  ChevronRight,
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import ProductFormModal from '../../components/admin/ProductFormModal';
import AdminSidebar from '../../components/admin/AdminSidebar';
import CategoryManager from '../../components/admin/CategoryManager';
import BannerManager from '../../components/admin/BannerManager';
import { resolveImageUrl } from '../../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    products,
    categories,
    banners,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    resetToDefault,
  } = useProducts();

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
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'categories' | 'banners'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
  const activeCategoriesCount = categories.length;
  const lowStockCount = products.filter((p) => (p.stock || 0) < 15).length;

  // Handlers for Products
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
    if (
      window.confirm(
        'Kembalikan seluruh produk, kategori, dan banner ke database master awal? Perubahan kustom akan direset.'
      )
    ) {
      resetToDefault();
      showToast('Database katalog berhasil direset ke data master.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-[#171717] flex selection:bg-neutral-900 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#133129] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 border border-white/10 text-xs font-semibold animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. ADMIN SIDEBAR (Responsive drawer on mobile, sticky on desktop) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        onLogout={handleLogout}
        counts={{
          products: totalProducts,
          categories: activeCategoriesCount,
          banners: (banners || []).length,
        }}
      />

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E5E5E0] px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 transition shrink-0"
              aria-label="Buka Menu Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Title */}
            <div className="flex items-center gap-2 min-w-0 text-xs sm:text-sm font-bold text-neutral-900">
              <span className="text-[#AABBB3] hidden sm:inline">Admin OEPRO</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400 hidden sm:inline" />
              <span className="truncate">
                {activeTab === 'products'
                  ? 'Katalog Produk & Varian'
                  : activeTab === 'categories'
                  ? 'Master Kategori Produk'
                  : 'Manajemen Banner Depan'}
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetData}
              className="px-2.5 sm:px-3 py-1.5 text-[11px] font-semibold text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl transition flex items-center gap-1.5 border border-neutral-200"
              title="Reset ke Master"
            >
              <RotateCcw className="w-3 h-3 text-neutral-500" />
              <span className="hidden sm:inline">Reset Master</span>
            </button>

            <Link
              to="/"
              target="_blank"
              className="px-2.5 sm:px-3 py-1.5 text-[11px] font-semibold text-[#A8C4B5] bg-[#A8C4B5]/10 hover:bg-[#A8C4B5]/20 rounded-xl transition flex items-center gap-1.5"
            >
              <Store className="w-3 h-3" />
              <span className="hidden sm:inline">Lihat Web</span>
            </Link>
          </div>
        </header>

        {/* Tab Content Body */}
        <main className="p-4 sm:p-8 space-y-6 flex-1 max-w-7xl w-full mx-auto">
          
          {/* TAB 1: PRODUK & VARIAN */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E5E0] shadow-2xs flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                      Total Produk
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-neutral-950 font-mono">
                      {totalProducts}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E5E0] shadow-2xs flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#133129] text-[#DCE5E0] flex items-center justify-center shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                      Kategori Aktif
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-neutral-950 font-mono">
                      {activeCategoriesCount}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E5E0] shadow-2xs flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                      Perlu Restock (&lt;15 pcs)
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-red-600 font-mono">
                      {lowStockCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Bar (Search, Category Filter, Add Button) */}
              <div className="p-4 sm:p-5 bg-white border border-[#E5E5E0] rounded-2xl shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <input
                      type="text"
                      placeholder="Cari SKU, nama produk, warna..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-xs bg-neutral-100/80 border border-neutral-200 rounded-xl text-neutral-900 placeholder:text-neutral-500 focus:bg-white focus:border-neutral-900 focus:outline-hidden transition"
                    />
                    <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
                  </div>

                  {/* Add Product Button */}
                  <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="px-4 py-2.5 bg-[#A8C4B5] hover:bg-[#A8C4B5]/90 text-[#081F1C] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Produk Baru</span>
                  </button>
                </div>

                {/* Category Pills Filter */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mr-1 shrink-0">
                    Kategori:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('ALL')}
                    className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition ${
                      selectedCategory === 'ALL'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    Semua ({products.length})
                  </button>
                  {categories.map((c) => {
                    const count = products.filter(
                      (p) => p.category === c.name || p.category_slug === c.slug
                    ).length;
                    return (
                      <button
                        key={c.id || c.slug}
                        type="button"
                        onClick={() => setSelectedCategory(c.name)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition ${
                          selectedCategory === c.name || selectedCategory === c.slug
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {c.name} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white border border-[#E5E5E0] rounded-2xl shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-[#E5E5E0] flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                    Daftar Katalog Produk ({filteredProducts.length})
                  </h3>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="p-12 text-center text-neutral-400">
                    <p className="text-xs">Tidak ada produk yang cocok dengan pencarian.</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#FBFBFA] border-b border-[#E5E5E0] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            <th className="py-3 px-4">Produk &amp; Varian</th>
                            <th className="py-3 px-4">Kategori</th>
                            <th className="py-3 px-4">Harga</th>
                            <th className="py-3 px-4">Varian Bertingkat</th>
                            <th className="py-3 px-4">Stok</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E5E0]">
                          {filteredProducts.map((prod) => {
                            const thumb = prod.images && prod.images.length > 0
                              ? resolveImageUrl(prod.images[0])
                              : 'assets/products/polo/black-stone/black-stone-oepro.webp';

                            const has2LevelVariants =
                              Array.isArray(prod.variants) &&
                              prod.variants.some((variant) => Array.isArray(variant.options) && variant.options.length > 0);
                            const hasFlatVariants = Array.isArray(prod.variants) && prod.variants.length > 0;
                            const flatVariantSizes = hasFlatVariants
                              ? prod.variants.map((variant) => variant.name).filter(Boolean)
                              : [];
                            const totalCombinations = has2LevelVariants
                              ? prod.variants.reduce((acc, v) => acc + (v.options || []).length, 0)
                              : flatVariantSizes.length || (prod.sizes || []).length;

                            return (
                              <tr key={prod.id} className="hover:bg-neutral-50/80 transition">
                                {/* Thumbnail & Info */}
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={thumb}
                                      alt={prod.name}
                                      className="w-12 h-14 object-cover rounded-lg bg-[#F5F5F3] border border-neutral-200 shrink-0"
                                    />
                                    <div className="min-w-0 max-w-xs">
                                      <h4 className="font-bold text-neutral-950 truncate text-xs">
                                        {prod.name}
                                      </h4>
                                      <span className="font-mono text-[10px] text-neutral-400 block uppercase">
                                        {prod.sku || '-'}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                {/* Kategori */}
                                <td className="py-3 px-4 whitespace-nowrap">
                                  <span className="text-[11px] font-medium text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md">
                                    {prod.category}
                                  </span>
                                </td>

                                {/* Harga */}
                                <td className="py-3 px-4 whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-neutral-950 font-mono">
                                      Rp{(prod.price || 0).toLocaleString('id-ID')}
                                    </span>
                                    {prod.original_price && prod.original_price > prod.price && (
                                      <span className="text-[10px] text-neutral-400 line-through font-mono">
                                        Rp{prod.original_price.toLocaleString('id-ID')}
                                      </span>
                                    )}
                                  </div>
                                </td>

                                {/* Varian 2-Level */}
                                <td className="py-3 px-4">
                                  {has2LevelVariants ? (
                                    <div className="space-y-1">
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#133129] text-[#DCE5E0] px-2 py-0.5 rounded-md">
                                        <Layers className="w-3 h-3 text-[#A8C4B5]" />
                                        <span>2-Level ({prod.variants.length} {prod.variant_level1_name || 'Warna'})</span>
                                      </span>
                                      <div className="text-[10px] text-neutral-500">
                                        {totalCombinations} kombinasi harga &amp; stok
                                      </div>
                                    </div>
                                  ) : hasFlatVariants ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md">
                                      <Layers className="w-3 h-3 text-[#A8C4B5]" />
                                      <span>
                                        1-Level ({flatVariantSizes.length} Ukuran
                                        {flatVariantSizes.length > 0 && `: ${flatVariantSizes[0]} - ${flatVariantSizes[flatVariantSizes.length - 1]}`})
                                      </span>
                                    </span>
                                  ) : (
                                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                                      {(prod.sizes || []).slice(0, 4).map((sz) => (
                                        <span
                                          key={sz}
                                          className="text-[9px] font-mono font-semibold px-1.5 py-0.2 bg-neutral-100 text-neutral-700 rounded-sm"
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
                                  )}
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

                                {/* Status Badges */}
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

                                {/* Actions */}
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
                        const thumb = prod.images && prod.images.length > 0
                          ? resolveImageUrl(prod.images[0])
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
                              </div>

                              {/* Mobile Actions */}
                              <div className="mt-2.5 flex items-center justify-between border-t border-neutral-100 pt-2">
                                <div className="text-[9px] font-semibold text-neutral-500">
                                  {Array.isArray(prod.variants) && prod.variants.some((variant) => Array.isArray(variant.options) && variant.options.length > 0)
                                    ? `2-Level Varian (${prod.variants.length} ${prod.variant_level1_name || 'Warna'})`
                                    : Array.isArray(prod.variants) && prod.variants.length > 0
                                    ? `1-Level (${prod.variants.length} Ukuran: ${prod.variants[0].name} - ${prod.variants[prod.variants.length - 1].name})`
                                    : `${(prod.sizes || []).length} Ukuran`}
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

            </div>
          )}

          {/* TAB 2: MASTER KATEGORI */}
          {activeTab === 'categories' && (
            <CategoryManager
              categories={categories}
              products={products}
              onAddCategory={addCategory}
              onUpdateCategory={updateCategory}
              onDeleteCategory={deleteCategory}
              showToast={showToast}
            />
          )}

          {/* TAB 3: BANNER DEPAN */}
          {activeTab === 'banners' && (
            <BannerManager
              banners={banners}
              onAddBanner={addBanner}
              onUpdateBanner={updateBanner}
              onDeleteBanner={deleteBanner}
              onToggleStatus={toggleBannerStatus}
              showToast={showToast}
            />
          )}

        </main>
      </div>

      {/* Product Form Modal (with 2-level variants) */}
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
