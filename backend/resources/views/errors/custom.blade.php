<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $code ?? 404 }} - {{ $title ?? 'Halaman Tidak Ditemukan' }} | OEPRO</title>
    
    <link rel="icon" type="image/svg+xml" href="/assets/brand/favicon.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
    
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: #081F1C; color: #DCE5E0; font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="min-h-screen flex items-center justify-center p-4 antialiased">
    <div class="max-w-md w-full text-center space-y-6 bg-[#0E2824] border border-[#A8C4B5]/20 p-8 sm:p-10 rounded-3xl shadow-2xl">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#133129] border border-[#A8C4B5]/30 text-[#A8C4B5] text-3xl font-black">
            {{ $code ?? '404' }}
        </div>
        
        <div class="space-y-2">
            <h1 class="text-2xl font-black text-white tracking-tight">
                {{ $title ?? 'Oops! Halaman Tidak Ditemukan' }}
            </h1>
            <p class="text-xs sm:text-sm text-gray-400 leading-relaxed">
                {{ $message ?? 'Halaman atau aksi yang Anda cari tidak tersedia atau terjadi kesalahan pada sistem.' }}
            </p>
        </div>

        <div class="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            @if(request()->is('admin*'))
                <a href="{{ route('admin.produk.index') }}" class="px-6 py-3 bg-[#A8C4B5] hover:bg-white text-[#081F1C] font-bold rounded-xl text-xs uppercase tracking-wider transition">
                    ← Kembali ke Admin
                </a>
                <a href="{{ route('admin.login') }}" class="px-6 py-3 bg-[#133129] hover:bg-[#163B35] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition">
                    Ke Halaman Login
                </a>
            @else
                <a href="{{ url('/') }}" class="px-6 py-3 bg-[#A8C4B5] hover:bg-white text-[#081F1C] font-bold rounded-xl text-xs uppercase tracking-wider transition">
                    Kembali ke Beranda
                </a>
                <a href="{{ url('/catalog') }}" class="px-6 py-3 bg-[#133129] hover:bg-[#163B35] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition">
                    Lihat Katalog
                </a>
            @endif
        </div>
        
        <div class="pt-2 text-[10px] text-gray-500 font-mono">
            OEPRO Official Store &bull; Error Code {{ $code ?? '404' }}
        </div>
    </div>
</body>
</html>
