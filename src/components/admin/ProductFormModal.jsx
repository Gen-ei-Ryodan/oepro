import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Image, Sparkles, Check, Upload, AlertCircle } from 'lucide-react';

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL'];

export default function ProductFormModal({ isOpen, onClose, onSave, product, categories }) {
  if (!isOpen) return null;

  const isEditing = Boolean(product && product.id);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Kaos Polo Premium',
    price: 129000,
    original_price: 159000,
    discount_percent: 19,
    stock: 50,
    material: '100% Cotton Pique Hexagon Premium (220 GSM)',
    fit: 'Regular Fit Unisex',
    description: '',
    sizes: [...ALL_SIZES],
    images: [],
    features: [
      '100% Full Cotton Pique Hexagon',
      'Kerah rajut tebal 4 lapis anti-curling',
      'Placket kancing rapi dengan jahitan bartack',
      'Side split di hem bawah untuk kenyamanan gerak',
    ],
    is_best_seller: false,
    is_featured: false,
    is_new_arrival: true,
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [newFeatureText, setNewFeatureText] = useState('');

  // Populate data when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || `OEP-${Date.now().toString().slice(-4)}`,
        category: product.category || (categories[0] ? categories[0].name : 'Kaos Polo Premium'),
        price: product.price || 0,
        original_price: product.original_price || product.price || 0,
        discount_percent: product.discount_percent || 0,
        stock: product.stock !== undefined ? product.stock : 50,
        material: product.material || '100% Cotton Pique Hexagon',
        fit: product.fit || 'Regular Fit Unisex',
        description: product.description || '',
        sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [...ALL_SIZES],
        images: product.images && product.images.length > 0 ? product.images : [],
        features: product.features && product.features.length > 0 ? product.features : [],
        is_best_seller: Boolean(product.is_best_seller),
        is_featured: Boolean(product.is_featured),
        is_new_arrival: Boolean(product.is_new_arrival),
      });
    } else {
      // New product defaults
      setFormData({
        name: '',
        sku: `OEP-${Math.floor(1000 + Math.random() * 9000)}`,
        category: categories[0] ? categories[0].name : 'Kaos Polo Premium',
        price: 129000,
        original_price: 149000,
        discount_percent: 13,
        stock: 50,
        material: '100% Cotton Combed 24s Reactive',
        fit: 'Regular Fit Unisex',
        description: 'Bahan katun premium OEPRO dengan rajutan benang padat dan tekstur sejuk.',
        sizes: [...ALL_SIZES],
        images: ['assets/products/polo/black-stone/black-stone-oepro.webp'],
        features: ['100% Full Cotton Murni', 'Jahitan rantai standar ekspor'],
        is_best_seller: false,
        is_featured: true,
        is_new_arrival: true,
      });
    }
  }, [product, categories]);

  // Handle Price Changes & Auto-Calculate Discount Percent
  const handlePriceChange = (field, value) => {
    const numVal = Math.max(0, parseInt(value, 10) || 0);
    const updated = { ...formData, [field]: numVal };

    if (field === 'price' || field === 'original_price') {
      const p = field === 'price' ? numVal : formData.price;
      const op = field === 'original_price' ? numVal : formData.original_price;

      if (op > p && op > 0) {
        updated.discount_percent = Math.round(((op - p) / op) * 100);
      } else {
        updated.discount_percent = 0;
      }
    }

    setFormData(updated);
  };

  // Toggle Size
  const toggleSize = (size) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      const nextSizes = exists ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size];
      return { ...prev, sizes: nextSizes };
    });
  };

  const selectAllSizes = () => {
    setFormData((prev) => ({ ...prev, sizes: [...ALL_SIZES] }));
  };

  const selectStandardSizes = () => {
    setFormData((prev) => ({ ...prev, sizes: ['S', 'M', 'L', 'XL'] }));
  };

  const selectJumboSizes = () => {
    setFormData((prev) => ({ ...prev, sizes: ['2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL'] }));
  };

  // Images
  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
    setNewImageUrl('');
  };

  const removeImage = (index) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, reader.result]
      }));
    };
    reader.readAsDataURL(file);
  };

  // Features
  const addFeature = () => {
    if (!newFeatureText.trim()) return;
    setFormData((prev) => ({ ...prev, features: [...prev.features, newFeatureText.trim()] }));
    setNewFeatureText('');
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama produk wajib diisi');
      return;
    }

    // Auto generate slug
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const catSlug = formData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const finalProduct = {
      ...(product || {}),
      ...formData,
      slug: slug || `product-${Date.now()}`,
      category_slug: catSlug,
      images: formData.images.length > 0 ? formData.images : ['assets/products/polo/black-stone/black-stone-oepro.webp'],
    };

    onSave(finalProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-[#E5E5E0] rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E5E0] bg-[#FBFBFA] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-[#2D4A3E] uppercase">
              OEPRO CATALOG MANAGEMENT
            </span>
            <h2 className="text-lg font-bold text-neutral-950">
              {isEditing ? `Edit Produk: ${formData.name || 'Produk'}` : 'Tambah Produk Baru'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form id="product-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Kolom Kiri: Info Utama & Harga (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Nama & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Nama Produk *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Kaos Polo Premium - Sage Green"
                    className="w-full px-3.5 py-2 text-sm bg-[#FBFBFA] border border-[#E5E5E0] rounded-xl focus:bg-white focus:border-neutral-950 focus:outline-hidden transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    SKU Kode
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#FBFBFA] border border-[#E5E5E0] rounded-xl focus:bg-white focus:border-neutral-950 focus:outline-hidden transition font-mono uppercase"
                  />
                </div>
              </div>

              {/* Kategori & Bahan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Kategori Produk
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-[#FBFBFA] border border-[#E5E5E0] rounded-xl focus:bg-white focus:border-neutral-950 focus:outline-hidden transition"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="Kaos Polo Premium">Kaos Polo Premium</option>
                    <option value="Kaos Polos Heavyweight">Kaos Polos Heavyweight</option>
                    <option value="Longsleeve Tee">Longsleeve Tee</option>
                    <option value="Outerwear">Outerwear</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Fit / Potongan
                  </label>
                  <input
                    type="text"
                    value={formData.fit}
                    onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                    placeholder="Regular Fit Unisex"
                    className="w-full px-3.5 py-2 text-sm bg-[#FBFBFA] border border-[#E5E5E0] rounded-xl focus:bg-white focus:border-neutral-950 focus:outline-hidden transition"
                  />
                </div>
              </div>

              {/* Pricing & Discount */}
              <div className="p-4 bg-[#F5F5F3] border border-[#E5E5E0] rounded-2xl space-y-3">
                <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block">
                  Struktur Harga &amp; Promo
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Harga Jual (Rp) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => handlePriceChange('price', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E0] rounded-xl focus:border-neutral-950 focus:outline-hidden font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Harga Coret / Normal (Rp)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.original_price}
                      onChange={(e) => handlePriceChange('original_price', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E0] rounded-xl focus:border-neutral-950 focus:outline-hidden text-neutral-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 mb-1">
                      Diskon (%)
                    </label>
                    <div className="w-full px-3 py-2 text-sm bg-amber-100/60 border border-amber-300 text-amber-900 font-bold rounded-xl flex items-center justify-between">
                      <span>{formData.discount_percent}% OFF</span>
                      {formData.original_price > formData.price && (
                        <span className="text-[10px] text-amber-800 font-normal">
                          Hemat Rp{(formData.original_price - formData.price).toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Material & Deskripsi */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                  Material Kain
                </label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  placeholder="100% Cotton Pique Hexagon Premium (220 GSM)"
                  className="w-full px-3.5 py-2 text-sm bg-[#FBFBFA] border border-[#E5E5E0] rounded-xl focus:bg-white focus:border-neutral-950 focus:outline-hidden transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                  Deskripsi Lengkap Produk
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tuliskan deskripsi keunggulan bahan, potongan kerah, dan petunjuk pemakaian..."
                  className="w-full px-3.5 py-2 text-sm bg-[#FBFBFA] border border-[#E5E5E0] rounded-xl focus:bg-white focus:border-neutral-950 focus:outline-hidden transition resize-y"
                ></textarea>
              </div>

              {/* Fitur & Keunggulan List */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
                  Poin Keunggulan / Fitur Bahan
                </label>
                <div className="space-y-2 mb-2">
                  {formData.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-[#F5F5F3] px-3 py-1.5 rounded-lg text-xs">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="flex-1 text-neutral-800">{feat}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-neutral-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    placeholder="Tambah poin keunggulan..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-[#FBFBFA] border border-[#E5E5E0] rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold rounded-xl text-neutral-800"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Ukuran, Stok, Galeri Gambar & Status (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Multi-select Ukuran (XS s/d 8XL) */}
              <div className="p-4 bg-[#F5F5F3] border border-[#E5E5E0] rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Varian Ukuran ({formData.sizes.length} Terpilih)
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={selectAllSizes}
                      className="text-[10px] font-semibold text-neutral-600 hover:text-neutral-950 underline cursor-pointer"
                    >
                      Semua
                    </button>
                    <span className="text-neutral-300">|</span>
                    <button
                      type="button"
                      onClick={selectStandardSizes}
                      className="text-[10px] font-semibold text-neutral-600 hover:text-neutral-950 underline cursor-pointer"
                    >
                      S–XL
                    </button>
                    <span className="text-neutral-300">|</span>
                    <button
                      type="button"
                      onClick={selectJumboSizes}
                      className="text-[10px] font-semibold text-neutral-600 hover:text-neutral-950 underline cursor-pointer"
                    >
                      2XL–8XL
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-1.5">
                  {ALL_SIZES.map((sz) => {
                    const active = formData.sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSize(sz)}
                        className={`py-1.5 text-xs font-semibold rounded-lg border transition text-center ${
                          active
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                            : 'bg-white text-neutral-600 border-[#E5E5E0] hover:border-neutral-400'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stok & Status Badges */}
              <div className="p-4 bg-[#F5F5F3] border border-[#E5E5E0] rounded-2xl space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
                    Stok Inventaris (Pcs)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#E5E5E0] rounded-xl focus:border-neutral-950 focus:outline-hidden font-semibold"
                  />
                </div>

                <div className="pt-2 border-t border-neutral-200 space-y-2">
                  <label className="flex items-center gap-2.5 text-xs font-medium text-neutral-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_best_seller}
                      onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
                      className="w-4 h-4 rounded-sm text-neutral-950 focus:ring-neutral-950"
                    />
                    <span>Tandai sebagai <strong>Best Seller</strong></span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs font-medium text-neutral-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-4 h-4 rounded-sm text-neutral-950 focus:ring-neutral-950"
                    />
                    <span>Tampilkan di <strong>Koleksi Pilihan (Featured)</strong></span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs font-medium text-neutral-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_new_arrival}
                      onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                      className="w-4 h-4 rounded-sm text-neutral-950 focus:ring-neutral-950"
                    />
                    <span>Badge <strong>New Arrival</strong></span>
                  </label>
                </div>
              </div>

              {/* Galeri Gambar Produk */}
              <div className="p-4 bg-[#F5F5F3] border border-[#E5E5E0] rounded-2xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 block">
                  Galeri Foto Produk ({formData.images.length})
                </span>

                {/* Thumbnails preview */}
                <div className="grid grid-cols-4 gap-2">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-white border border-neutral-200">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-neutral-950 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm">
                          Utama
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Upload from file */}
                <label className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-dashed border-neutral-300 rounded-xl text-xs font-semibold text-neutral-700 hover:border-neutral-950 cursor-pointer transition">
                  <Upload className="w-4 h-4 text-neutral-500" />
                  <span>Upload Foto dari Perangkat</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Or paste URL */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Atau tempel path/URL foto..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#E5E5E0] rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-3 py-1.5 bg-neutral-950 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800"
                  >
                    Tambah
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Sticky Footer Actions */}
        <div className="px-6 py-4 border-t border-[#E5E5E0] bg-[#FBFBFA] flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/50 rounded-xl transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            form="product-form"
            className="px-6 py-2.5 bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-semibold rounded-xl transition shadow-md shadow-neutral-950/10 cursor-pointer flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{isEditing ? 'Simpan Perubahan' : 'Terbitkan Produk'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
