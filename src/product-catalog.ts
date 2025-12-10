import { Product, SKU } from './types/product';

 export class ProductCatalog {
  private products: Product[];

  constructor(products: Product[]) {
    this.products = products;
  }

  getProduct(sku: SKU): Product | undefined {
    return this.products.find(p => p.sku === sku);
  }

  hasProduct(sku: SKU): boolean {
    return this.products.some(p => p.sku === sku);
  }
}