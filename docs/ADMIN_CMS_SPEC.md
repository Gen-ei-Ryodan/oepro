# SPESIFIKASI TEKNIS ADMIN CMS & REST API CRUD PRODUK OEPRO
**Proyek:** OEPRO E-Commerce (Production Grade)  
**Dokumen:** Spesifikasi Arsitektur Backend & Antarmuka Admin CMS  
**Standar:** Lean, Anti-Bloat, Superpowers & Ponytail (Node.js v20 LTS, SQLite3, Fastify/Express Lean, JWT Auth)  
**Penyusun:** Renji (Full-Stack Engineer - Dev 2) & Akane (UI/UX Designer)  
**Lead:** Kento (Senior Full-Stack & Engineering Lead) | Assignee Frontend: Kenji (Dev 1)

---

## 1. ARSITEKTUR BACKEND LEAN & ZERO-BLOAT

### 1.1 Tech Stack Backend
- **Runtime:** Node.js v20 LTS
- **Server Framework:** Node Native HTTP / Express 4.x / Fastify (Zero overhead, anti-bloat)
- **Database:** SQLite 3 (`data/oepro.db` via `better-sqlite3` atau driver sqlite3 native)
  - File-based, zero configuration, instant deployment di Cloud VPS / local.
  - ACID compliant dengan WAL (Write-Ahead Logging) mode untuk performa baca tinggi.
- **Autentikasi:** JSON Web Token (JWT) + bcrypt / crypto scrypt (zero native bloat).
- **Upload File:** Form parsing multipart stream ke direktori `public/uploads/products/` dengan auto-naming sanitized timestamp/uuid.

---

## 2. SCHEMA DATABASE SQLITE (`oepro.db`)

### 2.1 Tabel `admins`
Menyimpan kredensial admin CMS OEPRO secara aman.
```sql
CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin', -- 'superadmin', 'admin', 'inventory'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 2.2 Tabel `products`
Menampung seluruh katalog produk OEPRO dengan field selaras `data/products.json`.
```sql
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,                       -- e.g. 'oepro-polo-black-stone'
    sku TEXT UNIQUE NOT NULL,                  -- e.g. 'OEP-POLO-BS-01'
    slug TEXT UNIQUE NOT NULL,                 -- e.g. 'kaos-polo-premium-black-stone'
    name TEXT NOT NULL,                        -- e.g. 'Kaos Polo Premium - Black Stone'
    category TEXT NOT NULL,                    -- e.g. 'Kaos Polo Premium'
    category_slug TEXT NOT NULL,               -- e.g. 'polo-shirt'
    price INTEGER NOT NULL,                    -- e.g. 129000 (IDR)
    original_price INTEGER,                    -- e.g. 159000 (IDR)
    discount_percent INTEGER DEFAULT 0,        -- e.g. 19
    rating REAL DEFAULT 5.0,                   -- e.g. 4.9
    review_count INTEGER DEFAULT 0,            -- e.g. 150
    sold_count INTEGER DEFAULT 0,              -- e.g. 500
    stock INTEGER NOT NULL DEFAULT 0,          -- e.g. 60
    is_best_seller INTEGER DEFAULT 0,          -- 0 atau 1
    is_featured INTEGER DEFAULT 0,             -- 0 atau 1
    is_new_arrival INTEGER DEFAULT 0,          -- 0 atau 1
    material TEXT,                             -- e.g. '100% Cotton Pique Hexagon Premium'
    fit TEXT DEFAULT 'Regular Fit Unisex',
    description TEXT,
    sizes TEXT NOT NULL,                       -- JSON string array: ["XS","S","M","L","XL","2XL","3XL","4XL","5XL","6XL","7XL","8XL"]
    images TEXT NOT NULL,                      -- JSON string array url/path: ["assets/products/..."]
    features TEXT,                             -- JSON string array: ["100% Full Cotton Pique..."]
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
```

### 2.3 Tabel `categories`
Menampung master kategori produk.
```sql
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    image TEXT,
    item_count INTEGER DEFAULT 0
);
```

---

## 3. SPESIFIKASI REST API ADMIN

Base URL: `/api/admin`  
Header Keamanan: `Authorization: Bearer <jwt_token>` (atau `Cookie: admin_token=<jwt_token>`)

### 3.1 Endpoint Autentikasi
| Method | Endpoint | Deskripsi | Request Body / Query | Response Sukses (200) |
|---|---|---|---|---|
| `POST` | `/api/admin/auth/login` | Login admin & generate JWT | `{ "username": "admin", "password": "..." }` | `{ "success": true, "token": "ey...", "admin": { "id": "...", "username": "admin", "role": "superadmin" } }` |
| `POST` | `/api/admin/auth/logout` | Invalidate token/clear cookie | Empty | `{ "success": true, "message": "Logged out" }` |
| `GET` | `/api/admin/auth/me` | Cek status auth aktif | Empty | `{ "success": true, "admin": { "id": "...", "username": "admin" } }` |

### 3.2 Endpoint CRUD Produk
| Method | Endpoint | Deskripsi | Query / Request Body | Response Sukses |
|---|---|---|---|---|
| `GET` | `/api/admin/products` | Ambil daftar produk (paginasi & filter) | `?page=1&limit=20&search=polo&category=polo-shirt&sort=newest` | `{ "success": true, "data": [...], "pagination": { "page": 1, "limit": 20, "total": 105, "totalPages": 6 } }` |
| `GET` | `/api/admin/products/:id` | Ambil detail 1 produk untuk form edit | Path param `:id` | `{ "success": true, "data": { "id": "...", "name": "...", "sizes": [...], "images": [...] } }` |
| `POST` | `/api/admin/products` | Tambah produk baru | JSON Payload produk lengkap (auto-generate slug & sku jika kosong) | `{ "success": true, "message": "Product created", "data": { ... } }` (201) |
| `PUT` | `/api/admin/products/:id` | Perbarui data produk | JSON Payload update produk | `{ "success": true, "message": "Product updated", "data": { ... } }` |
| `DELETE` | `/api/admin/products/:id` | Hapus produk | Path param `:id` | `{ "success": true, "message": "Product deleted" }` |

### 3.3 Endpoint Upload Gambar Produk
| Method | Endpoint | Deskripsi | Content-Type | Response Sukses (200) |
|---|---|---|---|---|
| `POST` | `/api/admin/upload` | Upload single/multiple foto produk | `multipart/form-data` (file: `image`) | `{ "success": true, "url": "/assets/uploads/products/prod_173192837.webp", "filename": "prod_173192837.webp" }` |

---

## 4. STRUKTUR PAYLOAD PRODUK (JSON VALIDATION)

```json
{
  "name": "Kaos Polo Premium - Sage Green",
  "category": "Kaos Polo Premium",
  "category_slug": "polo-shirt",
  "price": 129000,
  "original_price": 159000,
  "discount_percent": 19,
  "stock": 45,
  "is_best_seller": true,
  "is_featured": true,
  "is_new_arrival": true,
  "material": "100% Cotton Pique Hexagon Premium (220 GSM)",
  "fit": "Regular Fit Unisex",
  "description": "Koleksi Kaos Polo bernuansa Sage Green...",
  "sizes": ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "7XL", "8XL"],
  "images": [
    "assets/products/polo/sage-green/sage-green-oepro.webp"
  ],
  "features": [
    "100% Full Cotton Pique Hexagon",
    "Kerah rajut tebal 4 lapis anti-curling"
  ]
}
```

---

## 5. RANCANGAN STRUKTUR VISUAL & HIERARKI UI/UX ADMIN CMS (AKANE SPEC)

### 5.1 Route & Layout Hierarchy
- `/admin/login` — Halaman Login Minimalis
  - Card sentral berlatar warm ecru (`#FBFBFA`) dan card backdrop (`#F5F5F3`).
  - Form: Username/Email, Password, Tombol "Masuk ke Admin Console" (Obsidian `#171717`, hover charcoal).
  - Clean error banner jika kredensial tidak valid.
