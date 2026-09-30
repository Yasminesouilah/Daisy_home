import { WILAYAS } from "../data/wilayas.js";

export function getDeliveryFees(req, res) {
  res.json(WILAYAS);
}