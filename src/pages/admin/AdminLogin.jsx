import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import { login } from '../../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login({ username, password });
      const { token, user } = res.data;

      localStorage.setItem('oepro_admin_token', token);
      localStorage.setItem('oepro_admin_auth', JSON.stringify({
        token,
        username: user?.name || username,
        role: user?.role || 'Super Admin',
        loginAt: new Date().toISOString()
      }));

      navigate('/admin');
    } catch (err) {
      const msg = err.response?.data?.message || 'Kredensial tidak valid. Silakan coba lagi.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col justify-center items-center px-4 py-12 selection:bg-neutral-900 selection:text-white">
      {/* Back to Store */}
      <a
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Katalog OEPRO
      </a>

      {/* Card */}
      <div className="w-full max-w-md bg-white border border-[#E5E5E0] rounded-2xl p-8 shadow-xl shadow-neutral-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-950 text-white mb-3">
            <Lock className="w-5 h-5 text-amber-400" />
          </div>
          <span className="block text-[11px] font-bold tracking-widest text-[#2D4A3E] uppercase mb-1">
            OEPRO APPAREL · MANAGEMENT
          </span>
          <h1 className="text-2xl font-bold text-neutral-950 tracking-tight">
            Portal Admin OEPRO
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Masuk untuk mengelola produk, harga diskon, katalog, dan stok inventaris.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Username / Email
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FBFBFA] border border-[#E5E5E0] rounded-xl focus:bg-white focus:border-neutral-950 focus:outline-hidden transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#FBFBFA] border border-[#E5E5E0] rounded-xl focus:bg-white focus:border-neutral-950 focus:outline-hidden transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1.5">
              Default akses demo: <code className="text-neutral-700 font-semibold">admin</code> / <code className="text-neutral-700 font-semibold">admin123</code>
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-neutral-950 text-white hover:bg-neutral-800 font-semibold text-sm rounded-xl transition duration-150 flex items-center justify-center gap-2 shadow-md shadow-neutral-950/10 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Masuk ke Panel Admin</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#E5E5E0] text-center">
          <p className="text-[11px] text-neutral-400">
            OEPRO Cloud Architecture &copy; 2026. Hak Akses Terbatas.
          </p>
        </div>
      </div>
    </div>
  );
}