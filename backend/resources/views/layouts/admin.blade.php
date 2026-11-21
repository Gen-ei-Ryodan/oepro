<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin Panel OEPRO')</title>
    
    {{-- Fonts --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
    
    {{-- Tailwind CSS --}}
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                    },
                    colors: {
                        primary: '#133129',
                        sage: '#A8C4B5',
                        dark: '#081F1C',
                    }
                }
            }
        }
    </script>
    
    <style>
        [x-cloak] { display: none !important; }
    </style>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    @stack('styles')
</head>
<body class="bg-[#F8F9FA] text-gray-900 font-sans antialiased flex h-screen overflow-hidden">

    {{-- SIDEBAR --}}
    <aside class="w-64 bg-primary text-white flex flex-col shrink-0 border-r border-white/5">
        {{-- Brand --}}
        <div class="h-20 px-6 flex items-center justify-between border-b border-white/10">
            <div class="flex items-center gap-2">
                <span class="text-2xl font-black tracking-tighter text-white">OEPRO</span>
                <span class="text-[9px] uppercase tracking-widest font-extrabold text-sage bg-white/10 px-1.5 py-0.5 rounded">Admin</span>
            </div>
            <a href="{{ url('/') }}" target="_blank" title="Lihat Website" class="text-sage hover:text-white transition">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
            </a>
        </div>

        {{-- Nav Links --}}
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <a href="{{ route('admin.produk.index') }}"
               class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition {{ request()->is('admin/produk*') ? 'bg-white/15 text-white shadow-xs' : 'text-sage hover:bg-white/5 hover:text-white' }}">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                <span>Produk & Varian</span>
            </a>

            <a href="{{ route('admin.kategori.index') }}"
               class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition {{ request()->is('admin/kategori*') ? 'bg-white/15 text-white shadow-xs' : 'text-sage hover:bg-white/5 hover:text-white' }}">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
                <span>Kategori</span>
            </a>

            <a href="{{ route('admin.banner.index') }}"
               class="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition {{ request()->is('admin/banner*') ? 'bg-white/15 text-white shadow-xs' : 'text-sage hover:bg-white/5 hover:text-white' }}">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>Banner Depan</span>
            </a>
        </nav>

        {{-- User info & Logout --}}
        <div class="p-4 border-t border-white/10 flex items-center justify-between">
            <div class="truncate">
                <span class="text-xs font-bold text-white block truncate">{{ session('admin_user', 'Admin') }}</span>
                <span class="text-[10px] text-sage/70 font-mono">Logged in</span>
            </div>
            <form action="{{ route('admin.logout') }}" method="POST">
                @csrf
                <button type="submit" title="Logout" class="p-2 text-sage hover:text-red-400 hover:bg-white/5 rounded-lg transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                </button>
            </form>
        </div>
    </aside>

    {{-- MAIN CONTENT AREA --}}
    <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header class="h-20 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between shrink-0">
            <h1 class="text-lg font-black text-gray-900 tracking-tight">
                @yield('page-title', 'Dashboard')
            </h1>
            <div>
                @yield('header-actions')
            </div>
        </header>

        <main class="p-6 sm:p-8 space-y-6">
            {{-- Flash Messages --}}
            @if(session('success'))
            <div class="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>{{ session('success') }}</span>
            </div>
            @endif

            @if(session('error'))
            <div class="bg-red-50 border border-red-200 text-red-800 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
                <svg class="w-4 h-4 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
                <span>{{ session('error') }}</span>
            </div>
            @endif

            @if($errors->any())
            <div class="bg-red-50 border border-red-200 text-red-800 text-xs px-4 py-3 rounded-xl">
                <strong class="font-bold block mb-1">Ada kesalahan input:</strong>
                <ul class="list-disc list-inside space-y-0.5">
                    @foreach($errors->all() as $err)
                    <li>{{ $err }}</li>
                    @endforeach
                </ul>
            </div>
            @endif

            @yield('content')
        </main>
    </div>

    @stack('scripts')
</body>
</html>
