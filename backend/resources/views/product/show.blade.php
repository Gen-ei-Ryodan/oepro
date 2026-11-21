@extends('layouts.app')

@section('title', $product->name . ' - OEPRO Official Store')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
     x-data="productDetail({
         name: {{ json_encode($product->name) }},
         basePrice: {{ (float) $product->price }},
         origPrice: {{ (float) ($product->original_price ?? $product->price) }},
         category: {{ json_encode(strtolower($product->category->name ?? '')) }},
         waNumber: '6281313888927',
         sizes: {{ json_encode($product->sizes ?? ['S', 'M', 'L', 'XL', '2XL']) }},
         colors: {{ json_encode($product->colors ?? []) }},
         variants: {{ json_encode($product->variants_data ?? []) }}
     })">

    {{-- Breadcrumbs --}}
    <nav class="flex items-center text-xs md:text-sm text-gray-400 mb-6 gap-2">
        <a href="{{ url('/') }}" class="hover:text-[#A8C4B5] transition">Beranda</a>
        <span>/</span>
        <a href="{{ url('/catalog') }}" class="hover:text-[#A8C4B5] transition">Katalog</a>
        @if($product->category)
        <span>/</span>
        <a href="{{ url('/catalog?category=' . $product->category->slug) }}" class="hover:text-[#A8C4B5] transition">{{ $product->category->name }}</a>
        @endif
        <span>/</span>
        <span class="text-white font-medium truncate max-w-xs">{{ $product->name }}</span>
    </nav>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {{-- FOTO PRODUK (Gallery) --}}
        <div class="lg:col-span-6 space-y-4">
            @php
                $images = $product->images;
                $defaultImg = $images->first()?->image_url ?? '/assets/brand/oepro-logo.webp';
            @endphp
            
            {{-- Main Image Viewer --}}
            <div class="relative aspect-square rounded-3xl overflow-hidden bg-[#0E2824] border border-[#A8C4B5]/20 shadow-2xl">
                <img src="{{ $defaultImg }}" :src="currentImage" alt="{{ $product->name }}" class="w-full h-full object-cover transition-all duration-300">
                
                @if($product->discount_percent > 0)
                <span class="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                    HEMAT {{ $product->discount_percent }}%
                </span>
                @endif
                
                @if($product->is_best_seller)
                <span class="absolute top-4 right-4 bg-[#133129] border border-[#A8C4B5]/40 text-[#A8C4B5] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    ⭐ BEST SELLER
                </span>
                @endif
            </div>

            {{-- Thumbnail Selector --}}
            @if($images->count() > 1)
            <div class="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                @foreach($images as $img)
                <button type="button"
                        @click="currentImage = '{{ $img->image_url }}'"
                        :class="currentImage === '{{ $img->image_url }}' ? 'border-[#A8C4B5] ring-2 ring-[#A8C4B5]/40 scale-95' : 'border-[#A8C4B5]/20 opacity-60 hover:opacity-100'"
                        class="w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition bg-[#0E2824]">
                    <img src="{{ $img->image_url }}" alt="Thumbnail" class="w-full h-full object-cover">
                </button>
                @endforeach
            </div>
            @endif
        </div>

        {{-- INFO & ORDER PEMESANAN --}}
        <div class="lg:col-span-6 space-y-6">
            {{-- Category & SKU --}}
            <div class="flex items-center justify-between text-xs text-gray-400 font-mono">
                <span class="bg-[#133129] text-[#A8C4B5] border border-[#A8C4B5]/20 px-3 py-1 rounded-lg font-sans font-medium text-xs">
                    {{ $product->category->name ?? 'Kaos OEPRO' }}
                </span>
                <span>SKU: {{ $product->sku ?? '-' }}</span>
            </div>

            {{-- Title --}}
            <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                {{ $product->name }}
            </h1>

            {{-- Price Display --}}
            <div class="p-5 bg-[#0E2824] rounded-2xl border border-[#A8C4B5]/20 flex items-baseline gap-3 shadow-inner">
                <span class="text-3xl font-black text-[#A8C4B5] font-mono tracking-tight" x-text="formatRupiah(currentUnitPrice)">
                    Rp {{ number_format($product->price, 0, ',', '.') }}
                </span>
                <template x-if="currentOrigPrice > currentUnitPrice">
                    <span class="text-base text-gray-500 line-through font-mono" x-text="formatRupiah(currentOrigPrice)">
                        Rp {{ number_format($product->original_price ?? 0, 0, ',', '.') }}
                    </span>
                </template>
            </div>

            {{-- PILIHAN WARNA (Jika ada) --}}
            <template x-if="colors && colors.length > 0">
                <div class="space-y-3">
                    <label class="block text-xs font-bold uppercase tracking-wider text-gray-300">
                        Warna: <span class="text-[#A8C4B5] font-bold" x-text="selectedColor"></span>
                    </label>
                    <div class="flex flex-wrap gap-2 max-h-48 overflow-y-auto no-scrollbar">
                        <template x-for="c in colors" :key="c.name">
                            <button type="button"
                                    @click="selectedColor = c.name"
                                    :class="selectedColor === c.name ? 'border-[#A8C4B5] bg-[#A8C4B5] text-[#081F1C] shadow-md' : 'border-[#A8C4B5]/20 bg-[#0E2824] text-gray-300 hover:border-[#A8C4B5]/50'"
                                    class="px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-2">
                                <span class="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" :style="'background-color: ' + (c.hex || '#1D1D1D')"></span>
                                <span x-text="c.name"></span>
                            </button>
                        </template>
                    </div>
                </div>
            </template>

            {{-- PILIHAN UKURAN --}}
            <div class="space-y-3">
                <div class="flex items-center justify-between">
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-300">
                        Pilih Ukuran: <span class="text-[#A8C4B5] font-bold font-mono" x-text="selectedSize"></span>
                    </label>
                    <span class="text-[11px] text-gray-400 font-medium">Ukuran standar lokal unisex</span>
                </div>
                <div class="flex flex-wrap gap-2">
                    <template x-for="sz in sizes" :key="sz">
                        <button type="button"
                                @click="selectSize(sz)"
                                :class="selectedSize === sz ? 'bg-[#A8C4B5] text-[#081F1C] border-[#A8C4B5] shadow-lg font-black' : 'bg-[#0E2824] text-gray-300 border-[#A8C4B5]/20 hover:border-[#A8C4B5]/60'"
                                class="min-w-[46px] h-10 px-3.5 rounded-xl border text-xs font-bold font-mono transition flex items-center justify-center">
                            <span x-text="sz"></span>
                        </button>
                    </template>
                </div>
            </div>

            {{-- JUMLAH (QTY) & TOTAL --}}
            <div class="flex items-center justify-between gap-4 pt-2">
                <div class="space-y-1">
                    <label class="block text-xs font-bold uppercase tracking-wider text-gray-300">Jumlah</label>
                    <div class="flex items-center border border-[#A8C4B5]/20 rounded-xl bg-[#0E2824] overflow-hidden w-fit">
                        <button type="button" @click="qty = Math.max(1, qty - 1)" class="px-3.5 py-2 text-gray-300 hover:bg-[#133129] font-bold transition">−</button>
                        <span class="px-4 py-2 font-mono font-bold text-sm min-w-[40px] text-center text-white" x-text="qty">1</span>
                        <button type="button" @click="qty = qty + 1" class="px-3.5 py-2 text-gray-300 hover:bg-[#133129] font-bold transition">+</button>
                    </div>
                </div>

                <div class="text-right">
                    <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Total Estimasi</span>
                    <span class="text-2xl font-black text-[#A8C4B5] font-mono" x-text="formatRupiah(currentUnitPrice * qty)"></span>
                </div>
            </div>

            {{-- TOMBOL UTAMA PESAN VIA WHATSAPP --}}
            <div class="pt-2">
                <a :href="getWaLink()"
                   target="_blank"
                   rel="noopener noreferrer"
                   class="w-full py-4 px-6 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-2xl shadow-xl shadow-[#25D366]/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 text-base">
                    <svg class="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.152.569 4.17 1.564 5.917l-1.664 6.083 6.223-1.633c1.7 1.002 3.69 1.573 5.823 1.573 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
                    </svg>
                    <span>Beli Sekarang via WhatsApp</span>
                </a>
                <p class="text-center text-[11px] text-gray-400 mt-2">
                    Fast response langsung terhubung dengan Customer Service OEPRO
                </p>
            </div>

            {{-- SPESIFIKASI & DETAIL BAHAN --}}
            <div class="border-t border-[#A8C4B5]/15 pt-6 space-y-4">
                <h3 class="text-sm font-bold uppercase tracking-wider text-white">Spesifikasi Produk</h3>
                <dl class="grid grid-cols-2 gap-3 text-xs">
                    <div class="p-3 bg-[#0E2824] border border-[#A8C4B5]/15 rounded-xl">
                        <dt class="text-gray-400 font-medium">Bahan / Material</dt>
                        <dd class="text-white font-semibold mt-0.5">{{ $product->material ?? '100% Cotton 24s' }}</dd>
                    </div>
                    <div class="p-3 bg-[#0E2824] border border-[#A8C4B5]/15 rounded-xl">
                        <dt class="text-gray-400 font-medium">Fitting / Potongan</dt>
                        <dd class="text-white font-semibold mt-0.5">{{ $product->fit ?? 'Regular Fit Unisex' }}</dd>
                    </div>
                </dl>
            </div>

            {{-- DESKRIPSI --}}
            @if($product->description)
            <div class="border-t border-[#A8C4B5]/15 pt-6 space-y-3">
                <h3 class="text-sm font-bold uppercase tracking-wider text-white">Deskripsi</h3>
                <div class="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                    {{ $product->description }}
                </div>
            </div>
            @endif

            {{-- FITUR UNGGULAN --}}
            @if(!empty($product->features) && is_array($product->features))
            <div class="border-t border-[#A8C4B5]/15 pt-6 space-y-3">
                <h3 class="text-sm font-bold uppercase tracking-wider text-white">Keunggulan OEPRO</h3>
                <ul class="space-y-2">
                    @foreach($product->features as $feat)
                    <li class="flex items-start gap-2 text-xs text-gray-300">
                        <span class="text-[#A8C4B5] font-bold shrink-0">✓</span>
                        <span>{{ $feat }}</span>
                    </li>
                    @endforeach
                </ul>
            </div>
            @endif
        </div>
    </div>

    {{-- PRODUK TERKAIT (SLIDER HORIZONTAL) --}}
    @if(isset($relatedProducts) && $relatedProducts->count() > 0)
    <div class="mt-16 sm:mt-24 border-t border-[#A8C4B5]/15 pt-12">
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">Koleksi Terkait</h2>
            <a href="{{ url('/catalog') }}" class="text-xs font-bold text-[#A8C4B5] hover:underline">Lihat Semua →</a>
        </div>
        <div class="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar snap-x">
            @foreach($relatedProducts as $rel)
            <div class="snap-start shrink-0 w-[180px] sm:w-[240px]">
                @include('partials.product-card', ['product' => $rel])
            </div>
            @endforeach
        </div>
    </div>
    @endif
