@extends('layouts.app')

@section('title', 'OEPRO - Official Store | Kaos Polos & Polo Pique Katun Murni')

@section('content')

{{-- HERO SECTION / BANNER SLIDER --}}
<section class="relative bg-[#081F1C] text-white overflow-hidden"
         x-data="{ active: 0, total: {{ count($banners) > 0 ? count($banners) : 1 }} }"
         x-init="if (total > 1) setInterval(() => active = (active + 1) % total, 6000)">
    
    @if(count($banners) > 0)
        @foreach($banners as $idx => $b)
        <div x-show="active === {{ $idx }}"
             x-transition:enter="transition ease-out duration-700"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100"
             class="relative min-h-[460px] sm:min-h-[540px] flex items-center">
            
            @if($b->image_url)
            <img src="{{ $b->image_url }}" alt="{{ $b->title }}" class="absolute inset-0 w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-r from-[#081F1C]/95 via-[#081F1C]/75 to-[#081F1C]/30"></div>
            @else
            <div class="absolute inset-0 bg-gradient-to-br from-[#133129] via-[#081F1C] to-[#041210]"></div>
            @endif

            <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
                <div class="max-w-xl space-y-5">
                    @if($b->tag)
                    <span class="inline-block text-[11px] font-black uppercase tracking-widest text-[#A8C4B5] bg-[#133129]/80 border border-[#A8C4B5]/30 px-3.5 py-1 rounded-full backdrop-blur-md">
                        {{ $b->tag }}
                    </span>
                    @endif
                    <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                        {{ $b->title ?? $b->headline }}
                    </h1>
                    @if($b->subheadline)
                    <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
                        {{ $b->subheadline }}
                    </p>
                    @endif
                    <div class="pt-4 flex flex-wrap gap-4">
                        <a href="{{ url($b->cta_link ?? '/catalog') }}"
                           class="px-8 py-3.5 bg-[#A8C4B5] hover:bg-white text-[#081F1C] font-extrabold rounded-full text-xs uppercase tracking-wider transition transform hover:scale-105 shadow-xl">
                            {{ $b->cta_text ?? 'Lihat Katalog' }} →
                        </a>
                        <a href="https://wa.me/6281313888927?text=Halo%20Admin%20OEPRO,%20saya%20ingin%20tanya%20produk%20dan%20harga"
                           target="_blank"
                           class="px-6 py-3.5 bg-[#133129]/80 hover:bg-[#133129] border border-[#A8C4B5]/30 text-white font-bold rounded-full text-xs uppercase tracking-wider backdrop-blur-md transition">
                            Chat Admin WA
                        </a>
                    </div>
                </div>
            </div>
        </div>
        @endforeach
    @else
        {{-- Default Hero Fallback --}}
        <div class="relative min-h-[460px] sm:min-h-[540px] flex items-center bg-gradient-to-br from-[#133129] via-[#081F1C] to-[#041210]">
            <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center">
                <div class="max-w-2xl mx-auto space-y-6">
                    <span class="inline-block text-[11px] font-black uppercase tracking-widest text-[#A8C4B5] bg-white/10 px-3.5 py-1 rounded-full">
                        OEPRO OFFICIAL STORE
                    </span>
                    <h1 class="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
                        100% Full Cotton Murni.<br><span class="text-[#A8C4B5]">Kenyamanan Berkelas.</span>
                    </h1>
                    <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
                        Koleksi Kaos Polos Combed 24s Super Soft, Polo Pique Hexagon Premium, dan Longsleeve dengan standar jahitan rantai ekspor.
                    </p>
                    <div class="pt-4 flex justify-center gap-4">
                        <a href="{{ url('/catalog') }}" class="px-8 py-4 bg-[#A8C4B5] hover:bg-white text-[#081F1C] font-extrabold rounded-full text-xs uppercase tracking-wider transition transform hover:scale-105 shadow-xl">
                            Belanja Sekarang →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    @endif
</section>

