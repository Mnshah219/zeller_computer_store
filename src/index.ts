import { Checkout } from './checkout';
import { ThreeForTwoRule } from './rules/three-for-two-rule';
import { BulkDiscountRule } from './rules/bulk-discount-rule';
import { SKU } from './types/product';

console.log('Example 1: atv, atv, atv, vga');
const pricingRules1 = [
  new ThreeForTwoRule(SKU.ATV),
];
export const products = [
  { sku: SKU.IPD, name: 'Super iPad', price: 549.99 },
  { sku: SKU.MBP, name: 'MacBook Pro', price: 1399.99 },
  { sku: SKU.ATV, name: 'Apple TV', price: 109.50 },
  { sku: SKU.VGA, name: 'VGA adapter', price: 30.00 },
]
const co1 = new Checkout(products, pricingRules1);
co1.scan(SKU.ATV);
co1.scan(SKU.ATV);
co1.scan(SKU.ATV);
co1.scan(SKU.VGA);
console.log(`Total: $${co1.total().toFixed(2)}`);
console.log('Expected: $249.00\n');

console.log('Example 2: atv, ipd, ipd, atv, ipd, ipd, ipd');
const pricingRules2 = [
  new ThreeForTwoRule(SKU.ATV),
  new BulkDiscountRule(SKU.IPD, 4, 499.99),
];
const co2 = new Checkout(products, pricingRules2);
co2.scan(SKU.ATV);
co2.scan(SKU.IPD);
co2.scan(SKU.IPD);
co2.scan(SKU.ATV);
co2.scan(SKU.IPD);
co2.scan(SKU.IPD);
co2.scan(SKU.IPD);
console.log(`Total: $${co2.total().toFixed(2)}`);
console.log('Expected: $2718.95\n');

console.log('Example 3: Regular pricing (no rules)');
const co3 = new Checkout(products);
co3.scan(SKU.MBP);
co3.scan(SKU.VGA);
console.log(`Total: $${co3.total().toFixed(2)}`);
console.log('Expected: $1429.99');
