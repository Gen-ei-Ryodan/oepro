import { getProductPriceBySize } from './pricing';

export const STORE_WA_NUMBER = '628113458177';

export const formatRupiah = (num) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const createWhatsAppOrderLink = (items, totalAmount, customNote = '') => {
  let text = `Halo Admin OEPRO, saya ingin memesan produk berikut:\n\n`;

  items.forEach((item, index) => {
    const colorName = item.color?.name || item.color || '-';
    const size = item.size || '-';
    const unitPrice = item.price || getProductPriceBySize(item.product, size);
    const subtotalItem = unitPrice * (item.quantity || 1);

    text += `${index + 1}. *${item.product?.name || 'Produk OEPRO'}*\n`;
    text += `   - Warna: ${colorName}\n`;
    text += `   - Ukuran: ${size} (${formatRupiah(unitPrice)}/pcs)\n`;
    text += `   - Jumlah: ${item.quantity} pcs\n`;
    text += `   - Subtotal: ${formatRupiah(subtotalItem)}\n\n`;
  });

  const totalQty = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  text += `--------------------------------\n`;
  text += `*Total Item:* ${totalQty} pcs\n`;
  text += `*Total Belanja:* ${formatRupiah(totalAmount)}\n\n`;

  if (customNote) {
    text += `*Catatan Khusus:* ${customNote}\n\n`;
  }

  text += `Mohon info ketersediaan stok & total ongkir ke alamat saya ya:\n`;
  text += `Nama:\n`;
  text += `Alamat Lengkap:\n`;
  text += `Kota / Kec:\n`;
  text += `No. HP:\n\n`;
  text += `Terima kasih!`;

  return `https://wa.me/${STORE_WA_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const createWhatsAppProductLink = (product, color, size, qty = 1, customPrice = null) => {
  const colorName = color?.name || color || '-';
  const sizeText = size || '-';
  const unitPrice = customPrice !== null && customPrice !== undefined 
    ? customPrice 
    : getProductPriceBySize(product, sizeText);
  const priceFormatted = formatRupiah(unitPrice * qty);

  let text = `Halo Admin OEPRO, saya ingin memesan:\n\n`;
  text += `*${product.name}*\n`;
  text += `- Warna: ${colorName}\n`;
  text += `- Ukuran: ${sizeText}\n`;
  text += `- Jumlah: ${qty} pcs\n`;
  text += `- Harga: ${formatRupiah(unitPrice)} / pcs\n`;
  text += `- Total: ${priceFormatted}\n\n`;
  text += `Apakah varian ini ready stok? Mohon info kelanjutan pemesanannya. Terima kasih!`;

  return `https://wa.me/${STORE_WA_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const createWhatsAppGeneralLink = () => {
  const text = `Halo Admin OEPRO, saya ingin konsultasi seputar produk katun murni COTTON BASIC (Kaos Polos 24s, Polo Pique, & Longsleeve).`;
  return `https://wa.me/${STORE_WA_NUMBER}?text=${encodeURIComponent(text)}`;
};