</div>

@push('scripts')
<script>
function productDetail(config) {
    return {
        currentImage: '{{ $defaultImg }}',
        name: config.name,
        basePrice: config.basePrice,
        origPrice: config.origPrice,
        category: config.category,
        waNumber: config.waNumber,
        sizes: config.sizes,
        colors: config.colors,
        variants: config.variants || [],
        selectedSize: config.sizes && config.sizes.length > 0 ? config.sizes[0] : 'L',
        selectedColor: config.colors && config.colors.length > 0 ? config.colors[0].name : '',
        qty: 1,
        currentUnitPrice: config.basePrice,
        currentOrigPrice: config.origPrice,

        init() {
            this.recalcPrice();
        },

        selectSize(sz) {
            this.selectedSize = sz;
            this.recalcPrice();
        },

        recalcPrice() {
            const sz = (this.selectedSize || '').toUpperCase().trim();
            
            // 1. Cek if defined in specific product variants
            if (this.variants && this.variants.length > 0) {
                const found = this.variants.find(v => (v.name || '').toUpperCase().trim() === sz);
                if (found && found.price) {
                    this.currentUnitPrice = Number(found.price);
                    this.currentOrigPrice = Number(found.original_price || found.price);
                    return;
                }
            }

            // 2. Default tiered prices
            const cat = this.category || '';
            const poloTiers = {
                'XS': [92000, 119000], 'S': [92000, 119000], 'M': [92000, 119000], 'L': [92000, 119000], 'XL': [92000, 119000],
                '2XL': [100000, 125000], '3XL': [108000, 135000], '4XL': [116000, 145000], '5XL': [124000, 155000],
                '6XL': [132000, 165000], '7XL': [140000, 175000], '8XL': [148000, 185000]
            };
            const lsTiers = {
                'XS': [72000, 89000], 'S': [72000, 89000], 'M': [72000, 89000], 'L': [72000, 89000], 'XL': [72000, 89000],
                '2XL': [79000, 98000], '3XL': [86000, 107000], '4XL': [93000, 116000], '5XL': [100000, 125000],
                '6XL': [107000, 134000], '7XL': [114000, 143000], '8XL': [121000, 151000]
            };
            const tsTiers = {
                'XS': [62000, 79000], 'S': [62000, 79000], 'M': [62000, 79000], 'L': [62000, 79000], 'XL': [62000, 79000],
                '2XL': [67000, 85000], '3XL': [72000, 90000], '4XL': [77000, 96000], '5XL': [82000, 103000],
                '6XL': [87000, 109000], '7XL': [92000, 115000], '8XL': [97000, 121000]
            };

            let table = tsTiers;
            if (cat.includes('polo')) table = poloTiers;
            else if (cat.includes('longsleeve') || cat.includes('lengan panjang')) table = lsTiers;

            if (table[sz]) {
                this.currentUnitPrice = table[sz][0];
                this.currentOrigPrice = table[sz][1];
            } else {
                this.currentUnitPrice = this.basePrice;
                this.currentOrigPrice = this.origPrice;
            }
        },

        formatRupiah(num) {
            return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
        },

        getWaLink() {
            let text = `Halo Admin OEPRO, saya ingin memesan produk:\n\n`;
            text += `*${this.name}*\n`;
            if (this.selectedColor) {
                text += `- Warna: ${this.selectedColor}\n`;
            }
            text += `- Ukuran: ${this.selectedSize}\n`;
            text += `- Jumlah: ${this.qty} pcs\n`;
            text += `- Harga: ${this.formatRupiah(this.currentUnitPrice)} / pcs\n`;
            text += `- Total Estimasi: ${this.formatRupiah(this.currentUnitPrice * this.qty)}\n\n`;
            text += `Apakah varian ini ready stok? Mohon info kelanjutan pemesanannya ya. Terima kasih!`;

            return `https://wa.me/${this.waNumber}?text=${encodeURIComponent(text)}`;
        }
    };
}
</script>
@endpush
@endsection
