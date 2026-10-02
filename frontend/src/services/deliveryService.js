import { wilayas } from "../data/wilayas.js";
import { api, hasApi } from "./api.js";

export async function getDeliveryFees() {
  if (hasApi()) return api("/delivery/fees");
  return wilayas.map(({ code, name, deliveryFee }) => ({
    code,
    name,
    fee: deliveryFee,
    homeFee: deliveryFee,
    officeFee: deliveryFee,
  }));
}

export function getDeliveryFee(wilaya, method = "home") {
  if (hasApi()) {
    return getDeliveryFees().then(
      (fees) => {
        const rate = fees.find((item) => item.name === wilaya || item.code === wilaya);
        return method === "office" ? rate?.officeFee ?? 0 : rate?.homeFee ?? rate?.fee ?? 0;
      },
    );
  }
  return wilayas.find((item) => item.name === wilaya || item.code === wilaya)?.deliveryFee ?? 0;
}