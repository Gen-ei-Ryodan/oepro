# PANDUAN LENGKAP DESIGN SYSTEM & SPESIFIKASI UI/UX OEPRO (ANTI-AI SLOP)
**Dokumen Referensi:** UI/UX Redesign & Design System Architecture  
**Brand:** OEPRO (Pure Cotton Essentials & Premium Lacoste Pique)  
**Target Eksekusi:** Kenji (Full-Stack Engineer), Bagas (QA Specialist), Bayu (Auditor)  
**Penyusun:** Akane / Laras (UI/UX Designer & Interface Specialist)  
**Standar Framework:** UI/UX Pro Max (WCAG 2.1 AA Contrast 4.5:1, Mobile-First, Touch Target min 44x44px)

---

## 1. EXECUTIVE SUMMARY & HASIL PEROMBAKAN UI/UX

Berdasarkan evaluasi kritis user dan tangkapan layar antarmuka:
1. **Navbar yang Sangat Buruk & Berantakan Diselesaikan:**
   - **Desktop**: Layout bersih dengan logo OEPRO + overline "COTTON ESSENTIALS" di kiri, link navigasi kategori berjarak lega, search bar terstruktur elegan, tombol Riwayat Pesanan, Akun, dan Cart button dengan badge counter dinamis di kanan.
   - **Mobile**: Hamburger menu drawer yang rapi, touch target seluruh link >= 44x44px, ditambah sticky bottom navigation mobile dengan ikon Lucide (Home, Catalog, Cart with Badge, History, Account).
2. **Cart Drawer Rusak Fatal Diperbaiki:**
   - Foto produk raksasa (layout collapse) digantikan oleh kontainer proporsional `w-20 h-24 rounded-md bg-[#F5F5F3]` dengan `object-cover object-top`.
   - Menampilkan detail size badge, swatch warna katun, stepper kuantitas (minus/plus) dengan touch target memadai, harga subtotal font monospace terstruktur, dan sticky checkout CTA di bagian bawah.
3. **Pembersihan Aset Visual Nyasar (Foto Tas Wanita Dihapus):**
   - Pada galeri Product Detail Page (`/product/oepro-polo-snow-white`), foto tas wanita dibuang dan digantikan oleh 2 aset foto resmi katun: detail kerah polo (`polo-snow-white-2.jpg`) dan makro tekstur pori pique heksagon (`fabric-pique-hexagon.jpg`).
4. **Desain Theme Baru "Modern Minimalist Luxury Apparel":**
   - Mengusung estetika tenang ala Uniqlo U / Fear of God Essentials / Muji: latar belakang warm ecru (`#FBFBFA`), teks obsidian (`#171717`), hairline subtle border (`#E5E5E0`), aksen pine katun (`#2D4A3E`), tanpa gradien norak / AI slop.
   - Diimplementasikan di SEMUA Halaman: Home, Catalog, Product Detail (PDP), Cart, Checkout, Order History, dan Account.

---

## 2. ATURAN WARNA SEMANTIK & TOKENS (TAILWIND CONFIG)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        oepro: {
          obsidian: '#171717',     // Primary text & primary CTA button
          charcoal: '#262626',     // High-contrast secondary text & active states
          muted: '#737373',        // Caption, metadata, secondary labels (WCAG AA compliant)
          subtle: '#A3A3A3',       // Hairline borders, placeholders
          pine: '#2D4A3E',         // Brand signature accent (Cotton Earth Tone)
          warm: '#FBFBFA',         // App background (warm ecru, ramah di mata)
          card: '#F5F5F3',         // Architectural image backdrop & neutral cards
          border: '#E5E5E0',       // 1px hairline border
          crimson: '#991B1B',      // Refined discount/sale tag
          emerald: '#166534',      // Trust & guarantee badge
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'sans-serif'],
      }
    }
  }
}
```

---

## 3. SPESIFIKASI PERBAIKAN SETIAP KOMPONEN & HALAMAN

### A. Navbar & Navigation Header (`src/components/Navbar.jsx`)
* **Top Announcement Bar**: Background `#0A0A0A`, teks `#D4D4D0`, font size 12px, menampilkan kode promo `OEPRO10` dengan border tipis dan info garansi tukar ukuran.
* **Header Bar**: Tinggi 64px (mobile) hingga 80px (desktop), background `bg-white/95 backdrop-blur-md` dengan border bawah 1px `#E5E5E0`.
* **Search Box**: Input box minimalis dengan padding kiri ikon search, focus border obsidian, tanpa bentuk lonjong pil norak.
* **Mobile Sticky Bottom Nav**: 5 item menu dengan touch target 56x44px, label 10px, dan live badge counter pada tombol Keranjang.

