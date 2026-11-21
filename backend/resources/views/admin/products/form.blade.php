@extends('layouts.admin')

@php
    $isEdit = isset($product);
    $variantsData = old('variants', $product->variants_data ?? []);
    if (empty($variantsData)) {
        $sizesList = $product->sizes ?? ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL'];
        foreach ($sizesList as $sz) {
            $variantsData[] = [
                'name' => $sz,
                'price' => $product->price ?? 62000,
                'original_price' => $product->original_price ?? 79000,
                'stock' => 25,
                'sku' => ($product->sku ?? 'OEP') . '-' . $sz
            ];
        }
    }
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
      x-data="adminProductForm({{ json_encode($variantsData) }})"
      class="space-y-8 max-w-6xl">
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
                    <textarea name="description" rows="4" placeholder="Tuliskan deskripsi detail produk..."
                              class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden leading-relaxed">{{ old('description', $product->description ?? '') }}</textarea>
                </div>
            </div>

            {{-- TABEL VARIAN 1 TINGKAT (UKURAN / SIZE) --}}
            <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-xs font-bold uppercase tracking-wider text-gray-900">Varian 1 Tingkat (Ukuran & Harga Spesifik)</h3>
                        <p class="text-[11px] text-gray-400">Atur harga, harga coret, diskon, dan stok untuk tiap opsi ukuran</p>
                    </div>
                    <button type="button" @click="addVariant()" class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition">
                        + Tambah Opsi Ukuran
                    </button>
                </div>

                <div class="overflow-x-auto border border-gray-200 rounded-xl">
                    <table class="w-full text-left text-xs border-collapse">
                        <thead class="bg-gray-50 border-b border-gray-200 text-[10px] font-bold text-gray-500 uppercase">
                            <tr>
                                <th class="p-2.5">Ukuran</th>
                                <th class="p-2.5">Harga Jual (Rp)</th>
                                <th class="p-2.5">Harga Asli (Rp)</th>
                                <th class="p-2.5">Stok</th>
                                <th class="p-2.5">SKU Varian</th>
                                <th class="p-2.5 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <template x-for="(v, idx) in variants" :key="idx">
                                <tr class="hover:bg-gray-50/50">
                                    <td class="p-2">
                                        <input type="text" :name="'variants[' + idx + '][name]'" x-model="v.name" required
                                               class="w-20 px-2 py-1 text-xs border border-gray-200 rounded-lg font-bold font-mono focus:border-primary focus:outline-none">
                                    </td>
                                    <td class="p-2">
                                        <input type="number" :name="'variants[' + idx + '][price]'" x-model="v.price" required step="500"
                                               class="w-28 px-2 py-1 text-xs border border-gray-200 rounded-lg font-mono font-bold text-primary focus:border-primary focus:outline-none">
                                    </td>
                                    <td class="p-2">
                                        <input type="number" :name="'variants[' + idx + '][original_price]'" x-model="v.original_price" step="500"
                                               class="w-28 px-2 py-1 text-xs border border-gray-200 rounded-lg font-mono text-gray-500 focus:border-primary focus:outline-none">
                                    </td>
                                    <td class="p-2">
                                        <input type="number" :name="'variants[' + idx + '][stock]'" x-model="v.stock" min="0"
                                               class="w-20 px-2 py-1 text-xs border border-gray-200 rounded-lg font-mono focus:border-primary focus:outline-none">
                                    </td>
                                    <td class="p-2">
                                        <input type="text" :name="'variants[' + idx + '][sku]'" x-model="v.sku"
                                               class="w-32 px-2 py-1 text-xs border border-gray-200 rounded-lg font-mono focus:border-primary focus:outline-none">
                                    </td>
                                    <td class="p-2 text-center">
                                        <button type="button" @click="removeVariant(idx)" class="p-1 text-gray-400 hover:text-red-600 rounded transition" title="Hapus">
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>

            {{-- HARGA UTAMA & STOK GLOBAL --}}
            <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Harga Standar & Ringkasan Stok</h3>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="space-y-1">
                        <label class="block text-xs font-bold text-gray-700">Harga Base (Rp) <span class="text-red-500">*</span></label>
                        <input type="number" name="price" value="{{ old('price', $product->price ?? '') }}" required min="0" step="500"
                               placeholder="62000"
                               class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden font-mono font-bold text-primary">
                    </div>

                    <div class="space-y-1">
                        <label class="block text-xs font-bold text-gray-700">Harga Asli Coret (Rp)</label>
                        <input type="number" name="original_price" value="{{ old('original_price', $product->original_price ?? '') }}" min="0" step="500"
                               placeholder="79000"
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

            {{-- SPESIFIKASI --}}
            <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Bahan & Karakteristik</h3>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="space-y-1">
                        <label class="block text-xs font-bold text-gray-700">Bahan / Material</label>
                        <input type="text" name="material" value="{{ old('material', $product->material ?? '') }}"
                               placeholder="Contoh: 100% Cotton Combed 24s Soft Touch (185 GSM)"
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
                    <label class="block text-xs font-bold text-gray-700">Fitur / Keunggulan (1 baris per poin)</label>
                    @php
                        $featuresVal = isset($product->features) && is_array($product->features) ? implode("\n", $product->features) : '';
                    @endphp
                    <textarea name="features_raw" rows="3" placeholder="Kerah anti-melar&#10;Jahitan rantai pundak&#10;Bahan katun reaktif tidak luntur"
                              class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden leading-relaxed">{{ old('features_raw', $featuresVal) }}</textarea>
                </div>
            </div>
        </div>

        {{-- KOLOM SIDEBAR (1 Kolom): FOTO DRAG & DROP REORDER & STATUS --}}
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

            {{-- FOTO PRODUK DENGAN DRAG & DROP REORDER (SORTABLE) --}}
            <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-xs font-bold uppercase tracking-wider text-gray-900">Foto Produk</h3>
                        <p class="text-[10px] text-gray-400">Geser/Drag foto untuk ubah urutan. Foto urutan pertama = Foto Utama</p>
                    </div>
                </div>

                @if($isEdit && $product->images->count() > 0)
                <div id="image-sortable-list" class="grid grid-cols-2 gap-2.5">
                    @foreach($product->images as $idx => $img)
                    <div class="sortable-item relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 cursor-grab active:cursor-grabbing hover:border-primary transition"
                         data-id="{{ $img->id }}">
                        
                        <input type="hidden" name="image_order[]" value="{{ $img->id }}">
                        <img src="{{ $img->image_url }}" alt="Product Image" class="w-full h-full object-cover pointer-events-none">
                        
                        {{-- Badge Utama / Index --}}
                        <div class="absolute top-1 left-1 image-badge">
                            @if($img->is_primary)
                            <span class="bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm primary-tag">UTAMA</span>
                            @else
                            <span class="bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm order-num">#{{ $idx + 1 }}</span>
                            @endif
                        </div>

                        {{-- Action Buttons --}}
                        <div class="absolute top-1 right-1 flex gap-1">
                            {{-- Delete Image Button --}}
                            <button type="button" 
                                    onclick="if(confirm('Hapus foto ini?')) document.getElementById('delete-img-{{ $img->id }}').submit();"
                                    class="p-1 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md transition" title="Hapus foto">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    @endforeach
                </div>
                @endif

                {{-- Upload Input --}}
                <div class="space-y-1 pt-2 border-t border-gray-100">
                    <label class="block text-xs font-bold text-gray-700">{{ $isEdit ? 'Tambah Foto Baru' : 'Upload Foto Produk' }}</label>
                    <input type="file" name="{{ $isEdit ? 'new_images[]' : 'images[]' }}" multiple accept="image/*"
                           class="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer">
                    <span class="text-[10px] text-gray-400 block">Bisa upload beberapa foto sekaligus</span>
                </div>
            </div>

            {{-- TOMBOL SUBMIT --}}
            <div class="space-y-3">
                <button type="submit" class="w-full py-4 bg-primary hover:bg-dark text-white font-black rounded-2xl shadow-xl transition text-xs uppercase tracking-wider flex items-center justify-center gap-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    <span>{{ $isEdit ? 'Simpan Perubahan ke Database' : 'Tambahkan Produk' }}</span>
                </button>
            </div>
        </div>
    </div>
