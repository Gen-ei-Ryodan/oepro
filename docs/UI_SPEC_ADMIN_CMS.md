# SPESIFIKASI UI/UX ADMIN PANEL OEPRO (ANTI-BLOAT & LEAN CMS)
**Dokumen Referensi:** UI/UX Admin Architecture & Interface Guide  
**Brand:** OEPRO (Pure Cotton Essentials & Premium Lacoste Pique)  
**Target Eksekusi:** Kenji (Lead Dev / Frontend React), Renji (Dev 2 / REST API & SQLite)  
**Penyusun:** Akane (UI/UX Designer & Interface Specialist)  
**Standar Framework:** UI/UX Pro Max (WCAG 2.1 AA Contrast 4.5:1, Mobile-First Admin, Touch Target min 44x44px, Native Modern CSS)

---

## 1. DESIGN PRINCIPLES & FILOSOFI INTERFACE

Admin CMS OEPRO didesain dengan prinsip **Lean, Clean, High-Utility & Anti-Bloat**:
1. **Visual Harmony with Buyer Experience**: Menggunakan token warna, tipografi, dan estetika yang selaras dengan buyer site (Modern Minimalist Luxury Apparel — Uniqlo U / Fear of God Essentials vibe), bukan tampilan template admin dashboard kaku atau warna-warni norak.
2. **Zero-Friction Ergonomics**:
   - Quick Search & Category Filter instan tanpa reload.
   - Dual-Column Modal Form yang membagi data esensial teks di kiri dan upload gambar / varian ukuran di kanan.
   - Perhitungan diskon otomatis (% discount preview saat harga normal & coret diinput).
   - Multi-select size pills interaktif (XS - 8XL) sekali klik.
3. **Mobile-Ready Admin**: Admin toko sering mengecek stok atau mengubah status produk melalui smartphone. Antarmuka wajib beralih mulus dari Data Table di desktop ke Card List yang nyaman disentuh di layar ponsel (< 640px).

---

## 2. DESIGN TOKENS & ATURAN STYLING

Selaras dengan `tailwind.config.js` OEPRO:

| Token Name | Hex Code | Utility Class | Penggunaan di Admin |
| :--- | :--- | :--- | :--- |
| **Obsidian** | `#171717` | `bg-neutral-900` / `text-neutral-900` | Teks utama, primary CTA button, navbar header |
| **Charcoal** | `#262626` | `text-neutral-800` / `border-neutral-800` | Subheader, button hover, border aktif |
| **Muted** | `#737373` | `text-neutral-500` | Label caption, SKU, metadata, placeholder |
| **Subtle** | `#A3A3A3` | `text-neutral-400` / `border-neutral-300` | Hairline dividers, subtle borders |
| **Pine Signature** | `#2D4A3E` | `bg-[#2D4A3E]` / `text-[#2D4A3E]` | Badge "Featured", brand highlight, active tab |
| **Warm Ecru** | `#FBFBFA` | `bg-[#FBFBFA]` | Background utama halaman admin |
| **Card / Canvas** | `#F5F5F3` | `bg-[#F5F5F3]` | Background thumbnail gambar, table header, surface card |
| **Hairline Border**| `#E5E5E0` | `border-[#E5E5E0]` | Pembatas tabel, container card, input border |
| **Crimson Sale** | `#991B1B` | `text-red-700` / `bg-red-50` | Badge diskon, stok habis (< 5), tombol Hapus |
| **Emerald Trust** | `#166534` | `text-emerald-700` / `bg-emerald-50` | Badge status aktif, in-stock, Best Seller |

**Tipografi**:
- Font: `Plus Jakarta Sans`, fallback `Inter`, `sans-serif`.
- Scale:
  - H1 Page Title: `text-xl sm:text-2xl font-bold tracking-tight text-neutral-900`
  - Overline / Badge: `text-[10px] sm:text-xs font-semibold uppercase tracking-wider`
  - Body / Table Cell: `text-sm text-neutral-800 font-normal`
  - Input Labels: `text-xs font-medium text-neutral-700 tracking-wide uppercase`
  - Price Tag: `font-semibold text-neutral-900`

---

## 3. STRUKTUR ARSITEKTUR & NAVIGASI ADMIN