{{-- 1. KOLEKSI PILIHAN (SLIDE KE SAMPING) --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <div class="flex items-center justify-between mb-6">
        <div>
            <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">Koleksi Pilihan</h2>
            <p class="text-xs text-gray-400 mt-1">Geser untuk melihat semua kategori katun murni OEPRO</p>
        </div>
        <a href="{{ url('/catalog') }}" class="text-xs font-bold text-[#A8C4B5] hover:underline">Semua Kategori →</a>
    </div>

    {{-- Horizontal Scroll / Slider --}}
    <div class="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
        @foreach($categories as $cat)
        <a href="{{ url('/catalog?category=' . $cat->slug) }}" class="snap-start shrink-0 w-[240px] sm:w-[280px] group relative rounded-3xl p-6 sm:p-7 bg-[#0E2824] border border-[#A8C4B5]/15 hover:border-[#A8C4B5]/60 hover:shadow-2xl transition-all flex flex-col justify-between">
            <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#A8C4B5] bg-[#133129] px-2.5 py-1 rounded-full border border-[#A8C4B5]/20">
                    {{ $cat->products_count }} Produk
                </span>
                <h3 class="text-lg font-black text-white mt-4 group-hover:text-[#A8C4B5] transition-colors">
                    {{ $cat->name }}
                </h3>
                <p class="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                    {{ $cat->description ?? 'Bahan 100% katun murni dengan sentuhan premium.' }}
                </p>
            </div>
            <div class="mt-6 text-xs font-bold text-[#A8C4B5] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Jelajahi Produk</span>
                <span>→</span>
            </div>
        </a>
        @endforeach
    </div>
</section>

{{-- 2. PRODUK TERLARIS (SLIDE KE SAMPING) --}}
@if($bestSellers->count() > 0)
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-[#A8C4B5]/10">
    <div class="flex items-center justify-between mb-6">
        <div>
            <div class="flex items-center gap-2">
                <span class="text-amber-400 font-bold text-sm">⭐</span>
                <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">Produk Terlaris (Best Seller)</h2>
            </div>
            <p class="text-xs text-gray-400 mt-1">Geser ke samping untuk melihat produk paling banyak dipesan</p>
        </div>
        <a href="{{ url('/catalog') }}" class="text-xs font-bold text-[#A8C4B5] hover:underline">Lihat Semua →</a>
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
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-[#A8C4B5]/10">
    <div class="flex items-center justify-between mb-6">
        <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#081F1C] bg-[#A8C4B5] px-2.5 py-0.5 rounded-full font-mono">NEW RELEASES</span>
            <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight mt-2">Koleksi Terbaru</h2>
        </div>
        <a href="{{ url('/catalog') }}" class="text-xs font-bold text-[#A8C4B5] hover:underline">Lihat Semua →</a>
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
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
    <div class="bg-[#0E2824] border border-[#A8C4B5]/20 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div class="max-w-2xl space-y-4 relative z-10">
            <span class="text-xs font-black uppercase tracking-widest text-[#A8C4B5]">KUALITAS TANPA KOMPROMI</span>
            <h2 class="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                Kenapa Memilih OEPRO?
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-xs">
                <div class="space-y-1">
                    <strong class="text-[#A8C4B5] text-sm block">100% Full Cotton Murni</strong>
                    <p class="text-gray-300 leading-relaxed">Tanpa campuran polyester sintesis. Bahan bernapas bebas dan menyerap keringat seketika.</p>
                </div>
                <div class="space-y-1">
                    <strong class="text-[#A8C4B5] text-sm block">Kerah Anti-Melar 4 Lapis</strong>
                    <p class="text-gray-300 leading-relaxed">Rib kerah tebal dengan konstruksi double-knit tahan cuci berkali-kali tanpa melipat.</p>
                </div>
                <div class="space-y-1">
                    <strong class="text-[#A8C4B5] text-sm block">Jahitan Rantai Standar Ekspor</strong>
                    <p class="text-gray-300 leading-relaxed">Pundak dan sambungan dijahit rantai rapi dengan benang katun kuat standar ekspor.</p>
                </div>
                <div class="space-y-1">
                    <strong class="text-[#A8C4B5] text-sm block">Pewarnaan Reaktif Tidak Luntur</strong>
                    <p class="text-gray-300 leading-relaxed">Warna pekat, tajam, dan tidak mudah pudar meskipun dicuci rutin dalam jangka panjang.</p>
                </div>
            </div>
        </div>
    </div>
</section>

@endsection
