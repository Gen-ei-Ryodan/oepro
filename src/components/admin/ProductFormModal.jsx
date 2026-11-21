import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import {
  X,
  Plus,
  Trash2,
  Image as ImageIcon,
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
  Grid,
  RefreshCw,
  GripVertical,
  Star,
} from 'lucide-react';

const STANDARD_SIZES = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL'];
const JUMBO_SIZES = [];
const ALL_SIZES = ['XS', ...STANDARD_SIZES];

export const getCategoryDefaults = (categoryName) => {
  const cat = (categoryName || '').toLowerCase();
  if (cat.includes('polo')) {
    return {
      price: 92000,
      original_price: 119000,
      discount_percent: 23,
      material: '100% Cotton Pique Hexagon Premium (220 GSM)',
      features: [
        '100% Full Cotton Pique Hexagon (Tanpa Campuran Polyester)',
        'Kerah rajut tebal 4 lapis anti-curling tahan cuci',
        'Placket kancing rapi dengan jahitan bartack penguat',
        'Side split di hem bawah untuk kenyamanan gerak',
        'Handfeel sejuk dan menyerap keringat seketika',
      ],
    };
  }
  if (cat.includes('longsleeve') || cat.includes('lengan panjang')) {
    return {
      price: 72000,
      original_price: 89000,
      discount_percent: 19,
      material: '100% Cotton Combed 24s Lengan Panjang',
      features: [
        '100% Full Cotton Combed 24s Super Soft',
        'Manset rib elastis tebal anti-melar di ujung lengan',
        'Jahitan rantai pundak standar ekspor',
        'Bahan sejuk menyerap keringat maksimal',
      ],
    };
  }
  return {
    price: 62000,
    original_price: 79000,
    discount_percent: 22,
    material: '100% Cotton Combed 24s Premium (185 GSM)',
    features: [
      '100% Cotton Combed 24s Super Soft',
      'Kerah O-Neck rib 1x1 anti-melar tahan cuci',
      'Jahitan rantai pundak dan jahitan ganda rapi',
      'Dyeing reaktif warna pekat tidak mudah luntur',
    ],
  };
};

export const getTieredSizePrice = (categoryName, size, basePrice, baseOriginalPrice) => {
  const cat = (categoryName || '').toLowerCase();
  const sz = (size || '').toUpperCase().trim();

  const poloTiers = {
    'XS': [92000, 119000], 'S': [92000, 119000], 'M': [92000, 119000], 'L': [92000, 119000], 'XL': [92000, 119000],
    '2XL': [100000, 125000], '3XL': [108000, 135000], '4XL': [116000, 145000], '5XL': [124000, 155000],
    '6XL': [132000, 165000], '7XL': [140000, 175000], '8XL': [148000, 185000]
  };

  const lsTiers = {
    'XS': [72000, 89000], 'S': [72000, 89000], 'M': [72000, 89000], 'L': [72000, 89000], 'XL': [72000, 89000],
    '2XL': [79000, 98000], '3XL': [86000, 107000], '4XL': [93000, 116000], '5XL': [100000, 125000],
    '6XL': [107000, 134000], '7XL': [114000, 143000], '8XL': [121000, 151000]
  };

  const tsTiers = {
    'XS': [62000, 79000], 'S': [62000, 79000], 'M': [62000, 79000], 'L': [62000, 79000], 'XL': [62000, 79000],
    '2XL': [67000, 85000], '3XL': [72000, 90000], '4XL': [77000, 96000], '5XL': [82000, 103000],
    '6XL': [87000, 109000], '7XL': [92000, 115000], '8XL': [97000, 121000]
  };

  if (cat.includes('polo')) {
    if (poloTiers[sz]) {
      return { price: poloTiers[sz][0], original_price: poloTiers[sz][1] };
    }
    return { price: basePrice || 92000, original_price: baseOriginalPrice || 119000 };
  }

  if (cat.includes('longsleeve') || cat.includes('lengan panjang')) {
    if (lsTiers[sz]) {
      return { price: lsTiers[sz][0], original_price: lsTiers[sz][1] };
    }
    return { price: basePrice || 72000, original_price: baseOriginalPrice || 89000 };
  }

  if (tsTiers[sz]) {
    return { price: tsTiers[sz][0], original_price: tsTiers[sz][1] };
  }
  return { price: basePrice || 62000, original_price: baseOriginalPrice || 79000 };
};