```
/admin/login
  └── Validasi Kredensial -> Simpan JWT / Session token
        └── /admin (Katalog & Manajemen Produk)
              ├── Action Bar: Live Search + Category Filter + Button "+ Tambah Produk"
              ├── Quick Stats Strip: Total SKU, Produk Aktif, Stok Kritis (< 10)
              ├── Main Content:
              │     ├── Desktop (>= 768px): Data Table responsif
              │     └── Mobile (< 768px): Card Stack List
              └── Modals:
                    ├── ProductFormModal (Create / Edit Produk)
                    └── DeleteConfirmDialog (Konfirmasi Hapus Produk)
```

---

## 4. SPESIFIKASI DETAIL HALAMAN & KOMPONEN

### 4.1 Admin Login Screen (`/admin/login`)

**Layout**:
- Container: Full height `min-h-screen bg-[#FBFBFA] flex flex-col justify-center items-center px-4`.
- Card Container: `w-full max-w-md bg-white border border-[#E5E5E0] rounded-xl p-8 shadow-sm`.
- Header:
  - Brand Logo: "OEPRO" `font-extrabold tracking-tighter text-2xl text-neutral-900`
  - Sub-tag: "COTTON ESSENTIALS · ADMIN PORTAL" `text-[10px] uppercase tracking-widest text-neutral-400 mt-1`
  - Welcome Message: "Masuk untuk mengelola katalog produk dan inventaris toko." `text-sm text-neutral-500 mt-3`
- Form Fields:
  1. **Username / Email**:
     - Label: `USERNAME ATAU EMAIL`
     - Input: `h-11 px-3.5 rounded-lg border border-[#E5E5E0] text-sm focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900`
     - Icon: `User` (Lucide) subtle di sisi kiri.
  2. **Password**:
     - Label: `PASSWORD`
     - Input: `h-11 px-3.5 pr-10 rounded-lg border border-[#E5E5E0] text-sm`
     - Toggle visibility: Ikon `Eye` / `EyeOff` di sisi kanan input.
  3. **Submit Button**:
     - CTA: `Masuk ke Panel Admin`
     - Class: `w-full h-11 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 mt-2`
     - State: Loading spinner ringkas saat autentikasi berlangsung.
- Security Footer:
  - `Akses terbatas khusus tim internal OEPRO. Seluruh aktivitas tercatat.` `text-xs text-neutral-400 text-center mt-6`

---

### 4.2 Admin Header & Quick Stats Bar (`/admin`)

**Top Navigation Bar (`AdminNavbar`)**:
- Background: `bg-white border-b border-[#E5E5E0] sticky top-0 z-30 px-4 sm:px-8 h-16 flex items-center justify-between`
- Left Section:
  - Brand mark: "OEPRO" + badge `ADMIN CMS` (`bg-[#F5F5F3] text-neutral-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-[#E5E5E0]`)
  - Link: "Lihat Web Buyer" (`text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 ml-4 hidden sm:flex`)
- Right Section:
  - User Indicator: "Admin Toko" dengan status dot hijau (`w-2 h-2 rounded-full bg-emerald-500`)
  - Tombol Logout: Ikon `LogOut` (`p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition`)

**Stats Strip (Lean & Informative)**:
- Tiga kartu ringkas di atas tabel:
  1. **Total Produk**: Count total SKU aktif (`text-2xl font-bold text-neutral-900`)
  2. **Kategori Aktif**: Count varian kategori (Polo, Kaos, Celana, dll.)
  3. **Stok Menipis (< 10)**: Count produk dengan stok menipis dengan alert warna amber halus (`text-amber-700 bg-amber-50/50`)

---

### 4.3 Action Bar & Filter Produk

- Layout: `flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between my-6`
- **Search Input**:
  - Container: `relative flex-1 max-w-md`
  - Icon: `Search` (Lucide) di posisi kiri input.
  - Placeholder: `"Cari produk berdasarkan nama, SKU, atau kategori..."`
  - Input styling: `w-full h-10 pl-9 pr-4 rounded-lg bg-white border border-[#E5E5E0] text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-900`
- **Category Filter Dropdown**:
  - Pilihan: "Semua Kategori", "Kaos Polo Premium", "Kaos Polos Katun", "Celana Chino", dll.
  - Height: `h-10 px-3 rounded-lg bg-white border border-[#E5E5E0] text-sm font-medium text-neutral-700`
- **Add Product Button**:
  - CTA: `+ Tambah Produk Baru`
  - Styling: `h-10 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 shadow-sm transition`

