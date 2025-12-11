import { Checkout } from '../src/checkout';
import { ThreeForTwoRule } from '../src/rules/three-for-two-rule';
import { BulkDiscountRule } from '../src/rules/bulk-discount-rule';
import { SKU, Product } from '../src/types/product';
import { PricingRule } from '../src/rules/pricing-rule';
import { getItemCount, getUnitPrice } from '../src/rules/pricing-helpers';

const createCheckout = (pricingRules: PricingRule[] = []) =>
  new Checkout(pricingRules);

describe('Checkout System', () => {
  describe('Basic functionality', () => {
    it('should calculate total for single item', () => {
      const co = createCheckout();
      co.scan(SKU.ATV);
      expect(co.total()).toBe(109.50);
    });

    it('should calculate total for multiple different items', () => {
      const co = createCheckout();
      co.scan(SKU.ATV);
      co.scan(SKU.VGA);
      expect(co.total()).toBe(139.50);
    });

    it('should calculate total for multiple same items', () => {
      const co = createCheckout();
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      expect(co.total()).toBe(219.00);
    });

    it('should throw error for invalid SKU', () => {
      const co = createCheckout();
      expect(() => co.scan('invalid' as any)).toThrow("Product with SKU 'invalid' not found in catalog");
    });
  });

  describe('Three-for-two rule', () => {
    it('should apply 3-for-2 deal on Apple TVs', () => {
      const pricingRules = [new ThreeForTwoRule(SKU.ATV)];
      const co = createCheckout(pricingRules);
      
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      
      // 3 Apple TVs, pay for 2: 2 * 109.50 = 219.00
      expect(co.total()).toBe(219.00);
    });

    it('should handle 3-for-2 deal with extra items', () => {
      const pricingRules = [new ThreeForTwoRule(SKU.ATV)];
      const co = createCheckout(pricingRules);
      
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      
      // 4 Apple TVs: 1 group of 3 (pay for 2) + 1 extra = 3 * 109.50 = 328.50
      expect(co.total()).toBe(328.50);
    });

    it('should handle multiple groups of 3', () => {
      const pricingRules = [new ThreeForTwoRule(SKU.ATV)];
      const co = createCheckout(pricingRules);
      
      // 6 Apple TVs: 2 groups of 3, pay for 4 total
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      
      // 2 groups of 3 = pay for 4: 4 * 109.50 = 438.00
      expect(co.total()).toBe(438.00);
    });

    it('should not apply 3-for-2 to other products', () => {
      const pricingRules = [new ThreeForTwoRule(SKU.ATV)];
      const co = createCheckout(pricingRules);
      
      co.scan(SKU.VGA);
      co.scan(SKU.VGA);
      co.scan(SKU.VGA);
      
      // 3 VGA adapters, no discount: 3 * 30.00 = 90.00
      expect(co.total()).toBe(90.00);
    });
  });

  describe('Bulk discount rule', () => {
    it('should apply bulk discount when buying more than 4 Super iPads', () => {
      const pricingRules = [new BulkDiscountRule(SKU.IPD, 4, 499.99)];
      const co = createCheckout(pricingRules);
      
      co.scan(SKU.IPD);
      co.scan(SKU.IPD);
      co.scan(SKU.IPD);
      co.scan(SKU.IPD);
      co.scan(SKU.IPD);
      
      // 5 Super iPads with bulk discount: 5 * 499.99 = 2499.95
      expect(co.total()).toBe(2499.95);
    });

    it('should not apply bulk discount when buying 4 or fewer Super iPads', () => {
      const pricingRules = [new BulkDiscountRule(SKU.IPD, 4, 499.99)];
      const co = createCheckout(pricingRules);
      
      co.scan(SKU.IPD);
      co.scan(SKU.IPD);
      co.scan(SKU.IPD);
      co.scan(SKU.IPD);
      
      // 4 Super iPads, no discount: 4 * 549.99 = 2199.96
      expect(co.total()).toBe(2199.96);
    });

    it('should not apply bulk discount to other products', () => {
      const pricingRules = [new BulkDiscountRule(SKU.IPD, 4, 499.99)];
      const co = createCheckout(pricingRules);
      
      co.scan(SKU.MBP);
      co.scan(SKU.MBP);
      co.scan(SKU.MBP);
      co.scan(SKU.MBP);
      co.scan(SKU.MBP);
      
      // 5 MacBook Pros, no discount: 5 * 1399.99 = 6999.95
      expect(co.total()).toBe(6999.95);
    });
  });

  describe('Example scenarios from requirements', () => {
    it('should handle scenario 1: atv, atv, atv, vga', () => {
      const pricingRules = [
        new ThreeForTwoRule(SKU.ATV),
      ];
      const co = createCheckout(pricingRules);
      
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      co.scan(SKU.VGA);
      
      // 3 Apple TVs (3-for-2): 2 * 109.50 = 219.00
      // 1 VGA adapter: 30.00
      // Total: 249.00
      expect(co.total()).toBe(249.00);
    });

    it('should handle scenario 2: atv, ipd, ipd, atv, ipd, ipd, ipd', () => {
      const pricingRules = [
        new ThreeForTwoRule(SKU.ATV),
        new BulkDiscountRule(SKU.IPD, 4, 499.99),
      ];
      const co = createCheckout(pricingRules);
      
      co.scan(SKU.ATV);
      co.scan(SKU.IPD);
      co.scan(SKU.IPD);
      co.scan(SKU.ATV);
      co.scan(SKU.IPD);
      co.scan(SKU.IPD);
      co.scan(SKU.IPD);
      
      // 2 Apple TVs: 2 * 109.50 = 219.00
      // 5 Super iPads (bulk discount): 5 * 499.99 = 2499.95
      // Total: 2718.95
      expect(co.total()).toBe(2718.95);
    });
  });

  describe('Flexible pricing rules', () => {
    it('should work with no pricing rules', () => {
      const co = createCheckout();
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      
      // No discount: 3 * 109.50 = 328.50
      expect(co.total()).toBe(328.50);
    });

    it('should combine multiple applicable pricing rules', () => {
      // Extra rule: flat $10 off when at least 3 Apple TVs are in the cart
      const customRule: PricingRule = {
        appliesTo: (context) => getItemCount(context, SKU.ATV) >= 3,
        calculatePrice: (context) => {
          const quantity = getItemCount(context, SKU.ATV);
          const unitPrice = getUnitPrice(context, SKU.ATV);

          if (!unitPrice || quantity < 3) {
            return { discount: 0, isApplicable: false };
          }

          return { discount: 10, isApplicable: true };
        },
      };
      
      const pricingRules = [
        new ThreeForTwoRule(SKU.ATV),
        customRule,
      ];
      const co = createCheckout(pricingRules);
      
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      co.scan(SKU.ATV);
      
      // Three-for-two discount: -109.50
      // Custom flat discount: -10.00
      // Base: 3 * 109.50 = 328.50
      // Total: 209.00
      expect(co.total()).toBe(209.00);
    });

    it('should handle items scanned in any order', () => {
      const pricingRules = [
        new ThreeForTwoRule(SKU.ATV),
        new BulkDiscountRule(SKU.IPD, 4, 499.99),
      ];
      const co = createCheckout(pricingRules);
      
      // Scan in different order
      co.scan(SKU.IPD);
      co.scan(SKU.ATV);
      co.scan(SKU.IPD);
      co.scan(SKU.ATV);
      co.scan(SKU.IPD);
      co.scan(SKU.IPD);
      co.scan(SKU.IPD);
      co.scan(SKU.ATV);
      
      // 3 Apple TVs (3-for-2): 2 * 109.50 = 219.00
      // 5 Super iPads (bulk discount): 5 * 499.99 = 2499.95
      // Total: 2718.95
      expect(co.total()).toBe(2718.95);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty cart', () => {
      const co = createCheckout();
      expect(co.total()).toBe(0);
    });

    it('should handle very large quantities', () => {
      const pricingRules = [new ThreeForTwoRule(SKU.ATV)];
      const co = createCheckout(pricingRules);
      
      // 10 Apple TVs: 3 groups of 3 (pay for 6) + 1 extra = 7 * 109.50 = 766.50
      for (let i = 0; i < 10; i++) {
        co.scan(SKU.ATV);
      }
      
      expect(co.total()).toBe(766.50);
    });
  });
});
