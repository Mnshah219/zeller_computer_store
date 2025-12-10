import { SKU } from '../types/product';
import { PricingRuleRequest } from './pricing-rule';

export const getItemCount = (context: PricingRuleRequest, sku: SKU): number =>
  context.scannedItems.reduce((count, current) => (current === sku ? count + 1 : count), 0);

export const getUnitPrice = (context: PricingRuleRequest, sku: SKU): number | null => {
  const product = context.productCatalog.getProduct(sku);
  return product ? product.price : null;
};

