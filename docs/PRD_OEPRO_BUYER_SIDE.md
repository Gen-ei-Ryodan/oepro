# Product Requirement Document (PRD)
## Demo Website E-Commerce OEPRO (Buyer-Side Experience)

---

### 1. Informasi Proyek
- **Nama Proyek:** Demo Website E-Commerce OEPRO (Buyer-Side)
- **Brand:** OEPRO (OEPRO Cotton Basic / Oepro Store)
- **Kategori Industri:** Fashion / Casual Daily Wear (Basic T-Shirt, Polo, Longsleeve, Outerwear, Unisex)
- **Karakter Visual & Estetika:** Minimalis, clean, modern, earth/neutral tones, mobile-first responsive.
- **Target Pengguna:** Konsumen muda & dewasa harian yang mencari kebutuhan pakaian esensial berkualitas tinggi (*Cotton Combed 24s*) dengan harga terjangkau (Rp 60.000 – Rp 200.000).
- **Penanggung Jawab Proyek:** Kira (Project Manager & Workspace Admin)
- **Pelaksana Teknis:** Kenji (Full-Stack Engineer) & Akane (UI/UX Designer)
- **Lokasi Direktori:** `/Users/10969sosho/PROJECTS/finance/PROJECT/PROJECT MOUS/oepro/`

---

### 2. Tujuan & Ruang Lingkup (Scope)
Demo web store ini dibangun secara eksklusif berfokus pada **Buyer-Side Journey** (alur belanja pembeli dari penemuan produk hingga transaksi selesai) yang interaktif, responsif, dan siap didemokan ke stakeholder/klien.

**Halaman & Fitur Utama:**
1. **Beranda (Homepage):**
   - Header & Navigasi (Logo OEPRO, menu kategori, search bar, icon cart dengan counter, avatar akun).
   - Hero Section (Promosi peluncuran koleksi basic essentials, CTA belanja).
   - Kategori Unggulan (Basic Tees, Longsleeves, Polo Shirts, Outerwear).
   - Featured & Best Seller Products (Grid produk dengan harga & quick view).
   - Brand Value Proposition (Katun 100% 24s Adem, Jahitan Rantai Standar Distro, Garansi Tukar Ukuran, Pengiriman Cepat).
   - Footer informatif (Tautan bantuan, kebijakan privasi, kontak & sosial media).

2. **Katalog Produk (Product Listing / Shop Page):**
   - Filter multidimensi: Kategori produk, rentang harga, ukuran (S, M, L, XL, XXL), dan varian warna (Black, White, Navy, Olive, Charcoal, Sage, Mustard).
   - Sortir produk: Terbaru, Harga Terendah, Harga Tertinggi, Paling Populer.
   - Live Search: Pencarian produk realtime berdasarkan nama/tipe.
   - Grid layout responsif dengan badge diskon/stok terbatas.

3. **Detail Produk (Product Detail Page):**
   - Galeri foto produk (carousel thumbnail & zoom view).
   - Informasi detail spesifikasi bahan (misal: 100% Ring-Spun Cotton Combed 24s, Gramasi 180-190 gsm).
   - Selector varian interaktif (pilihan warna dan ukuran aktif/non-aktif sesuai stok).
   - Size Chart / Panduan Ukuran interaktif modal (Tabel Lebar Dada x Panjang Baju).
   - Tombol aksi: "Tambah ke Keranjang" & "Beli Sekarang".
   - Rekomendasi produk serupa / pelengkap (*Cross-selling / You May Also Like*).

4. **Keranjang Belanja (Cart Page & Drawer):**
   - Tampilan item dalam keranjang dengan foto thumbnail, nama varian, ukuran, harga satuan, dan pengatur kuantitas (+/-).
   - Fitur hapus item dan kosongkan cart.
   - Ringkasan subtotal harga dan estimasi berat belanjaan.
   - Input voucher / promo kupon diskon (dengan validasi demo, e.g. `OEPROBASIC10`).
   - Tombol CTA "Lanjut ke Pembayaran / Checkout".

5. **Checkout & Pembayaran (Checkout Flow):**
   - Formulir data pembeli & alamat pengiriman (Nama, No. HP, Provinsi, Kota/Kab, Kode Pos, Catatan).
   - Pilihan kurir pengiriman (JNE, SiCepat, J&T, GoSend) dengan kalkulasi ongkir simulasi.
   - Pilihan metode pembayaran (QRIS, Virtual Account BCA/Mandiri/BRI, E-Wallet GoPay/OVO, COD).
   - Rincian total pembayaran (Subtotal + Ongkir - Diskon).
   - Konfirmasi pembuatan pesanan (Simulasi sukses checkout).

6. **Akun Pengguna (Customer Account / Profile):**
   - Informasi profil buyer (Nama, Email, Nomor Telepon).
   - Buku alamat tersimpan (Alamat utama pengiriman).
   - Tab navigasi pengaturan akun.

7. **Riwayat Pesanan (Order History & Status Tracking):**
   - Daftar pesanan yang pernah dibuat (Nomor invoice, tanggal, total, status: Menunggu Pembayaran, Diproses, Dikirim, Selesai).
   - Detail pesanan & resi pengiriman simulasi (*Track Order timeline*).

---

### 3. Tech Stack Rekomendasi untuk Dev (Kenji)
- **Frontend Framework:** Next.js (App Router) / React dengan TypeScript.
- **Styling:** Tailwind CSS (skema warna netral OEPRO: zinc, slate, monochrome, warm off-white).
- **Icons:** Lucide-React.
- **State Management:** Zustand / React Context (Cart & Order State).
- **Asset Sourcing:** Mock data produk OEPRO dan integrasi scraper/curated image via Agent Ren.

---

### 4. Kriteria Keberhasilan (Acceptance Criteria)
- Seluruh navigasi antar 7 halaman berjalan mulus (SPA routing tanpa broken links).
- Fungsi interaktif keranjang belanja berjalan persisten (bisa tambah, ubah jumlah, hapus).
- Checkout flow menghasilkan invoice/order baru yang langsung tercatat di Order History.
- Desain 100% responsif di layar mobile (360px) dan desktop (1440px).
