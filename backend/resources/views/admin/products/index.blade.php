@extends('layouts.admin')

@section('title', 'Katalog Produk - Admin OEPRO')
@section('page-title', 'Katalog Produk & Varian')

@section('header-actions')
<a href="{{ route('admin.produk.create') }}" class="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-dark text-white text-xs font-bold rounded-xl transition shadow-xs">
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
    </svg>
    <span>Tambah Produk Baru</span>
</a>
@endsection

@section('content')
<div class="space-y-6">

    {{-- Filter & Search --}}
    <div class="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <form method="GET" action="{{ route('admin.produk.index') }}" class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div class="relative flex-1 max-w-md">
                <input type="text" name="q" value="{{ request('q') }}" placeholder="Cari nama produk atau SKU..."
                       class="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:bg-white focus:border-primary focus:outline-hidden transition">
                <svg class="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
            </div>

            <div class="flex items-center gap-2">
                <select name="category_id" onchange="this.form.submit()" class="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-700 focus:outline-hidden">
                    <option value="">Semua Kategori</option>
                    @foreach($categories as $cat)
                    <option value="{{ $cat->id }}" {{ request('category_id') == $cat->id ? 'selected' : '' }}>{{ $cat->name }}</option>
                    @endforeach
                </select>
                <button type="submit" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold rounded-xl text-gray-800 transition">
                    Filter
                </button>
            </div>
        </form>
    </div>

    {{-- Table --}}
    <div class="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
                <thead>
                    <tr class="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        <th class="py-3 px-4">Produk</th>
                        <th class="py-3 px-4">Kategori</th>
                        <th class="py-3 px-4">Harga Jual</th>
                        <th class="py-3 px-4">Stok</th>
                        <th class="py-3 px-4">Status</th>
                        <th class="py-3 px-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($products as $prod)
                    @php
                        $thumb = $prod->images->first()?->image_url ?? '/assets/brand/oepro-logo.webp';
                    @endphp
                    <tr class="hover:bg-gray-50/80 transition">
                        {{-- Produk info --}}
                        <td class="py-3 px-4">
                            <div class="flex items-center gap-3">
                                <img src="{{ $thumb }}" alt="{{ $prod->name }}" class="w-12 h-14 object-cover rounded-lg bg-gray-100 border border-gray-200 shrink-0">
                                <div class="min-w-0 max-w-xs">
                                    <h4 class="font-bold text-gray-950 truncate text-xs">{{ $prod->name }}</h4>
                                    <span class="font-mono text-[10px] text-gray-400 block uppercase">{{ $prod->sku ?? '-' }}</span>
                                </div>
                            </div>
                        </td>

                        {{-- Kategori --}}
                        <td class="py-3 px-4 whitespace-nowrap">
                            <span class="text-[11px] font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                                {{ $prod->category->name ?? '-' }}
                            </span>
                        </td>

                        {{-- Harga --}}
                        <td class="py-3 px-4 whitespace-nowrap font-mono">
                            <span class="font-bold text-gray-950">Rp {{ number_format($prod->price, 0, ',', '.') }}</span>
                            @if(!empty($prod->original_price) && $prod->original_price > $prod->price)
                            <span class="text-[10px] text-gray-400 line-through block">Rp {{ number_format($prod->original_price, 0, ',', '.') }}</span>
                            @endif
                        </td>

                        {{-- Stok --}}
                        <td class="py-3 px-4 whitespace-nowrap">
                            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold {{ $prod->stock < 15 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800' }}">
                                {{ $prod->stock ?? 0 }} pcs
                            </span>
                        </td>

                        {{-- Status Badges --}}
                        <td class="py-3 px-4 whitespace-nowrap">
                            <div class="flex flex-col gap-1">
                                @if($prod->is_best_seller)
                                <span class="text-[9px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.2 rounded w-fit">BEST SELLER</span>
                                @endif
                                @if($prod->is_featured)
                                <span class="text-[9px] font-bold text-emerald-900 bg-emerald-100 px-1.5 py-0.2 rounded w-fit">FEATURED</span>
                                @endif
                                @if($prod->is_new_arrival)
                                <span class="text-[9px] font-bold text-blue-900 bg-blue-100 px-1.5 py-0.2 rounded w-fit">NEW</span>
                                @endif
                            </div>
                        </td>

                        {{-- Actions --}}
                        <td class="py-3 px-4 text-right whitespace-nowrap">
                            <div class="flex items-center justify-end gap-1.5">
                                <a href="{{ url('/product/' . $prod->slug) }}" target="_blank" title="Lihat di Web" class="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                    </svg>
                                </a>
                                <a href="{{ route('admin.produk.edit', $prod->id) }}" title="Edit Produk" class="p-1.5 text-gray-600 hover:text-gray-950 rounded-lg hover:bg-gray-100 transition font-bold">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                    </svg>
                                </a>
                                <form action="{{ route('admin.produk.destroy', $prod->id) }}" method="POST" onsubmit="return confirm('Yakin ingin menghapus produk ini selamanya?')" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" title="Hapus Produk" class="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition">
                                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="6" class="p-8 text-center text-gray-400">Belum ada produk yang cocok.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>

        @if($products->hasPages())
        <div class="p-4 border-t border-gray-200">
            {{ $products->links() }}
        </div>
        @endif
    </div>
</div>
@endsection
