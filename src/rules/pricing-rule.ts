import { ProductCatalog } from '../product-catalog';
import { SKU } from '../types/product';

export interface PricingRuleRequest {
  scannedItems: SKU[];
  productCatalog: ProductCatalog;
}

export interface PricingRuleResult {
  discount: number;
  isApplicable: boolean;
}

export interface PricingRule {
  appliesTo(context: PricingRuleRequest): boolean;
  calculatePrice(context: PricingRuleRequest): PricingRuleResult;
}
