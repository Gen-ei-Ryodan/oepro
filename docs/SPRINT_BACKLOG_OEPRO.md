# Sprint Backlog & Task Distribution: OEPRO Demo E-Commerce (Buyer-Side)

**Sprint:** Sprint 1 - Buyer-Side Demo MVP  
**Sprint Goal:** Menghadirkan web store demo interaktif OEPRO untuk sisi pembeli (katalog, detail, cart, checkout, akun, dan history pesanan).  
**Lead:** Kira (PM)  
**Assignee:** Kenji (Full-Stack Dev), Akane (UI/UX)

---

## Pembagian Tiket & Spesifikasi Teknis

### [OEP-101] Foundation & Layout Architecture
- **Assignee:** Kenji
- **Priority:** High
- **Scope:**
  - Inisialisasi project Next.js / Tailwind CSS di `/Users/10969sosho/PROJECTS/finance/PROJECT/PROJECT MOUS/oepro/`.
  - Setup Global Navigation Header (Logo OEPRO, Nav links, Search Bar, Cart Badge Counter, Account Menu).
  - Setup Footer responsif (Links, Kebijakan, Socials).
  - Mobile bottom navigation bar untuk layar smartphone.
- **Acceptance Criteria:**
  - Header & Footer konsisten di seluruh route.
  - Cart counter reaktif mengikuti item di state keranjang.

### [OEP-102] Homepage & Brand Showcase
- **Assignee:** Kenji & Akane
- **Priority:** High
- **Scope:**
  - Hero banner promosi esensial OEPRO ("Cotton Basic Essentials for Everyday Living").
  - Kategori showcase cards (Kaos Polos 24s, Longsleeve, Polo Shirt, Outerwear).
  - Best Sellers & New Arrivals grid (produk unggulan).
  - Value proposition strip (100% Combed 24s, Jahitan Rantai, Garansi Tukar Size).
- **Acceptance Criteria:**
  - Tampilan visual selaras dengan branding minimalis OEPRO.
  - Klik kategori atau banner langsung memfilter/mengarah ke halaman katalog.

### [OEP-103] Product Catalog & Multi-filtering Engine
- **Assignee:** Kenji
- **Priority:** High
- **Scope:**
  - Mock dataset katalog produk OEPRO (Basic Tees, Longsleeves, Polos, Jackets, harga Rp65k - Rp189k).
  - Filter sidebar/modal: Kategori, Rentang Harga, Varian Ukuran (S, M, L, XL, XXL), Warna (Black, White, Navy, Olive, dll.).
  - Fitur sorting: Populer, Harga Termurah, Harga Termahal, Rilis Baru.
  - Search query filter realtime.
- **Acceptance Criteria:**
  - Filter dan search bekerja secara reaktif dan instan tanpa reload halaman.
  - Tampilan empty state jika filter tidak menemukan produk.

### [OEP-104] Product Detail Page (PDP) & Variant Selector
- **Assignee:** Kenji
- **Priority:** High
- **Scope:**
  - Gallery gambar produk multi-angle (bisa diganti sesuai varian warna).
  - Dynamic size selector & color swatch picker.
  - Modal panduan ukuran (*Size Chart Table*).
  - Counter jumlah pembelian (+ / -).
  - Tombol aksi "Tambah ke Keranjang" & "Beli Langsung".
  - Section produk terkait (*You May Also Like*).
- **Acceptance Criteria:**
  - Validasi pemilihan ukuran/warna sebelum bisa klik tambah ke keranjang.
  - Feedback toast notifikasi saat produk berhasil dimasukkan ke keranjang.

### [OEP-105] Shopping Cart & Drawer State Management
- **Assignee:** Kenji
- **Priority:** High
- **Scope:**
  - State persisten belanja (Local Storage / State Store).
  - Cart Slide-over Drawer + Dedicated Cart Page.
  - Edit kuantitas item, hapus produk, atau kosongkan keranjang.
  - Kalkulasi subtotal otomatis dan input promo code simulasi (`OEPRO10` diskon 10%).
- **Acceptance Criteria:**
  - Refresh browser tidak menghilangkan item yang ada di cart.
  - Subtotal terupdate secara realtime saat kuantitas berubah.

### [OEP-106] Checkout Flow & Order Confirmation
- **Assignee:** Kenji
- **Priority:** High
- **Scope:**
  - Formulir input alamat & kontak penerima.
  - Pilihan simulasi kurir (JNE Reguler, SiCepat Gokil, GoSend Instant) dengan tarif ongkir dinamis.
  - Pilihan metode pembayaran (QRIS, VA Bank Transfer, COD).
  - Ringkasan tagihan (Subtotal + Ongkir - Potongan Promo).
  - Aksi "Bayar Sekarang" yang menghasilkan Order ID/Invoice dan meredirect ke halaman Sukses Pesanan.
- **Acceptance Criteria:**
  - Validasi field input formulir wajib diisi.
  - Sukses checkout otomatis menambahkan pesanan ke daftar Order History dan mengosongkan cart.

### [OEP-107] Customer Account & Order History Tracking
- **Assignee:** Kenji
- **Priority:** Medium
- **Scope:**
  - Halaman profil pembeli (Data diri, alamat tersimpan).
  - Halaman riwayat transaksi / history pesanan (Daftar invoice, tanggal, nominal, status pesanan).
  - Modal detail pesanan & simulasi pelacakan nomor resi pengiriman.
- **Acceptance Criteria:**
  - Pesanan baru yang dibuat di checkout langsung muncul di daftar riwayat.
  - Status pesanan ditampilkan jelas dengan badge warna informatif.

### [OEP-108] Image Sourcing & Curation (Asset OEPRO)
- **Assignee:** Ren (Data Extraction) / Akane
- **Priority:** Medium
- **Scope:**
  - Kurasi dan pengumpulan image produk fashion basic OEPRO yang otentik dan bersih (background polos/studio).
  - Optimasi ukuran gambar WebP/PNG untuk performa rendering demo.
- **Acceptance Criteria:**
  - Seluruh produk memiliki aset foto beresolusi tajam tanpa watermark mengganggu.
