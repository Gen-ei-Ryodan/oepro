@php
    $thumb = $product->images->first()?->image_url ?? '/assets/brand/oepro-logo.webp';
@endphp

<div class="group bg-[#0E2824] rounded-2xl overflow-hidden border border-[#A8C4B5]/15 hover:border-[#D8B761]/60 hover:shadow-2xl transition-all flex flex-col h-full relative">
    <a href="{{ url('/product/' . $product->slug) }}" class="relative overflow-hidden aspect-square bg-[#081F1C] block">
        <img src="{{ $thumb }}" alt="{{ $product->name }}" loading="lazy"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
    </a>

    <div class="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#A8C4B5]/70 block mb-1">
                {{ $product->category->name ?? 'Kaos OEPRO' }}
            </span>
            <a href="{{ url('/product/' . $product->slug) }}" class="block">
                <h3 class="font-bold text-white text-xs sm:text-sm line-clamp-2 group-hover:text-[#D8B761] transition-colors leading-snug">
                    {{ $product->name }}
                </h3>
            </a>
        </div>

        <div class="mt-3 pt-2 border-t border-[#A8C4B5]/10 flex flex-col gap-2">
            <div class="flex items-baseline justify-between gap-1">
                <span class="font-black text-[#D8B761] font-mono text-xs sm:text-sm">
                    Rp {{ number_format($product->price, 0, ',', '.') }}
                </span>
                @if(!empty($product->original_price) && $product->original_price > $product->price)
                <span class="text-[10px] text-gray-500 line-through font-mono">
                    Rp {{ number_format($product->original_price, 0, ',', '.') }}
                </span>
                @endif
            </div>

            {{-- Tombol Tambah ke Keranjang --}}
            <button type="button"
                    @click.prevent.stop="$store.cart.add({
                        id: {{ $product->id }},
                        name: {{ json_encode($product->name) }},
                        price: {{ (float) $product->price }},
                        image: {{ json_encode($thumb) }},
                        size: '{{ $product->sizes[0] ?? 'L' }}',
                        color: '{{ $product->colors[0]['name'] ?? '' }}',
                        qty: 1
                    })"
                    class="w-full py-2 px-3 bg-[#133129] hover:bg-[#D8B761] text-[#D8B761] hover:text-[#081F1C] border border-[#D8B761]/30 hover:border-[#D8B761] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <span>+ Keranjang</span>
            </button>
        </div>
    </div>
</div>
