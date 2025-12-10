/**
 * Product SKU identifiers
 */
export enum SKU {
  IPD = 'ipd',
  MBP = 'mbp',
  ATV = 'atv',
  VGA = 'vga',
}

/**
 * Product information
 */
export interface Product {
  sku: SKU;
  name: string;
  price: number;
}
