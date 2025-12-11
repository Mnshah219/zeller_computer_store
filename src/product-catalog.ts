import { Product, SKU } from './types/product';

 export class ProductCatalog {
  private products: Product[];

  constructor(products: Product[] = defaultProducts) {
    this.products = products;
  }

  getProduct(sku: SKU): Product | undefined {
    return this.products.find(p => p.sku === sku);
  }

  hasProduct(sku: SKU): boolean {
    return this.products.some(p => p.sku === sku);
  }
}

export const defaultProducts: Product[] = [
  { sku: SKU.IPD, name: 'Super iPad', price: 549.99 },
  { sku: SKU.MBP, name: 'MacBook Pro', price: 1399.99 },
  { sku: SKU.ATV, name: 'Apple TV', price: 109.50 },
  { sku: SKU.VGA, name: 'VGA adapter', price: 30.00 },
]