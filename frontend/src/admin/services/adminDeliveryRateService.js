import { adminApi } from "./adminApi.js";

export function getAdminDeliveryRates() {
  return adminApi.get("/delivery-rates");
}

export function updateAdminDeliveryRate(code, fees) {
  return adminApi.patch(`/delivery-rates/${encodeURIComponent(code)}`, fees);
}