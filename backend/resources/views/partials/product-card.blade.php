@php
    $thumb = $product->images->first()?->image_url ?? '/assets/brand/oepro-logo.webp';
@endphp

<a href="{{ url('/product/' . $product->slug) }}" class="group bg-[#0E2824] rounded-2xl overflow-hidden border border-[#A8C4B5]/15 hover:border-[#A8C4B5]/60 hover:shadow-2xl transition-all block flex flex-col h-full">
    <div class="relative overflow-hidden aspect-square bg-[#081F1C]">
        <img src="{{ $thumb }}" alt="{{ $product->name }}" loading="lazy"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">

        {{-- Badges --}}
        <div class="absolute top-2 left-2 flex flex-col gap-1">
            @if($product->is_best_seller)
            <span class="bg-[#133129] border border-[#A8C4B5]/30 text-[#A8C4B5] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">Best Seller</span>
            @endif
            @if($product->is_new_arrival)
            <span class="bg-[#A8C4B5] text-[#081F1C] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">New</span>
            @endif
            @if(!empty($product->discount_percent) && $product->discount_percent > 0)
            <span class="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md">-{{ $product->discount_percent }}%</span>
            @endif
        </div>
    </div>
    <div class="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#A8C4B5]/70 block mb-1">
                {{ $product->category->name ?? 'Kaos OEPRO' }}
            </span>
            <h3 class="font-bold text-white text-xs sm:text-sm line-clamp-2 group-hover:text-[#A8C4B5] transition-colors leading-snug">
                {{ $product->name }}
            </h3>
        </div>
        <div class="mt-2.5 flex items-baseline gap-2">
            <span class="font-black text-[#A8C4B5] font-mono text-xs sm:text-sm">
                Rp {{ number_format($product->price, 0, ',', '.') }}
            </span>
            @if(!empty($product->original_price) && $product->original_price > $product->price)
            <span class="text-[10px] text-gray-500 line-through font-mono">
                Rp {{ number_format($product->original_price, 0, ',', '.') }}
            </span>
            @endif
        </div>
    </div>
</a>
