import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('oepro_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem('oepro_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('oepro_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem('oepro_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('oepro_coupon');
      }
    } catch (e) {
      console.error('Failed to save coupon to localStorage', e);
    }
  }, [coupon]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const addToCart = (product, selectedColor, selectedSize, quantity = 1) => {
    if (!selectedColor || !selectedSize) {
      showToast('Silakan pilih warna dan ukuran terlebih dahulu', 'error');
      return false;
    }

    const cartItemId = `${product.id}-${selectedColor.name || selectedColor}-${selectedSize}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.cartItemId === cartItemId);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            cartItemId,
            product,
            color: selectedColor,
            size: selectedSize,
            quantity,
            price: product.price,
            addedAt: new Date().toISOString(),
          },
        ];
      }
    });

    showToast(`Berhasil menambahkan "${product.name}" (${selectedSize} / ${selectedColor.name || selectedColor}) ke keranjang!`);
    return true;
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeFromCart = (cartItemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.cartItemId !== cartItemId));
    showToast('Produk dihapus dari keranjang', 'info');
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'OEPRO10' || cleanCode === 'OEPROBASIC10') {
      setCoupon({
        code: cleanCode,
        description: 'Diskon 10% Spesial Launching OEPRO',
        discountPercent: 10,
        type: 'percentage',
      });
      showToast('Kupon OEPRO10 (Diskon 10%) berhasil digunakan!');
      return { success: true, message: 'Kupon 10% berhasil dipasang' };
    } else if (cleanCode === 'OEPROGRATIS' || cleanCode === 'ONGKIRFREE') {
      setCoupon({
        code: cleanCode,
        description: 'Potongan Ongkos Kirim Rp 15.000',
        discountFixed: 15000,
        type: 'shipping',
      });
      showToast('Kupon Subsidi Ongkir Rp 15.000 berhasil digunakan!');
      return { success: true, message: 'Kupon Subsidi Ongkir aktif' };
    } else {
      showToast('Kode voucher tidak valid atau sudah kadaluarsa', 'error');
      return { success: false, message: 'Kode voucher tidak ditemukan' };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    showToast('Kupon voucher dibatalkan', 'info');
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let discountAmount = 0;
  if (coupon) {
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
    } else if (coupon.type === 'shipping') {
      discountAmount = coupon.discountFixed || 0;
    }
  }

  // Estimasi berat (gram), rata-rata 250 gram per pakaian
  const estimatedWeightGrams = totalItems * 250;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
        discountAmount,
        estimatedWeightGrams,
        coupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        toast,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
