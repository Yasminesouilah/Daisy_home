import { CURRENCY } from "../config/constants";

// 2900 -> "2 900 DA"
export function formatPrice(value) {
  const n = Math.round(Number(value) || 0);
  return `${n.toLocaleString("fr-FR").replace(/[\u202f\u00a0]/g, "\u00a0")}\u00a0${CURRENCY}`;
}