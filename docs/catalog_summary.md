# OEPRO Store - Product Catalog & Asset Manifest

**Brand:** OEPRO (Oepro Cotton Basic & Apparel)  
**Tagline:** Pure Cotton Essentials & Premium Lacoste Pique  
**Workshop/Store:** Jl. Karah Tama Asri II No. 24, Karah, Kec. Jambangan, Surabaya, Jawa Timur  
**Kontak:** +62 811-3458-177 | Instagram: @oepro.store  
**Marketplace:** Shopee: https://shopee.co.id/oepro | Tokopedia: https://www.tokopedia.com/oepro  

---

## 1. Struktur Direktori Aset (`/assets`)

```
oepro/
├── assets/
│   ├── brand/
│   │   ├── logo.svg              # Logo utama (gelap)
│   │   ├── logo-white.svg        # Logo kontras tinggi (terang)
│   │   └── favicon.svg           # Icon favicon browser
│   ├── banners/
│   │   ├── hero-banner-main.jpg  # Banner utama editorial beranda (1200x801)
│   │   ├── hero-editorial.jpg    # Banner gaya hidup fashion (1200x800)
│   │   └── promo-banner-cotton.jpg # Banner promo material pure cotton
│   ├── categories/
│   │   ├── cat-polo.jpg          # Thumbnail kategori Polo Shirt
│   │   ├── cat-tshirt.jpg        # Thumbnail kategori Basic T-Shirt
│   │   ├── cat-longsleeve.jpg    # Thumbnail kategori Longsleeve
│   │   └── cat-outer.jpg         # Thumbnail kategori Outerwear
│   ├── fabric/
│   │   ├── fabric-pique-hexagon.jpg   # Tekstur pori Pique Hexagon
│   │   └── fabric-cotton-combed-24s.jpg # Tekstur rajut Combed 24s
│   ├── products/
│   │   ├── polo-mineral-green-1.jpg & 2.jpg
│   │   ├── polo-soft-blue-1.jpg & 2.jpg
│   │   ├── polo-snow-white-1.jpg
│   │   ├── polo-black-onyx-1.jpg
│   │   ├── polo-lemon-tree-1.jpg
│   │   ├── polo-misty-grey-1.jpg
│   │   ├── tshirt-sage-green-1.jpg
│   │   ├── tshirt-white-pure-1.jpg
│   │   ├── tshirt-coffee-latte-1.jpg
│   │   ├── tshirt-black-solid-1.jpg
│   │   ├── tshirt-heavyweight-oversize-1.jpg
│   │   ├── longsleeve-latte-brown-1.jpg
│   │   ├── longsleeve-charcoal-1.jpg
│   │   ├── outer-harrington-khaki-1.jpg
│   │   └── outer-bomber-olive-1.jpg
│   └── data/                     # Salinan JSON untuk static site import
└── data/
    ├── products.json             # 12 produk lengkap dengan SKU, harga, spek, diskon
    ├── categories.json           # 4 kategori utama
    ├── store_info.json           # Profil toko, alamat, kontak, color palette
    └── reviews.json              # Ulasan pembeli terverifikasi
```

---

## 2. Ringkasan Koleksi & Harga

| Kategori | Produk Unggulan | Bahan Utama | Range Harga | Pilihan Ukuran |
| :--- | :--- | :--- | :--- | :--- |
| **Kaos Polo Premium** | Polo Lacoste Pique (Mineral Green, Soft Blue, Snow White, Black Onyx, Lemon Tree, Misty Grey) | 100% Cotton Pique Hexagon (220 GSM) | Rp 129.000 | S, M, L, XL, XXL, 3XL, 4XL |
| **Basic T-Shirt** | Cotton Combed 24s (Sage Green, Coffee Latte, Pure White, Solid Black) & Boxy Heavyweight 20s | 100% Cotton Combed 24s & 20s Reaktif | Rp 75.000 - Rp 99.000 | S s/d 4XL |
| **Basic Longsleeve** | Longsleeve dengan Rib Manset (Latte Brown, Charcoal) | 100% Cotton Combed 24s Rib Wrist | Rp 89.000 | S s/d XXL |
| **Outerwear** | Jaket Harrington Classic Tartan Lining (Khaki Beige) & Bomber Olive | Cotton Drill Premium + Tartan Cotton | Rp 199.000 | M s/d XXL |

---

## 3. Catatan Integrasi untuk Tim Developer (Kenji) & UI/UX (Akane)
1. **Logo & Favicon**: Gunakan `assets/brand/logo.svg` untuk header navbar terang dan `logo-white.svg` jika header memiliki background gelap.
2. **Color Palette Brand**:
   - Dark Slate / Navy: `#1E293B`
   - Mineral Green (Signature): `#4A6B5D`
   - Accent Blue: `#3B82F6`
   - Soft Cream / Off-white: `#F8FAFC`
3. **Responsive Images**: Seluruh file gambar produk dan banner telah dioptimasi dengan format JPEG high-quality, rasio konsisten, dan siap dimuat cepat di web/mobile.
