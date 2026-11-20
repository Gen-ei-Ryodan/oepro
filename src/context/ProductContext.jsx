import React, { createContext, useContext, useState, useEffect } from 'react';
import initialProductsData from '../data/products.json';
import initialCategoriesData from '../data/categories.json';

const ProductContext = createContext(null);

const STORAGE_KEY = 'oepro_dynamic_products_v5';
const CATEGORIES_KEY = 'oepro_dynamic_categories_v4';
const BANNERS_KEY = 'oepro_dynamic_banners_v5';
const BANNER_LAYOUT_KEY = 'oepro_banner_layout_v4';

export const initialBannersData = [
  {
    id: 'banner-1',
    headline: 'Nyaman Dipakai, Mudah Dipadukan.',
    subheadline: 'Kaos berbahan Cotton Combed 24s, 100% katun dengan potongan regular fit yang nyaman untuk semua.',
    tag: 'Koleksi Katun 100%',
    ctaText: 'Belanja Sekarang',
    ctaLink: '/catalog',
    image: '/assets/banners/hero-banner-new.jpg',
    imageLayout: 'background',
    isActive: true,
    order: 1,
  },
  {
    id: 'banner-2',
    headline: 'pique hexagon premium',
    subheadline: 'Rajutan pori hexagon mewah, adem dan berkelas dengan kerah rajut tebal 4 lapis anti-keriting.',
    tag: 'Koleksi Polo Eksklusif',
    ctaText: 'Lihat Katalog Polo',
    ctaLink: '/catalog?cat=polo-shirt',
    image: '/assets/products/polo/ruby-red/ruby-red-oepro.webp',
    imageLayout: 'contained',
    isActive: true,
    order: 2,
  },
];

const cleanProductImages = (items) => {
  if (!Array.isArray(items)) return [];
  return items.map((p) => ({
    ...p,
    images: Array.isArray(p.images)
      ? p.images.filter((img) => !img.toLowerCase().includes('total') && !img.toLowerCase().includes('worxt'))
      : [],
  }));
};

export function ProductProvider({ children }) {
  // 1. PRODUCTS STATE
  const [products, setProducts] = useState(() => {
    
try {
       localStorage.removeItem('oepro_dynamic_products_v4');
       const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Migration: normalize all product ratings to 4.9
          const normalized = parsed.map((p) => ({ ...p, rating: 4.9 }));
          return cleanProductImages(normalized);
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved products, falling back to initial data', e);
    }
    return cleanProductImages(initialProductsData);
  });

  // 2. CATEGORIES STATE
  const [categories, setCategories] = useState(() => {
try {
       localStorage.removeItem('oepro_dynamic_products_v4');
       const saved = localStorage.getItem(CATEGORIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved categories', e);
    }
    return initialCategoriesData;
  });

  // 3. BANNERS STATE
  const [banners, setBanners] = useState(() => {
    
try {
       localStorage.removeItem('oepro_dynamic_banners_v4');
       localStorage.removeItem('oepro_dynamic_banners_v6');
      localStorage.removeItem('oepro_dynamic_banners_v6');
      localStorage.removeItem('oepro_banners_version');
      const saved = localStorage.getItem(BANNERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved banners', e);
    }
    return initialBannersData;
  });

  // 4. BANNER LAYOUT STATE ('boxed' | 'full')
  const [bannerLayout, setBannerLayout] = useState(() => {
try {
       localStorage.removeItem('oepro_dynamic_banners_v4');
       localStorage.removeItem('oepro_dynamic_banners_v6');
       const saved = localStorage.getItem(BANNER_LAYOUT_KEY);
      if (saved === 'full' || saved === 'boxed') {
        return saved;
      }
    } catch (e) {
      console.warn('Failed to parse saved banner layout', e);
    }
    return 'boxed';
  });

  useEffect(() => {
    const handleStorage = (e) => {
      if (!e.newValue) return;
      try {
        if (e.key === BANNERS_KEY) setBanners(JSON.parse(e.newValue));
        if (e.key === STORAGE_KEY) setProducts(cleanProductImages(JSON.parse(e.newValue)));
        if (e.key === CATEGORIES_KEY) setCategories(JSON.parse(e.newValue));
        if (e.key === BANNER_LAYOUT_KEY) setBannerLayout(e.newValue);
      } catch (err) {}
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Sync state to localStorage whenever products change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to localStorage', e);
    }
  }, [products]);

  // Sync categories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories to localStorage', e);
    }
  }, [categories]);

  // Sync banners to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BANNERS_KEY, JSON.stringify(banners));
    } catch (e) {
      console.error('Error saving banners to localStorage', e);
    }
  }, [banners]);

  // Sync banner layout to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(BANNER_LAYOUT_KEY, bannerLayout);
    } catch (e) {
      console.error('Error saving banner layout to localStorage', e);
    }
  }, [bannerLayout]);

  // --- PRODUCT ACTIONS ---
  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: newProduct.id || `oepro-${Date.now()}`,
      rating: newProduct.rating || 5.0,
      review_count: newProduct.review_count || 0,
      sold_count: newProduct.sold_count || 0,
    };
    setProducts((prev) => [productWithId, ...prev]);
    return productWithId;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  // --- CATEGORY ACTIONS ---
  const addCategory = (newCat) => {
    const categoryWithId = {
      ...newCat,
      id: newCat.id || `cat-${Date.now()}`,
      slug: newCat.slug || (newCat.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      item_count: newCat.item_count || 0,
    };
    setCategories((prev) => [...prev, categoryWithId]);
    return categoryWithId;
  };

  const updateCategory = (id, updatedFields) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updatedFields } : cat))
    );
  };

  const deleteCategory = (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  // --- BANNER ACTIONS ---
  const addBanner = (newBanner) => {
    const bannerWithId = {
      ...newBanner,
      id: newBanner.id || `banner-${Date.now()}`,
      order: newBanner.order || banners.length + 1,
      imageLayout: newBanner.imageLayout || 'contained',
      isActive: newBanner.isActive !== undefined ? newBanner.isActive : true,
    };
    setBanners((prev) => [...prev, bannerWithId]);
    return bannerWithId;
  };

  const updateBanner = (id, updatedFields) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    );
  };

  const deleteBanner = (id) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleBannerStatus = (id) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const resetToDefault = () => {
    setProducts(initialProductsData);
    setCategories(initialCategoriesData);
    setBanners(initialBannersData);
    setBannerLayout('boxed');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CATEGORIES_KEY);
    localStorage.removeItem(BANNERS_KEY);
    localStorage.removeItem(BANNER_LAYOUT_KEY);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        banners,
        bannerLayout,
        setBannerLayout,
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
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
