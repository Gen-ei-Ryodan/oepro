@extends('layouts.app')

@section('title', 'Katalog Produk Lengkap - OEPRO Official Store')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">

    {{-- HEADER --}}
    <div class="space-y-2">
        <h1 class="text-3xl sm:text-4xl font-black text-[#FCD34D] tracking-tight">Katalog Produk</h1>
        <p class="text-xs sm:text-sm text-gray-300">Koleksi pakaian basic 100% katun murni untuk kenyamanan aktivitas Anda setiap hari.</p>
    </div>

    {{-- FILTER & SEARCH BAR --}}
    <div class="bg-[#0E2824] p-4 sm:p-6 rounded-3xl border border-[#A8C4B5]/20 shadow-xl space-y-4">
        <form method="GET" action="{{ url('/catalog') }}" class="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            
            {{-- Search Bar --}}
            <div class="relative flex-1 max-w-md">
                <input type="text" name="q" value="{{ request('q') }}" placeholder="Cari nama kaos, polo, warna, atau SKU..."
                       class="w-full pl-10 pr-4 py-2.5 text-xs bg-[#081F1C] border border-[#A8C4B5]/20 rounded-2xl text-white placeholder-gray-500 focus:bg-[#081F1C] focus:border-[#A8C4B5] focus:outline-hidden transition">
                <svg class="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </div>

            {{-- Sorting --}}
            <div class="flex items-center gap-2">
                @if(request('category'))
                <input type="hidden" name="category" value="{{ request('category') }}">
                @endif
                <select name="sort" onchange="this.form.submit()" class="text-xs bg-[#081F1C] border border-[#A8C4B5]/20 rounded-2xl px-3.5 py-2.5 text-gray-200 focus:outline-hidden font-medium">
                    <option value="newest" {{ request('sort') == 'newest' ? 'selected' : '' }}>Terbaru</option>
                    <option value="price_asc" {{ request('sort') == 'price_asc' ? 'selected' : '' }}>Harga: Terendah</option>
                    <option value="price_desc" {{ request('sort') == 'price_desc' ? 'selected' : '' }}>Harga: Tertinggi</option>
                    <option value="name_asc" {{ request('sort') == 'name_asc' ? 'selected' : '' }}>Nama A - Z</option>
                </select>
                <button type="submit" class="px-5 py-2.5 bg-[#A8C4B5] hover:bg-white text-[#081F1C] text-xs font-bold rounded-2xl transition">
                    Cari
                </button>
            </div>
        </form>

        {{-- Category Pills --}}
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-[#A8C4B5]/10">
            <a href="{{ url('/catalog' . (request('q') ? '?q=' . request('q') : '')) }}"
               class="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition {{ !request('category') ? 'bg-[#A8C4B5] text-[#081F1C] shadow-xs' : 'bg-[#133129] text-[#A8C4B5] hover:bg-[#163B35] hover:text-white' }}">
                Semua Produk
            </a>
            @foreach($categories as $cat)
            <a href="{{ url('/catalog?category=' . $cat->slug . (request('q') ? '&q=' . request('q') : '')) }}"
               class="px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition {{ request('category') == $cat->slug ? 'bg-[#A8C4B5] text-[#081F1C] shadow-xs' : 'bg-[#133129] text-[#A8C4B5] hover:bg-[#163B35] hover:text-white' }}">
                {{ $cat->name }} ({{ $cat->products_count }})
            </a>
            @endforeach
        </div>
    </div>

    {{-- PRODUCT GRID --}}
    @if($products->count() > 0)
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        @foreach($products as $prod)
            @include('partials.product-card', ['product' => $prod])
        @endforeach
    </div>

    {{-- PAGINATION --}}
    @if($products->hasPages())
    <div class="pt-8">
        {{ $products->links() }}
    </div>
    @endif

    @else
    <div class="p-16 text-center bg-[#0E2824] rounded-3xl border border-[#A8C4B5]/20 space-y-4">
        <span class="text-4xl">🔍</span>
        <h3 class="text-base font-bold text-white">Tidak ada produk yang cocok</h3>
        <p class="text-xs text-gray-400">Coba ubah kata kunci pencarian atau pilih kategori lain.</p>
        <a href="{{ url('/catalog') }}" class="inline-block px-5 py-2.5 bg-[#A8C4B5] text-[#081F1C] text-xs font-bold rounded-xl transition">
            Lihat Semua Produk
        </a>
    </div>
    @endif

</div>
@endsection