### B. Cart Drawer (`src/components/CartDrawer.jsx`)
* **Slide-over Layout**: Lebar `max-w-md` dengan backdrop blur `bg-neutral-950/60`.
* **Item Thumbnail**: Dikunci pada dimensi `w-20 h-24` (80x96px) dengan `flex-shrink-0`, background `#F5F5F3`, border `#E5E5E0`, dan `object-cover object-top`.
* **Item Info**: Judul line-clamp-1, badge size, circle color hex, stepper kuantitas dengan tombol `+` dan `-` berjarak aman.
* **Sticky Bottom**: Rincian subtotal, strip jaminan garansi katun, dan dual CTA "Lihat Keranjang" & "Checkout".

### C. Halaman Beranda (`src/pages/Home.jsx`)
* **Hero Section**: Tipografi editorial bersih: "Pakaian Harian Nyaman, Bahan Katun Murni." Menggantikan gradien teks murahan dengan kontras solid tinggi.
* **Kategori Grid**: Kartu rasio proporsional dengan hover subtle zoom.
* **Best Seller Grid**: Kontainer gambar terkunci `aspect-[3/4]` sehingga tinggi kartu seragam tanpa dead whitespace.

### D. Halaman Katalog (`src/pages/Catalog.jsx`)
* **Layout Responsif**: Desktop menggunakan sticky filter sidebar di kiri (kategori, ukuran, warna katun), sementara mobile menggunakan drawer filter pop-up yang mudah diakses dengan satu sentuhan.
* **Filter Chips**: Tampilan visual chip filter aktif dengan tombol hapus (X) dan reset cepat.
* **Grid Produk**: 2 kolom di mobile, 2 kolom di tablet, 3 kolom di desktop dengan card seragam.

### E. Halaman Detail Produk (`src/pages/ProductDetail.jsx`)
* **Galeri Foto**: Rasio utama `aspect-[3/4]`, didukung thumbnail selector di bawahnya.
* **Kurasi Aset**: Memastikan tidak ada aset wanita/tas. Hanya aset pakaian katun pria & uniseks serta tekstur makro kain rajut pique.
* **Selector Ukuran & Warna**: Touch target min 44x44px dengan kontras seleksi aktif hitam pekat (`bg-neutral-900 text-white`).
* **Informasi Garansi & Tab**: Spesifikasi bahan gramasi GSM, instruksi cuci, dan kebijakan retur 7 hari Surabaya.

### F. Halaman Keranjang (`src/pages/Cart.jsx`)
* **Daftar Item**: Thumbnail seragam 80x96px di mobile dan 96x112px di desktop.
* **Kupon Diskon**: Form kupon terintegrasi dengan validasi instan (`OEPRO10` = 10% off).
* **Ringkasan Belanja**: Kartu sticky di desktop dengan perhitungan subtotal, diskon, dan CTA menuju checkout.

### G. Halaman Checkout (`src/pages/Checkout.jsx`)
* **Formulir 2-Kolom**: Sisi kiri formulir penerima, ekspedisi (SiCepat, JNE, J&T, GoSend), dan metode pembayaran (QRIS, BCA VA, Mandiri VA, COD). Sisi kanan ringkasan pesanan sticky.
* **Touch Targets**: Setiap opsi ekspedisi dan pembayaran memiliki tinggi minimal 44px dengan radio indicator elegan.

### H. Halaman Riwayat Pesanan (`src/pages/OrderHistory.jsx`)
* **Status Filter Tabs**: Tab navigasi bergeser rapi (Semua, Menunggu Pembayaran, Diproses, Dikirim, Selesai).
* **Modal Rincian & Resi**: Modal drawer samping untuk melacak kurir dan nomor resi pengiriman dari gudang Surabaya.

---

## 4. HASIL VERIFIKASI BUILD & INTEGRITAS KODE

* **Vite Production Build**: Berhasil `npm run build` tanpa error (1.64s).
* **Ukuran Bundle**: CSS `40.32 kB` (Gzip: `7.09 kB`), JS `331.95 kB` (Gzip: `90.55 kB`).
* **Validasi Utility Tailwind**: Menghilangkan seluruh kelas invalid seperti `aspect-4/5`, `w-18`, `w-22`, dan `h-26`.

Dokumen ini menjadi acuan mutlak bagi tim pengembang untuk menjaga konsistensi antarmuka OEPRO.
