import { PricingRule, PricingRuleRequest, PricingRuleResult } from './pricing-rule';
import { SKU } from '../types/product';
import { getItemCount, getUnitPrice } from './pricing-helpers';

export class ThreeForTwoRule implements PricingRule {
  constructor(private readonly targetSku: SKU) {}

  appliesTo(context: PricingRuleRequest): boolean {
    const quantity = getItemCount(context, this.targetSku);
    return quantity >= 3;
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

    const groupsOfThree = Math.floor(quantity / 3);
    const discountedItems = groupsOfThree * 2;
    const remainingItems = quantity % 3;
    const totalPriceWithOffer = (discountedItems + remainingItems) * unitPrice;
    const fullPrice = quantity * unitPrice;
    const discount = Math.max(fullPrice - totalPriceWithOffer, 0);

    return {
      discount,
      isApplicable: discount > 0,
    };
  }
}
