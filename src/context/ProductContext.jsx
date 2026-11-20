import React, { createContext, useContext, useState, useEffect } from 'react';
import initialProductsData from '../data/products.json';
import initialCategoriesData from '../data/categories.json';
import { fetchBanners, fetchCategories, fetchProducts, createBanner, updateBanner, deleteBanner, createCategory, updateCategory, deleteCategory, createProduct, updateProduct, deleteProduct } from '../services/api';

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
  return items.map((p) => {
    const catObj = (typeof p.category === 'object' && p.category !== null) ? p.category : null;
    return {
      ...p,
      category: catObj ? catObj.name : (p.category || ''),
      category_slug: catObj ? catObj.slug : (p.category_slug || ''),
      images: Array.isArray(p.images)
        ? p.images
            .map((img) => {
              const url = typeof img === 'string' ? img : (img?.url || img?.image_url || '');
              return url;
            })
            .filter((url) => url && !url.toLowerCase().includes('total') && !url.toLowerCase().includes('worxt'))
        : [],
    };
  });
};

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      localStorage.removeItem('oepro_dynamic_products_v4');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map((p) => ({ ...p, rating: 4.9 }));
          return cleanProductImages(normalized);
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved products, falling back to initial data', e);
    }
    return cleanProductImages(initialProductsData);
  });

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

  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [bannersRes, productsRes, categoriesRes] = await Promise.all([
          fetchBanners().catch(() => ({ data: [] })),
          fetchProducts().catch(() => ({ data: [] })),
          fetchCategories().catch(() => ({ data: [] })),
        ]);

        if (bannersRes.data?.length) setBanners(bannersRes.data);
        if (productsRes.data?.length) setProducts(cleanProductImages(productsRes.data));
        if (categoriesRes.data?.length) setCategories(categoriesRes.data);
      } catch (err) {
        console.warn('API fetch failed, using local data', err);
        setApiError(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories to localStorage', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(BANNERS_KEY, JSON.stringify(banners));
    } catch (e) {
      console.error('Error saving banners to localStorage', e);
    }
  }, [banners]);

  useEffect(() => {
    try {
      localStorage.setItem(BANNER_LAYOUT_KEY, bannerLayout);
    } catch (e) {
      console.error('Error saving banner layout to localStorage', e);
    }
  }, [bannerLayout]);

  const addProduct = async (newProduct) => {
    try {
      const formData = new FormData();
      Object.entries(newProduct).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'images' && Array.isArray(value)) {
            value.forEach((img, idx) => {
              if (img.startsWith('data:')) {
                const base64Data = img.split(',')[1];
                const mimeType = img.split(',')[0].split(':')[1].split(';')[0];
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: mimeType });
                formData.append(`images[${idx}]`, blob, `image_${idx}.jpg`);
              }
            });
          } else if (key === 'variants' || key === 'features' || key === 'sizes' || key === 'colors') {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });
      const res = await createProduct(formData);
      const productWithId = { ...newProduct, ...res.data, id: newProduct.id || res.data.id || `oepro-${Date.now()}` };
      setProducts((prev) => [productWithId, ...prev]);
      return productWithId;
    } catch (err) {
      const productWithId = {
        ...newProduct,
        id: newProduct.id || `oepro-${Date.now()}`,
        rating: newProduct.rating || 5.0,
        review_count: newProduct.review_count || 0,
        sold_count: newProduct.sold_count || 0,
      };
      setProducts((prev) => [productWithId, ...prev]);
      return productWithId;
    }
  };

  const updateProductFn = async (id, updatedFields) => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      Object.entries(updatedFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'images' && Array.isArray(value)) {
            value.forEach((img, idx) => {
              if (img.startsWith('data:')) {
                const base64Data = img.split(',')[1];
                const mimeType = img.split(',')[0].split(':')[1].split(';')[0];
                const byteCharacters = atob(base64Data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: mimeType });
                formData.append(`images[${idx}]`, blob, `image_${idx}.jpg`);
              }
            });
          } else if (key === 'variants' || key === 'features' || key === 'sizes' || key === 'colors') {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });
      await updateProduct(id, formData);
    } catch (err) {
      console.warn('API update failed, updating locally only', err);
    }
    setProducts((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item)));
  };

  const deleteProductFn = async (id) => {
    try {
      await deleteProduct(id);
    } catch (err) {
      console.warn('API delete failed, deleting locally only', err);
    }
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const addCategory = async (newCat) => {
    try {
      const formData = new FormData();
      Object.entries(newCat).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'image' && typeof value === 'string' && value.startsWith('data:')) {
            const base64Data = value.split(',')[1];
            const mimeType = value.split(',')[0].split(':')[1].split(';')[0];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            formData.append('image', blob, 'category_image.jpg');
          } else {
            formData.append(key, value);
          }
        }
      });
      const res = await createCategory(formData);
      const categoryWithId = { ...newCat, ...res.data, id: newCat.id || res.data.id || `cat-${Date.now()}` };
      setCategories((prev) => [...prev, categoryWithId]);
      return categoryWithId;
    } catch (err) {
      const categoryWithId = {
        ...newCat,
        id: newCat.id || `cat-${Date.now()}`,
        slug: newCat.slug || (newCat.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        item_count: newCat.item_count || 0,
      };
      setCategories((prev) => [...prev, categoryWithId]);
      return categoryWithId;
    }
  };

  const updateCategoryFn = async (id, updatedFields) => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      Object.entries(updatedFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'image' && typeof value === 'string' && value.startsWith('data:')) {
            const base64Data = value.split(',')[1];
            const mimeType = value.split(',')[0].split(':')[1].split(';')[0];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            formData.append('image', blob, 'category_image.jpg');
          } else {
            formData.append(key, value);
          }
        }
      });
      await updateCategory(id, formData);
    } catch (err) {
      console.warn('API update failed, updating locally only', err);
    }
    setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, ...updatedFields } : cat)));
  };

  const deleteCategoryFn = async (id) => {
    try {
      await deleteCategory(id);
    } catch (err) {
      console.warn('API delete failed, deleting locally only', err);
    }
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const addBanner = async (newBanner) => {
    try {
      const formData = new FormData();
      Object.entries(newBanner).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'image' && typeof value === 'string' && value.startsWith('data:')) {
            const base64Data = value.split(',')[1];
            const mimeType = value.split(',')[0].split(':')[1].split(';')[0];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            formData.append('image', blob, 'banner_image.jpg');
          } else {
            formData.append(key, value);
          }
        }
      });
      const res = await createBanner(formData);
      const bannerWithId = { ...newBanner, ...res.data, id: newBanner.id || res.data.id || `banner-${Date.now()}` };
      setBanners((prev) => [...prev, bannerWithId]);
      return bannerWithId;
    } catch (err) {
      const bannerWithId = {
        ...newBanner,
        id: newBanner.id || `banner-${Date.now()}`,
        order: newBanner.order || banners.length + 1,
        imageLayout: newBanner.imageLayout || 'contained',
        isActive: newBanner.isActive !== undefined ? newBanner.isActive : true,
      };
      setBanners((prev) => [...prev, bannerWithId]);
      return bannerWithId;
    }
  };

  const updateBannerFn = async (id, updatedFields) => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      Object.entries(updatedFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'image' && typeof value === 'string' && value.startsWith('data:')) {
            const base64Data = value.split(',')[1];
            const mimeType = value.split(',')[0].split(':')[1].split(';')[0];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: mimeType });
            formData.append('image', blob, 'banner_image.jpg');
          } else {
            formData.append(key, value);
          }
        }
      });
      await updateBanner(id, formData);
    } catch (err) {
      console.warn('API update failed, updating locally only', err);
    }
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b)));
  };

  const deleteBannerFn = async (id) => {
    try {
      await deleteBanner(id);
    } catch (err) {
      console.warn('API delete failed, deleting locally only', err);
    }
    setBanners((prev) => prev.filter((b) => b.id !== id));
  };

  const toggleBannerStatus = (id) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b)));
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
        updateProduct: updateProductFn,
        deleteProduct: deleteProductFn,
        addCategory,
        updateCategory: updateCategoryFn,
        deleteCategory: deleteCategoryFn,
        addBanner,
        updateBanner: updateBannerFn,
        deleteBanner: deleteBannerFn,
        toggleBannerStatus,
        resetToDefault,
        loading,
        apiError,
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