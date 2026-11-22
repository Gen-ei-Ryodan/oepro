@extends('layouts.app')

@section('title', 'OEPRO - Official Store | Kaos Polos & Polo Pique Katun Murni')

@section('content')

{{-- HERO SECTION / BANNER SLIDER (BOXED, 100% OPACITY FOTO TERANG, TEKS LANGSUNG DI ATAS FOTO TANPA CARD) --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-6">
    <div class="relative bg-[#0E2824] border border-[#A8C4B5]/20 rounded-3xl overflow-hidden shadow-2xl"
         x-data="{ active: 0, total: {{ count($banners) > 0 ? count($banners) : 1 }} }"
         x-init="if (total > 1) setInterval(() => active = (active + 1) % total, 6000)">
        
        @if(count($banners) > 0)
            @foreach($banners as $idx => $b)
            <div x-show="active === {{ $idx }}"
                 x-transition:enter="transition ease-out duration-700"
                 x-transition:enter-start="opacity-0"
                 x-transition:enter-end="opacity-100"
                 class="relative aspect-[2.4/1] sm:aspect-[16/7] md:aspect-[21/9] flex items-center overflow-hidden">
                
                {{-- Foto Banner 100% Opacity Penuh & Terang Tetap Landscape --}}
                @if($b->image_url)
                <img src="{{ $b->image_url }}" alt="{{ $b->title }}" class="absolute inset-0 w-full h-full object-cover object-center opacity-100">
                @else
                <div class="absolute inset-0 bg-gradient-to-br from-[#133129] via-[#0E2824] to-[#081F1C]"></div>
                @endif

                {{-- Teks di Atas Banner (Responsif, Proporsional di Layar Mobile) --}}
                <div class="relative z-10 px-3.5 sm:px-12 lg:px-16 py-3 sm:py-14 w-full">
                    <div class="max-w-[65%] sm:max-w-md lg:max-w-lg space-y-1 sm:space-y-4">
                        @if($b->tag)
                        <span class="inline-block text-[8px] sm:text-[11px] font-bold uppercase tracking-widest text-[#D8B761] bg-[#081F1C]/70 border border-[#D8B761]/30 px-2 sm:px-3 py-0.5 rounded-full drop-shadow-md">
                            {{ $b->tag }}
                        </span>
                        @endif

                        {{-- HEADLINE --}}
                        <h1 class="text-xs sm:text-3xl lg:text-5xl font-black tracking-tight leading-tight text-[#D8B761] drop-shadow-md">
                            {{ $b->title ?? $b->headline }}
                        </h1>

                        {{-- SUB HEADLINE --}}
                        @if($b->subheadline)
                        <p class="text-white text-[9px] sm:text-xs lg:text-base leading-tight sm:leading-relaxed font-normal drop-shadow-md line-clamp-2 sm:line-clamp-none">
                            {{ $b->subheadline }}
                        </p>
                        @endif

                        {{-- TOMBOL-TOMBOL --}}
                        <div class="pt-1 sm:pt-3 flex flex-wrap gap-1.5 sm:gap-3">
                            <a href="{{ url($b->cta_link ?? '/catalog') }}"
                               class="px-2.5 py-1 sm:px-7 sm:py-3 bg-[#D8B761] hover:bg-white text-[#081F1C] font-extrabold rounded-full text-[9px] sm:text-xs uppercase tracking-wider transition transform hover:scale-105 shadow-xl">
                                {{ $b->cta_text ?? 'Katalog' }} →
                            </a>
                            <a href="https://wa.me/6281313888927?text=Halo%20Admin%20OEPRO,%20saya%20ingin%20tanya%20produk%20dan%20harga"
                               target="_blank"
                               class="px-2 py-1 sm:px-6 sm:py-3 bg-[#081F1C]/80 hover:bg-[#133129] border border-white/40 text-white font-bold rounded-full text-[9px] sm:text-xs uppercase tracking-wider transition shadow-lg">
                                Chat WA
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            @endforeach
        @else
            {{-- Default Hero Fallback --}}
            <div class="relative min-h-[380px] sm:min-h-[460px] flex items-center bg-[#0E2824] px-6 sm:px-12 py-12">
                <div class="max-w-2xl space-y-4">
                    <span class="inline-block text-[11px] font-black uppercase tracking-widest text-[#D8B761] bg-[#081F1C]/70 px-3.5 py-1 rounded-full border border-[#D8B761]/30">
                        OEPRO OFFICIAL STORE
                    </span>
                    <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[#D8B761]">
                        100% Full Cotton Murni.<br><span class="text-white">Kenyamanan Berkelas.</span>
                    </h1>
                    <p class="text-white text-sm sm:text-base leading-relaxed">
                        Koleksi Kaos Polos Combed 24s Super Soft, Polo Pique Hexagon Premium, dan Longsleeve dengan standar jahitan rantai ekspor.
                    </p>
                    <div class="pt-3 flex gap-3">
                        <a href="{{ url('/catalog') }}" class="px-7 py-3.5 bg-[#D8B761] hover:bg-white text-[#081F1C] font-extrabold rounded-full text-xs uppercase tracking-wider transition transform hover:scale-105 shadow-xl">
                            Belanja Sekarang →
                        </a>
                    </div>
                </div>
            </div>
        @endif
    </div>
</section>

{{-- KATALOG PRODUK OEPRO (LANGSUNG GABUNG SEMUA PRODUK DENGAN FILTER PILL KECIL SEPERTI REFERENSI) --}}
<section id="katalog" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
         x-data="{ showAll: false }">
    {{-- Header & Subhead --}}
    <div class="space-y-4 mb-8">
        {{-- Filter Pills Kecil: Saat diklik langsung membuka /catalog dengan kategori terpilih --}}
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <a href="{{ url('/catalog') }}"
               class="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 bg-[#0E2824] border border-white/10 text-gray-300 hover:border-[#D8B761] hover:text-[#D8B761]">
                <span>Semua</span>
                <span class="text-[10px] opacity-80">({{ $totalProductsCount }})</span>
            </a>
            @foreach($categories as $cat)
            <a href="{{ url('/catalog?category=' . $cat->slug) }}"
               class="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 bg-[#0E2824] border border-white/10 text-gray-300 hover:border-[#D8B761] hover:text-[#D8B761]">
                <span>{{ $cat->name }}</span>
                <span class="text-[10px] opacity-80">({{ $cat->products_count }})</span>
            </a>
            @endforeach
        </div>

        <div class="flex items-center justify-between border-t border-white/5 pt-4">
            <div>
                <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <span>Katalog Produk OEPRO</span>
                    <span class="text-xs sm:text-sm font-normal text-gray-400">({{ $allProducts->count() }} varian)</span>
                </h2>
            </div>
            <a href="{{ url('/catalog') }}" class="text-xs font-bold text-[#D8B761] hover:underline flex items-center gap-1">
                <span>Semua Katalog</span>
                <span>→</span>
            </a>
        </div>
    </div>

    {{-- Grid Produk All (Tampilkan 12 produk pertama, tombol tampilkan lebih untuk sisa produk) --}}
    @if($allProducts->count() > 0)
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
        @foreach($allProducts as $idx => $prod)
        <div class="{{ $idx >= 12 ? 'hidden' : '' }}"
             @if($idx >= 12) :class="showAll ? '!block' : 'hidden'" @endif>
            @include('partials.product-card', ['product' => $prod])
        </div>
        @endforeach
    </div>

    {{-- Tombol Tampilkan Lebih (Bila produk > 12) --}}
    @if($allProducts->count() > 12)
    <div class="mt-10 text-center" x-show="!showAll">
        <button type="button"
                @click="showAll = true"
                class="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#133129] hover:bg-[#163B35] text-[#D8B761] font-extrabold rounded-full border border-[#D8B761]/40 transition-all text-xs uppercase tracking-wider shadow-xl transform hover:scale-105">
            <span>Tampilkan Lebih ({{ $allProducts->count() - 12 }} Produk Lainnya)</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </button>
    </div>
    @endif

    @else
    <div class="p-16 text-center bg-[#0E2824] rounded-3xl border border-white/10 space-y-3">
        <p class="text-sm text-gray-300">Belum ada produk untuk kategori ini.</p>
        <a href="{{ url('/') }}#katalog" class="inline-block px-5 py-2 bg-[#D8B761] text-[#081F1C] text-xs font-bold rounded-xl">Lihat Semua Produk</a>
    </div>
    @endif
</section>

{{-- FITUR KEUNGGULAN (KOTAK RATA KIRI, POSISI GRID CENTER TENGAH) --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
    <div class="bg-[#0E2824] border border-[#D8B761]/30 text-white rounded-3xl p-8 sm:p-12 sm:py-16 relative overflow-hidden shadow-2xl">
        <div class="max-w-4xl mx-auto space-y-4 relative z-10">
            {{-- Header Section Tetap Rapi di Tengah --}}
            <div class="text-center space-y-2 mb-8">
                <span class="text-xs font-black uppercase tracking-widest text-[#D8B761] block">KUALITAS TANPA KOMPROMI</span>
                <h2 class="text-2xl sm:text-4xl font-black tracking-tight leading-snug text-[#D8B761]">
                    Kenapa Memilih OEPRO?
                </h2>
                <p class="text-gray-300 text-xs sm:text-sm max-w-xl mx-auto">
                    Dedikasi kami untuk menghadirkan kenyamanan berkelas lewat material pilihan, konstruksi jahitan presisi, dan daya tahan ekstra.
                </p>
            </div>

            {{-- Grid 2 Kolom di Tengah, Isi Tiap Kotak Rata Kiri dengan Ikon di Kiri --}}
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 pt-2">
                {{-- Item 1 --}}
                <div class="flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-[#081F1C]/70 border border-white/10 hover:border-[#D8B761]/40 transition text-left">
                    <div class="w-12 h-12 rounded-2xl bg-[#133129] border border-[#D8B761]/30 text-[#D8B761] flex items-center justify-center shrink-0 shadow-md">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                    </div>
                    <div class="space-y-1">
                        <strong class="text-white text-sm sm:text-base font-bold block">100% Full Cotton Murni</strong>
                        <p class="text-gray-300 text-xs leading-relaxed font-light">Tanpa campuran polyester sintesis. Bahan bernapas bebas dan menyerap keringat seketika.</p>
                    </div>
                </div>

                {{-- Item 2 --}}
                <div class="flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-[#081F1C]/70 border border-white/10 hover:border-[#D8B761]/40 transition text-left">
                    <div class="w-12 h-12 rounded-2xl bg-[#133129] border border-[#D8B761]/30 text-[#D8B761] flex items-center justify-center shrink-0 shadow-md">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                    </div>
                    <div class="space-y-1">
                        <strong class="text-white text-sm sm:text-base font-bold block">Kerah Anti-Melar 4 Lapis</strong>
                        <p class="text-gray-300 text-xs leading-relaxed font-light">Rib kerah tebal dengan konstruksi double-knit tahan cuci berkali-kali tanpa melipat.</p>
                    </div>
                </div>

                {{-- Item 3 --}}
                <div class="flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-[#081F1C]/70 border border-white/10 hover:border-[#D8B761]/40 transition text-left">
                    <div class="w-12 h-12 rounded-2xl bg-[#133129] border border-[#D8B761]/30 text-[#D8B761] flex items-center justify-center shrink-0 shadow-md">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
                        </svg>
                    </div>
                    <div class="space-y-1">
                        <strong class="text-white text-sm sm:text-base font-bold block">Jahitan Rantai Standar Ekspor</strong>
                        <p class="text-gray-300 text-xs leading-relaxed font-light">Pundak dan sambungan dijahit rantai rapi dengan benang katun kuat standar ekspor.</p>
                    </div>
                </div>

                {{-- Item 4 --}}
                <div class="flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-[#081F1C]/70 border border-white/10 hover:border-[#D8B761]/40 transition text-left">
                    <div class="w-12 h-12 rounded-2xl bg-[#133129] border border-[#D8B761]/30 text-[#D8B761] flex items-center justify-center shrink-0 shadow-md">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
                        </svg>
                    </div>
                    <div class="space-y-1">
                        <strong class="text-white text-sm sm:text-base font-bold block">Pewarnaan Reaktif Tidak Luntur</strong>
                        <p class="text-gray-300 text-xs leading-relaxed font-light">Warna pekat, tajam, dan tidak mudah pudar meskipun dicuci rutin dalam jangka panjang.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

{{-- SECTION: STANDAR MUTU OEPRO (LETAK DI ATAS FOOTER DENGAN BACKGROUND #133129 & FOTO MODEL CEWE + COWO) --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
    <div class="bg-[#133129] rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-12 shadow-2xl border border-[#D8B761]/30 text-white">
        <div class="text-center max-w-xl mx-auto mb-6 sm:mb-10 space-y-1.5 sm:space-y-2">
            <span class="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-[#D8B761]">STANDAR MUTU OEPRO</span>
            <h2 class="text-lg sm:text-3xl font-black text-white tracking-tight">Dua Pilihan Material Katun Esensial</h2>
            <p class="text-[11px] sm:text-xs text-gray-300">Komitmen kualitas OEPRO untuk setiap jahitan dan serat kain yang Anda kenakan.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-8">
            {{-- Card 1: 100% Katun Combed 24s (Foto Cewek) -> Klik masuk ke Kategori Kaos --}}
            <a href="{{ url('/catalog?category=basic-tshirt') }}"
               class="bg-[#0E2824] rounded-2xl sm:rounded-3xl p-3 sm:p-6 flex flex-row items-center sm:items-start gap-3.5 sm:gap-6 border border-white/10 shadow-lg group hover:border-[#D8B761] hover:scale-[1.01] transition-all block cursor-pointer">
                <div class="w-20 h-28 sm:w-36 sm:h-44 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-[#081F1C] border border-[#D8B761]/30 shadow-md">
                    <img src="/assets/images/mutu-combed24s-cewe.jpg" alt="100% Katun Combed 24s" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                </div>
                <div class="flex-1 text-left space-y-1 sm:space-y-2.5 min-w-0">
                    <span class="inline-block px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#133129] text-[#D8B761] border border-[#D8B761]/30">Material 01</span>
                    <h3 class="text-sm sm:text-xl font-black text-[#D8B761] group-hover:text-white transition leading-snug truncate sm:whitespace-normal">1. 100% Katun Combed 24s</h3>
                    <p class="text-[10px] sm:text-sm text-gray-200 leading-relaxed font-light line-clamp-2 sm:line-clamp-none">
                        Terbuat dari 100% serat katun berkualitas, memiliki tekstur lembut, adem, nyaman menyerap keringat, dan cocok untuk penggunaan sehari-hari.
                    </p>
                    <div class="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#D8B761] group-hover:text-white pt-0.5 sm:pt-2 transition">
                        <span>Lihat Kaos Combed 24s</span>
                        <span>→</span>
                    </div>
                </div>
            </a>

            {{-- Card 2: Pique Hexagon Premium (Foto Cowok) -> Klik masuk ke Kategori Polo --}}
            <a href="{{ url('/catalog?category=polo-shirt') }}"
               class="bg-[#0E2824] rounded-2xl sm:rounded-3xl p-3 sm:p-6 flex flex-row items-center sm:items-start gap-3.5 sm:gap-6 border border-white/10 shadow-lg group hover:border-[#D8B761] hover:scale-[1.01] transition-all block cursor-pointer">
                <div class="w-20 h-28 sm:w-36 sm:h-44 shrink-0 rounded-xl sm:rounded-2xl overflow-hidden bg-[#081F1C] border border-[#D8B761]/30 shadow-md">
                    <img src="/assets/images/mutu-pique-cowo.jpg" alt="Pique Hexagon Premium" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                </div>
                <div class="flex-1 text-left space-y-1 sm:space-y-2.5 min-w-0">
                    <span class="inline-block px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider bg-[#133129] text-[#D8B761] border border-[#D8B761]/30">Material 02</span>
                    <h3 class="text-sm sm:text-xl font-black text-[#D8B761] group-hover:text-white transition leading-snug truncate sm:whitespace-normal">2. Pique Hexagon Premium</h3>
                    <p class="text-[10px] sm:text-sm text-gray-200 leading-relaxed font-light line-clamp-2 sm:line-clamp-none">
                        Kain bertekstur motif hexagon dengan tampilan elegan dan eksklusif. Memiliki karakteristik kuat, nyaman, serta memberikan kesan premium saat dikenakan.
                    </p>
                    <div class="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-[#D8B761] group-hover:text-white pt-0.5 sm:pt-2 transition">
                        <span>Lihat Kaos Polo Pique</span>
                        <span>→</span>
                    </div>
                </div>
            </a>
        </div>
    </div>
</section>

@endsection
