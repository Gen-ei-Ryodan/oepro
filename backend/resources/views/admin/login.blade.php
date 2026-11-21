<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin - OEPRO</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
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
</head>
<body class="bg-[#081F1C] font-sans antialiased flex items-center justify-center min-h-screen p-4 selection:bg-sage selection:text-dark">

    <div class="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        
        {{-- Brand Header --}}
        <div class="text-center space-y-2">
            <span class="text-3xl font-black tracking-tighter text-primary">OEPRO</span>
            <h1 class="text-lg font-bold text-gray-900">Admin Portal</h1>
            <p class="text-xs text-gray-400">Silakan login untuk mengelola katalog produk, kategori, dan banner.</p>
        </div>

        {{-- Errors --}}
        @if($errors->any())
        <div class="bg-red-50 border border-red-200 text-red-800 text-xs px-4 py-3 rounded-xl font-medium">
            {{ $errors->first() }}
        </div>
        @endif

        {{-- Form --}}
        <form action="{{ route('admin.login.post') }}" method="POST" class="space-y-4">
            @csrf
            
            <div class="space-y-1">
                <label class="block text-xs font-bold text-gray-700">Email Admin</label>
                <input type="email" name="email" value="{{ old('email', 'admin@oepro.id') }}" required autofocus
                       placeholder="admin@oepro.id"
                       class="w-full px-4 py-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden transition">
            </div>

            <div class="space-y-1">
                <label class="block text-xs font-bold text-gray-700">Password</label>
                <input type="password" name="password" required
                       placeholder="••••••••"
                       class="w-full px-4 py-3 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary focus:outline-hidden transition">
            </div>

            <button type="submit" class="w-full py-3.5 bg-primary hover:bg-dark text-white font-bold rounded-xl shadow-lg transition text-xs uppercase tracking-wider">
                Masuk ke Dashboard Admin
            </button>
        </form>

        <div class="text-center pt-2">
            <a href="{{ url('/') }}" class="text-xs text-gray-400 hover:text-primary transition font-medium">
                ← Kembali ke Toko Online
            </a>
        </div>
    </div>

</body>
</html>
