@extends('layouts.app')

@section('title', 'OEPRO - Official Store | Kaos Polos & Polo Pique Katun Murni')

@section('content')

{{-- HERO SECTION / BANNER SLIDER (NON-FULL WIDTH / BOXED, 100% OPACITY) --}}
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
                 class="relative min-h-[380px] sm:min-h-[460px] flex items-center">
                
                {{-- Banner Background / Image (Full Opacity 100%, No heavy dark blur) --}}
                @if($b->image_url)
                <img src="{{ $b->image_url }}" alt="{{ $b->title }}" class="absolute inset-0 w-full h-full object-cover">
                {{-- Subtle gradient overlay to keep text readable on left side --}}
                <div class="absolute inset-0 bg-gradient-to-r from-[#081F1C]/90 via-[#081F1C]/50 to-transparent"></div>
                @else
                <div class="absolute inset-0 bg-gradient-to-br from-[#133129] via-[#0E2824] to-[#081F1C]"></div>
                @endif

                <div class="relative z-10 px-6 sm:px-12 lg:px-16 py-12 sm:py-16 w-full">
                    <div class="max-w-xl space-y-4">
                        @if($b->tag)
                        <span class="inline-block text-[11px] font-black uppercase tracking-widest text-[#FCD34D] bg-[#081F1C]/70 border border-[#FCD34D]/30 px-3.5 py-1 rounded-full backdrop-blur-md">
                            {{ $b->tag }}
                        </span>
                        @endif
                        <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[#FCD34D]">
                            {{ $b->title ?? $b->headline }}
                        </h1>
                        @if($b->subheadline)
                        <p class="text-white text-sm sm:text-base leading-relaxed font-normal">
                            {{ $b->subheadline }}
                        </p>
                        @endif
                        <div class="pt-3 flex flex-wrap gap-3">
                            <a href="{{ url($b->cta_link ?? '/catalog') }}"
                               class="px-7 py-3 bg-[#FCD34D] hover:bg-white text-[#081F1C] font-extrabold rounded-full text-xs uppercase tracking-wider transition transform hover:scale-105 shadow-xl">
                                {{ $b->cta_text ?? 'Lihat Katalog' }} →
                            </a>
                            <a href="https://wa.me/6281313888927?text=Halo%20Admin%20OEPRO,%20saya%20ingin%20tanya%20produk%20dan%20harga"
                               target="_blank"
                               class="px-6 py-3 bg-[#081F1C]/80 hover:bg-[#133129] border border-white/30 text-white font-bold rounded-full text-xs uppercase tracking-wider backdrop-blur-md transition">
                                Chat Admin WA
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
                    <span class="inline-block text-[11px] font-black uppercase tracking-widest text-[#FCD34D] bg-[#081F1C]/70 px-3.5 py-1 rounded-full border border-[#FCD34D]/30">
                        OEPRO OFFICIAL STORE
                    </span>
                    <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[#FCD34D]">
                        100% Full Cotton Murni.<br><span class="text-white">Kenyamanan Berkelas.</span>
                    </h1>
                    <p class="text-white text-sm sm:text-base leading-relaxed">
                        Koleksi Kaos Polos Combed 24s Super Soft, Polo Pique Hexagon Premium, dan Longsleeve dengan standar jahitan rantai ekspor.
                    </p>
                    <div class="pt-3 flex gap-3">
                        <a href="{{ url('/catalog') }}" class="px-7 py-3.5 bg-[#FCD34D] hover:bg-white text-[#081F1C] font-extrabold rounded-full text-xs uppercase tracking-wider transition transform hover:scale-105 shadow-xl">
                            Belanja Sekarang →
                        </a>
                    </div>
                </div>
            </div>
        @endif
    </div>
</section>

{{-- SECTION: STANDAR MUTU OEPRO --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100">
        <div class="text-center max-w-xl mx-auto mb-8 space-y-1">
            <span class="text-[11px] font-extrabold uppercase tracking-widest text-[#133129]/60">STANDAR MUTU OEPRO</span>
            <h2 class="text-2xl sm:text-3xl font-black text-[#081F1C] tracking-tight">Dua Pilihan Material Katun Esensial</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {{-- Card 1: 100% Katun Combed 24s --}}
            <div class="bg-[#1A2E2B] rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 border border-white/10 shadow-md">
                <div class="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-[#081F1C] rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
                    <img src="/assets/brand/oepro-logo.webp" alt="100% Katun Combed 24s" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 text-center sm:text-left space-y-2">
                    <h3 class="text-lg font-black text-[#FCD34D]">1. 100% Katun Combed 24s</h3>
                    <p class="text-xs sm:text-sm text-gray-200 leading-relaxed font-light">
                        Terbuat dari 100% serat katun berkualitas, memiliki tekstur lembut, adem, nyaman menyerap keringat, dan cocok untuk penggunaan sehari-hari.
                    </p>
                    <a href="{{ url('/catalog?category=basic-t-shirt-24s') }}" class="inline-flex items-center gap-1 text-xs font-bold text-[#FCD34D] hover:underline pt-1">
                        <span>Lihat Kaos Combed 24s</span>
                        <span>→</span>
                    </a>
                </div>
            </div>

            {{-- Card 2: Pique Hexagon Premium --}}
            <div class="bg-[#1A2E2B] rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 border border-white/10 shadow-md">
                <div class="w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-[#081F1C] rounded-xl overflow-hidden flex items-center justify-center border border-white/10">
                    <img src="/assets/brand/oepro-logo.webp" alt="Pique Hexagon Premium" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 text-center sm:text-left space-y-2">
                    <h3 class="text-lg font-black text-[#FCD34D]">2. Pique Hexagon Premium</h3>
                    <p class="text-xs sm:text-sm text-gray-200 leading-relaxed font-light">
                        Kain bertekstur motif hexagon dengan tampilan elegan dan eksklusif. Memiliki karakteristik kuat, nyaman, serta memberikan kesan premium saat dikenakan.
                    </p>
                    <a href="{{ url('/catalog?category=kaos-polo') }}" class="inline-flex items-center gap-1 text-xs font-bold text-[#FCD34D] hover:underline pt-1">
                        <span>Lihat Kaos Polo Pique</span>
                        <span>→</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

{{-- 1. KOLEKSI PILIHAN (SLIDE KE SAMPING) --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <div class="flex items-center justify-between mb-6">
        <div>
            <h2 class="text-xl sm:text-2xl font-black text-[#FCD34D] tracking-tight">Koleksi Pilihan</h2>
            <p class="text-xs text-white/80 mt-1">Geser untuk melihat semua kategori katun murni OEPRO</p>
        </div>
        <a href="{{ url('/catalog') }}" class="text-xs font-bold text-[#FCD34D] hover:underline">Semua Kategori →</a>
    </div>

    {{-- Horizontal Scroll / Slider --}}
    <div class="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
        @foreach($categories as $cat)
        <a href="{{ url('/catalog?category=' . $cat->slug) }}" class="snap-start shrink-0 w-[240px] sm:w-[280px] group relative rounded-3xl p-6 sm:p-7 bg-[#0E2824] border border-[#A8C4B5]/15 hover:border-[#FCD34D]/60 hover:shadow-2xl transition-all flex flex-col justify-between">
            <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#FCD34D] bg-[#133129] px-2.5 py-1 rounded-full border border-[#FCD34D]/20">
                    {{ $cat->products_count }} Produk
                </span>
                <h3 class="text-lg font-black text-white mt-4 group-hover:text-[#FCD34D] transition-colors">
                    {{ $cat->name }}
                </h3>
                <p class="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                    {{ $cat->description ?? 'Bahan 100% katun murni dengan sentuhan premium.' }}
                </p>
            </div>
            <div class="mt-6 text-xs font-bold text-[#FCD34D] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Jelajahi Produk</span>
                <span>→</span>
            </div>
        </a>
        @endforeach
    </div>
</section>

{{-- 2. PRODUK TERLARIS (SLIDE KE SAMPING) --}}
@if($bestSellers->count() > 0)
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-[#A8C4B5]/10">
    <div class="flex items-center justify-between mb-6">
        <div>
            <div class="flex items-center gap-2">
                <span class="text-[#FCD34D] font-bold text-base">⭐</span>
                <h2 class="text-xl sm:text-2xl font-black text-[#FCD34D] tracking-tight">Produk Terlaris (Best Seller)</h2>
            </div>
            <p class="text-xs text-white/80 mt-1">Geser ke samping untuk melihat produk paling banyak dipesan</p>
        </div>
        <a href="{{ url('/catalog') }}" class="text-xs font-bold text-[#FCD34D] hover:underline">Lihat Semua →</a>
    </div>

    {{-- Horizontal Scroll / Slider --}}
    <div class="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
        @foreach($bestSellers as $prod)
        <div class="snap-start shrink-0 w-[170px] sm:w-[240px] md:w-[260px]">
            @include('partials.product-card', ['product' => $prod])
        </div>
        @endforeach
    </div>
</section>
@endif

{{-- 3. KOLEKSI TERBARU (SLIDE KE SAMPING) --}}
@if($newArrivals->count() > 0)
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-[#A8C4B5]/10">
    <div class="flex items-center justify-between mb-6">
        <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#081F1C] bg-[#FCD34D] px-2.5 py-0.5 rounded-full font-mono">NEW RELEASES</span>
            <h2 class="text-xl sm:text-2xl font-black text-[#FCD34D] tracking-tight mt-2">Koleksi Terbaru</h2>
        </div>
        <a href="{{ url('/catalog') }}" class="text-xs font-bold text-[#FCD34D] hover:underline">Lihat Semua →</a>
    </div>

    {{-- Horizontal Scroll / Slider --}}
    <div class="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
        @foreach($newArrivals as $prod)
        <div class="snap-start shrink-0 w-[170px] sm:w-[240px] md:w-[260px]">
            @include('partials.product-card', ['product' => $prod])
        </div>
        @endforeach
    </div>
</section>
@endif

{{-- FITUR KEUNGGULAN --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <div class="bg-[#0E2824] border border-[#A8C4B5]/20 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div class="max-w-2xl space-y-4 relative z-10">
            <span class="text-xs font-black uppercase tracking-widest text-[#FCD34D]">KUALITAS TANPA KOMPROMI</span>
            <h2 class="text-2xl sm:text-4xl font-black tracking-tight leading-snug text-[#FCD34D]">
                Kenapa Memilih OEPRO?
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-xs">
                <div class="space-y-1">
                    <strong class="text-white text-sm block">100% Full Cotton Murni</strong>
                    <p class="text-gray-300 leading-relaxed">Tanpa campuran polyester sintesis. Bahan bernapas bebas dan menyerap keringat seketika.</p>
                </div>
                <div class="space-y-1">
                    <strong class="text-white text-sm block">Kerah Anti-Melar 4 Lapis</strong>
                    <p class="text-gray-300 leading-relaxed">Rib kerah tebal dengan konstruksi double-knit tahan cuci berkali-kali tanpa melipat.</p>
                </div>
                <div class="space-y-1">
                    <strong class="text-white text-sm block">Jahitan Rantai Standar Ekspor</strong>
                    <p class="text-gray-300 leading-relaxed">Pundak dan sambungan dijahit rantai rapi dengan benang katun kuat standar ekspor.</p>
                </div>
                <div class="space-y-1">
                    <strong class="text-white text-sm block">Pewarnaan Reaktif Tidak Luntur</strong>
                    <p class="text-gray-300 leading-relaxed">Warna pekat, tajam, dan tidak mudah pudar meskipun dicuci rutin dalam jangka panjang.</p>
                </div>
            </div>
        </div>
    </div>
</section>

@endsection
