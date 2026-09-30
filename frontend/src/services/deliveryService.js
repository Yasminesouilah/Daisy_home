import { wilayas } from "../data/wilayas.js";
import { api, hasApi } from "./api.js";

export function getDeliveryFee(wilaya) {
  if (hasApi()) return api(`/delivery/${encodeURIComponent(wilaya)}`);
  return wilayas.find((item) => item.name === wilaya || item.code === wilaya)?.deliveryFee ?? 0;
}