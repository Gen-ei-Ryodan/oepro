<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'OEPRO - Official Store | Premium Cotton Basic')</title>
    
    {{-- Fonts --}}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    {{-- Tailwind CSS --}}
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
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
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    </style>
    
    {{-- Alpine.js --}}
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    @stack('styles')
</head>
<body class="bg-[#FBFBFA] font-sans text-gray-900 antialiased selection:bg-primary selection:text-white flex flex-col min-h-screen">

    {{-- TOP PROMO BAR --}}
    <div class="bg-primary text-white text-[11px] py-2 px-4 text-center font-medium tracking-wide">
        ✨ 100% Cotton Murni Combed 24s & Pique Hexagon • Garansi Nyaman & Tidak Panas
    </div>

    {{-- NAVBAR --}}
    <nav class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16 sm:h-20">
                
                {{-- LOGO --}}
                <a href="{{ url('/') }}" class="flex items-center gap-2">
                    <span class="text-2xl sm:text-3xl font-black tracking-tighter text-primary">OEPRO</span>
                    <span class="text-[9px] uppercase tracking-widest font-extrabold text-sage bg-primary/10 px-1.5 py-0.5 rounded">Store</span>
                </a>

                {{-- DESKTOP MENU --}}
                <div class="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-700">
                    <a href="{{ url('/') }}" class="hover:text-primary transition-colors {{ request()->is('/') ? 'text-primary' : '' }}">Beranda</a>
                    <a href="{{ url('/catalog') }}" class="hover:text-primary transition-colors {{ request()->is('catalog*') ? 'text-primary' : '' }}">Semua Produk</a>
                    <a href="{{ url('/catalog?category=polo-shirt') }}" class="hover:text-primary transition-colors">Kaos Polo</a>
                    <a href="{{ url('/catalog?category=cotton-combed-24s') }}" class="hover:text-primary transition-colors">Kaos Polos 24s</a>
                    <a href="{{ url('/catalog?category=longsleeve') }}" class="hover:text-primary transition-colors">Longsleeve</a>
                </div>

                {{-- ACTION BUTTONS --}}
                <div class="flex items-center gap-3">
                    <a href="https://wa.me/6281313888927?text=Halo%20Admin%20OEPRO,%20saya%20ingin%20tanya%20produk%20dan%20stok"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary hover:bg-dark text-white text-xs font-bold transition shadow-xs">
                        <svg class="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.152.569 4.17 1.564 5.917l-1.664 6.083 6.223-1.633c1.7 1.002 3.69 1.573 5.823 1.573 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
                        </svg>
                        <span>Chat WhatsApp</span>
                    </a>
                </div>
            </div>
        </div>
    </nav>

    {{-- MAIN CONTENT --}}
    <main class="flex-1">
        @yield('content')
    </main>

    {{-- FLOATING WHATSAPP BUTTON --}}
    <a href="https://wa.me/6281313888927?text=Halo%20Admin%20OEPRO,%20saya%20ingin%20tanya%20seputar%20produk%20kaos"
       target="_blank"
       rel="noopener noreferrer"
       class="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 sm:p-4 rounded-full shadow-2xl transition transform hover:scale-110 flex items-center justify-center group"
       title="Hubungi Admin OEPRO via WhatsApp">
        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.152.569 4.17 1.564 5.917l-1.664 6.083 6.223-1.633c1.7 1.002 3.69 1.573 5.823 1.573 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
        </svg>
        <span class="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
            Pesan via WA
        </span>
    </a>

    {{-- FOOTER --}}
    <footer class="bg-dark text-white border-t border-white/10 mt-16 sm:mt-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                
                {{-- Col 1: Brand --}}
                <div class="md:col-span-2 space-y-4">
                    <span class="text-3xl font-black tracking-tighter text-white">OEPRO</span>
                    <p class="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                        Produksi kaos polos, polo shirt pique premium, dan lengan panjang berbahan 100% katun murni berkualitas standar ekspor. Nyaman, adem, dan awet dicuci.
                    </p>
                    <div class="text-xs text-gray-400">
                        WhatsApp Customer Service: <strong class="text-white">+62 813-1388-8927</strong>
                    </div>
                </div>

                {{-- Col 2: Kategori --}}
                <div class="space-y-3">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-sage">Kategori</h4>
                    <ul class="space-y-2 text-xs text-gray-300">
                        <li><a href="{{ url('/catalog?category=polo-shirt') }}" class="hover:text-white transition">Kaos Polo Pique</a></li>
                        <li><a href="{{ url('/catalog?category=cotton-combed-24s') }}" class="hover:text-white transition">Kaos Polos Combed 24s</a></li>
                        <li><a href="{{ url('/catalog?category=longsleeve') }}" class="hover:text-white transition">Kaos Lengan Panjang</a></li>
                        <li><a href="{{ url('/catalog') }}" class="hover:text-white transition">Semua Produk</a></li>
                    </ul>
                </div>

                {{-- Col 3: Layanan --}}
                <div class="space-y-3">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-sage">Pemesanan</h4>
                    <p class="text-xs text-gray-400 leading-relaxed">
                        Pemesanan eceran & grosir dilayani langsung via WhatsApp dengan respon cepat dan pengiriman ke seluruh Indonesia.
                    </p>
                    <a href="https://wa.me/6281313888927" target="_blank" class="inline-block text-xs font-bold text-sage hover:underline">
                        Hubungi WhatsApp →
                    </a>
                </div>
            </div>

            <div class="border-t border-white/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
                <span>© {{ date('Y') }} OEPRO. All rights reserved.</span>
                <a href="{{ url('/admin/login') }}" class="text-gray-600 hover:text-gray-400 text-[11px]">Admin Login</a>
            </div>
        </div>
    </footer>

    @stack('scripts')
</body>
</html>
