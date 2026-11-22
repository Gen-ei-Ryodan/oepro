@extends('layouts.admin')

@section('title', 'Banner Depan - Admin OEPRO')
@section('page-title', 'Manajemen Banner Depan')

@section('content')
<div class="grid grid-cols-1 lg:grid-cols-3 gap-8" x-data="{
    isEdit: false,
    editId: null,
    formAction: '{{ route('admin.banner.store') }}',
    title: '',
    subheadline: '',
    cta_link: '',
    order: 1,
    is_active: true,
    startEdit(banner) {
        this.isEdit = true;
        this.editId = banner.id;
        this.formAction = '/admin/banner/' + banner.id;
        this.title = banner.title || banner.headline || '';
        this.subheadline = banner.subheadline || '';
        this.cta_link = banner.cta_link || '';
        this.order = banner.order || 1;
        this.is_active = !!banner.is_active;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    cancelEdit() {
        this.isEdit = false;
        this.editId = null;
        this.formAction = '{{ route('admin.banner.store') }}';
        this.title = '';
        this.subheadline = '';
        this.cta_link = '';
        this.order = 1;
        this.is_active = true;
    }
}">
    
    {{-- Form Tambah / Edit Banner --}}
    <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4 h-fit">
        <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-gray-500" x-text="isEdit ? 'Edit Banner Depan' : 'Tambah Banner Baru'"></h3>
            <button type="button" x-show="isEdit" @click="cancelEdit()" class="text-xs text-red-500 hover:underline">Batal</button>
        </div>
        
        <form :action="formAction" method="POST" enctype="multipart/form-data" class="space-y-4">
            @csrf
            <template x-if="isEdit">
                <input type="hidden" name="_method" value="PUT">
            </template>

            <div class="space-y-1">
                <label class="block text-xs font-bold text-gray-700">Judul / Headline <span class="text-red-500">*</span></label>
                <input type="text" name="title" x-model="title" required placeholder="Contoh: Koleksi Kaos Polo Premium"
                       class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden">
            </div>

            <div class="space-y-1">
                <label class="block text-xs font-bold text-gray-700">Subheadline</label>
                <textarea name="subheadline" x-model="subheadline" rows="2" placeholder="Deskripsi singkat promo banner..."
                          class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden"></textarea>
            </div>

            <div class="space-y-1">
                <label class="block text-xs font-bold text-gray-700">Link Tujuan (URL)</label>
                <input type="text" name="cta_link" x-model="cta_link" placeholder="/catalog?category=polo-shirt"
                       class="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden font-mono">
            </div>

            <div class="space-y-1">
                <label class="block text-xs font-bold text-gray-700">Upload Gambar Banner</label>
                <input type="file" name="image" accept="image/*"
                       class="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer">
                <p class="text-[10px] text-gray-400" x-show="isEdit">Biarkan kosong jika tidak ingin mengganti gambar saat ini.</p>
            </div>

            <div class="flex items-center gap-4">
                <div class="space-y-1 flex-1">
                    <label class="block text-xs font-bold text-gray-700">Urutan (Order)</label>
                    <input type="number" name="order" x-model="order" min="1"
                           class="w-full px-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden font-mono">
                </div>
                <label class="flex items-center gap-2 cursor-pointer pt-4">
                    <input type="checkbox" name="is_active" value="1" x-model="is_active" class="rounded border-gray-300 text-primary focus:ring-primary">
                    <span class="text-xs font-bold text-gray-700">Aktif</span>
                </label>
            </div>

            <button type="submit" class="w-full py-3 bg-[#133129] hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-xs" x-text="isEdit ? 'Simpan Perubahan Banner' : '+ Tambah Banner'">
            </button>
        </form>
    </div>

    {{-- Tabel Banner --}}
    <div class="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-gray-700">Daftar Banner Depan ({{ $banners->count() }})</h3>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse text-xs">
                <thead>
                    <tr class="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        <th class="py-3 px-4">Preview</th>
                        <th class="py-3 px-4">Headline</th>
                        <th class="py-3 px-4">Urutan</th>
                        <th class="py-3 px-4">Status</th>
                        <th class="py-3 px-4 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                    @forelse($banners as $b)
                    <tr class="hover:bg-gray-50/80 transition">
                        <td class="py-3 px-4">
                            <div class="w-24 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                @if($b->image_url)
                                <img src="{{ $b->image_url }}" alt="{{ $b->title }}" class="w-full h-full object-cover">
                                @else
                                <div class="w-full h-full flex items-center justify-center text-gray-400 text-[10px]">No Img</div>
                                @endif
                            </div>
                        </td>
                        <td class="py-3 px-4 font-bold text-gray-950">
                            <div>{{ $b->title ?? $b->headline }}</div>
                            @if($b->subheadline)
                            <div class="text-[11px] font-normal text-gray-500 line-clamp-1">{{ $b->subheadline }}</div>
                            @endif
                        </td>
                        <td class="py-3 px-4 font-mono text-gray-700">{{ $b->order ?? 1 }}</td>
                        <td class="py-3 px-4">
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold {{ $b->is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600' }}">
                                {{ $b->is_active ? 'Aktif' : 'Nonaktif' }}
                            </span>
                        </td>
                        <td class="py-3 px-4 text-right space-x-1">
                            {{-- Tombol Edit Banner --}}
                            <button type="button"
                                    @click="startEdit({{ json_encode($b) }})"
                                    class="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition inline-flex items-center" title="Edit Banner">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                            </button>

                            {{-- Tombol Hapus Banner --}}
                            <form action="{{ route('admin.banner.destroy', $b->id) }}" method="POST" onsubmit="return confirm('Hapus banner ini?')" class="inline">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                </button>
                            </form>
                        </td>
                    </tr>
                    @empty
                    <tr>
                        <td colspan="5" class="p-6 text-center text-gray-400">Belum ada banner.</td>
                    </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
