<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'OEPRO - Official Store | Premium Cotton Basic')</title>
    
    {{-- Favicon --}}
    <link rel="icon" type="image/svg+xml" href="/assets/brand/favicon.svg">
    <link rel="alternate icon" href="/assets/brand/favicon.ico">
    <link rel="apple-touch-icon" href="/assets/brand/oepro-logo.webp">

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
                        dark: '#081F1C',
                        surface: '#0E2824',
                        surfaceHover: '#163B35',
                        brandYellow: '#D8B761', // Kuning emas OEPRO
                        brandYellowHover: '#C4A350',
                        borderMuted: 'rgba(216, 183, 97, 0.2)',
                    }
                }
            }
        }
    </script>
    
    <style>
        [x-cloak] { display: none !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        body { background-color: #081F1C; color: #FFFFFF; }

        @keyframes promoMarquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee {
            display: inline-flex;
            white-space: nowrap;
            animation: promoMarquee 28s linear infinite;
        }
        .animate-marquee:hover {
            animation-play-state: paused;
        }
    </style>
    
    {{-- Alpine.js Cart Store --}}
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script>
        document.addEventListener('alpine:init', () => {
            Alpine.store('cart', {
                items: (function() {
                    const saved = JSON.parse(localStorage.getItem('oepro_cart_items') || '[]');
                    // Bersihkan / auto-perbaiki item cart yang tersimpan dengan logo atau tanpa foto
                    return saved.map(i => {
                        if (!i.image || i.image.includes('oepro-logo') || i.image.includes('favicon')) {
                            // Cek berdasarkan nama produk
                            const n = (i.name || '').toLowerCase();
                            // Pola: "Kaos Polo Premium - Red Chili" -> color: red-chili
                            const colorName = n.split(' - ')[1] || '';
                            const colorSlug = colorName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                            if (n.includes('polo')) {
                                i.image = `/storage/products/polo/${colorSlug}/${colorSlug}-oepro.webp`;
                            } else if (n.includes('longsleeve') || n.includes('lengan panjang')) {
                                i.image = `/storage/products/longsleeve/${colorSlug}/${colorSlug}-oepro.webp`;
                            } else {
                                i.image = `/storage/products/tshirt/${colorSlug}/${colorSlug}-oepro.webp`;
                            }
                        }
                        return i;
                    });
                })(),
                isOpen: false,
                
                add(product, selectedSize = 'L', selectedColor = '', qty = 1, price = null, image = '') {
                    // Mendukung add({id, name, price, image, size, color, qty}) atau add(product, size, color, qty, price, image)
                    let pId = product.id;
                    let pName = product.name;
                    let pSlug = product.slug || '';
                    let pSize = product.size || selectedSize || 'L';
                    let pColor = product.color || selectedColor || '';
                    let pQty = product.qty || qty || 1;
                    let pPrice = product.price !== undefined ? product.price : (price || 0);
                    let pImage = product.image || image || (product.images && product.images[0]?.image_url) || '';

                    // Jika image masih kosong atau default logo, generate dari nama produk
                    if (!pImage || pImage.includes('oepro-logo')) {
                        const n = (pName || '').toLowerCase();
                        const colorName = pColor || (n.split(' - ')[1] || '');
                        const colorSlug = colorName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        if (n.includes('polo')) {
                            pImage = `/storage/products/polo/${colorSlug}/${colorSlug}-oepro.webp`;
                        } else if (n.includes('longsleeve') || n.includes('lengan panjang')) {
                            pImage = `/storage/products/longsleeve/${colorSlug}/${colorSlug}-oepro.webp`;
                        } else {
                            pImage = `/storage/products/tshirt/${colorSlug}/${colorSlug}-oepro.webp`;
                        }
                    }

                    const existingIndex = this.items.findIndex(i => 
                        i.id === pId && i.size === pSize && i.color === pColor
                    );

                    if (existingIndex > -1) {
                        this.items[existingIndex].qty += pQty;
                        if (pImage && (!this.items[existingIndex].image || this.items[existingIndex].image.includes('oepro-logo'))) {
                            this.items[existingIndex].image = pImage;
                        }
                    } else {
                        this.items.push({
                            id: pId,
                            name: pName,
                            slug: pSlug,
                            price: pPrice,
                            size: pSize,
                            color: pColor,
                            qty: pQty,
                            image: pImage
                        });
                    }
                    this.save();
                    this.isOpen = true;
                },

                remove(index) {
                    this.items.splice(index, 1);
                    this.save();
                },

                updateQty(index, delta) {
                    this.items[index].qty = Math.max(1, this.items[index].qty + delta);
                    this.save();
                },

                save() {
                    localStorage.setItem('oepro_cart_items', JSON.stringify(this.items));
                },

                totalCount() {
                    return this.items.reduce((sum, i) => sum + i.qty, 0);
                },

                totalPrice() {
                    return this.items.reduce((sum, i) => sum + (i.price * i.qty), 0);
                },

                formatRupiah(num) {
                    return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
                },

                checkoutWa(customNote = '') {
                    if (this.items.length === 0) return;
                    let text = `Halo Admin OEPRO, saya ingin memesan produk dari keranjang belanja:\n\n`;
                    this.items.forEach((item, idx) => {
                        text += `*${item.name}*\n`;
                        if (item.color) text += `Warna: ${item.color}\n`;
                        text += `Ukuran: ${item.size} (${this.formatRupiah(item.price)}/pcs)\n`;
                        text += `Jumlah: ${item.qty} pcs\n`;
                        text += `Subtotal: ${this.formatRupiah(item.price * item.qty)}\n\n`;
                    });
                    text += `Total Item: ${this.totalCount()} pcs\n`;
                    text += `Total Belanja: ${this.formatRupiah(this.totalPrice())}\n\n`;
                    if (customNote) text += `*Catatan:* ${customNote}\n\n`;
                    text += `Mohon bantu konfirmasi ketersediaan stok dan informasi ongkir ke alamat saya.\n\n`;
                    text += `Apakah pesanan saya juga bisa mendapatkan promo GRATIS ONGKIR?`;

                    const waUrl = `https://wa.me/6281313888927?text=${encodeURIComponent(text)}`;
                    window.open(waUrl, '_blank');
                }
            });
        });
    </script>
    @stack('styles')
</head>
<body class="bg-[#081F1C] text-white font-sans antialiased selection:bg-[#D8B761] selection:text-[#081F1C] flex flex-col min-h-screen pb-20 md:pb-0" x-data>

    {{-- TOP PROMO BAR (MARQUEE AUTO-RUN & LOOPING RUNNING TEXT) --}}
    <div class="bg-[#133129] border-b border-white/10 text-gray-200 text-[11px] sm:text-xs py-1.5 overflow-hidden font-medium tracking-wide">
        <div class="animate-marquee items-center gap-12">
            <span class="inline-flex items-center gap-2">
                <span class="text-[#D8B761]">🚚</span>
                <span>Nikmati promo Gratis Ongkir ke seluruh Indonesia, karena sekarang pesanan Anda bisa sampai ke mana saja tanpa biaya pengiriman. Syarat & ketentuan berlaku.</span>
            </span>
            <span class="text-[#D8B761]/60">•</span>
            {{-- Duplikasi untuk efek looping mulus tanpa patah (seamless infinite loop) --}}
            <span class="inline-flex items-center gap-2">
                <span class="text-[#D8B761]">🚚</span>
                <span>Nikmati promo Gratis Ongkir ke seluruh Indonesia, karena sekarang pesanan Anda bisa sampai ke mana saja tanpa biaya pengiriman. Syarat & ketentuan berlaku.</span>
            </span>
            <span class="text-[#D8B761]/60">•</span>
        </div>
    </div>

    {{-- NAVBAR (Sesuai request: Kiri logo & text, search product, WhatsApp, Keranjang Putih) --}}
    <nav class="sticky top-0 z-40 bg-[#081F1C]/95 backdrop-blur-md border-b border-white/10 transition-all">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
                
                {{-- PALING KIRI: Logo OEPRO dan tulisan oepro cotton basic --}}
                <a href="{{ url('/') }}" class="flex items-center gap-2.5 shrink-0 group">
                    <img src="/assets/brand/oepro-logo.webp" alt="oepro" class="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-full bg-white/10 p-0.5">
                    <div class="flex flex-col">
                        <span class="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-[#D8B761] transition leading-none">oepro</span>
                        <span class="text-[10px] sm:text-[11px] text-gray-300 font-normal leading-tight">cotton basic</span>
                    </div>
                </a>

                {{-- SEBELAHNYA: Search Bar (Klik langsung masuk ke /catalog) --}}
                <div class="flex-1 max-w-lg hidden sm:block">
                    @if(request()->is('catalog*'))
                    <form method="GET" action="{{ url('/catalog') }}" class="relative flex items-center">
                        <input type="text" name="q" value="{{ request('q') }}" placeholder="Cari kaos polos, polo lacoste, longsleeve..." autofocus
                               class="w-full pl-10 pr-24 py-2.5 text-xs bg-[#133129]/80 border border-white/15 rounded-full text-white placeholder-gray-400 focus:bg-[#0E2824] focus:border-[#D8B761] focus:outline-hidden transition shadow-inner">
                        <button type="submit" class="absolute left-3 text-gray-400 hover:text-[#D8B761] transition" title="Cari di Katalog">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </button>
                        <button type="submit" class="absolute right-1.5 px-3 py-1 bg-[#D8B761] hover:bg-white text-[#081F1C] text-[11px] font-bold rounded-full transition shadow-xs">
                            Cari
                        </button>
                    </form>
                    @else
                    <a href="{{ url('/catalog') }}" class="relative flex items-center group cursor-pointer block">
                        <div class="w-full pl-10 pr-24 py-2.5 text-xs bg-[#133129]/80 border border-white/15 rounded-full text-gray-400 group-hover:border-[#D8B761] group-hover:text-white transition shadow-inner flex items-center select-none">
                            <span>Cari kaos polos, polo lacoste, longsleeve...</span>
                        </div>
                        <div class="absolute left-3 text-gray-400 group-hover:text-[#D8B761] transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </div>
                        <div class="absolute right-1.5 px-3 py-1 bg-[#D8B761] group-hover:bg-white text-[#081F1C] text-[11px] font-bold rounded-full transition shadow-xs">
                            Cari
                        </div>
                    </a>
                    @endif
                </div>

                {{-- KANAN: Tulisan WhatsApp + Keranjang (Warna Putih) --}}
                <div class="flex items-center gap-2 sm:gap-4 shrink-0">
                    {{-- WhatsApp --}}
                    <a href="https://wa.me/6281313888927?text=Halo%20Admin%20OEPRO,%20saya%20ingin%20bertanya%20mengenai%20produk%20OEPRO.%20Boleh%20minta%20informasi%20lebih%20lanjut%20mengenai%20pilihan%20produk,%20ketersediaan%20stok,%20serta%20promo%20GRATIS%20ONGKIR%20yang%20sedang%20berlaku%3F%20Terima%20kasih!"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="inline-flex items-center gap-2 px-2 sm:px-3 py-1.5 text-xs font-bold text-gray-200 hover:text-white transition group">
                        <span class="w-6 h-6 rounded-lg bg-[#25D366] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
                            <img src="/assets/icons/whatsapp.svg" alt="WhatsApp" class="w-3.5 h-3.5 object-contain">
                        </span>
                        <span>WhatsApp</span>
                    </a>

                    {{-- Keranjang (Warna Putih) --}}
                    <button type="button"
                            @click="$store.cart.isOpen = true"
                            class="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-white hover:bg-gray-100 text-[#081F1C] text-xs font-bold transition shadow-md">
                        <svg class="w-4 h-4 text-[#081F1C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                        </svg>
                        <span>Keranjang</span>
                        <span x-show="$store.cart.totalCount() > 0" x-text="$store.cart.totalCount()"
                              class="bg-[#D8B761] text-[#081F1C] text-[10px] font-black px-1.5 py-0.2 rounded-full"></span>
                    </button>
                </div>
            </div>

            {{-- Mobile Search Bar (Klik langsung masuk ke /catalog) --}}
            <div class="pb-3 sm:hidden">
                @if(request()->is('catalog*'))
                <form method="GET" action="{{ url('/catalog') }}" class="relative flex items-center">
                    <input type="text" name="q" value="{{ request('q') }}" placeholder="Cari kaos polos, polo lacoste..." autofocus
                           class="w-full pl-10 pr-16 py-2 text-xs bg-[#133129] border border-white/15 rounded-full text-white placeholder-gray-400 focus:outline-hidden">
                    <button type="submit" class="absolute left-3 text-gray-400 hover:text-[#D8B761]" title="Cari">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </button>
                    <button type="submit" class="absolute right-1 px-3 py-1 bg-[#D8B761] text-[#081F1C] text-[10px] font-bold rounded-full">
                        Cari
                    </button>
                </form>
                @else
                <a href="{{ url('/catalog') }}" class="relative flex items-center cursor-pointer block">
                    <div class="w-full pl-10 pr-16 py-2 text-xs bg-[#133129] border border-white/15 rounded-full text-gray-400 flex items-center select-none">
                        <span>Cari kaos polos, polo lacoste...</span>
                    </div>
                    <div class="absolute left-3 text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </div>
                    <div class="absolute right-1 px-3 py-1 bg-[#D8B761] text-[#081F1C] text-[10px] font-bold rounded-full">
                        Cari
                    </div>
                </a>
                @endif
            </div>
        </div>
    </nav>

    {{-- CART DRAWER / MODAL --}}
    <div x-show="$store.cart.isOpen"
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         class="fixed inset-0 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end"
         style="z-index: 9999;"
         @keydown.escape.window="$store.cart.isOpen = false"
         x-cloak>
        <div class="w-full max-w-md bg-[#0E2824] border-l border-white/10 h-full flex flex-col p-4 sm:p-6 shadow-2xl relative z-10"
             @click.away="$store.cart.isOpen = false">
            
            <div class="flex items-center justify-between pb-4 border-b border-white/10">
                <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-[#D8B761]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                    <h3 class="text-base font-black text-white">Keranjang Belanja (<span x-text="$store.cart.totalCount()"></span>)</h3>
                </div>
                <button type="button" @click="$store.cart.isOpen = false" class="text-gray-400 hover:text-white p-1">✕</button>
            </div>

            {{-- Cart Item List --}}
            <div class="flex-1 overflow-y-auto py-4 space-y-3 no-scrollbar">
                <template x-if="$store.cart.items.length === 0">
                    <div class="text-center py-12 text-gray-400 space-y-2">
                        <span class="text-3xl">🛒</span>
                        <p class="text-xs">Keranjang Anda masih kosong</p>
                    </div>
                </template>

                <template x-for="(item, idx) in $store.cart.items" :key="idx">
                    <div class="bg-[#133129] p-3 rounded-2xl border border-white/10 flex gap-3 items-center">
                        <img :src="item.image" alt="item.name" class="w-14 h-14 object-cover rounded-xl bg-black/20 shrink-0">
                        <div class="flex-1 min-w-0">
                            <h4 class="text-xs font-bold text-white truncate" x-text="item.name"></h4>
                            <span class="text-[10px] text-gray-400 block font-mono">
                                <span x-show="item.color" x-text="item.color + ' • '"></span>
                                Ukuran: <span class="text-[#D8B761]" x-text="item.size"></span>
                            </span>
                            <span class="text-xs font-mono font-bold text-[#D8B761]" x-text="$store.cart.formatRupiah(item.price)"></span>
                        </div>
                        <div class="flex flex-col items-end gap-1.5 shrink-0">
                            <button type="button" @click="$store.cart.remove(idx)" class="text-gray-400 hover:text-red-400 text-xs">✕</button>
                            <div class="flex items-center border border-white/20 rounded-lg overflow-hidden bg-[#081F1C]">
                                <button type="button" @click="$store.cart.updateQty(idx, -1)" class="px-2 py-0.5 text-xs text-gray-300 hover:bg-white/10">−</button>
                                <span class="px-2 text-xs font-mono font-bold text-white" x-text="item.qty"></span>
                                <button type="button" @click="$store.cart.updateQty(idx, 1)" class="px-2 py-0.5 text-xs text-gray-300 hover:bg-white/10">+</button>
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            {{-- Checkout Footer -> Langsung arah WhatsApp --}}
            <div class="pt-4 border-t border-white/10 space-y-3 pb-6 sm:pb-0">
                <div class="flex justify-between items-center text-xs">
                    <span class="text-gray-400 font-medium">Total Belanja:</span>
                    <span class="text-lg font-black text-[#D8B761] font-mono" x-text="$store.cart.formatRupiah($store.cart.totalPrice())"></span>
                </div>
                <button type="button"
                        @click="$store.cart.checkoutWa()"
                        :disabled="$store.cart.items.length === 0"
                        class="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.274.072.376-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.152.569 4.17 1.564 5.917l-1.664 6.083 6.223-1.633c1.7 1.002 3.69 1.573 5.823 1.573 6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
                    </svg>
                    <span>Lanjut Pesan ke WhatsApp</span>
                </button>
            </div>
        </div>
    </div>

    {{-- MAIN CONTENT --}}
    <main class="flex-1">
        @yield('content')
    </main>

    {{-- MOBILE FLOATING BOTTOM NAV --}}
    <div x-show="!$store.cart.isOpen"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0 translate-y-4"
         x-transition:enter-end="opacity-100 translate-y-0"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100 translate-y-0"
         x-transition:leave-end="opacity-0 translate-y-4"
         class="md:hidden fixed bottom-4 inset-x-4 z-40 bg-[#133129]/95 backdrop-blur-lg border border-white/15 rounded-2xl shadow-2xl p-2 flex items-center justify-around text-xs font-bold">
        <a href="{{ url('/') }}" class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition {{ request()->is('/') ? 'text-[#D8B761] bg-[#081F1C]' : 'text-gray-300 hover:text-white' }}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="text-[10px]">Beranda</span>
        </a>

        <a href="{{ url('/catalog') }}" class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition {{ request()->is('catalog*') ? 'text-[#D8B761] bg-[#081F1C]' : 'text-gray-300 hover:text-white' }}">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
            <span class="text-[10px]">Katalog</span>
        </a>

        <button type="button" @click="$store.cart.isOpen = true" class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-white hover:text-[#D8B761] transition relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <span class="text-[10px]">Keranjang</span>
            <span x-show="$store.cart.totalCount() > 0" x-text="$store.cart.totalCount()"
                  class="absolute top-0 right-2 bg-[#D8B761] text-[#081F1C] text-[9px] font-black px-1 rounded-full"></span>
        </button>

        <a href="https://wa.me/6281313888927?text=Halo%20Admin%20OEPRO,%20saya%20ingin%20bertanya%20mengenai%20produk%20OEPRO.%20Boleh%20minta%20informasi%20lebih%20lanjut%20mengenai%20pilihan%20produk,%20ketersediaan%20stok,%20serta%20promo%20GRATIS%20ONGKIR%20yang%20sedang%20berlaku%3F%20Terima%20kasih!" target="_blank"
           class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-gray-300 hover:text-white transition">
            <img src="/assets/icons/whatsapp.svg" alt="WhatsApp" class="w-5 h-5 object-contain">
            <span class="text-[10px]">WhatsApp</span>
        </a>
    </div>

    {{-- FOOTER (Dilengkapi Marketplace & Social Links sesuai instruksi) --}}
    <footer class="bg-[#041210] text-[#DCE5E0] border-t border-white/10 mt-16 sm:mt-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                
                {{-- Col 1: Brand & Desc --}}
                <div class="md:col-span-2 space-y-4">
                    <span class="text-3xl font-extrabold tracking-tight text-white">oepro</span>
                    <p class="text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                        Produksi kaos polos, polo shirt pique premium, dan lengan panjang berbahan 100% katun murni berkualitas standar ekspor. Nyaman, adem, dan awet dicuci.
                    </p>
                    <div class="text-xs text-gray-400">
                        WhatsApp CS: <strong class="text-white">+62 813-1388-8927</strong>
                    </div>
                </div>

                {{-- Col 2: Kategori --}}
                <div class="space-y-3">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-[#D8B761]">Koleksi Produk</h4>
                    <ul class="space-y-2 text-xs text-gray-400">
                        <li><a href="{{ url('/catalog?category=polo-shirt') }}" class="hover:text-[#D8B761] transition">Kaos Polo Pique</a></li>
                        <li><a href="{{ url('/catalog?category=cotton-combed-24s') }}" class="hover:text-[#D8B761] transition">Kaos Polos Combed 24s</a></li>
                        <li><a href="{{ url('/catalog?category=longsleeve') }}" class="hover:text-[#D8B761] transition">Kaos Lengan Panjang</a></li>
                        <li><a href="{{ url('/catalog') }}" class="hover:text-[#D8B761] transition">Semua Produk</a></li>
                    </ul>
                </div>

                {{-- Col 3: Official Marketplace & Social Media Links --}}
                <div class="space-y-4">
                    <h4 class="text-xs font-bold uppercase tracking-wider text-[#D8B761]">Official Store & Sosmed</h4>
                    <div class="flex items-center gap-3">
                        {{-- Shopee Logo Button --}}
                        <a href="https://id.shp.ee/HJUio6qQ" target="_blank" rel="noopener noreferrer"
                           title="Shopee Official Store"
                           class="w-11 h-11 rounded-2xl bg-[#EE4D2D] hover:bg-[#d43f20] text-white flex items-center justify-center p-2.5 shadow-lg transition-transform hover:scale-110">
                            <img src="/assets/icons/shopee.svg" alt="Shopee" class="w-full h-full object-contain">
                        </a>

                        {{-- Tokopedia Logo Button --}}
                        <a href="https://www.tiktok.com/@oepro.official?_r=1&_t=ZS-9BbqmThyTgu" target="_blank" rel="noopener noreferrer"
                           title="Tokopedia Official"
                           class="w-11 h-11 rounded-2xl bg-[#03AC0E] hover:bg-[#02920c] text-white flex items-center justify-center p-2.5 shadow-lg transition-transform hover:scale-110">
                            <img src="/assets/icons/tokopedia.png" alt="Tokopedia" class="w-full h-full object-contain">
                        </a>

                        {{-- TikTok Shop / TikTok Mall Logo Button --}}
                        <a href="https://vt.tiktok.com/ZSseXR2kY/?page=Mall" target="_blank" rel="noopener noreferrer"
                           title="TikTok Shop Mall"
                           class="w-11 h-11 rounded-2xl bg-black hover:bg-neutral-900 border border-white/20 text-white flex items-center justify-center p-2.5 shadow-lg transition-transform hover:scale-110">
                            <img src="/assets/icons/tiktok.svg" alt="TikTok Shop" class="w-full h-full object-contain">
                        </a>

                        {{-- TikTok Sosmed Logo Button --}}
                        <a href="https://www.tiktok.com/@oepro.official?_r=1&_t=ZS-9BbqmThyTgu" target="_blank" rel="noopener noreferrer"
                           title="TikTok @oepro.official"
                           class="w-11 h-11 rounded-2xl bg-[#010101] hover:bg-neutral-800 border border-[#D8B761]/40 text-[#D8B761] flex items-center justify-center p-2.5 shadow-lg transition-transform hover:scale-110">
                            <img src="/assets/icons/tiktok.svg" alt="TikTok Akun" class="w-full h-full object-contain">
                        </a>

                        {{-- WhatsApp CS Logo Button --}}
                        <a href="https://wa.me/6281313888927" target="_blank" rel="noopener noreferrer"
                           title="WhatsApp Official CS"
                           class="w-11 h-11 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center p-2.5 shadow-lg transition-transform hover:scale-110">
                            <img src="/assets/icons/whatsapp.svg" alt="WhatsApp CS" class="w-full h-full object-contain">
                        </a>
                    </div>
                    <p class="text-[11px] text-gray-400">Klik ikon untuk belanja langsung di platform favorit Anda.</p>
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