- `/admin` (atau `/admin/products`) — Dashboard & Katalog CMS
  - **Sidebar / Header Navigation:**
    - Logo OEPRO + badge status "ADMIN CONSOLE".
    - Menu navigasi ringkas: Dashboard, Produk, Kategori, Pesanan, Pengaturan Akun, Tombol Logout.
  - **Top Action Bar:**
    - Search input real-time (mencari nama atau SKU produk).
    - Dropdown filter kategori (Semua, Kaos Polo, Basic T-Shirt, Longsleeve, Outerwear).
    - Tombol CTA Utama: `+ Tambah Produk Baru` (Obsidian button).
  - **Tabel / Card Grid Produk:**
    - Kolom: Thumbnail Gambar (w-12 h-14 rounded), Info Produk (Nama, SKU, Kategori), Harga (Rp normal + coret), Stok (badge warna: Hijau >10, Kuning 1-10, Merah 0), Status (Pill: Best Seller / Featured), Aksi (Tombol Edit ikon pensil & Hapus ikon tempat sampah).
    - Pagination responsif (Halaman 1 dari N, tombol Prev/Next).
  - **Modal Form Tambah / Edit Produk (Drawer / Centered Modal):**
    - Grid 2 Kolom (Desktop) / 1 Kolom (Mobile):
      - Kiri: Info Utama (Nama Produk, Kategori, Harga Normal, Harga Diskon, Stok, Material, Deskripsi).
      - Kanan: Image Upload & Preview Grid (Drag & drop zone, thumbnail preview dengan tombol remove), Multi-select Size Chips (XS sampai 8XL dengan status aktif toggle), Checkbox Badges (Best Seller, Featured, New Arrival).
    - Sticky Footer: Tombol Batal & Tombol Simpan Produk.

---

## 6. SINKRONISASI DENGAN FRONTEND BUYER (KENJI HANDOFF)
1. Frontend Buyer membaca data dari SQLite API (`/api/products` & `/api/products/:slug`).
2. Perubahan (Create/Update/Delete) di Admin Panel langsung berefek instan ke etalase toko.
3. Fallback: Jika API server belum aktif, frontend tetap aman membaca fallback JSON static di `data/products.json`.
