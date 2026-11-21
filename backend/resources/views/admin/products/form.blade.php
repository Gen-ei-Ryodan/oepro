@extends('layouts.admin')

@php
    $isEdit = isset($product);
@endphp

@section('title', $isEdit ? 'Edit Produk - OEPRO' : 'Tambah Produk Baru - OEPRO')
@section('page-title', $isEdit ? 'Edit Produk: ' . $product->name : 'Tambah Produk Baru')

@section('header-actions')
<a href="{{ route('admin.produk.index') }}" class="px-3.5 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition">
    ← Kembali ke Daftar
</a>
@endsection

@section('content')
<form action="{{ $isEdit ? route('admin.produk.update', $product->id) : route('admin.produk.store') }}"
      method="POST"
      enctype="multipart/form-data"
      class="space-y-8 max-w-5xl">
    @csrf
    @if($isEdit)
        @method('PUT')
    @endif

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {{-- KOLOM UTAMA (2 Kolom) --}}
        <div class="lg:col-span-2 space-y-6">
            
            {{-- INFORMASI DASAR --}}
            <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Informasi Dasar</h3>
                
                <div class="space-y-1">
                    <label class="block text-xs font-bold text-gray-700">Nama Produk <span class="text-red-500">*</span></label>
                    <input type="text" name="name" value="{{ old('name', $product->name ?? '') }}" required
                           placeholder="Contoh: Kaos Polo Pique Hexagon - Black Stone"
                           class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-1">
                        <label class="block text-xs font-bold text-gray-700">Kategori <span class="text-red-500">*</span></label>
                        <select name="category_id" required class="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden">
                            <option value="">Pilih Kategori...</option>
                            @foreach($categories as $cat)
                            <option value="{{ $cat->id }}" {{ (old('category_id', $product->category_id ?? '') == $cat->id) ? 'selected' : '' }}>
                                {{ $cat->name }}
                            </option>
                            @endforeach
                        </select>
                    </div>

                    <div class="space-y-1">
                        <label class="block text-xs font-bold text-gray-700">SKU / Kode Barang</label>
                        <input type="text" name="sku" value="{{ old('sku', $product->sku ?? '') }}"
                               placeholder="Contoh: OEP-POLO-BLK"
                               class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden font-mono">
                    </div>
                </div>

                <div class="space-y-1">
                    <label class="block text-xs font-bold text-gray-700">Deskripsi Lengkap</label>
                    <textarea name="description" rows="5" placeholder="Tuliskan deskripsi detail produk..."
                              class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden leading-relaxed">{{ old('description', $product->description ?? '') }}</textarea>
                </div>
            </div>

            {{-- HARGA & STOK --}}
            <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Harga & Stok</h3>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="space-y-1">
                        <label class="block text-xs font-bold text-gray-700">Harga Jual (Rp) <span class="text-red-500">*</span></label>
                        <input type="number" name="price" value="{{ old('price', $product->price ?? '') }}" required min="0" step="500"
                               placeholder="92000"
                               class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden font-mono font-bold text-primary">
                    </div>

                    <div class="space-y-1">
                        <label class="block text-xs font-bold text-gray-700">Harga Asli Coret (Rp)</label>
                        <input type="number" name="original_price" value="{{ old('original_price', $product->original_price ?? '') }}" min="0" step="500"
                               placeholder="119000"
                               class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden font-mono">
                    </div>

                    <div class="space-y-1">
                        <label class="block text-xs font-bold text-gray-700">Total Stok</label>
                        <input type="number" name="stock" value="{{ old('stock', $product->stock ?? 50) }}" min="0"
                               placeholder="50"
                               class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden font-mono">
                    </div>
                </div>
            </div>

            {{-- SPESIFIKASI & VARIAN --}}
            <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Spesifikasi & Pilihan Ukuran</h3>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-1">
                        <label class="block text-xs font-bold text-gray-700">Bahan / Material</label>
                        <input type="text" name="material" value="{{ old('material', $product->material ?? '') }}"
                               placeholder="Contoh: 100% Cotton Pique Hexagon (220 GSM)"
                               class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden">
                    </div>

                    <div class="space-y-1">
                        <label class="block text-xs font-bold text-gray-700">Fitting / Potongan</label>
                        <input type="text" name="fit" value="{{ old('fit', $product->fit ?? 'Regular Fit Unisex') }}"
                               placeholder="Contoh: Regular Fit Unisex"
                               class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden">
                    </div>
                </div>

                <div class="space-y-1">
                    <label class="block text-xs font-bold text-gray-700">Pilihan Ukuran (Pisahkan dengan koma)</label>
                    @php
                        $sizesVal = isset($product->sizes) && is_array($product->sizes) ? implode(', ', $product->sizes) : 'S, M, L, XL, 2XL, 3XL, 4XL, 5XL, 6XL, 7XL, 8XL';
                    @endphp
                    <input type="text" name="sizes_raw" value="{{ old('sizes_raw', $sizesVal) }}"
                           placeholder="S, M, L, XL, 2XL, 3XL, 4XL, 5XL, 6XL, 7XL, 8XL"
                           class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden font-mono">
                    <span class="text-[10px] text-gray-400 block">Contoh: S, M, L, XL, 2XL, 3XL, 4XL, 5XL, 6XL, 7XL, 8XL</span>
                </div>

                <div class="space-y-1">
                    <label class="block text-xs font-bold text-gray-700">Fitur / Keunggulan (1 baris per poin)</label>
                    @php
                        $featuresVal = isset($product->features) && is_array($product->features) ? implode("\n", $product->features) : '';
                    @endphp
                    <textarea name="features_raw" rows="4" placeholder="Kerah rajut tebal 4 lapis anti-curling&#10;Placket kancing rapi dengan jahitan penguat&#10;Handfeel sejuk dan menyerap keringat"
                              class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden leading-relaxed">{{ old('features_raw', $featuresVal) }}</textarea>
                </div>
            </div>
        </div>

        {{-- KOLOM SIDEBAR (1 Kolom): FOTO & STATUS --}}
        <div class="space-y-6">
            
            {{-- STATUS & VISIBILITAS --}}
            <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Badge & Status</h3>

                <div class="space-y-3">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="is_featured" value="1" {{ old('is_featured', $product->is_featured ?? false) ? 'checked' : '' }} class="rounded border-gray-300 text-primary focus:ring-primary">
                        <span class="text-xs font-bold text-gray-700">Featured (Tampil di Beranda)</span>
                    </label>

                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="is_best_seller" value="1" {{ old('is_best_seller', $product->is_best_seller ?? false) ? 'checked' : '' }} class="rounded border-gray-300 text-primary focus:ring-primary">
                        <span class="text-xs font-bold text-gray-700">Best Seller</span>
                    </label>

                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" name="is_new_arrival" value="1" {{ old('is_new_arrival', $product->is_new_arrival ?? false) ? 'checked' : '' }} class="rounded border-gray-300 text-primary focus:ring-primary">
                        <span class="text-xs font-bold text-gray-700">New Arrival</span>
                    </label>
                </div>
            </div>

            {{-- FOTO PRODUK --}}
            <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Foto Produk</h3>

                @if($isEdit && $product->images->count() > 0)
                <div class="space-y-2">
                    <span class="text-[11px] font-bold text-gray-700 block">Foto Saat Ini ({{ $product->images->count() }})</span>
                    <div class="grid grid-cols-2 gap-2">
                        @foreach($product->images as $img)
                        <div class="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                            <img src="{{ $img->image_url }}" alt="Product Image" class="w-full h-full object-cover">
                            
                            @if($img->is_primary)
                            <span class="absolute top-1 left-1 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded">UTAMA</span>
                            @else
                            <label class="absolute top-1 left-1 bg-white/90 text-gray-700 text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer shadow-xs">
                                <input type="radio" name="primary_image_id" value="{{ $img->id }}" class="hidden">
                                <span>Pilih Utama</span>
                            </label>
                            @endif

                            {{-- Delete Image Form --}}
                            <form action="{{ route('admin.produk.images.destroy', [$product->id, $img->id]) }}" method="POST" onsubmit="return confirm('Hapus foto ini?')" class="absolute bottom-1 right-1">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="p-1 bg-red-600 text-white rounded-md shadow-xs opacity-80 hover:opacity-100 transition" title="Hapus foto">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                </button>
                            </form>
                        </div>
                        @endforeach
                    </div>
                </div>
                @endif

                {{-- Upload Input --}}
                <div class="space-y-1">
                    <label class="block text-xs font-bold text-gray-700">{{ $isEdit ? 'Tambah Foto Baru' : 'Upload Foto Produk' }}</label>
                    <input type="file" name="{{ $isEdit ? 'new_images[]' : 'images[]' }}" multiple accept="image/*"
                           class="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer">
                    <span class="text-[10px] text-gray-400 block">Bisa pilih beberapa gambar sekaligus (JPG, PNG, WebP)</span>
                </div>
            </div>

            {{-- TOMBOL SUBMIT --}}
            <div class="space-y-3">
                <button type="submit" class="w-full py-3.5 bg-primary hover:bg-dark text-white font-bold rounded-xl shadow-lg transition text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>{{ $isEdit ? 'Simpan Perubahan ke Database' : 'Tambahkan Produk' }}</span>
                </button>
            </div>
        </div>
    </div>
</form>
@endsection
