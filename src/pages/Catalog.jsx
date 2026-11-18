import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Search,
  RotateCcw,
  Sparkles,
  Heart,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';
import categoriesData from '../data/categories.json';
import { useWishlist } from '../context/WishlistContext';

export default function Catalog() {
  const { products: productsData, categories: categoriesData } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const { wishlist } = useWishlist();

  const categoryFromUrl = searchParams.get('cat') || 'all';
  const queryFromUrl = searchParams.get('q') || '';
  const wishlistOnly = searchParams.get('wishlist') === 'true';

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    setSearchQuery(queryFromUrl);
  }, [queryFromUrl]);

  const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL'];
  const allSizes = useMemo(() => {
    const set = new Set();
    productsData.forEach((p) => {
      if (p.sizes) p.sizes.forEach((s) => set.add(s));
    });
    return Array.from(set).sort((a, b) => {
      const idxA = SIZE_ORDER.indexOf(a);
      const idxB = SIZE_ORDER.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, []);

  const allColors = useMemo(() => {
    const map = new Map();
    productsData.forEach((p) => {
      if (p.colors) {
        p.colors.forEach((c) => {
          if (!map.has(c.name)) {
            map.set(c.name, c);
          }
        });
      }
    });
    return Array.from(map.values());
  }, []);

  const filteredProducts = useMemo(() => {
    return productsData
      .filter((p) => {
        if (wishlistOnly && !wishlist.includes(p.id)) return false;
        if (selectedCategory !== 'all' && p.category_slug !== selectedCategory) return false;
        if (selectedSizes.length > 0 && !p.sizes.some((s) => selectedSizes.includes(s))) return false;
        if (selectedColors.length > 0 && !p.colors.some((c) => selectedColors.includes(c.name))) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCategory = p.category.toLowerCase().includes(q);
          const matchColor = p.colors && p.colors.some((c) => c.name.toLowerCase().includes(q));
          if (!matchName && !matchCategory && !matchColor) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.sold_count || 0) - (a.sold_count || 0);
      });
  }, [selectedCategory, selectedSizes, selectedColors, searchQuery, sortBy, wishlistOnly, wishlist]);

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', slug);
    }
    setSearchParams(searchParams);
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setSearchQuery('');
    setSortBy('popular');
    setSearchParams({});
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (searchQuery ? 1 : 0) +
    (wishlistOnly ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-8 pb-32 sm:pb-16 bg-[#FBFBFA]">
      
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 uppercase tracking-widest mb-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Katalog Resmi OEPRO</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
              {wishlistOnly
                ? 'Daftar Produk Favorit Anda'
                : selectedCategory === 'all'
                ? 'Semua Koleksi Katun Murni'
                : categoriesData.find((c) => c.slug === selectedCategory)?.name || 'Katalog Produk'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-white border border-neutral-200 rounded-full px-3 py-2 font-medium text-neutral-800 shadow-2xs focus:outline-hidden"
            >
              <option value="popular">Terpopuler &bull; Paling Laris</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="price-low">Harga: Rendah ke Tinggi</option>
              <option value="price-high">Harga: Tinggi ke Rendah</option>
            </select>

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden relative p-2 bg-neutral-900 text-white rounded-full flex items-center justify-center shadow-xs"
              title="Filter"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-neutral-950 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Pills Bar (Horizontal Scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2.5 mt-2 border-b border-neutral-200">
          <button
            type="button"
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
              selectedCategory === 'all' && !wishlistOnly
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Semua ({productsData.length})
          </button>
          {categoriesData.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleCategorySelect(cat.slug)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.slug && !wishlistOnly
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {cat.name} ({cat.item_count})
            </button>
          ))}
          {wishlist.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (wishlistOnly) {
                  searchParams.delete('wishlist');
                } else {
                  searchParams.set('wishlist', 'true');
                }
                setSearchParams(searchParams);
              }}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-all flex items-center gap-1 ${
                wishlistOnly
                  ? 'bg-red-500 text-white shadow-xs'
                  : 'bg-neutral-100 text-red-600 hover:bg-red-50'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Favorit ({wishlist.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN LAYOUT: SIDEBAR (DESKTOP) + PRODUCT GRID (2-COL ON MOBILE) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 items-start">
        
        {/* Desktop Sidebar Filter (1 col) */}
        <aside className="hidden lg:block space-y-6 p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <h3 className="font-bold text-sm text-neutral-900">Filter Katalog</h3>
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">Pilih Ukuran</h4>
            <div className="grid grid-cols-4 gap-1.5">
              {allSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleSizeToggle(sz)}
                  className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition ${
                    selectedSizes.includes(sz)
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-white'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2 pt-3 border-t border-neutral-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">Warna Katun</h4>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {allColors.map((c) => {
                const isSelected = selectedColors.includes(c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleColorToggle(c.name)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition border ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-neutral-300" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Product Grid (3 cols on desktop, 2 cols on mobile) */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-neutral-200">
              <h3 className="text-sm font-bold text-neutral-900 mb-1">
                Tidak ada produk yang cocok
              </h3>
              <p className="text-xs text-neutral-500 mb-4">
                Coba sesuaikan filter atau kata kunci pencarian Anda.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-5 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-full"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl flex flex-col">
              
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                <h3 className="font-bold text-sm text-neutral-900">Filter Produk</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto space-y-5 flex-1 text-xs">
                {/* Categories */}
                <div className="space-y-2">
                  <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[11px]">Kategori</h4>
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => handleCategorySelect('all')}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                        selectedCategory === 'all' ? 'bg-neutral-900 text-white' : 'text-neutral-700 bg-neutral-100'
                      }`}
                    >
                      Semua Produk ({productsData.length})
                    </button>
                    {categoriesData.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => handleCategorySelect(cat.slug)}
                        className={`text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                          selectedCategory === cat.slug ? 'bg-neutral-900 text-white' : 'text-neutral-700 bg-neutral-100'
                        }`}
                      >
                        {cat.name} ({cat.item_count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-2 pt-3 border-t border-neutral-100">
                  <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[11px]">Ukuran</h4>
                  <div className="grid grid-cols-4 gap-1.5">
                    {allSizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleSizeToggle(sz)}
                        className={`py-2 text-xs font-mono font-bold rounded-lg border ${
                          selectedSizes.includes(sz) ? 'bg-neutral-900 text-white border-neutral-900' : 'border-neutral-200 text-neutral-700'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-neutral-200 flex gap-2">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="w-1/2 py-2.5 text-xs font-semibold border border-neutral-200 rounded-xl text-neutral-700"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-1/2 py-2.5 text-xs font-semibold bg-neutral-900 text-white rounded-xl"
                >
                  Terapkan
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