---

### 4.4 Data Table Produk (Desktop >= 768px)

Struktur tabel minimalis dengan pembatas hairline (`border-[#E5E5E0]`):

| Kolom | Lebar | Deskripsi Visual & Elemen |
| :--- | :--- | :--- |
| **Produk** | 35% | Thumbnail (`w-12 h-14 object-cover rounded bg-[#F5F5F3]`) + Nama Produk (`font-medium text-neutral-900`) + SKU (`text-xs text-neutral-400 font-mono`) |
| **Kategori** | 15% | Badge kategori (`text-xs bg-[#F5F5F3] text-neutral-600 px-2 py-0.5 rounded`) |
| **Harga** | 15% | Harga Jual (`text-sm font-semibold text-neutral-900`) + Harga Coret (jika ada diskon: `text-xs text-neutral-400 line-through`) |
| **Stok** | 10% | Jumlah stok angka + indikator warna (Hijau jika > 10, Amber jika <= 10, Merah jika 0) |
| **Status / Badge** | 12% | Badges: `Best Seller` (Emerald pill), `Featured` (Pine pill), `New Arrival` (Obsidian pill) |
| **Aksi** | 13% | Tombol Aksi: Edit (Ikon `Edit2` / `Pencil`), Delete (Ikon `Trash2` merah lembut), Preview PDP (Ikon `ExternalLink`) |

---

### 4.5 Card List View (Mobile < 768px)

Pada layar kecil, tabel otomatis berganti menjadi tumpukan kartu:
- Card container: `bg-white border border-[#E5E5E0] rounded-xl p-4 mb-3 flex gap-3.5`
- Kiri: Foto thumbnail `w-20 h-24 rounded-lg object-cover bg-[#F5F5F3] flex-shrink-0`
- Kanan:
  - Header: Nama produk `font-medium text-sm text-neutral-900 line-clamp-1`
  - SKU & Kategori: `text-xs text-neutral-400 font-mono`
  - Harga: Rp 129.000 (coret Rp 159.000 jika ada)
  - Stok & Badge baris bawah: Pill stok + Best Seller / Featured
  - Tombol aksi horizontal: `Edit` (btn outline) dan `Hapus` (btn red subtle) dengan touch target min 44x44px.

---

### 4.6 Modal Form Produk (`ProductFormModal.jsx`)

Modal dialog modern yang bersih dengan ukuran `max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-elevated border border-[#E5E5E0]`:

#### A. Header Modal
- Title: `"Tambah Produk Baru"` atau `"Edit Produk: [Nama Produk]"`
- Subtitle: `"Lengkapi spesifikasi material, harga, ukuran, dan aset visual produk."`
- Close button: Ikon `X` di sudut kanan atas dengan `hover:bg-neutral-100 p-2 rounded-full`.

#### B. Body Modal: Dual-Column Architecture

**Kolom Kiri (Data Produk & Spesifikasi Teks - 60% Lebar)**:
1. **Nama Produk**:
   - Input teks: placeholder `"Contoh: Kaos Polo Premium - Royal Navy"`
   - Auto-generate Slug otomatis saat mengetik nama produk (dengan opsi edit manual jika diperlukan).
2. **Slug**:
   - Input monospace kecil: `/product/` + `slug-produk`
3. **SKU (Stock Keeping Unit)**:
   - Contoh: `OEP-POLO-RN-02`
4. **Kategori**:
   - Dropdown pilihan: `Kaos Polo Premium`, `Kaos Polos Katun`, `Celana Chino`, `Koleksi Linen`.
5. **Harga & Diskon**:
   - Baris 2 kolom:
     * **Harga Jual (Rp)**: `number input` misal `129000`
     * **Harga Normal / Coret (Rp)**: `number input` misal `159000`
   - Real-time Preview: Teks otomatis `"Diskon 19% (Hemat Rp 30.000)"` muncul di bawah input jika harga normal > harga jual.
6. **Deskripsi Produk**:
   - Textarea 4 baris untuk detail keunggulan bahan katun, kerapian jahitan, dan spesifikasi fit.
7. **Spesifikasi Bahan & Fit**:
   - Input Material: e.g. `"100% Cotton Pique Hexagon Premium (220 GSM)"`
   - Input Fit: e.g. `"Regular Fit Unisex"`

