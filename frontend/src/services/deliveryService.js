import { wilayas } from "../data/wilayas.js";
import { api, hasApi } from "./api.js";

export async function getDeliveryFees() {
  if (hasApi()) return api("/delivery/fees");
  return wilayas.map(({ code, name, deliveryFee }) => ({ code, name, fee: deliveryFee }));
}

export function getDeliveryFee(wilaya) {
  if (hasApi()) {
    return getDeliveryFees().then(
      (fees) => fees.find((item) => item.name === wilaya || item.code === wilaya)?.fee ?? 0,
    );
  }
  return wilayas.find((item) => item.name === wilaya || item.code === wilaya)?.deliveryFee ?? 0;
}