</form>

{{-- Hidden Delete Forms for Images --}}
@if($isEdit)
    @foreach($product->images as $img)
    <form id="delete-img-{{ $img->id }}" action="{{ route('admin.produk.images.destroy', [$product->id, $img->id]) }}" method="POST" class="hidden">
        @csrf
        @method('DELETE')
    </form>
    @endforeach
@endif

@push('scripts')
{{-- SortableJS CDN --}}
<script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.2/Sortable.min.js"></script>
<script>
function adminProductForm(initialVariants) {
    return {
        variants: initialVariants || [],
        
        addVariant() {
            this.variants.push({
                name: 'XL',
                price: 62000,
                original_price: 79000,
                stock: 25,
                sku: ''
            });
        },

        removeVariant(index) {
            if (this.variants.length <= 1) {
                alert('Minimal harus ada 1 opsi ukuran!');
                return;
            }
            this.variants.splice(index, 1);
        }
    };
}

// Inisialisasi Sortable Drag and Drop untuk Foto
document.addEventListener('DOMContentLoaded', function() {
    const el = document.getElementById('image-sortable-list');
    if (el) {
        new Sortable(el, {
            animation: 150,
            ghostClass: 'opacity-40',
            onEnd: function() {
                // Update label UTAMA / Index saat urutan berubah
                const items = el.querySelectorAll('.sortable-item');
                items.forEach((item, idx) => {
                    const badge = item.querySelector('.image-badge');
                    if (badge) {
                        if (idx === 0) {
                            badge.innerHTML = '<span class="bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm primary-tag">UTAMA</span>';
                        } else {
                            badge.innerHTML = '<span class="bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm order-num">#' + (idx + 1) + '</span>';
                        }
                    }
                });
            }
        });
    }
});
</script>
@endpush
@endsection