export default function ProductFormModal({
  isOpen = false,
  product = null,
  categories = [],
  onSave,
  onClose,
}) {
  if (!isOpen) return null;
  const isEditing = Boolean(product && product.id);
  const initialCat = product?.category || (categories[0] ? categories[0].name : 'Kaos Polo Premium');
  const catDefaults = getCategoryDefaults(initialCat);

  // Main Form Data State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: initialCat,
    price: catDefaults.price,
    original_price: catDefaults.original_price,
    discount_percent: catDefaults.discount_percent,
    stock: 50,
    material: catDefaults.material,
    fit: 'Regular Fit Unisex',
    description: '',
    sizes: [...ALL_SIZES],
    images: [],
    features: catDefaults.features,
    is_best_seller: false,
    is_featured: false,
    is_new_arrival: true,
    has_variants: true,
    variant_level1_name: 'Warna',
    variant_level2_name: 'Ukuran',
    variants: [],
  });
  const isFlatVariants = formData.variants.length > 0 && formData.variants.every((variant) => !Array.isArray(variant.options));

  const [newImageUrl, setNewImageUrl] = useState('');
  const [dragImageIdx, setDragImageIdx] = useState(null);
  const [dragOverImageIdx, setDragOverImageIdx] = useState(null);
  const [bulkOriginalPrice, setBulkOriginalPrice] = useState('');
  const [bulkPrice, setBulkPrice] = useState('');
  const [bulkStock, setBulkStock] = useState('');
  const [expandedVariantIdx, setExpandedVariantIdx] = useState(0);

  // Matrix Generator input states
  const [matrixL1Input, setMatrixL1Input] = useState('Hitam, Merah, Navy');
  const [matrixL2Input, setMatrixL2Input] = useState('S, M, L, XL, 2XL');
  const [showMatrixGen, setShowMatrixGen] = useState(false);

  // Initialize or populate data
  useEffect(() => {
    if (product) {
      const curCat = product.category || (categories[0] ? categories[0].name : 'Kaos Polo Premium');
      const curCatDef = getCategoryDefaults(curCat);
      const prodPrice = product.price || curCatDef.price;
      const prodOrigPrice = product.original_price || curCatDef.original_price;

      let initialVariants = [];
      if (Array.isArray(product.variants) && product.variants.length > 0) {
        const hasNestedOptions = product.variants.some((variant) => Array.isArray(variant.options) && variant.options.length > 0);
        initialVariants = product.variants.map((variant, variantIdx) => {
          if (!hasNestedOptions) {
            const tiered = getTieredSizePrice(curCat, variant.name, prodPrice, prodOrigPrice);
            return {
              ...variant,
              id: variant.id || `var-${variantIdx + 1}`,
              price: variant.price !== undefined ? variant.price : tiered.price,
              original_price: variant.original_price !== undefined ? variant.original_price : tiered.original_price,
              stock: variant.stock !== undefined ? variant.stock : 25,
              image: variant.image || (product.images && product.images[0]) || '',
              sku: variant.sku || `${product.sku || 'OEP'}-${variant.name}`,
            };
          }

          return {
            ...variant,
            id: variant.id || `var1-${variantIdx + 1}`,
            image: variant.image || (product.images && product.images[0]) || '',
            options: (variant.options || []).map((option, optionIdx) => {
              const tiered = getTieredSizePrice(curCat, option.name, prodPrice, prodOrigPrice);
              return {
                ...option,
                id: option.id || `var2-${variantIdx + 1}-${optionIdx + 1}`,
                price: option.price !== undefined ? option.price : tiered.price,
                original_price: option.original_price !== undefined ? option.original_price : tiered.original_price,
                stock: option.stock !== undefined ? option.stock : 25,
                image: option.image || variant.image || (product.images && product.images[0]) || '',
                sku: option.sku || `${product.sku || 'OEP'}-${(variant.name || 'CLR').slice(0, 3).toUpperCase()}-${option.name}`,
              };
            }),
          };
        });
      } else if (Array.isArray(product.colors) && product.colors.length > 0) {
        const sizesToUse = (product.sizes && product.sizes.length > 0) ? product.sizes : STANDARD_SIZES;
        initialVariants = product.colors.slice(0, 3).map((c, idx) => ({
          id: `var1-${idx + 1}`,
          name: c.name || `Warna ${idx + 1}`,
          hex: c.hex || '#1D1D1D',
          image: (product.images && product.images[0]) || '',
          options: sizesToUse.map((sz, szIdx) => {
            const tiered = getTieredSizePrice(curCat, sz, prodPrice, prodOrigPrice);
            return {
              id: `var2-${idx + 1}-${szIdx + 1}`,
              name: sz,
              price: tiered.price,
              original_price: tiered.original_price,
              stock: 25,
              image: (product.images && product.images[0]) || '',
              sku: `${product.sku || 'OEP'}-${(c.name || 'CLR').slice(0, 3).toUpperCase()}-${sz}`,
            };
          }),
        }));
      } else {
        initialVariants = [
          {
            id: 'var1-1',
            name: 'Black Stone',
            hex: '#1D1D1D',
            image: (product.images && product.images[0]) || '',
            options: STANDARD_SIZES.map((sz, i) => {
              const tiered = getTieredSizePrice(curCat, sz, prodPrice, prodOrigPrice);
              return {
                id: `var2-1-${i + 1}`,
                name: sz,
                price: tiered.price,
                original_price: tiered.original_price,
                stock: 25,
                image: (product.images && product.images[0]) || '',
                sku: `OEP-BLK-${sz}`,
              };
            }),
          },
        ];
      }

      setFormData({
        name: product.name || '',
        sku: product.sku || `OEP-${Date.now().toString().slice(-4)}`,
        category: curCat,
        price: prodPrice,
        original_price: prodOrigPrice,
        discount_percent: product.discount_percent || Math.round(((prodOrigPrice - prodPrice) / prodOrigPrice) * 100),
        stock: product.stock !== undefined ? product.stock : 50,
        material: product.material || curCatDef.material,
        fit: product.fit || 'Regular Fit Unisex',
        description: product.description || '',
        sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [...ALL_SIZES],
        images: product.images && product.images.length > 0 ? product.images : [],
        features: product.features && product.features.length > 0 ? product.features : curCatDef.features,
        is_best_seller: Boolean(product.is_best_seller),
        is_featured: Boolean(product.is_featured),
        is_new_arrival: Boolean(product.is_new_arrival),
        has_variants: true,
        variant_level1_name: product.variant_level1_name || 'Warna',
        variant_level2_name: product.variant_level2_name || 'Ukuran',
        variants: initialVariants,
      });
    } else {
      // New product defaults
      const curCat = categories[0] ? categories[0].name : 'Kaos Polo Premium';
      const curCatDef = getCategoryDefaults(curCat);

      const defaultVariants = [
        {
          id: 'var1-1',
          name: 'Black Stone',
          hex: '#1D1D1D',
          image: 'assets/products/polo/black-stone/black-stone-oepro.webp',
          options: [
            { id: 'var2-1-1', name: 'S', price: curCatDef.price, original_price: curCatDef.original_price, stock: 25, image: 'assets/products/polo/black-stone/black-stone-oepro.webp', sku: 'POLO-BLK-S' },
            { id: 'var2-1-2', name: 'M', price: curCatDef.price, original_price: curCatDef.original_price, stock: 30, image: 'assets/products/polo/black-stone/black-stone-oepro.webp', sku: 'POLO-BLK-M' },
            { id: 'var2-1-3', name: 'L', price: curCatDef.price, original_price: curCatDef.original_price, stock: 35, image: 'assets/products/polo/black-stone/black-stone-oepro.webp', sku: 'POLO-BLK-L' },
            { id: 'var2-1-4', name: 'XL', price: curCatDef.price, original_price: curCatDef.original_price, stock: 25, image: 'assets/products/polo/black-stone/black-stone-oepro.webp', sku: 'POLO-BLK-XL' },
            { id: 'var2-1-5', name: '2XL', price: curCatDef.price + 8000, original_price: curCatDef.original_price + 10000, stock: 15, image: 'assets/products/polo/black-stone/black-stone-oepro.webp', sku: 'POLO-BLK-2XL' },
          ],
        },
        {
          id: 'var1-2',
          name: 'Ruby Red',
          hex: '#C21807',
          image: 'assets/products/polo/ruby-red/ruby-red-oepro.webp',
          options: [
            { id: 'var2-2-1', name: 'S', price: curCatDef.price, original_price: curCatDef.original_price, stock: 20, image: 'assets/products/polo/ruby-red/ruby-red-oepro.webp', sku: 'POLO-RR-S' },
            { id: 'var2-2-2', name: 'M', price: curCatDef.price, original_price: curCatDef.original_price, stock: 25, image: 'assets/products/polo/ruby-red/ruby-red-oepro.webp', sku: 'POLO-RR-M' },
            { id: 'var2-2-3', name: 'L', price: curCatDef.price, original_price: curCatDef.original_price, stock: 30, image: 'assets/products/polo/ruby-red/ruby-red-oepro.webp', sku: 'POLO-RR-L' },
            { id: 'var2-2-4', name: 'XL', price: curCatDef.price, original_price: curCatDef.original_price, stock: 20, image: 'assets/products/polo/ruby-red/ruby-red-oepro.webp', sku: 'POLO-RR-XL' },
            { id: 'var2-2-5', name: '2XL', price: curCatDef.price + 8000, original_price: curCatDef.original_price + 10000, stock: 10, image: 'assets/products/polo/ruby-red/ruby-red-oepro.webp', sku: 'POLO-RR-2XL' },
          ],
        },
      ];

      setFormData({
        name: '',
        sku: `OEP-${Math.floor(1000 + Math.random() * 9000)}`,
        category: curCat,
        price: curCatDef.price,
        original_price: curCatDef.original_price,
        discount_percent: curCatDef.discount_percent,
        stock: 230,
        material: curCatDef.material,
        fit: 'Regular Fit Unisex',
        description: 'Pakaian katun berkualitas tinggi dengan jahitan rapi standar ekspor dan handfeel nyaman.',
        sizes: [...STANDARD_SIZES],
        images: ['assets/products/polo/black-stone/black-stone-oepro.webp'],
        features: curCatDef.features,
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

  // Recalculate total stock, min price, and min original_price from variants
  const syncFromVariants = (variants) => {
    let totalStock = 0;
    let minPrice = Infinity;
    let minOriginalPrice = 0;

    variants.forEach((v1) => {
      (Array.isArray(v1.options) ? v1.options : [v1]).forEach((variant) => {
        totalStock += parseInt(variant.stock, 10) || 0;
        const p = parseInt(variant.price, 10);
        if (p && p < minPrice) {
          minPrice = p;
          minOriginalPrice = parseInt(variant.original_price, 10) || Math.round(p * 1.25 / 1000) * 1000;
        }
      });
    });

    const updated = {
      variants,
      stock: totalStock,
    };
    if (minPrice !== Infinity) {
      updated.price = minPrice;
      updated.original_price = minOriginalPrice || formData.original_price;
      if (updated.original_price > minPrice) {
        updated.discount_percent = Math.round(
          ((updated.original_price - minPrice) / updated.original_price) * 100
        );
      }
    }
    return updated;
  };

  // Add Level 1 Variant
  const addLevel1Variant = () => {
    const newIdx = (formData.variants || []).length + 1;
    const cat = formData.category;
    const defaultImg = formData.images[0] || 'assets/brand/oepro-logo.webp';

    const newV1 = {
      id: `var1-${Date.now()}`,
      name: `Varian Warna ${newIdx}`,
      hex: '#3A3732',
      image: defaultImg,
      options: STANDARD_SIZES.map((sz, i) => {
        const tiered = getTieredSizePrice(cat, sz, formData.price, formData.original_price);
        return {
          id: `var2-${Date.now()}-${i + 1}`,
          name: sz,
          price: tiered.price,
          original_price: tiered.original_price,
          stock: 25,
          image: defaultImg,
          sku: `${formData.sku}-V${newIdx}-${sz}`,
        };
      }),
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

  // Add Level 2 Option under Level 1
  const addLevel2Option = (v1Idx, name = 'XL') => {
    const nextVariants = [...formData.variants];
    const v1 = nextVariants[v1Idx];
    const tiered = getTieredSizePrice(formData.category, name, formData.price, formData.original_price);
    const defaultImg = v1.image || formData.images[0] || 'assets/brand/oepro-logo.webp';

    const newOption = {
      id: `var2-${Date.now()}-${(v1.options || []).length + 1}`,
      name: name,
      price: tiered.price,
      original_price: tiered.original_price,
      stock: 20,
      image: defaultImg,
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

  const updateFlatVariant = (variantIdx, field, value) => {
    const nextVariants = [...formData.variants];
    nextVariants[variantIdx] = {
      ...nextVariants[variantIdx],
      [field]: ['price', 'stock', 'original_price'].includes(field)
        ? Math.max(0, parseInt(value, 10) || 0)
        : value,
    };
    setFormData((prev) => ({ ...prev, ...syncFromVariants(nextVariants) }));
  };

  // Quick S-XL fill
  const applyStandardSizesToV1 = (v1Idx) => {
    const nextVariants = [...formData.variants];
    const v1 = nextVariants[v1Idx];
    const defaultImg = v1.image || formData.images[0] || 'assets/brand/oepro-logo.webp';

    const newOptions = STANDARD_SIZES.map((sz, i) => {
      const tiered = getTieredSizePrice(formData.category, sz, formData.price, formData.original_price);
      return {
        id: `var2-${Date.now()}-${i}`,
        name: sz,
        price: tiered.price,
        original_price: tiered.original_price,
        stock: 25,
        image: defaultImg,
        sku: `${formData.sku}-${(v1.name || 'VAR').slice(0, 3).toUpperCase()}-${sz}`,
      };
    });
    nextVariants[v1Idx] = { ...v1, options: newOptions };
    setFormData((prev) => ({
      ...prev,
      ...syncFromVariants(nextVariants),
    }));
  };

  // Bulk Apply Price or Stock to all variant combinations
  const handleBulkApply = () => {
    const origP = bulkOriginalPrice ? parseInt(bulkOriginalPrice, 10) : null;
    const p = bulkPrice ? parseInt(bulkPrice, 10) : null;
    const s = bulkStock ? parseInt(bulkStock, 10) : null;
    if (origP === null && p === null && s === null) {
      alert('Masukkan harga normal, harga diskon, atau stok untuk menerapkan serentak.');
      return;
    }

    const nextVariants = formData.variants.map((v1) => {
      const applyValues = (variant) => ({
        ...variant,
        ...(origP !== null ? { original_price: origP } : {}),
        ...(p !== null ? { price: p } : {}),
        ...(s !== null ? { stock: s } : {}),
      });
      return Array.isArray(v1.options)
        ? { ...v1, options: v1.options.map(applyValues) }
        : applyValues(v1);
    });

    setFormData((prev) => ({
      ...prev,
      ...syncFromVariants(nextVariants),
    }));
    alert('Harga dan stok serentak berhasil diterapkan ke seluruh kombinasi varian!');
  };

  // Generate Cartesian Matrix automatically
  const handleGenerateMatrix = () => {
    const l1Names = matrixL1Input.split(',').map((s) => s.trim()).filter(Boolean);
    const l2Names = matrixL2Input.split(',').map((s) => s.trim()).filter(Boolean);

    if (l1Names.length === 0 || l2Names.length === 0) {
      alert('Masukkan minimal 1 nama Level 1 dan 1 nama Level 2');
      return;
    }

    const defaultColorMap = {
      merah: '#C21807',
      hitam: '#1D1D1D',
      'black stone': '#1D1D1D',
      navy: '#1C1D32',
      putih: '#FFFFFF',
      kuning: '#DBA03C',
      hijau: '#213430',
      biru: '#0C577E',
      'abu-abu': '#95939E',
      sage: '#8D9367',
      mocca: '#B19A88',
    };

    const defaultImg = formData.images[0] || 'assets/brand/oepro-logo.webp';

    const newVariants = l1Names.map((l1Name, idx) => {
      const hex = defaultColorMap[l1Name.toLowerCase()] || '#3A3732';

      const options = l2Names.map((l2Name, optIdx) => {
        const tiered = getTieredSizePrice(formData.category, l2Name, formData.price, formData.original_price);
        return {
          id: `var2-${Date.now()}-${idx + 1}-${optIdx + 1}`,
          name: l2Name,
          price: tiered.price,
          original_price: tiered.original_price,
          stock: 25,
          image: defaultImg,
          sku: `${formData.sku || 'OEP'}-${l1Name.slice(0, 3).toUpperCase()}-${l2Name.toUpperCase()}`,
        };
      });

      return {
        id: `var1-${Date.now()}-${idx + 1}`,
        name: l1Name,
        hex,
        image: defaultImg,
        options,
      };
    });

    setFormData((prev) => ({
      ...prev,
      ...syncFromVariants(newVariants),
    }));
    setShowMatrixGen(false);
    alert(`Berhasil generate matriks: ${l1Names.length} ${formData.variant_level1_name} x ${l2Names.length} ${formData.variant_level2_name} (${l1Names.length * l2Names.length} kombinasi total)!`);
  };

  // Upload image for variant option
  const handleVariantImageUpload = (v1Idx, optIdx, file) => {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran foto varian maksimal 3MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      updateLevel2Field(v1Idx, optIdx, 'image', event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Upload image for Level 1
  const handleLevel1ImageUpload = (v1Idx, file) => {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Ukuran foto varian maksimal 3MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      updateLevel1Field(v1Idx, 'image', event.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle Main Product Gallery Image Upload
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

  // Reorder gallery images via drag & drop (index 0 = foto utama/cover)
  const { updateProduct } = useProducts();

  const compressImage = (file, maxWidth, quality, callback) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = img.width / img.height;
        if (img.width > maxWidth) {
          canvas.width = maxWidth;
          canvas.height = maxWidth / ratio;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          callback(blob);
        }, 'image/jpeg', quality);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const compressAndUploadImage = (event, maxWidth, quality) => {
    const file = event.target.files[0];
    if (file) {
      compressImage(file, maxWidth, quality, (compressedBlob) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImageUrl = event.target.result;
          if (newImageUrl.length + (localStorage.getItem('oepro_dynamic_products_v5')?.length || 0) > 5 * 1024 * 1024) {
            alert('Gambar melampaui batasan kapasitas penyimpanan!');
          } else {
            setFormData((prev) => ({ ...prev, images: [newImageUrl, ...prev.images] }));
          }
        };
        reader.readAsDataURL(compressedBlob);
      });
    }
  };

  const reorderImage = (from, to) => {
    if (from === null || to === null || from === to) return;
    setFormData((prev) => {
      const next = [...prev.images];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return { ...prev, images: next };
    });
  };

  const handleImageDragStart = (idx) => {
    setDragImageIdx(idx);
    setDragOverImageIdx(idx);
  };

  const handleImageDragOver = (e, idx) => {
    e.preventDefault();
    if (dragImageIdx !== null && dragImageIdx !== idx) {
      setDragOverImageIdx(idx);
    }
  };

  const handleImageDrop = (e, idx) => {
    e.preventDefault();
    reorderImage(dragImageIdx, idx);
    setDragImageIdx(null);
    setDragOverImageIdx(null);
  };

  const handleImageDragEnd = () => {
    setDragImageIdx(null);
    setDragOverImageIdx(null);
  };

  // Pilih foto jadi utama (jalan juga di touch device yang tidak mendukung drag)
  const makeImagePrimary = (index) => {
    if (index === 0) return;
    reorderImage(index, 0);
  };

  // Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Nama produk wajib diisi.');
      return;
    }

    const generatedColors = formData.variants.filter((v1) => Array.isArray(v1.options)).map((v1) => ({
      name: v1.name,
      hex: v1.hex || '#1D1D1D',
    }));

    const allSizesSet = new Set();
    formData.variants.forEach((v1) => {
      (Array.isArray(v1.options) ? v1.options : [v1]).forEach((variant) => allSizesSet.add(variant.name));
    });
    const generatedSizes = Array.from(allSizesSet);

    const matchingCat = categories.find((c) => c.name === formData.category);
    const category_slug = matchingCat
      ? matchingCat.slug
      : formData.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Transform images to include order and is_primary
    const transformedImages = (formData.images || []).map((url, idx) => ({
      order: idx,
      is_primary: idx === 0,
      url: url,
    }));

    const productPayload = {
      ...formData,
      category_slug,
      colors: isFlatVariants ? (product?.colors || []) : generatedColors,
      sizes: generatedSizes.length > 0 ? generatedSizes : formData.sizes,
      images: transformedImages,
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
            <div className="w-8 h-8 rounded-lg bg-[#A8C4B5]/10 text-[#A8C4B5] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-neutral-950">
                {isEditing ? `Edit Produk: ${formData.name || 'Produk OEPRO'}` : 'Tambah Produk & Matriks Varian 2-Tingkat'}
              </h2>
              <p className="text-[11px] text-neutral-500">
                Atur informasi produk, spesifikasi bahan, dan harga serta stok per ukuran atau kombinasi matriks 2-level.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg transition cursor-pointer"
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
                  placeholder="Contoh: Kaos Polo Premium - Black Stone"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#A8C4B5] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Kategori Katalog
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const catDef = getCategoryDefaults(newCat);
                      setFormData((prev) => ({
                        ...prev,
                        category: newCat,
                        price: !isEditing ? catDef.price : prev.price,
                        original_price: !isEditing ? catDef.original_price : prev.original_price,
                        discount_percent: !isEditing ? catDef.discount_percent : prev.discount_percent,
                        material: !isEditing ? catDef.material : prev.material,
                        features: !isEditing ? catDef.features : prev.features,
                      }));
                    }}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#A8C4B5] focus:outline-hidden"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    SKU Induk (Kode Produk)
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-300 rounded-xl font-mono focus:bg-white focus:border-[#A8C4B5] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#DCE5E0] block">
                Ringkasan Harga &amp; Stok Produk
              </span>

              <div className="p-3 bg-white rounded-xl border border-neutral-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500">Harga Diskon (Jual):</span>
                  <strong className="text-neutral-950 font-mono text-sm">
                    Rp{(formData.price || 0).toLocaleString('id-ID')}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500">Harga Normal (Coret):</span>
                  <span className="text-neutral-400 line-through font-mono text-xs">
                    Rp{(formData.original_price || 0).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500">Diskon Terhitung:</span>
                  <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full text-[10px]">
                    -{formData.discount_percent || 0}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-neutral-100">
                  <span className="text-neutral-500">Total Stok Tersedia:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                    {formData.stock || 0} pcs
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-500">Kombinasi Matriks:</span>
                  <strong className="text-neutral-700">
                    {isFlatVariants
                      ? formData.variants.length
                      : (formData.variants || []).reduce((acc, v) => acc + (v.options || []).length, 0)} Varian
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
                    className="w-3.5 h-3.5 rounded-sm text-[#A8C4B5] focus:ring-[#A8C4B5]"
                  />
                  <span>Tandai <strong>Best Seller</strong></span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-3.5 h-3.5 rounded-sm text-[#A8C4B5] focus:ring-[#A8C4B5]"
                  />
                  <span>Tampilkan di <strong>Koleksi Pilihan</strong></span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_new_arrival}
                    onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                    className="w-3.5 h-3.5 rounded-sm text-[#A8C4B5] focus:ring-[#A8C4B5]"
                  />
                  <span>Badge <strong>New Arrival</strong></span>
                </label>
              </div>
            </div>

          </div>

          {/* 2. STRUKTUR MATRIKS 2-TINGKAT (LEVEL 1: WARNA x LEVEL 2: UKURAN) */}
          <div className="p-4 sm:p-5 bg-[#F5F5F3] border border-[#E5E5E0] rounded-2xl space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A8C4B5]" />
                  <h3 className="font-bold text-xs sm:text-sm text-neutral-900 uppercase tracking-wider">
                    {isFlatVariants ? 'Varian 1-Tingkat: Ukuran Langsung' : 'Struktur Varian 2-Tingkat (Level 1: Opsi Utama → Level 2: Sub-Opsi Transaksi)'}
                  </h3>
                </div>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  {isFlatVariants
                    ? 'Harga normal, harga diskon, dan stok dapat diatur untuk setiap ukuran.'
                    : 'Penentuan data transaksi (Harga Normal, Harga Diskon, Stok & Foto) berada di ujung varian (Level 2).'}
                </p>
              </div>

              {/* Labels configuration */}
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Nama Level 1"
                  value={formData.variant_level1_name}
                  onChange={(e) => setFormData({ ...formData, variant_level1_name: e.target.value })}
                  className="px-2.5 py-1 text-xs bg-white border border-neutral-300 rounded-lg w-28 text-center font-semibold"
                  title="Label Level 1 (misal: Warna)"
                />
                <span className="text-neutral-400 font-bold">&times;</span>
                <input
                  type="text"
                  placeholder="Nama Level 2"
                  value={formData.variant_level2_name}
                  onChange={(e) => setFormData({ ...formData, variant_level2_name: e.target.value })}
                  className="px-2.5 py-1 text-xs bg-white border border-neutral-300 rounded-lg w-28 text-center font-semibold"
                  title="Label Level 2 (misal: Ukuran)"
                />
              </div>
            </div>

            {/* Matrix Generator & Quick Bulk Tools Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              
              {/* Tool A: Generator Matriks Cepat */}
              <div className="lg:col-span-12 p-3 bg-white rounded-xl border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                    <Grid className="w-3.5 h-3.5 text-[#A8C4B5]" />
                    <span>Generator Matriks Kombinasi Otomatis (Level 1 &times; Level 2):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowMatrixGen(!showMatrixGen)}
                    className="text-[11px] text-[#A8C4B5] hover:underline font-semibold"
                  >
                    {showMatrixGen ? 'Sembunyikan Generator' : 'Buka Generator Matriks'}
                  </button>
                </div>

                {showMatrixGen && (
                  <div className="pt-2 border-t border-neutral-100 space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-0.5">
                          Daftar {formData.variant_level1_name} (pisahkan koma):
                        </label>
                        <input
                          type="text"
                          value={matrixL1Input}
                          onChange={(e) => setMatrixL1Input(e.target.value)}
                          placeholder="Contoh: Merah, Hitam, Navy, Putih"
                          className="w-full px-2.5 py-1 text-xs border border-neutral-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-600 uppercase mb-0.5">
                          Daftar {formData.variant_level2_name} (pisahkan koma):
                        </label>
                        <input
                          type="text"
                          value={matrixL2Input}
                          onChange={(e) => setMatrixL2Input(e.target.value)}
                          placeholder="Contoh: S, M, L, XL, 2XL"
                          className="w-full px-2.5 py-1 text-xs border border-neutral-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleGenerateMatrix}
                      className="px-3 py-1.5 bg-[#A8C4B5] hover:bg-[#97b5a5] text-[#081F1C] text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Matriks Cartesian Sekarang</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Tool B: Quick Bulk Batch Tool */}
              <div className="lg:col-span-12 p-3 bg-white rounded-xl border border-neutral-200 flex flex-wrap items-center gap-2 justify-between">
                <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#A8C4B5]" />
                  <span>Atur Serentak Semua Kombinasi:</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="number"
                    placeholder="Harga Normal (Rp)"
                    value={bulkOriginalPrice}
                    onChange={(e) => setBulkOriginalPrice(e.target.value)}
                    className="w-28 px-2.5 py-1 text-xs border border-neutral-300 rounded-lg font-mono"
                    title="Harga Normal / Coret Serentak"
                  />
                  <input
                    type="number"
                    placeholder="Harga Diskon (Rp)"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    className="w-28 px-2.5 py-1 text-xs border border-neutral-300 rounded-lg font-mono font-bold text-neutral-900"
                    title="Harga Jual Serentak"
                  />
                  <input
                    type="number"
                    placeholder="Stok (Pcs)"
                    value={bulkStock}
                    onChange={(e) => setBulkStock(e.target.value)}
                    className="w-20 px-2.5 py-1 text-xs border border-neutral-300 rounded-lg font-mono"
                    title="Stok Serentak"
                  />
                  <button
                    type="button"
                    onClick={handleBulkApply}
                    className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                  >
                    Terapkan
                  </button>
                </div>
              </div>

            </div>

            {/* List of Level 1 Variants & their Level 2 combinations table */}
            <div className="space-y-3">
              {isFlatVariants && (
                <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-2xs">
                  <div className="px-3.5 py-3 bg-[#FBFBFA] border-b border-neutral-200 flex items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">Varian Ukuran 1-Tingkat</h4>
                      <p className="text-[10px] text-neutral-500">Harga dan stok diatur langsung untuk setiap ukuran.</p>
                    </div>
                    <button type="button" onClick={() => setShowMatrixGen(true)} className="text-[10px] font-semibold text-[#A8C4B5] hover:underline">
                      Buat matriks 2-level
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-neutral-100 text-neutral-600 text-[10px] uppercase font-bold border-b border-neutral-200">
                          <th className="py-2 px-2.5">Ukuran</th>
                          <th className="py-2 px-2">Harga Normal (Rp)</th>
                          <th className="py-2 px-2">Harga Diskon (Rp)</th>
                          <th className="py-2 px-2">Stok (Pcs)</th>
                          <th className="py-2 px-2">SKU</th>
                          <th className="py-2 px-2 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {formData.variants.map((variant, variantIdx) => (
                          <tr key={variant.id || variantIdx} className="hover:bg-neutral-50/80">
                            <td className="py-2 px-2.5"><input type="text" value={variant.name || ''} onChange={(e) => updateFlatVariant(variantIdx, 'name', e.target.value)} className="w-16 px-2 py-1 text-xs font-bold text-center border border-neutral-300 rounded-lg bg-white" aria-label={`Ukuran varian ${variantIdx + 1}`} /></td>
                            <td className="py-2 px-2"><input type="number" min="0" step="1000" value={variant.original_price ?? ''} onChange={(e) => updateFlatVariant(variantIdx, 'original_price', e.target.value)} className="w-24 px-2 py-1 text-xs font-mono text-neutral-500 border border-neutral-300 rounded-lg bg-white" aria-label={`Harga normal ukuran ${variant.name}`} /></td>
                            <td className="py-2 px-2"><input type="number" min="0" step="1000" value={variant.price ?? ''} onChange={(e) => updateFlatVariant(variantIdx, 'price', e.target.value)} className="w-24 px-2 py-1 text-xs font-mono font-bold text-neutral-900 border border-neutral-300 rounded-lg bg-white" aria-label={`Harga diskon ukuran ${variant.name}`} /></td>
                            <td className="py-2 px-2"><input type="number" min="0" value={variant.stock ?? ''} onChange={(e) => updateFlatVariant(variantIdx, 'stock', e.target.value)} className="w-16 px-2 py-1 text-xs font-mono font-bold text-emerald-800 border border-neutral-300 rounded-lg bg-white text-center" aria-label={`Stok ukuran ${variant.name}`} /></td>
                            <td className="py-2 px-2"><input type="text" value={variant.sku || ''} onChange={(e) => updateFlatVariant(variantIdx, 'sku', e.target.value)} className="w-28 px-2 py-1 text-[11px] font-mono border border-neutral-300 rounded-lg bg-white" aria-label={`SKU ukuran ${variant.name}`} /></td>
                            <td className="py-2 px-2 text-right"><button type="button" onClick={() => { const nextVariants = formData.variants.filter((_, idx) => idx !== variantIdx); setFormData((prev) => ({ ...prev, ...syncFromVariants(nextVariants) })); }} className="p-1 text-neutral-400 hover:text-red-600 rounded-md" title={`Hapus ukuran ${variant.name}`} aria-label={`Hapus ukuran ${variant.name}`}><Trash2 className="w-3.5 h-3.5" /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {!isFlatVariants && (formData.variants || []).map((v1, v1Idx) => {
                const isExpanded = expandedVariantIdx === v1Idx;
                const totalV1Stock = (v1.options || []).reduce(
                  (acc, opt) => acc + (parseInt(opt.stock, 10) || 0),
                  0
                );

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

                        {/* Color hex picker */}
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
                          placeholder="Nama Varian Level 1"
                          className="px-2.5 py-1 text-xs font-bold bg-white border border-neutral-300 rounded-lg flex-1 max-w-xs focus:border-[#A8C4B5] focus:outline-hidden"
                        />

                        {/* Level 1 Foto Thumbnail */}
                        <div className="flex items-center gap-1 shrink-0">
                          <div className="w-7 h-7 rounded-md border border-neutral-300 bg-neutral-100 overflow-hidden flex items-center justify-center">
                            {v1.image ? (
                              <img src={v1.image} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
                            )}
                          </div>
                          <label className="p-1 hover:bg-neutral-200 rounded text-neutral-600 cursor-pointer" title="Upload Foto Warna Ini">
                            <Upload className="w-3.5 h-3.5" />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleLevel1ImageUpload(v1Idx, e.target.files[0])}
                              className="hidden"
                            />
                          </label>
                        </div>

                        <span className="text-[10px] text-neutral-500 font-medium hidden sm:inline">
                          ({(v1.options || []).length} {formData.variant_level2_name} &bull; {totalV1Stock} pcs)
                        </span>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => applyStandardSizesToV1(v1Idx)}
                          className="text-[10px] font-semibold text-[#A8C4B5] bg-[#A8C4B5]/10 hover:bg-[#A8C4B5]/20 px-2 py-1 rounded-lg transition"
                          title="Isi otomatis ukuran S, M, L, XL, 2XL"
                        >
                          + S–2XL
                        </button>
                        <button
                          type="button"
                          onClick={() => removeLevel1Variant(v1Idx)}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded-lg cursor-pointer"
                          title="Hapus Varian Level 1 ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedVariantIdx(isExpanded ? -1 : v1Idx)}
                          className="p-1 text-neutral-500 hover:text-neutral-900 rounded-lg cursor-pointer"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Level 2 Options Table (Cartesian Combinations) */}
                    {isExpanded && (
                      <div className="p-3.5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wide">
                            Kombinasi Akhir ({v1.name} &times; {formData.variant_level2_name}) &rarr; Harga, Stok &amp; Foto:
                          </span>
                          <button
                            type="button"
                            onClick={() => addLevel2Option(v1Idx, 'XL')}
                            className="text-[11px] font-semibold text-[#A8C4B5] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Tambah {formData.variant_level2_name} Baru</span>
                          </button>
                        </div>

                        {/* Combinations Table */}
                        <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-neutral-100 text-neutral-600 text-[10px] uppercase font-bold border-b border-neutral-200">
                                <th className="py-2 px-2.5">Kombinasi</th>
                                <th className="py-2 px-2">{formData.variant_level2_name}</th>
                                <th className="py-2 px-2">Harga Normal (Rp)</th>
                                <th className="py-2 px-2">Harga Diskon (Rp)</th>
                                <th className="py-2 px-2">Stok (Pcs)</th>
                                <th className="py-2 px-2">Foto Varian</th>
                                <th className="py-2 px-2">SKU</th>
                                <th className="py-2 px-2 text-right">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                              {(v1.options || []).map((v2, v2Idx) => (
                                <tr key={v2.id || v2Idx} className="hover:bg-neutral-50/80">
                                  {/* Label Kombinasi */}
                                  <td className="py-2 px-2.5 font-semibold text-neutral-800 whitespace-nowrap">
                                    <span className="px-1.5 py-0.5 rounded-sm bg-neutral-100 text-neutral-700 text-[10px] mr-1">
                                      {v1.name}
                                    </span>
                                    +
                                    <span className="px-1.5 py-0.5 rounded-sm bg-[#133129] text-[#DCE5E0] font-bold text-[10px] ml-1">
                                      {v2.name}
                                    </span>
                                  </td>

                                  {/* Level 2 Name */}
                                  <td className="py-2 px-2">
                                    <input
                                      type="text"
                                      value={v2.name}
                                      onChange={(e) =>
                                        updateLevel2Field(v1Idx, v2Idx, 'name', e.target.value)
                                      }
                                      className="w-14 px-2 py-1 text-xs font-bold text-center border border-neutral-300 rounded-lg bg-white"
                                    />
                                  </td>

                                  {/* Harga Normal / Coret */}
                                  <td className="py-2 px-2">
                                    <input
                                      type="number"
                                      min="0"
                                      step="1000"
                                      value={v2.original_price || ''}
                                      onChange={(e) =>
                                        updateLevel2Field(v1Idx, v2Idx, 'original_price', e.target.value)
                                      }
                                      placeholder="Normal"
                                      className="w-24 px-2 py-1 text-xs font-mono text-neutral-500 border border-neutral-300 rounded-lg bg-white"
                                    />
                                  </td>

                                  {/* Harga Diskon / Jual */}
                                  <td className="py-2 px-2">
                                    <input
                                      type="number"
                                      min="0"
                                      step="1000"
                                      value={v2.price}
                                      onChange={(e) =>
                                        updateLevel2Field(v1Idx, v2Idx, 'price', e.target.value)
                                      }
                                      placeholder="Diskon"
                                      className="w-24 px-2 py-1 text-xs font-mono font-bold text-neutral-900 border border-neutral-300 rounded-lg bg-white"
                                    />
                                  </td>

                                  {/* Specific Stock */}
                                  <td className="py-2 px-2">
                                    <input
                                      type="number"
                                      min="0"
                                      value={v2.stock}
                                      onChange={(e) =>
                                        updateLevel2Field(v1Idx, v2Idx, 'stock', e.target.value)
                                      }
                                      className="w-16 px-2 py-1 text-xs font-mono font-bold text-emerald-800 border border-neutral-300 rounded-lg bg-white text-center"
                                    />
                                  </td>

                                  {/* Foto Varian */}
                                  <td className="py-2 px-2">
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-8 h-8 rounded-md border border-neutral-300 bg-neutral-50 overflow-hidden flex items-center justify-center shrink-0">
                                        {v2.image ? (
                                          <img src={v2.image} alt="" className="w-full h-full object-contain" />
                                        ) : (
                                          <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
                                        )}
                                      </div>
                                      <label className="p-1 hover:bg-neutral-200 rounded text-neutral-600 cursor-pointer" title="Upload Foto Kombinasi Ini">
                                        <Upload className="w-3.5 h-3.5" />
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleVariantImageUpload(v1Idx, v2Idx, e.target.files[0])}
                                          className="hidden"
                                        />
                                      </label>
                                    </div>
                                  </td>

                                  {/* SKU */}
                                  <td className="py-2 px-2">
                                    <input
                                      type="text"
                                      placeholder="SKU"
                                      value={v2.sku || ''}
                                      onChange={(e) =>
                                        updateLevel2Field(v1Idx, v2Idx, 'sku', e.target.value)
                                      }
                                      className="w-28 px-2 py-1 text-[11px] font-mono border border-neutral-300 rounded-lg bg-white"
                                    />
                                  </td>

                                  {/* Action */}
                                  <td className="py-2 px-2 text-right">
                                    <button
                                      type="button"
                                      onClick={() => removeLevel2Option(v1Idx, v2Idx)}
                                      className="p-1 text-neutral-400 hover:text-red-600 rounded-md cursor-pointer"
                                      title="Hapus opsi ini"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
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
          {!isFlatVariants && (
            <button
              type="button"
              onClick={addLevel1Variant}
              className="w-full py-2.5 bg-white border border-dashed border-neutral-400 hover:border-neutral-800 rounded-xl text-xs font-semibold text-neutral-800 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#A8C4B5]" />
              <span>Tambah Varian {formData.variant_level1_name} Baru (Level 1)</span>
            </button>
          )}
          </div>

          {/* 3. GALERI FOTO PRODUK */}
          <div className="p-4 bg-[#F5F5F3] border border-[#E5E5E0] rounded-2xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-800 block">
              Galeri Foto Produk Utama ({formData.images.length})
            </span>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {formData.images.map((img, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={() => handleImageDragStart(idx)}
                  onDragOver={(e) => handleImageDragOver(e, idx)}
                  onDrop={(e) => handleImageDrop(e, idx)}
                  onDragEnd={handleImageDragEnd}
                  className={`relative group aspect-square rounded-xl overflow-hidden bg-white border transition-all cursor-grab active:cursor-grabbing ${
                    dragOverImageIdx === idx && dragImageIdx !== null && dragImageIdx !== idx
                      ? 'border-[#A8C4B5] ring-2 ring-[#A8C4B5] scale-95 opacity-70'
                      : 'border-neutral-200'
                  } ${dragImageIdx === idx ? 'opacity-40 scale-95' : ''}`}
                  title="Seret untuk mengubah urutan foto"
                >
                  <img src={img} alt="" className="w-full h-full object-cover pointer-events-none" />
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-neutral-950 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm">
                      Utama
                    </span>
                  )}
                  {/* Drag handle */}
                  <span className="absolute top-1 left-1/2 -translate-x-1/2 p-0.5 bg-black/55 text-white rounded-md opacity-0 group-hover:opacity-100 transition pointer-events-none">
                    <GripVertical className="w-3 h-3" />
                  </span>
                  {/* Jadikan utama (untuk touch / tanpa drag) */}
                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeImagePrimary(idx)}
                      className="absolute bottom-1 left-1 p-1 bg-black/60 text-white rounded-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition hover:bg-[#E0BC66] hover:text-black"
                      title="Jadikan foto utama"
                    >
                      <Star className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-md opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-neutral-500 flex items-center gap-1.5">
              <GripVertical className="w-3.5 h-3.5" />
              Seret foto untuk mengatur urutan &mdash; foto pertama menjadi gambar utama/cover katalog.
            </p>

            <div className="flex flex-col sm:flex-row gap-2">
              <label className="flex items-center justify-center gap-2 py-2 px-3 bg-white border border-dashed border-neutral-300 rounded-xl text-xs font-semibold text-neutral-700 hover:border-neutral-950 cursor-pointer transition shrink-0">
                <Upload className="w-4 h-4 text-neutral-500" />
                <span>Upload Foto Utama</span>
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
                  className="px-3.5 py-1.5 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800 cursor-pointer"
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
            className="px-6 py-2.5 bg-[#A8C4B5] hover:bg-[#A8C4B5]/90 text-[#081F1C] text-xs font-semibold rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 text-white" />
            <span>{isEditing ? 'Simpan Perubahan' : 'Terbitkan Produk'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
