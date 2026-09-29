import { api, hasApi } from "./api.js";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendMessage(values) {
  await delay();
  if (hasApi()) return api("/contact", { method: "POST", body: JSON.stringify(values) });
  return { ok: true, receivedAt: new Date().toISOString(), ...values };
}