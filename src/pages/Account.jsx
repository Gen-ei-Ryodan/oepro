import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, Package, ShieldCheck, Plus, Check, Edit2 } from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';

export default function Account() {
  const { profile, updateProfile, orders } = useOrders();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'addresses'
  const [formData, setFormData] = useState({
    name: profile.name || '',
    phone: profile.phone || '',
    email: profile.email || '',
    gender: profile.gender || 'Laki-laki',
    birthDate: profile.birthDate || '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    showToast('Profil akun berhasil diperbarui!');
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-32 sm:pb-16 bg-[#FBFBFA]">
      <div className="mb-8 pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
          Akun Pembeli
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Kelola profil identitas, buku alamat pengiriman, dan preferensi akun OEPRO Anda
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Nav (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-bold text-lg flex items-center justify-center shadow-md">
                {profile.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{profile.name}</h3>
                <p className="text-xs text-slate-500">{profile.email}</p>
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Member Terverifikasi
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'profile'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Biodata Diri</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  activeTab === 'addresses'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Buku Alamat Pengiriman</span>
              </button>
              <Link
                to="/history"
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-500" />
                  <span>Riwayat Pesanan</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-200 text-slate-800 rounded-full">
                  {orders.length}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Tab (8 cols) */}
        <div className="lg:col-span-8">
          {activeTab === 'profile' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Biodata Diri</h2>
                  <p className="text-xs text-slate-500">Kelola informasi nama dan kontak pribadi</p>
                </div>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-3.5 py-1.5 border border-slate-300 hover:bg-slate-50 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Ubah Profil</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Batal
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-75 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nomor WhatsApp / HP</label>
                    <input
                      type="tel"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-75 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                    <input
                      type="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-75 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Jenis Kelamin</label>
                    <select
                      disabled={!isEditing}
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl disabled:opacity-75 focus:bg-white"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-md hover:bg-slate-800 transition"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Buku Alamat Pengiriman</h2>
                  <p className="text-xs text-slate-500">Daftar alamat tersimpan untuk mempercepat proses checkout</p>
                </div>
              </div>

              <div className="space-y-4">
                {profile.addresses?.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition bg-slate-50/50 space-y-2 relative"
                  >
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-bold text-slate-900">{addr.label}</strong>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                          Alamat Utama
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      {addr.recipientName} ({addr.phone})
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {addr.address}, {addr.district}, {addr.city}, {addr.province} {addr.postalCode}
                    </p>
                    {addr.notes && (
                      <p className="text-[11px] text-slate-400 italic">
                        Catatan: {addr.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
