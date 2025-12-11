import { Product, SKU } from './types/product';
import { ProductCatalog } from './product-catalog';
import { PricingRule, PricingRuleRequest, PricingRuleResult } from './rules/pricing-rule';

export class Checkout {
  private scannedItems: SKU[] = [];
  private productCatalog: ProductCatalog;
  private pricingRules: PricingRule[];

  constructor(pricingRules: PricingRule[] = []) {
    this.productCatalog = new ProductCatalog();
    this.pricingRules = pricingRules;
  }

  scan(sku: SKU): void {
    if (!this.productCatalog.hasProduct(sku)) {
      throw new Error(`Product with SKU '${sku}' not found in catalog`);
    }
    this.scannedItems.push(sku);
  }

  total(): number {
    const context: PricingRuleRequest = {
      scannedItems: [...this.scannedItems],
      productCatalog: this.productCatalog,
    };

    const baseTotal = this.scannedItems.reduce((sum, sku) => {
      const product = this.productCatalog.getProduct(sku);
      return product ? sum + product.price : sum;
    }, 0);

    const totalDiscount = this.pricingRules.reduce((discountSum, rule) => {
      const result = rule.calculatePrice(context);
      if (!result.isApplicable) {
        return discountSum;
      }
      return discountSum + result.discount;
    }, 0);

    const grandTotal = Math.max(baseTotal - totalDiscount, 0);

    // Round to 2 decimal places to avoid floating point issues
    return Math.round(grandTotal * 100) / 100;
  }
}
