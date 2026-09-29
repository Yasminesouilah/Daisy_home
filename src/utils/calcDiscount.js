// (2900, 3600) -> 19
export function calcDiscount(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}