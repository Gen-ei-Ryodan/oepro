import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { resolveImageUrl } from '../services/api';

export default function ProductCard({ product }) {
  const { addToCart, setIsCartOpen } = useCart();

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Default', hex: '#000' };
  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'L';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const success = addToCart(product, defaultColor, defaultSize, 1);
    if (success) {
      setIsCartOpen(true);
    }
  };

  const primaryImage = product.images && product.images.length > 0
    ? resolveImageUrl(product.images[0])
    : '/assets/brand/oepro-logo.webp';

  return (
    <div className="group relative flex flex-col bg-gradient-to-b from-[#153528] to-[#0F2A24] rounded-2xl border border-[#24443B] hover:border-[#A8C4B5]/60 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300">
      
      {/* 1. IMAGE CONTAINER */}
      <Link
        to={`/product/${product.id}`}
        className="relative w-full aspect-[3/4] bg-white overflow-hidden block cursor-pointer"
      >
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/assets/brand/oepro-logo.webp';
          }}
        />

        {/* Quick Add Button on Hover (Desktop) / Bottom right button */}
        <div className="hidden sm:block absolute inset-x-2.5 bottom-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-10">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full py-2 px-3 bg-[#A8C4B5] hover:bg-[#97b5a5] text-[#081F1C] text-xs font-semibold rounded-lg shadow-md flex items-center justify-center gap-1.5 transition min-h-[38px]"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>+ Keranjang Cepat</span>
          </button>
        </div>
      </Link>

      {/* 2. PRODUCT METADATA */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1">
        
        {/* Category & Color Dots */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className="text-[10px] uppercase font-semibold text-white tracking-wider">
            {product.category_slug === 'polo-shirt' ? 'Polo Pique' : product.category_slug === 'basic-longsleeve' ? 'Longsleeve' : 'Cotton 24s'}
          </span>
          
          <div className="flex items-center gap-1">
            {product.colors && product.colors.slice(0, 3).map((c, i) => (
              <span
                key={i}
                className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-[#24443B]"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors && product.colors.length > 3 && (
              <span className="text-[9px] text-white">+{product.colors.length - 3}</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#A8C4B5] transition-colors line-clamp-1 mb-1.5">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        {/* Price & Rating */}
        <div className="mt-auto pt-1 flex items-baseline justify-between gap-1">
          <div>
            <span className="text-[10px] text-white block -mb-0.5 font-medium">Mulai</span>
            <span className="text-xs sm:text-sm font-bold text-white font-mono">
              {formatRupiah(product.price)}
            </span>
            {product.original_price > product.price && (
              <span className="text-[10px] text-white line-through block font-mono">
                {formatRupiah(product.original_price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-0.5 text-[10px] text-white font-medium">
            <Star className="w-3 h-3 text-[#E0BC66] fill-[#E0BC66]" />
            <span>{product.rating}</span>
          </div>
        </div>

        {/* Mobile Quick Add icon button */}
        <div className="sm:hidden mt-2 pt-2 border-t border-[#24443B] flex items-center justify-between">
          <span className="text-[10px] text-white font-normal">Ready Stock</span>
          <button
            type="button"
            onClick={handleQuickAdd}
            className="p-1.5 px-2 bg-[#A8C4B5] hover:bg-[#97b5a5] text-[#081F1C] rounded-lg flex items-center gap-1 text-[10px] font-semibold"
            aria-label="Beli"
          >
            <ShoppingBag className="w-3 h-3" />
            <span>+ Beli</span>
          </button>
        </div>

      </div>
    </div>
  );
}
