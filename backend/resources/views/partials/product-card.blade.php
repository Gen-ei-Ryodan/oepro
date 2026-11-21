@php
    $thumb = $product->images->first()?->image_url ?? '/assets/brand/oepro-logo.webp';
@endphp

<a href="{{ url('/product/' . $product->slug) }}" class="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-sage hover:shadow-xl transition-all block">
    <div class="relative overflow-hidden aspect-square bg-gray-50">
        <img src="{{ $thumb }}" alt="{{ $product->name }}"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">

        {{-- Badges --}}
        <div class="absolute top-2 left-2 flex flex-col gap-1">
            @if($product->is_best_seller)
            <span class="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">Best Seller</span>
            @endif
            @if($product->is_new_arrival)
            <span class="bg-sage text-primary text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">New</span>
            @endif
            @if(!empty($product->discount_percent) && $product->discount_percent > 0)
            <span class="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">-{{ $product->discount_percent }}%</span>
            @endif
        </div>
    </div>
    <div class="p-3 sm:p-4">
        <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
            {{ $product->category->name ?? 'Kaos OEPRO' }}
        </span>
        <h3 class="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {{ $product->name }}
        </h3>
        <div class="mt-2.5 flex items-baseline gap-2">
            <span class="font-black text-primary font-mono text-xs sm:text-sm">
                Rp {{ number_format($product->price, 0, ',', '.') }}
            </span>
            @if(!empty($product->original_price) && $product->original_price > $product->price)
            <span class="text-[10px] text-gray-400 line-through font-mono">
                Rp {{ number_format($product->original_price, 0, ',', '.') }}
            </span>
            @endif
        </div>
    </div>
</a>
