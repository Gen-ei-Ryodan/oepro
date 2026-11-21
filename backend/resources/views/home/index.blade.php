@extends('layouts.app')

@section('title', 'OEPRO - Official Store | Kaos Polos & Polo Pique Katun Murni')

@section('content')

{{-- HERO SECTION / BANNER SLIDER --}}
<section class="relative bg-primary text-white overflow-hidden"
         x-data="{ active: 0, total: {{ count($banners) > 0 ? count($banners) : 1 }} }"
         x-init="if (total > 1) setInterval(() => active = (active + 1) % total, 6000)">
    
    @if(count($banners) > 0)
        @foreach($banners as $idx => $b)
        <div x-show="active === {{ $idx }}"
             x-transition:enter="transition ease-out duration-700"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100"
             class="relative min-h-[480px] sm:min-h-[560px] flex items-center">
            
            @if($b->image_url)
            <img src="{{ $b->image_url }}" alt="{{ $b->title }}" class="absolute inset-0 w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/60 to-transparent"></div>
            @else
            <div class="absolute inset-0 bg-gradient-to-br from-primary via-dark to-[#041210]"></div>
            @endif

            <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
                <div class="max-w-xl space-y-5">
                    @if($b->tag)
                    <span class="inline-block text-[11px] font-black uppercase tracking-widest text-sage bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
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
                           class="px-8 py-3.5 bg-sage hover:bg-white text-dark font-extrabold rounded-full text-xs uppercase tracking-wider transition transform hover:scale-105 shadow-xl">
                            {{ $b->cta_text ?? 'Lihat Katalog' }} →
                        </a>
                        <a href="https://wa.me/6281313888927?text=Halo%20Admin%20OEPRO,%20saya%20ingin%20tanya%20produk%20dan%20harga"
                           target="_blank"
                           class="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full text-xs uppercase tracking-wider backdrop-blur-xs transition">
                            Chat Admin WA
                        </a>
                    </div>
                </div>
            </div>
        </div>
        @endforeach
    @else
        {{-- Default Hero Fallback --}}
        <div class="relative min-h-[480px] sm:min-h-[560px] flex items-center bg-gradient-to-br from-primary via-dark to-[#041210]">
            <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full text-center">
                <div class="max-w-2xl mx-auto space-y-6">
                    <span class="inline-block text-[11px] font-black uppercase tracking-widest text-sage bg-white/10 px-3.5 py-1 rounded-full">
                        OEPRO OFFICIAL STORE
                    </span>
                    <h1 class="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-white">
                        100% Full Cotton Murni.<br><span class="text-sage">Kenyamanan Berkelas.</span>
                    </h1>
                    <p class="text-gray-300 text-sm sm:text-base leading-relaxed">
                        Koleksi Kaos Polos Combed 24s Super Soft, Polo Pique Hexagon Premium, dan Longsleeve dengan standar jahitan rantai ekspor.
                    </p>
                    <div class="pt-4 flex justify-center gap-4">
                        <a href="{{ url('/catalog') }}" class="px-8 py-4 bg-sage hover:bg-white text-dark font-extrabold rounded-full text-xs uppercase tracking-wider transition transform hover:scale-105 shadow-xl">
                            Belanja Sekarang →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    @endif
</section>

{{-- KATEGORI POPULER --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
    <div class="flex items-center justify-between mb-8">
        <div>
            <h2 class="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">Koleksi Pilihan</h2>
            <p class="text-xs text-gray-500 mt-1">Pilih kategori katun sesuai kebutuhan gaya dan aktivitas Anda</p>
        </div>
        <a href="{{ url('/catalog') }}" class="text-xs font-bold text-primary hover:underline">Semua Kategori →</a>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        @foreach($categories as $cat)
        <a href="{{ url('/catalog?category=' . $cat->slug) }}" class="group relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-white to-gray-50 border border-gray-100 hover:border-sage hover:shadow-xl transition-all">
            <span class="text-[10px] font-bold uppercase tracking-wider text-sage bg-primary px-2.5 py-1 rounded-full">
                {{ $cat->products_count }} Produk
            </span>
            <h3 class="text-lg font-black text-gray-900 mt-4 group-hover:text-primary transition-colors">
                {{ $cat->name }}
            </h3>
            <p class="text-xs text-gray-500 mt-1 line-clamp-2">
                {{ $cat->description ?? 'Bahan 100% katun murni dengan sentuhan premium.' }}
            </p>
            <div class="mt-4 text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Jelajahi</span>
                <span>→</span>
            </div>
        </a>
        @endforeach
    </div>
</section>

{{-- BEST SELLER PRODUCTS --}}
@if($bestSellers->count() > 0)
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-gray-100">
    <div class="flex items-center justify-between mb-8">
        <div>
            <div class="flex items-center gap-2">
                <span class="text-amber-500 font-bold text-sm">⭐</span>
                <h2 class="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">Produk Terlaris (Best Seller)</h2>
            </div>
            <p class="text-xs text-gray-500 mt-1">Pilihan favorit ribuan pelanggan OEPRO di seluruh Indonesia</p>
        </div>
        <a href="{{ url('/catalog') }}" class="text-xs font-bold text-primary hover:underline">Lihat Semua →</a>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        @foreach($bestSellers as $prod)
            @include('partials.product-card', ['product' => $prod])
        @endforeach
    </div>
</section>
@endif

{{-- NEW ARRIVALS --}}
@if($newArrivals->count() > 0)
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-t border-gray-100">
    <div class="flex items-center justify-between mb-8">
        <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-sage bg-primary px-2 py-0.5 rounded-full">Koleksi Baru</span>
            <h2 class="text-xl sm:text-2xl font-black text-gray-950 tracking-tight mt-2">Koleksi Terbaru</h2>
        </div>
        <a href="{{ url('/catalog') }}" class="text-xs font-bold text-primary hover:underline">Lihat Semua →</a>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        @foreach($newArrivals as $prod)
            @include('partials.product-card', ['product' => $prod])
        @endforeach
    </div>
</section>
@endif

{{-- FITUR KEUNGGULAN --}}
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
    <div class="bg-primary text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
        <div class="max-w-2xl space-y-4 relative z-10">
            <span class="text-xs font-black uppercase tracking-widest text-sage">KUALITAS TANPA KOMPROMI</span>
            <h2 class="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                Kenapa Memilih OEPRO?
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-xs">
                <div class="space-y-1">
                    <strong class="text-sage text-sm block">100% Full Cotton Murni</strong>
                    <p class="text-gray-300 leading-relaxed">Tanpa campuran polyester sintesis. Bahan bernapas bebas dan menyerap keringat seketika.</p>
                </div>
                <div class="space-y-1">
                    <strong class="text-sage text-sm block">Kerah Anti-Melar 4 Lapis</strong>
                    <p class="text-gray-300 leading-relaxed">Rib kerah tebal dengan konstruksi double-knit tahan cuci berkali-kali tanpa melipat.</p>
                </div>
                <div class="space-y-1">
                    <strong class="text-sage text-sm block">Jahitan Rantai Standar Ekspor</strong>
                    <p class="text-gray-300 leading-relaxed">Pundak dan sambungan dijahit rantai rapi dengan benang katun kuat standar ekspor.</p>
                </div>
                <div class="space-y-1">
                    <strong class="text-sage text-sm block">Pewarnaan Reaktif Tidak Luntur</strong>
                    <p class="text-gray-300 leading-relaxed">Warna pekat, tajam, dan tidak mudah pudar meskipun dicuci rutin dalam jangka panjang.</p>
                </div>
            </div>
        </div>
    </div>
</section>

@endsection