**Kolom Kanan (Ukuran, Status, & Manajemen Foto - 40% Lebar)**:
1. **Multi-Select Ukuran (Pill Buttons)**:
   - Deretan tombol toggle ukuran lengkap: `XS`, `S`, `M`, `L`, `XL`, `2XL`, `3XL`, `4XL`, `5XL`, `6XL`, `7XL`, `8XL`.
   - State aktif: `bg-neutral-900 text-white font-medium border-neutral-900`
   - State tidak aktif: `bg-white text-neutral-600 border-[#E5E5E0] hover:border-neutral-400`
   - Ada tombol shortcut: `Pilih Semua Standard (S-XL)` dan `Pilih Semua Jumbo (2XL-8XL)`.
2. **Stok Produk**:
   - Number input: Kuota inventaris total (e.g. `60`).
3. **Status & Highlight Badges (Toggles)**:
   - Switch / Checkbox rapi:
     * `[✓] Best Seller` (Tampilkan label favorit penjualan)
     * `[✓] Featured` (Tampilkan di carousel homepage)
     * `[✓] New Arrival` (Tandai koleksi terbaru)
4. **Upload & Galeri Gambar Produk**:
   - Area Drag-and-Drop:
     * Border dashed: `border-2 border-dashed border-[#E5E5E0] rounded-xl p-4 text-center hover:border-neutral-400 cursor-pointer bg-[#FBFBFA]`
     * Icon: `UploadCloud` (Lucide)
     * Petunjuk: `"Klik atau seret gambar produk (JPG/PNG/WEBP, maks 2MB)"`
   - Input Fallback: Bisa juga paste path file / URL gambar.
   - Thumbnail Preview Grid:
     * Menampilkan kotak gambar yang sudah diunggah (`w-16 h-20 rounded object-cover border`).
     * Tombol hapus gambar di tiap thumbnail.
     * Tanda `Utama` pada gambar pertama.

#### C. Footer Modal (Sticky di bawah)
- Tombol `Batal`: `px-5 py-2.5 rounded-lg border border-[#E5E5E0] text-sm font-medium text-neutral-700 hover:bg-neutral-50`
- Tombol `Simpan Produk`: `px-6 py-2.5 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition flex items-center gap-2`

---

### 4.7 Delete Confirmation Modal (`DeleteConfirmModal.jsx`)

- Modal dialog peringatan yang jelas dan aman:
  - Icon: `AlertTriangle` warna merah (`bg-red-50 text-red-600 p-3 rounded-full`)
  - Title: `"Hapus Produk Ini?"`
  - Body: `"Produk '{nama_produk}' akan dihapus dari katalog. Tindakan ini tidak dapat dibatalkan."`
  - Action buttons:
    * `Batal`: Tombol netral.
    * `Hapus Permanen`: Tombol merah berani `bg-red-600 hover:bg-red-700 text-white font-medium`.

---

## 5. ACCESSIBILITY & PERFORMANCE COMPLIANCE (UI/UX PRO MAX)

1. **Keyboard Accessibility**:
   - Modal dapat ditutup dengan menekan tombol `Escape`.
   - Focus trap terjaga di dalam modal saat terbuka.
   - Seluruh interaksi input dan tombol memiliki ring fokus jelas (`focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2`).
2. **Contrast & Sizing**:
   - Seluruh teks memenuhi rasio kontras minimal 4.5:1 (WCAG 2.1 AA).
   - Area klik (touch target) tombol aksi pada mobile memenuhi standar minimal 44x44px.
3. **Zero-Bloat UI Code**:
   - Tidak menggunakan library component pihak ketiga yang berat (tanpa bloated UI kits).
   - Menggunakan kombinasi native React state + Tailwind CSS + Lucide icons yang sudah terpasang di project.

---

## 6. PROTOKOL HANDOFF & NEXT STEPS

Spesifikasi UI/UX Admin CMS ini siap digunakan untuk implementasi kode:
- **Renji (Dev 2)**: Menyiapkan endpoints REST API yang kompatibel dengan payload data di atas (`GET /api/admin/products`, `POST /api/admin/products`, `PUT /api/admin/products/:id`, `DELETE /api/admin/products/:id`, `POST /api/admin/upload`, `POST /api/admin/login`).
- **Kenji (Dev 1 / Lead)**: Mengintegrasikan komponen React `/admin` dan `/admin/login` sesuai layout, styling tokens, dan modal form yang dijabarkan dalam dokumen ini.

---
