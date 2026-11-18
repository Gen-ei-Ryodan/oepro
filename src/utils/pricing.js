/**
 * OEPRO Official Tiered Pricing per Size & Category
 * 
 * TS (Basic T-Shirt 24s / Kaos Polos):
 * XS-XL = 62.000
 * 2XL   = 67.000
 * 3XL   = 72.000
 * 4XL   = 77.000
 * 5XL   = 82.000
 * 6XL   = 87.000
 * 7XL   = 92.000
 * 8XL   = 97.000
 * 
 * LS (Basic Longsleeve / Kaos Lengan Panjang):
 * XS-XL = 72.000
 * 2XL   = 79.000
 * 3XL   = 86.000
 * 4XL   = 93.000
 * 5XL   = 100.000
 * 6XL   = 107.000
 * 7XL   = 114.000
 * 8XL   = 121.000
 * 
 * Polo (Kaos Polo Premium):
 * XS-XL = 92.000
 * 2XL   = 100.000
 * 3XL   = 108.000
 * 4XL   = 116.000
 * 5XL   = 124.000
 * 6XL   = 132.000
 * 7XL   = 140.000
 * 8XL   = 148.000
 */

export const PRICING_TABLE = {
  TS: {
    name: 'Basic T-Shirt 24s (TS)',
    basePrice: 62000,
    tiers: {
      'XS': 62000,
      'S': 62000,
      'M': 62000,
      'L': 62000,
      'XL': 62000,
      '2XL': 67000,
      '3XL': 72000,
      '4XL': 77000,
      '5XL': 82000,
      '6XL': 87000,
      '7XL': 92000,
      '8XL': 97000,
    }
  },
  LS: {
    name: 'Basic Longsleeve (LS)',
    basePrice: 72000,
    tiers: {
      'XS': 72000,
      'S': 72000,
      'M': 72000,
      'L': 72000,
      'XL': 72000,
      '2XL': 79000,
      '3XL': 86000,
      '4XL': 93000,
      '5XL': 100000,
      '6XL': 107000,
      '7XL': 114000,
      '8XL': 121000,
    }
  },
  POLO: {
    name: 'Kaos Polo Premium',
    basePrice: 92000,
    tiers: {
      'XS': 92000,
      'S': 92000,
      'M': 92000,
      'L': 92000,
      'XL': 92000,
      '2XL': 100000,
      '3XL': 108000,
      '4XL': 116000,
      '5XL': 124000,
      '6XL': 132000,
      '7XL': 140000,
      '8XL': 148000,
    }
  }
};

export function detectProductType(product) {
  if (!product) return 'TS';
  const text = `${product.name || ''} ${product.category || ''} ${product.category_slug || ''} ${product.sku || ''}`.toLowerCase();

  if (text.includes('polo')) return 'POLO';
  if (text.includes('longsleeve') || text.includes('long sleeve') || text.includes('lengan panjang') || text.includes('-ls-')) return 'LS';
  return 'TS';
}

export function getProductPriceBySize(product, size) {
  if (!product) return 62000;
  const type = detectProductType(product);
  const table = PRICING_TABLE[type];
  const normalizedSize = (size || 'M').toUpperCase().trim();

  if (table && table.tiers[normalizedSize]) {
    return table.tiers[normalizedSize];
  }

  // Fallback to table basePrice or product.price
  return table ? table.basePrice : (product.price || 62000);
}

export function getProductOriginalPriceBySize(product, size) {
  const currentPrice = getProductPriceBySize(product, size);
  // Estimate coret price ~20-25% higher
  return Math.round(currentPrice * 1.25 / 1000) * 1000;
}
