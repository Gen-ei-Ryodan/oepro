@extends('layouts.admin')

@section('title', 'Kategori Produk - Admin OEPRO')
@section('page-title', 'Master Kategori Produk')

@section('content')
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    
    {{-- Form Tambah Kategori --}}
    <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4 h-fit">
        <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400">Tambah Kategori Baru</h3>
        
        <form action="{{ route('admin.kategori.store') }}" method="POST" class="space-y-4">
            @csrf
            <div class="space-y-1">
                <label class="block text-xs font-bold text-gray-700">Nama Kategori <span class="text-red-500">*</span></label>
                <input type="text" name="name" required placeholder="Contoh: Kaos Raglan"
                       class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden">
            </div>

            <div class="space-y-1">
                <label class="block text-xs font-bold text-gray-700">Deskripsi Singkat</label>
                <textarea name="description" rows="3" placeholder="Koleksi kaos raglan berkualitas..."
                          class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden"></textarea>
            </div>

            <button type="submit" class="w-full py-3 bg-primary hover:bg-dark text-white text-xs font-bold rounded-xl transition shadow-xs">
                + Tambah Kategori
            </button>
        </form>
    </div>

    {{-- Tabel Kategori --}}
    <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-gray-700">Daftar Kategori Aktif ({{ $categories->count() }})</h3>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
                <thead>
                    <tr class="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        <th class="py-3 px-4">Nama Kategori</th>
                        <th class="py-3 px-4">Slug URL</th>
                        <th class="py-3 px-4">Jumlah Produk</th>
                        <th class="py-3 px-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($categories as $cat)
                    <tr class="hover:bg-gray-50/80 transition" x-data="{ editing: false }">
                        <td class="py-3 px-4 font-bold text-gray-950">
                            <span x-show="!editing">{{ $cat->name }}</span>
                            <form x-show="editing" action="{{ route('admin.kategori.update', $cat->id) }}" method="POST" class="flex gap-2">
                                @csrf
                                @method('PUT')
                                <input type="text" name="name" value="{{ $cat->name }}" class="px-2 py-1 text-xs border rounded-lg focus:outline-none">
                                <button type="submit" class="px-2 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold">Simpan</button>
                                <button type="button" @click="editing = false" class="px-2 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs">Batal</button>
                            </form>
                        </td>
                        <td class="py-3 px-4 font-mono text-gray-500 text-[11px]">{{ $cat->slug }}</td>
                        <td class="py-3 px-4">
                            <span class="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-bold text-[10px]">
                                {{ $cat->products_count ?? $cat->products()->count() }} produk
                            </span>
                        </td>
                        <td class="py-3 px-4 text-right">
                            <div class="flex items-center justify-end gap-1.5" x-show="!editing">
                                <button type="button" @click="editing = true" class="p-1.5 text-gray-600 hover:text-gray-950 hover:bg-gray-100 rounded-lg transition" title="Edit">
                                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                    </svg>
                                </button>
                                <form action="{{ route('admin.kategori.destroy', $cat->id) }}" method="POST" onsubmit="return confirm('Hapus kategori ini?')" class="inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus">
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
                        <td colspan="4" class="p-6 text-center text-gray-400">Belum ada kategori.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
