import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Image,
  Sparkles,
  Check,
  Upload,
  AlertCircle,
  Layers,
  ChevronDown,
  ChevronUp,
  Tag,
  Palette,
  Sliders,
} from 'lucide-react';

const STANDARD_SIZES = ['S', 'M', 'L', 'XL'];
const JUMBO_SIZES = ['2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL'];
const ALL_SIZES = ['XS', ...STANDARD_SIZES, ...JUMBO_SIZES];

export default function ProductFormModal({ isOpen, onClose, onSave, product, categories }) {
  if (!isOpen) return null;

  const isEditing = Boolean(product && product.id);

  // Main Form Data State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Kaos Polo Premium',
    price: 92000,
    original_price: 119000,
    discount_percent: 23,
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
    has_variants: true,
    variant_level1_name: 'Warna',
    variant_level2_name: 'Ukuran',
    variants: [],
  });

  const [newImageUrl, setNewImageUrl] = useState('');
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkStock, setBulkStock] = useState('');
  const [expandedVariantIdx, setExpandedVariantIdx] = useState(0);

  // Initialize or populate data
  useEffect(() => {
    if (product) {
      // Determine if product already has 2-level variants or construct from colors & sizes
      let initialVariants = [];
      if (Array.isArray(product.variants) && product.variants.length > 0) {
        initialVariants = product.variants;
      } else if (Array.isArray(product.colors) && product.colors.length > 0) {
        // Build 2-level variants from existing colors and sizes
        const sizesToUse = (product.sizes && product.sizes.length > 0) ? product.sizes : STANDARD_SIZES;
        initialVariants = product.colors.map((c, idx) => ({
          id: `var1-${idx + 1}`,
          name: c.name || `Warna ${idx + 1}`,
          hex: c.hex || '#1D1D1D',
          options: sizesToUse.map((sz, szIdx) => ({
            id: `var2-${idx + 1}-${szIdx + 1}`,
            name: sz,
            price: product.price || 92000,
            original_price: product.original_price || 119000,
            stock: 20,
            sku: `${product.sku || 'OEP'}-${(c.name || 'CLR').slice(0, 3).toUpperCase()}-${sz}`,
          })),
        }));
      } else {
        // Default 2-level variants
        initialVariants = [
          {
            id: 'var1-1',
            name: 'Black Stone',
            hex: '#1D1D1D',
            options: STANDARD_SIZES.map((sz, i) => ({
              id: `var2-1-${i + 1}`,
              name: sz,
              price: product.price || 92000,
              original_price: 119000,
              stock: 25,
              sku: `OEP-BLK-${sz}`,
            })),
          },
        ];
      }

      setFormData({
        name: product.name || '',
        sku: product.sku || `OEP-${Date.now().toString().slice(-4)}`,
        category: product.category || (categories[0] ? categories[0].name : 'Kaos Polo Premium'),
        price: product.price || 92000,
        original_price: product.original_price || 119000,
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
        has_variants: true,
        variant_level1_name: product.variant_level1_name || 'Warna',
        variant_level2_name: product.variant_level2_name || 'Ukuran',
        variants: initialVariants,
      });
    } else {
      // New product defaults with 2-level variants example
      const defaultVariants = [
        {
          id: 'var1-1',
          name: 'Merah',
          hex: '#C21807',
          options: [
            { id: 'var2-1-1', name: 'M', price: 92000, original_price: 119000, stock: 25, sku: 'POLO-MRH-M' },
            { id: 'var2-1-2', name: 'L', price: 92000, original_price: 119000, stock: 30, sku: 'POLO-MRH-L' },
            { id: 'var2-1-3', name: 'XL', price: 92000, original_price: 119000, stock: 20, sku: 'POLO-MRH-XL' },
          ],
        },
        {
          id: 'var1-2',
          name: 'Black Stone',
          hex: '#1D1D1D',
          options: [
            { id: 'var2-2-1', name: 'M', price: 92000, original_price: 119000, stock: 30, sku: 'POLO-BLK-M' },
            { id: 'var2-2-2', name: 'L', price: 92000, original_price: 119000, stock: 35, sku: 'POLO-BLK-L' },
            { id: 'var2-2-3', name: 'XL', price: 92000, original_price: 119000, stock: 25, sku: 'POLO-BLK-XL' },
          ],
        },
      ];

      setFormData({
        name: '',
        sku: `OEP-${Math.floor(1000 + Math.random() * 9000)}`,
        category: categories[0] ? categories[0].name : 'Kaos Polo Premium',
        price: 92000,
        original_price: 119000,
        discount_percent: 23,
        stock: 160,
        material: '100% Cotton Pique Hexagon Premium',
        fit: 'Regular Fit Unisex',
        description: 'Polo shirt katun murni berkualitas tinggi dengan tekstur pique hexagon premium berpori halus.',
        sizes: ['M', 'L', 'XL'],
        images: ['assets/products/polo/black-stone/black-stone-oepro.webp'],
        features: ['100% Full Cotton Murni', 'Jahitan rantai standar ekspor', 'Kerah rajut tebal 4 lapis'],
        is_best_seller: false,
        is_featured: true,
        is_new_arrival: true,
        has_variants: true,
        variant_level1_name: 'Warna',
        variant_level2_name: 'Ukuran',
        variants: defaultVariants,
      });
    }
  }, [product, categories]);

  // Recalculate total stock and base price from variants whenever variants change
  const syncFromVariants = (variants) => {
    let totalStock = 0;
    let minPrice = Infinity;

    variants.forEach((v1) => {
      (v1.options || []).forEach((v2) => {
        totalStock += parseInt(v2.stock, 10) || 0;
        if (v2.price && parseInt(v2.price, 10) < minPrice) {
          minPrice = parseInt(v2.price, 10);
        }
      });
    });

    const updated = {
      variants,
      stock: totalStock,
    };
    if (minPrice !== Infinity) {
      updated.price = minPrice;
      if (formData.original_price > minPrice) {
        updated.discount_percent = Math.round(
          ((formData.original_price - minPrice) / formData.original_price) * 100
        );
      }
    }
    return updated;
  };

  // Add Level 1 Variant (e.g. Warna baru)
  const addLevel1Variant = () => {
    const newIdx = (formData.variants || []).length + 1;
    const newV1 = {
      id: `var1-${Date.now()}`,
      name: `Varian Warna ${newIdx}`,
      hex: '#3A3732',
      options: [
        { id: `var2-${Date.now()}-1`, name: 'M', price: formData.price || 92000, original_price: formData.original_price, stock: 20, sku: '' },
        { id: `var2-${Date.now()}-2`, name: 'L', price: formData.price || 92000, original_price: formData.original_price, stock: 20, sku: '' },
        { id: `var2-${Date.now()}-3`, name: 'XL', price: formData.price || 92000, original_price: formData.original_price, stock: 20, sku: '' },
      ],
    };

    const nextVariants = [...formData.variants, newV1];
    setFormData((prev) => ({
      ...prev,
      ...syncFromVariants(nextVariants),
    }));
    setExpandedVariantIdx(nextVariants.length - 1);
  };

  const removeLevel1Variant = (idx) => {
    if (formData.variants.length <= 1) {
      alert('Minimal harus ada 1 varian level 1.');
      return;
    }
    const nextVariants = formData.variants.filter((_, i) => i !== idx);
    setFormData((prev) => ({
      ...prev,
      ...syncFromVariants(nextVariants),
    }));
    setExpandedVariantIdx(0);
  };

  const updateLevel1Field = (idx, field, value) => {
    const nextVariants = [...formData.variants];
    nextVariants[idx] = { ...nextVariants[idx], [field]: value };
    setFormData((prev) => ({ ...prev, variants: nextVariants }));
  };

  // Add Level 2 Option under Level 1 (e.g. Ukuran baru)
  const addLevel2Option = (v1Idx, name = 'XL') => {
    const nextVariants = [...formData.variants];
    const v1 = nextVariants[v1Idx];
    const newOption = {
      id: `var2-${Date.now()}-${(v1.options || []).length + 1}`,
      name: name,
      price: formData.price || 92000,
      original_price: formData.original_price || 119000,
      stock: 20,
      sku: `${formData.sku}-${(v1.name || 'VAR').slice(0, 3).toUpperCase()}-${name}`,
    };
    nextVariants[v1Idx] = {
      ...v1,
      options: [...(v1.options || []), newOption],
    };
    setFormData((prev) => ({
      ...prev,
      ...syncFromVariants(nextVariants),
    }));
  };

  const removeLevel2Option = (v1Idx, optIdx) => {
    const nextVariants = [...formData.variants];
    const v1 = nextVariants[v1Idx];
    if (v1.options.length <= 1) {
      alert('Minimal harus ada 1 varian level 2.');
      return;
    }
    nextVariants[v1Idx] = {
      ...v1,
      options: v1.options.filter((_, i) => i !== optIdx),
    };
    setFormData((prev) => ({
      ...prev,
      ...syncFromVariants(nextVariants),
    }));
  };

  const updateLevel2Field = (v1Idx, optIdx, field, value) => {
    const nextVariants = [...formData.variants];
    const v1 = nextVariants[v1Idx];
    const updatedOptions = [...v1.options];
    updatedOptions[optIdx] = {
      ...updatedOptions[optIdx],
      [field]: field === 'price' || field === 'stock' || field === 'original_price'
        ? Math.max(0, parseInt(value, 10) || 0)
        : value,
    };
    nextVariants[v1Idx] = { ...v1, options: updatedOptions };
    setFormData((prev) => ({
      ...prev,
      ...syncFromVariants(nextVariants),
    }));
  };

  // Apply Quick Sizes to Level 1
  const applyStandardSizesToV1 = (v1Idx) => {
    const nextVariants = [...formData.variants];
    const v1 = nextVariants[v1Idx];
    const newOptions = STANDARD_SIZES.map((sz, i) => ({
      id: `var2-${Date.now()}-${i}`,
      name: sz,
      price: formData.price || 92000,
      original_price: formData.original_price || 119000,
      stock: 25,
      sku: `${formData.sku}-${(v1.name || 'VAR').slice(0, 3).toUpperCase()}-${sz}`,
    }));
    nextVariants[v1Idx] = { ...v1, options: newOptions };
    setFormData((prev) => ({
      ...prev,
      ...syncFromVariants(nextVariants),
    }));
  };

  // Bulk Apply Price or Stock to all variant combinations
  const handleBulkApply = () => {
    const p = bulkPrice ? parseInt(bulkPrice, 10) : null;
    const s = bulkStock ? parseInt(bulkStock, 10) : null;
    if (p === null && s === null) return;

    const nextVariants = formData.variants.map((v1) => ({
      ...v1,
      options: (v1.options || []).map((v2) => ({
        ...v2,
        ...(p !== null ? { price: p } : {}),
        ...(s !== null ? { stock: s } : {}),
      })),
    }));

    setFormData((prev) => ({
      ...prev,
      ...syncFromVariants(nextVariants),
    }));
    alert('Harga/stok serentak berhasil diterapkan ke seluruh kombinasi varian!');
  };

  // Handle Image Upload
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran file maksimal 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, images: [event.target.result, ...prev.images] }));
    };
    reader.readAsDataURL(file);
  };

  const addImage = () => {
    if (!newImageUrl.trim()) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
    setNewImageUrl('');
  };

  const removeImage = (index) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama produk wajib diisi.');
      return;
    }

    // Auto generate colors and sizes arrays from 2-level variants for full backwards compatibility
    const generatedColors = formData.variants.map((v1) => ({
      name: v1.name,
      hex: v1.hex || '#1D1D1D',
    }));

    const allSizesSet = new Set();
    formData.variants.forEach((v1) => {
      (v1.options || []).forEach((v2) => allSizesSet.add(v2.name));
    });
    const generatedSizes = Array.from(allSizesSet);

    // Map category slug
    const matchingCat = categories.find((c) => c.name === formData.category);
    const category_slug = matchingCat
      ? matchingCat.slug
      : formData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const productPayload = {
      ...formData,
      category_slug,
      colors: generatedColors,
      sizes: generatedSizes.length > 0 ? generatedSizes : formData.sizes,
    };

    onSave(productPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] border border-neutral-200 shadow-2xl flex flex-col overflow-hidden animate-scale-up">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E5E5E0] bg-[#FBFBFA] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#075E54]/10 text-[#075E54] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-neutral-950">
                {isEditing ? `Edit Produk: ${formData.name || 'Produk OEPRO'}` : 'Tambah Produk & Varian Bertingkat'}
              </h2>
              <p className="text-[11px] text-neutral-500">
                Atur informasi katalog, spesifikasi material, dan struktur 2 varian harga &amp; stok.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg transition"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form id="product-form" onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* 1. INFORMASI UTAMA PRODUK */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            <div className="md:col-span-8 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nama Produk <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kaos Polo Premium - Ruby Red"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#075E54] focus:outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Kategori Master <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#075E54] focus:outline-hidden font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.slug} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Kode SKU Master
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Deskripsi Produk
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#075E54] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Spesifikasi Material Katun
                  </label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Potongan / Fit
                  </label>
                  <input
                    type="text"
                    value={formData.fit}
                    onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Right: Badges & Summary */}
            <div className="md:col-span-4 space-y-3 bg-[#FBFBFA] p-4 rounded-2xl border border-[#E5E5E0]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#3A3732] block">
                Ringkasan Stok &amp; Harga
              </span>

              <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500">Harga Terendah:</span>
                  <strong className="text-neutral-950 font-mono">
                    Rp{(formData.price || 0).toLocaleString('id-ID')}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500">Total Stok Tersedia:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                    {formData.stock || 0} pcs
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500">Kombinasi Varian:</span>
                  <strong className="text-neutral-700">
                    {(formData.variants || []).reduce((acc, v) => acc + (v.options || []).length, 0)} Pilihan
                  </strong>
                </div>
              </div>

              {/* Status Badges */}
              <div className="space-y-2 pt-2 border-t border-neutral-200">
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_best_seller}
                    onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
                    className="w-3.5 h-3.5 rounded-sm text-[#075E54] focus:ring-[#075E54]"
                  />
                  <span>Tandai <strong>Best Seller</strong></span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-3.5 h-3.5 rounded-sm text-[#075E54] focus:ring-[#075E54]"
                  />
                  <span>Tampilkan di <strong>Koleksi Pilihan</strong></span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_new_arrival}
                    onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                    className="w-3.5 h-3.5 rounded-sm text-[#075E54] focus:ring-[#075E54]"
                  />
                  <span>Badge <strong>New Arrival</strong></span>
                </label>
              </div>
            </div>

          </div>

          {/* 2. STRUKTUR 2 VARIAN BERTINGKAT (LEVEL 1: WARNA, LEVEL 2: UKURAN -> HARGA & STOK) */}
          <div className="p-5 bg-[#F5F5F3] border border-[#E5E5E0] rounded-2xl space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#075E54]" />
                  <h3 className="font-bold text-xs sm:text-sm text-neutral-900 uppercase tracking-wider">
                    Struktur 2 Varian Bertingkat (Harga &amp; Stok di Varian ke-2)
                  </h3>
                </div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Contoh: {formData.name || 'Produk Polo'} &rarr; Varian 1: {formData.variant_level1_name} ("Merah") &rarr; Varian 2: {formData.variant_level2_name} ("XL") = Harga &amp; Stok spesifik.
                </p>
              </div>

              {/* Labels configuration */}
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Nama Varian 1 (Warna)"
                  value={formData.variant_level1_name}
                  onChange={(e) => setFormData({ ...formData, variant_level1_name: e.target.value })}
                  className="px-2.5 py-1 text-xs bg-white border border-neutral-300 rounded-lg w-28 text-center font-semibold"
                  title="Nama Level 1"
                />
                <span className="text-neutral-400 font-bold">&rarr;</span>
                <input
                  type="text"
                  placeholder="Nama Varian 2 (Ukuran)"
                  value={formData.variant_level2_name}
                  onChange={(e) => setFormData({ ...formData, variant_level2_name: e.target.value })}
                  className="px-2.5 py-1 text-xs bg-white border border-neutral-300 rounded-lg w-28 text-center font-semibold"
                  title="Nama Level 2"
                />
              </div>
            </div>

            {/* Quick Bulk Batch Tool */}
            <div className="p-3 bg-white rounded-xl border border-neutral-200 flex flex-wrap items-center gap-2 justify-between">
              <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#075E54]" />
                <span>Atur Cepat Semua Varian:</span>
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <input
                  type="number"
                  placeholder="Harga (Rp)"
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                  className="w-24 px-2.5 py-1 text-xs border border-neutral-300 rounded-lg font-mono"
                />
                <input
                  type="number"
                  placeholder="Stok (Pcs)"
                  value={bulkStock}
                  onChange={(e) => setBulkStock(e.target.value)}
                  className="w-20 px-2.5 py-1 text-xs border border-neutral-300 rounded-lg font-mono"
                />
                <button
                  type="button"
                  onClick={handleBulkApply}
                  className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition"
                >
                  Terapkan Serentak
                </button>
              </div>
            </div>

            {/* List of Level 1 Variants */}
            <div className="space-y-3">
              {formData.variants.map((v1, v1Idx) => {
                const isExpanded = expandedVariantIdx === v1Idx;
                const totalV1Stock = (v1.options || []).reduce((acc, o) => acc + (o.stock || 0), 0);

                return (
                  <div
                    key={v1.id || v1Idx}
                    className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs"
                  >
                    {/* Level 1 Header Accordion */}
                    <div className="p-3.5 flex items-center justify-between gap-3 bg-[#FBFBFA] border-b border-neutral-200">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <span className="text-[11px] font-bold text-neutral-400 font-mono">
                          #{v1Idx + 1}
                        </span>

                        {/* Color preview picker */}
                        <input
                          type="color"
                          value={v1.hex || '#1D1D1D'}
                          onChange={(e) => updateLevel1Field(v1Idx, 'hex', e.target.value)}
                          className="w-6 h-6 rounded-md border border-neutral-300 cursor-pointer p-0 shrink-0"
                          title="Pilih Kode Warna"
                        />

                        {/* Level 1 Name */}
                        <input
                          type="text"
                          value={v1.name}
                          onChange={(e) => updateLevel1Field(v1Idx, 'name', e.target.value)}
                          placeholder="Nama Varian 1 (contoh: Merah, Navy)"
                          className="px-2.5 py-1 text-xs font-bold bg-white border border-neutral-300 rounded-lg flex-1 max-w-xs focus:border-[#075E54] focus:outline-hidden"
                        />

                        <span className="text-[10px] text-neutral-500 font-medium hidden sm:inline">
                          ({(v1.options || []).length} Ukuran &bull; {totalV1Stock} pcs)
                        </span>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => applyStandardSizesToV1(v1Idx)}
                          className="text-[10px] font-semibold text-[#075E54] bg-[#075E54]/10 hover:bg-[#075E54]/20 px-2 py-1 rounded-lg transition"
                          title="Isi otomatis ukuran S, M, L, XL"
                        >
                          + S–XL
                        </button>
                        <button
                          type="button"
                          onClick={() => removeLevel1Variant(v1Idx)}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded-lg"
                          title="Hapus Varian Level 1 ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedVariantIdx(isExpanded ? -1 : v1Idx)}
                          className="p-1 text-neutral-500 hover:text-neutral-900 rounded-lg"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Level 2 Options Table (Specific Price & Stock) */}
                    {isExpanded && (
                      <div className="p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">
                            Kombinasi Varian ke-2 ({formData.variant_level2_name}) &rarr; Harga &amp; Stok:
                          </span>
                          <button
                            type="button"
                            onClick={() => addLevel2Option(v1Idx, 'XL')}
                            className="text-[11px] font-semibold text-[#075E54] hover:underline flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah Ukuran Baru</span>
                          </button>
                        </div>

                        {/* Combinations Table */}
                        <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-neutral-100 text-neutral-600 text-[10px] uppercase font-bold border-b border-neutral-200">
                                <th className="py-2 px-3">Kombinasi</th>
                                <th className="py-2 px-3">{formData.variant_level2_name}</th>
                                <th className="py-2 px-3">Harga Spesifik (Rp)</th>
                                <th className="py-2 px-3">Stok (Pcs)</th>
                                <th className="py-2 px-3">SKU Kombinasi</th>
                                <th className="py-2 px-3 text-right">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                              {(v1.options || []).map((v2, v2Idx) => (
                                <tr key={v2.id || v2Idx} className="hover:bg-neutral-50/80">
                                  {/* Label Kombinasi */}
                                  <td className="py-2 px-3 font-semibold text-neutral-800 whitespace-nowrap">
                                    <span className="px-1.5 py-0.5 rounded-sm bg-neutral-100 text-neutral-700 text-[10px] mr-1">
                                      {v1.name}
                                    </span>
                                    +
                                    <span className="px-1.5 py-0.5 rounded-sm bg-[#E7E2CE] text-[#3A3732] font-bold text-[10px] ml-1">
                                      {v2.name}
                                    </span>
                                  </td>

                                  {/* Level 2 Name (e.g. Size) */}
                                  <td className="py-2 px-3">
                                    <input
                                      type="text"
                                      value={v2.name}
                                      onChange={(e) =>
                                        updateLevel2Field(v1Idx, v2Idx, 'name', e.target.value)
                                      }
                                      className="w-16 px-2 py-1 text-xs font-bold text-center border border-neutral-300 rounded-lg bg-white"
                                    />
                                  </td>

                                  {/* Specific Price */}
                                  <td className="py-2 px-3">
                                    <input
                                      type="number"
                                      min="0"
                                      step="1000"
                                      value={v2.price}
                                      onChange={(e) =>
                                        updateLevel2Field(v1Idx, v2Idx, 'price', e.target.value)
                                      }
                                      className="w-28 px-2 py-1 text-xs font-mono font-bold text-neutral-900 border border-neutral-300 rounded-lg bg-white"
                                    />
                                  </td>

                                  {/* Specific Stock */}
                                  <td className="py-2 px-3">
                                    <input
                                      type="number"
                                      min="0"
                                      value={v2.stock}
                                      onChange={(e) =>
                                        updateLevel2Field(v1Idx, v2Idx, 'stock', e.target.value)
                                      }
                                      className="w-20 px-2 py-1 text-xs font-mono font-bold text-emerald-800 border border-neutral-300 rounded-lg bg-white"
                                    />
                                  </td>

                                  {/* SKU */}
                                  <td className="py-2 px-3">
                                    <input
                                      type="text"
                                      placeholder="Opsional"
                                      value={v2.sku || ''}
                                      onChange={(e) =>
                                        updateLevel2Field(v1Idx, v2Idx, 'sku', e.target.value)
                                      }
                                      className="w-32 px-2 py-1 text-[11px] font-mono border border-neutral-300 rounded-lg bg-white"
                                    />
                                  </td>

                                  {/* Action */}
                                  <td className="py-2 px-3 text-right">
                                    <button
                                      type="button"
                                      onClick={() => removeLevel2Option(v1Idx, v2Idx)}
                                      className="p-1 text-neutral-400 hover:text-red-600 rounded-md"
                                      title="Hapus opsi ini"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Button to add new Level 1 Variant */}
            <button
              type="button"
              onClick={addLevel1Variant}
              className="w-full py-2.5 bg-white border border-dashed border-neutral-400 hover:border-neutral-800 rounded-xl text-xs font-semibold text-neutral-800 flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4 text-[#075E54]" />
              <span>Tambah Varian {formData.variant_level1_name} Baru (Level 1)</span>
            </button>
          </div>

          {/* 3. GALERI FOTO PRODUK */}
          <div className="p-4 bg-[#F5F5F3] border border-[#E5E5E0] rounded-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 block">
              Galeri Foto Produk ({formData.images.length})
            </span>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {formData.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group aspect-square rounded-xl overflow-hidden bg-white border border-neutral-200"
                >
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

            <div className="flex flex-col sm:flex-row gap-2">
              <label className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-dashed border-neutral-300 rounded-xl text-xs font-semibold text-neutral-700 hover:border-neutral-950 cursor-pointer transition shrink-0">
                <Upload className="w-4 h-4 text-neutral-500" />
                <span>Upload Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex flex-1 gap-2">
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
                  className="px-3.5 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>

        </form>

        {/* Modal Sticky Footer */}
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
            className="px-6 py-2.5 bg-[#075E54] hover:bg-[#075E54]/90 text-white text-xs font-semibold rounded-xl transition shadow-md flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-white" />
            <span>{isEditing ? 'Simpan Perubahan' : 'Terbitkan Produk'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
