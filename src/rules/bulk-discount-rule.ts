import { PricingRule, PricingRuleRequest, PricingRuleResult } from './pricing-rule';
import { SKU } from '../types/product';
import { getItemCount, getUnitPrice } from './pricing-helpers';

export class BulkDiscountRule implements PricingRule {
  constructor(
    private readonly targetSku: SKU,
    private readonly minQuantity: number,
    private readonly discountedPrice: number
  ) {}

  appliesTo(context: PricingRuleRequest): boolean {
    const quantity = getItemCount(context, this.targetSku);
    return quantity > this.minQuantity;
  }

  calculatePrice(context: PricingRuleRequest): PricingRuleResult {
    const quantity = getItemCount(context, this.targetSku);
    const unitPrice = getUnitPrice(context, this.targetSku);

    if (!unitPrice || !this.appliesTo(context)) {
      return {
        discount: 0,
        isApplicable: false,
      };
    }

    const perUnitSavings = Math.max(unitPrice - this.discountedPrice, 0);
    const discount = perUnitSavings * quantity;

    return {
      discount,
      isApplicable: discount > 0,
    };
  }
}
