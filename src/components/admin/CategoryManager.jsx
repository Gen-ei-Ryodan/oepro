import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  Upload,
  X,
  Check,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';

export default function CategoryManager({
  categories,
  products,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  showToast,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    subtitle: '',
    description: '',
    image: '',
  });

  const getProductCount = (categorySlug, categoryName) => {
    return products.filter(
      (p) => p.category_slug === categorySlug || p.category === categoryName
    ).length;
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      subtitle: '',
      description: '',
      image: 'assets/products/polo/black-stone/black-stone-oepro.webp',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name || '',
      slug: cat.slug || '',
      subtitle: cat.subtitle || '',
      description: cat.description || '',
      image: cat.image || '',
    });
    setIsModalOpen(true);
  };

  const handleNameChange = (name) => {
    setFormData((prev) => {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      return {
        ...prev,
        name,
        slug: editingCategory ? prev.slug : generatedSlug,
      };
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, image: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama kategori wajib diisi');
      return;
    }

    const payload = {
      ...formData,
      slug: formData.slug.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      item_count: getProductCount(formData.slug, formData.name),
    };

    if (editingCategory) {
      onUpdateCategory(editingCategory.id, payload);
      showToast(`Kategori "${payload.name}" berhasil diperbarui.`);
    } else {
      onAddCategory(payload);
      showToast(`Kategori baru "${payload.name}" berhasil ditambahkan.`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (cat) => {
    const count = getProductCount(cat.slug, cat.name);
    if (
      window.confirm(
        `Yakin ingin menghapus kategori "${cat.name}"? Terdapat ${count} produk terhubung.`
      )
    ) {
      onDeleteCategory(cat.id);
      showToast(`Kategori "${cat.name}" dihapus.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E5E0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#075E54]/10 text-[#075E54] flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
              Master Kategori Produk
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Kelola pengelompokan departemen katalog pakaian OEPRO, slug navigasi, dan thumbnail visual.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#075E54] hover:bg-[#075E54]/90 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori Baru</span>
        </button>
      </div>

      {/* Categories Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const count = getProductCount(cat.slug, cat.name);
          const imgSrc = cat.image
            ? (cat.image.startsWith('http') || cat.image.startsWith('data:') ? cat.image : `/${cat.image.replace(/^\//, '')}`)
            : '/assets/brand/oepro-logo.webp';

          return (
            <div
              key={cat.id || cat.slug}
              className="bg-white rounded-2xl border border-[#E5E5E0] p-4 flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-16 rounded-xl overflow-hidden bg-[#F5F5F3] border border-neutral-200 shrink-0">
                    <img
                      src={imgSrc}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-bold text-sm text-neutral-950 truncate">
                        {cat.name}
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7E2CE] text-[#3A3732] shrink-0">
                        {count} Produk
                      </span>
                    </div>
                    <span className="inline-block font-mono text-[10px] text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-md mt-0.5">
                      /{cat.slug}
                    </span>
                    {cat.subtitle && (
                      <p className="text-[11px] text-[#655F58] font-medium mt-1 truncate">
                        {cat.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {cat.description && (
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
                <a
                  href={`/catalog?cat=${cat.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-[#075E54] hover:underline flex items-center gap-1"
                >
                  <span>Lihat di Katalog</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition"
                    title="Edit Kategori"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-neutral-200 shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-[#FBFBFA]">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#075E54]" />
                <h3 className="font-bold text-sm text-neutral-900">
                  {editingCategory ? 'Edit Master Kategori' : 'Tambah Kategori Baru'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kaos Polo Premium, Kaos Oversize 24s"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#075E54] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Slug URL <span className="text-neutral-400 font-normal">(Digunakan untuk filter katalog)</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="contoh: polo-shirt"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-mono bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#075E54] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Sub-judul / Tagline Singkat
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 100% Cotton Pique Hexagon"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#075E54] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Deskripsi Kategori
                </label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi keunggulan kategori untuk SEO dan customer..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#075E54] focus:outline-hidden"
                />
              </div>

              {/* Category Image */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Foto Thumbnail Kategori
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border border-neutral-200 overflow-hidden bg-neutral-100 shrink-0">
                    {formData.image ? (
                      <img
                        src={formData.image.startsWith('http') || formData.image.startsWith('data:') ? formData.image : `/${formData.image.replace(/^\//, '')}`}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Foto</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Atau tempel URL/path gambar..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#075E54] hover:bg-[#075E54]/90 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingCategory ? 'Simpan Perubahan' : 'Buat Kategori'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
