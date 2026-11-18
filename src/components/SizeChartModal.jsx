import React, { useState } from "react";
import { X, Ruler, CheckCircle2 } from "lucide-react";

export default function SizeChartModal({ isOpen, onClose, initialTab = "polo" }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(initialTab === "outer" ? "polo" : initialTab);

  const sizeTables = {
    polo: {
      title: "Kaos Polo Lacoste Pique Hexagon",
      fit: "Regular Fit Unisex (Toleransi jahitan ±1-2 cm)",
      rows: [
        { size: "XS", ld: 48, pb: 68, pl: 17, bb: "40 - 50 kg" },
        { size: "S", ld: 50, pb: 68, pl: 19, bb: "50 - 60 kg" },
        { size: "M", ld: 52, pb: 70, pl: 21, bb: "60 - 70 kg" },
        { size: "L", ld: 54, pb: 72, pl: 23, bb: "70 - 80 kg" },
        { size: "XL", ld: 56, pb: 74, pl: 25, bb: "80 - 90 kg" },
        { size: "2XL", ld: 58, pb: 76, pl: 27, bb: "90 - 100 kg" },
        { size: "3XL", ld: 60, pb: 78, pl: 29, bb: "100 - 110 kg" },
        { size: "4XL", ld: 62, pb: 80, pl: 31, bb: "110 - 120 kg" },
        { size: "5XL", ld: 64, pb: 82, pl: 33, bb: "120 - 130 kg" },
        { size: "6XL", ld: 66, pb: 84, pl: 35, bb: "130 - 140 kg" },
        { size: "7XL", ld: 68, pb: 86, pl: 37, bb: "140 - 150 kg" },
        { size: "8XL", ld: 70, pb: 88, pl: 39, bb: "> 150 kg" },
      ],
    },
    tshirt: {
      title: "Basic T-Shirt 100% Cotton Combed 24s",
      fit: "Comfort Daily Fit Unisex (Toleransi jahitan ±1-2 cm)",
      rows: [
        { size: "XS", ld: 48, pb: 68, pl: 17, bb: "40 - 50 kg" },
        { size: "S", ld: 50, pb: 68, pl: 19, bb: "50 - 60 kg" },
        { size: "M", ld: 52, pb: 70, pl: 21, bb: "60 - 70 kg" },
        { size: "L", ld: 54, pb: 72, pl: 23, bb: "70 - 80 kg" },
        { size: "XL", ld: 56, pb: 74, pl: 25, bb: "80 - 90 kg" },
        { size: "2XL", ld: 58, pb: 76, pl: 27, bb: "90 - 100 kg" },
        { size: "3XL", ld: 60, pb: 78, pl: 29, bb: "100 - 110 kg" },
        { size: "4XL", ld: 62, pb: 80, pl: 31, bb: "110 - 120 kg" },
        { size: "5XL", ld: 64, pb: 82, pl: 33, bb: "120 - 130 kg" },
        { size: "6XL", ld: 66, pb: 84, pl: 35, bb: "130 - 140 kg" },
        { size: "7XL", ld: 68, pb: 86, pl: 37, bb: "140 - 150 kg" },
        { size: "8XL", ld: 70, pb: 88, pl: 39, bb: "> 150 kg" },
      ],
    },
    longsleeve: {
      title: "Basic Longsleeve Combed 24s Rib Wrist",
      fit: "Regular Fit dengan Manset Lengan (Toleransi ±1-2 cm)",
      rows: [
        { size: "XS", ld: 48, pb: 68, pl: 50, bb: "40 - 50 kg" },
        { size: "S", ld: 50, pb: 68, pl: 52, bb: "50 - 60 kg" },
        { size: "M", ld: 52, pb: 70, pl: 54, bb: "60 - 70 kg" },
        { size: "L", ld: 54, pb: 72, pl: 56, bb: "70 - 80 kg" },
        { size: "XL", ld: 56, pb: 74, pl: 58, bb: "80 - 90 kg" },
        { size: "2XL", ld: 58, pb: 76, pl: 60, bb: "90 - 100 kg" },
        { size: "3XL", ld: 60, pb: 78, pl: 62, bb: "100 - 110 kg" },
        { size: "4XL", ld: 62, pb: 80, pl: 64, bb: "110 - 120 kg" },
        { size: "5XL", ld: 64, pb: 82, pl: 66, bb: "120 - 130 kg" },
        { size: "6XL", ld: 66, pb: 84, pl: 68, bb: "130 - 140 kg" },
        { size: "7XL", ld: 68, pb: 86, pl: 70, bb: "140 - 150 kg" },
        { size: "8XL", ld: 70, pb: 88, pl: 72, bb: "> 150 kg" },
      ],
    },
  };

  const current = sizeTables[activeTab] || sizeTables.polo;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 z-10 animate-scale-up">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-slate-100 text-slate-800 rounded-xl">
                <Ruler className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Panduan Ukuran (Size Chart)</h3>
                <p className="text-xs text-slate-500">Standar ukuran pakaian resmi OEPRO Indonesia (XS - 8XL)</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl mb-4 overflow-x-auto text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("polo")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeTab === "polo" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Kaos Polo
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tshirt")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeTab === "tshirt" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Basic T-Shirt
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("longsleeve")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeTab === "longsleeve" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Longsleeve
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("official")}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeTab === "official" ? "bg-white text-slate-900 shadow-xs font-bold text-emerald-800" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Foto Panduan Resmi
            </button>
          </div>

          {/* Official Chart or Table */}
          {activeTab === "official" ? (
            <div className="mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex flex-col items-center justify-center overflow-hidden">
              <img
                src="/assets/brand/size-chart-oepro.webp"
                alt="Size Chart Resmi OEPRO"
                className="max-h-[380px] w-auto rounded-lg object-contain shadow-xs"
              />
              <span className="text-[11px] text-slate-500 mt-2 font-medium">Panduan Ukuran Resmi OEPRO Indonesia</span>
            </div>
          ) : (
          <div className="mb-4">
            <div className="text-xs text-slate-600 mb-2 font-medium flex items-center justify-between">
              <span><strong>{current.title}</strong> &bull; {current.fit}</span>
              <span className="text-slate-400 text-[11px]">Satuan: Centimeter (cm)</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-[300px] overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px] sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-3 bg-slate-50">Size</th>
                    <th className="py-2.5 px-3 text-center bg-slate-50">Lebar Dada (LD)</th>
                    <th className="py-2.5 px-3 text-center bg-slate-50">Panjang (PB)</th>
                    <th className="py-2.5 px-3 text-center bg-slate-50">Panjang Lengan</th>
                    <th className="py-2.5 px-3 text-center bg-slate-50">Estimasi BB</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {current.rows.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="py-2 px-3 font-bold font-sans text-slate-900">{row.size}</td>
                      <td className="py-2 px-3 text-center">{row.ld} cm</td>
                      <td className="py-2 px-3 text-center">{row.pb} cm</td>
                      <td className="py-2 px-3 text-center">{row.pl} cm</td>
                      <td className="py-2 px-3 text-center font-sans font-medium text-slate-600">{row.bb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          )}

          {/* Measurement Advice */}
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tips Memilih Ukuran yang Pas:</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Ukur baju kaos yang paling nyaman Anda kenakan di rumah secara mendatar (dari ketiak kiri ke ketiak kanan untuk <strong>Lebar Dada</strong>). Jika postur Anda di antara dua ukuran, disarankan memilih <strong>satu ukuran lebih besar</strong> untuk fitting santai harian. Tersedia lengkap mulai dari <strong>XS hingga 8XL</strong>.
            </p>
          </div>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
            >
              Saya Mengerti &amp; Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
