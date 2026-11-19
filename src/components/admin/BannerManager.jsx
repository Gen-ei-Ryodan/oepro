import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Upload,
  X,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  MoveUp,
  MoveDown,
  LayoutGrid,
  Maximize2,
} from 'lucide-react';

export default function BannerManager({
  banners,
  onAddBanner,
  onUpdateBanner,
  onDeleteBanner,
  onToggleStatus,
  showToast,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  const [formData, setFormData] = useState({
    headline: '',
    subheadline: '',
    tag: 'Koleksi Katun 100%',
    ctaText: 'Belanja',
    ctaLink: '/catalog',
    image: '/assets/products/polo/black-stone/black-stone-oepro.webp',
    imageLayout: 'contained',
    isActive: true,
  });

  const handleOpenAdd = () => {
    setEditingBanner(null);
    setFormData({
      headline: 'Nyaman Dipakai, Mudah Dipadukan.',
      subheadline: 'Kaos berbahan Cotton Combed 24s, 100% katun dengan potongan regular fit yang nyaman untuk semua.',
      tag: 'Koleksi Katun 100%',
      ctaText: 'Belanja',
      ctaLink: '/catalog',
      image: '/assets/products/polo/black-stone/black-stone-oepro.webp',
      imageLayout: 'contained',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      headline: banner.headline || '',
      subheadline: banner.subheadline || '',
      tag: banner.tag || 'Koleksi Katun 100%',
      ctaText: banner.ctaText || 'Belanja',
      ctaLink: banner.ctaLink || '/catalog',
      image: banner.image || '',
      imageLayout: banner.imageLayout || (banner.layout === 'full' ? 'full' : 'contained'),
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran gambar maksimal 3MB');
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
    if (!formData.headline.trim()) {
      alert('Teks headline banner wajib diisi');
      return;
    }

    if (editingBanner) {
      onUpdateBanner(editingBanner.id, formData);
      showToast('Banner berhasil diperbarui.');
    } else {
      onAddBanner(formData);
      showToast('Banner baru berhasil ditambahkan.');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (banner) => {
    if (banners.length <= 1) {
      alert('Minimal harus ada 1 banner di sistem.');
      return;
    }

    if (window.confirm(`Hapus banner "${banner.headline}"?`)) {
      onDeleteBanner(banner.id);
      showToast('Banner telah dihapus.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E5E0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#A8C4B5]/10 text-[#A8C4B5] flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
              Manajemen Banner Depan (Hero Slider)
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Atur banner utama di beranda toko (multiple banner slider), ganti foto visual, serta edit copywriting headline dan subheadline.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#A8C4B5] hover:bg-[#A8C4B5]/90 text-[#081F1C] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Banner Baru</span>
        </button>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {banners.map((banner, index) => {
          const imgSrc = banner.image
            ? (banner.image.startsWith('http') || banner.image.startsWith('data:') ? banner.image : `/${banner.image.replace(/^\//, '')}`)
            : '/assets/products/polo/black-stone/black-stone-oepro.webp';
          const layoutMode = banner.imageLayout || (banner.layout === 'full' ? 'full' : 'contained');

          return (
            <div
              key={banner.id || index}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                banner.isActive !== false
                  ? 'border-[#E5E5E0] shadow-xs'
                  : 'border-neutral-200 opacity-60 bg-neutral-50/50'
              }`}
            >
              {/* Banner Card Grid */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
                
                {/* Visual Thumbnail & Content */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-28 sm:w-36 h-20 sm:h-24 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-300 relative group flex items-center justify-center p-1">
                    <img
                      src={imgSrc}
                      alt={banner.headline}
                      className="w-full h-full object-contain"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1.5 py-0.2 rounded-sm">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#133129] text-[#DCE5E0] uppercase tracking-wider">
                        {banner.tag || 'Koleksi Katun 100%'}
                      </span>
                      {banner.isActive !== false ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" />
                          <span>Tayang Aktif</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded-full">
                          Nonaktif
                        </span>
                      )}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#A8C4B5]/10 text-[#A8C4B5]">
                        {layoutMode === 'full' ? 'Layout: Full' : 'Layout: Kecil'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-neutral-900 leading-snug">
                      {banner.headline}
                    </h3>
                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                      {banner.subheadline}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-neutral-400">
                      <span>Tombol CTA: <strong className="text-neutral-700">{banner.ctaText || 'Belanja'}</strong></span>
                      <span>&bull;</span>
                      <span>Tautan: <strong className="text-neutral-700 font-mono">{banner.ctaLink || '/catalog'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100 w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(banner.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                      banner.isActive !== false
                        ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                    title={banner.isActive !== false ? 'Sembunyikan dari beranda' : 'Aktifkan banner'}
                  >
                    {banner.isActive !== false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{banner.isActive !== false ? 'Nonaktifkan' : 'Aktifkan'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(banner)}
                    className="p-2 text-neutral-700 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition"
                    title="Edit Banner"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(banner)}
                    className="p-2 text-neutral-400 hover:text-red-600 bg-neutral-100 hover:bg-red-50 rounded-xl transition"
                    title="Hapus Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-neutral-200 shadow-2xl overflow-hidden animate-scale-up">
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-[#FBFBFA]">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#A8C4B5]" />
                <h3 className="font-bold text-sm text-neutral-900">
                  {editingBanner ? 'Edit Banner Depan' : 'Tambah Banner Depan'}
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

            <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Live Preview Box */}
              <div className="p-3 bg-neutral-950 text-white rounded-xl border border-neutral-800 space-y-2">
                <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                  Live Preview Banner
                </div>
                <div className="grid grid-cols-12 items-center gap-2">
                  <div className="col-span-8 space-y-1">
                    <span className="text-[8px] bg-white/20 text-neutral-200 px-1.5 py-0.5 rounded-full uppercase">
                      {formData.tag || 'Koleksi Katun 100%'}
                    </span>
                    <h4 className="text-xs font-bold leading-tight line-clamp-2">
                      {formData.headline || 'Headline Banner...'}
                    </h4>
                    <p className="text-[10px] text-neutral-300 line-clamp-2">
                      {formData.subheadline || 'Subheadline banner...'}
                    </p>
                    <div className="inline-block text-[9px] bg-white text-neutral-950 font-bold px-2 py-0.5 rounded-full mt-1">
                      {formData.ctaText || 'Belanja'} &rarr;
                    </div>
                  </div>
                  <div className="col-span-4 flex items-center justify-center h-16">
                    {formData.image ? (
                      <img
                        src={formData.image.startsWith('http') || formData.image.startsWith('data:') ? formData.image : `/${formData.image.replace(/^\//, '')}`}
                        alt="Preview"
                        className="h-full object-contain"
                      />
                    ) : (
                      <span className="text-[9px] text-neutral-500">Foto</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tag / Badge */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Tag / Label Atas
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Koleksi Katun 100%, Edisi Terbatas"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#A8C4B5] focus:outline-hidden"
                />
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Teks Headline Banner <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Nyaman Dipakai, Mudah Dipadukan."
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#A8C4B5] focus:outline-hidden"
                />
              </div>

              {/* Subheadline */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Teks Subheadline / Paragraf Banner
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Kaos berbahan Cotton Combed 24s, 100% katun dengan potongan regular fit yang nyaman untuk semua."
                  value={formData.subheadline}
                  onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#A8C4B5] focus:outline-hidden"
                />
              </div>

              {/* Image Upload & Path */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Foto Banner
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl cursor-pointer transition shrink-0">
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
                    placeholder="Atau tempel URL/path foto..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="flex-1 px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Image Layout (Contained vs Full) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Tata Letak Gambar Banner
                </label>
                <div className="inline-flex p-1 bg-[#081F1C] rounded-xl border border-[#133129]">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageLayout: 'contained' })}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      formData.imageLayout !== 'full'
                        ? 'bg-[#A8C4B5] text-[#081F1C] shadow-xs'
                        : 'text-[#DCE5E0] hover:text-[#A8C4B5]'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Gambar Kecil / Contained</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageLayout: 'full' })}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      formData.imageLayout === 'full'
                        ? 'bg-[#A8C4B5] text-[#081F1C] shadow-xs'
                        : 'text-[#DCE5E0] hover:text-[#A8C4B5]'
                    }`}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Gambar Full / Penuh</span>
                  </button>
                </div>
              </div>

              {/* CTA Button Text & Link */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Teks Tombol CTA
                  </label>
                  <input
                    type="text"
                    placeholder="Belanja"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Tautan Tujuan (Link)
                  </label>
                  <input
                    type="text"
                    placeholder="/catalog"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 text-xs font-semibold text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded-sm text-[#A8C4B5] focus:ring-[#A8C4B5]"
                  />
                  <span>Tampilkan banner ini di beranda depan (Aktif)</span>
                </label>
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
                  className="px-5 py-2 bg-[#A8C4B5] hover:bg-[#A8C4B5]/90 text-[#081F1C] text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingBanner ? 'Simpan Perubahan' : 'Terbitkan Banner'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
