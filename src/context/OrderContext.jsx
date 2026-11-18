import React, { createContext, useContext, useState, useEffect } from 'react';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

const initialSampleOrders = [
  {
    id: 'OEP-INV-20261114-001',
    createdAt: '2026-11-14T10:30:00.000Z',
    status: 'Selesai', // 'Menunggu Pembayaran', 'Diproses', 'Dikirim', 'Selesai'
    customer: {
      name: 'Budi Santoso',
      phone: '0812-3456-7890',
      email: 'budi.santoso@example.com',
      address: 'Jl. Rungkut Asri Timur No. 42',
      city: 'Surabaya',
      province: 'Jawa Timur',
      postalCode: '60293',
      notes: 'Titipkan ke pos security jika rumah kosong',
    },
    courier: {
      id: 'sicepat',
      name: 'SiCepat BEST (1 Hari)',
      service: 'BEST',
      cost: 18000,
      trackingNumber: '003291882711',
    },
    payment: {
      method: 'qris',
      name: 'QRIS Realtime (GoPay/OVO/BCA)',
      isPaid: true,
      paidAt: '2026-11-14T10:35:12.000Z',
    },
    items: [
      {
        cartItemId: 'oepro-polo-mineral-green-Mineral Green-XL',
        product: {
          id: 'oepro-polo-mineral-green',
          name: 'Kaos Polo Premium Lacoste Pique - Mineral Green',
          price: 129000,
          images: ['assets/products/polo/mineral-green/mineral-green-total.webp'],
        },
        color: { name: 'Mineral Green', hex: '#4A6B5D' },
        size: 'XL',
        quantity: 1,
        price: 129000,
      },
      {
        cartItemId: 'oepro-tshirt-white-pure-Snow White-L',
        product: {
          id: 'oepro-tshirt-white-pure',
          name: 'Kaos Polos Premium 100% Katun Combed 24s - Pure White',
          price: 69000,
          images: ['assets/products/tshirt/white-army/white-army-oepro.webp'],
        },
        color: { name: 'Pure White', hex: '#FFFFFF' },
        size: 'L',
        quantity: 1,
        price: 69000,
      },
    ],
    summary: {
      subtotal: 198000,
      discountAmount: 19800,
      couponCode: 'OEPRO10',
      shippingCost: 18000,
      grandTotal: 196200,
    },
    timeline: [
      { status: 'Pesanan Dibuat', time: '14 Nov 2026, 10:30 WIB', desc: 'Menunggu konfirmasi pembayaran' },
      { status: 'Pembayaran Dikonfirmasi', time: '14 Nov 2026, 10:35 WIB', desc: 'Pembayaran via QRIS berhasil diverifikasi' },
      { status: 'Pesanan Diproses & Dipacking', time: '14 Nov 2026, 13:00 WIB', desc: 'Pesanan disiapkan oleh gudang OEPRO Surabaya' },
      { status: 'Diserahkan ke Kurir', time: '14 Nov 2026, 17:30 WIB', desc: 'Resi SiCepat: 003291882711' },
      { status: 'Pesanan Selesai Diterima', time: '15 Nov 2026, 14:15 WIB', desc: 'Diterima oleh Budi (Ybs)' },
    ],
  },
];

const initialProfile = {
  name: 'Budi Santoso',
  phone: '0812-3456-7890',
  email: 'budi.santoso@example.com',
  gender: 'Laki-laki',
  birthDate: '1995-08-17',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  addresses: [
    {
      id: 'addr-1',
      isDefault: true,
      label: 'Rumah Utama',
      recipientName: 'Budi Santoso',
      phone: '0812-3456-7890',
      address: 'Jl. Rungkut Asri Timur No. 42',
      district: 'Rungkut',
      city: 'Surabaya',
      province: 'Jawa Timur',
      postalCode: '60293',
      notes: 'Pagar warna hitam, samping minimarket',
    },
    {
      id: 'addr-2',
      isDefault: false,
      label: 'Kantor / Studio',
      recipientName: 'Budi Santoso (Work)',
      phone: '0811-9876-5432',
      address: 'Gedung Graha Pena Lt. 5 Unit 502, Jl. Ahmad Yani No. 88',
      district: 'Wonokromo',
      city: 'Surabaya',
      province: 'Jawa Timur',
      postalCode: '60234',
      notes: 'Titip di resepsionis lobi utama',
    },
  ],
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('oepro_orders');
      return saved ? JSON.parse(saved) : initialSampleOrders;
    } catch (e) {
      return initialSampleOrders;
    }
  });

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('oepro_profile');
      return saved ? JSON.parse(saved) : initialProfile;
    } catch (e) {
      return initialProfile;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('oepro_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('oepro_profile', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  }, [profile]);

  const createOrder = (orderData) => {
    const timestamp = new Date();
    const dateFormatted = timestamp.toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = Math.floor(100 + Math.random() * 900);
    const orderId = `OEP-INV-${dateFormatted}-${randomHex}`;

    const newOrder = {
      id: orderId,
      createdAt: timestamp.toISOString(),
      status: orderData.payment.method === 'cod' ? 'Diproses' : 'Menunggu Pembayaran',
      customer: orderData.customer,
      courier: {
        ...orderData.courier,
        trackingNumber: `OEP${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      },
      payment: {
        ...orderData.payment,
        isPaid: orderData.payment.method !== 'cod' ? false : true,
        paidAt: null,
      },
      items: orderData.items,
      summary: orderData.summary,
      timeline: [
        {
          status: 'Pesanan Dibuat',
          time: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp),
          desc: orderData.payment.method === 'cod' ? 'Pesanan COD berhasil diverifikasi' : 'Menunggu konfirmasi pembayaran',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedTimeline = [
          ...order.timeline,
          {
            status: newStatus,
            time: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date()),
            desc: `Status diperbarui menjadi ${newStatus}`,
          },
        ];

        return {
          ...order,
          status: newStatus,
          payment: {
            ...order.payment,
            isPaid: newStatus === 'Diproses' || newStatus === 'Dikirim' || newStatus === 'Selesai' ? true : order.payment.isPaid,
            paidAt: order.payment.paidAt || (newStatus !== 'Menunggu Pembayaran' ? new Date().toISOString() : null),
          },
          timeline: updatedTimeline,
        };
      })
    );
  };

  const updateProfile = (updatedFields) => {
    setProfile((prev) => ({ ...prev, ...updatedFields }));
  };

  const getOrderById = (orderId) => {
    return orders.find((o) => o.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        profile,
        createOrder,
        updateOrderStatus,
        updateProfile,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
