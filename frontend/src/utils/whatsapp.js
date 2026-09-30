import { SITE } from "../config/site.js";

export function buildWhatsAppLink(message = SITE.whatsappMessage) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function buildOrderWhatsAppLink(order) {
  const lines = order.items.map((item) => `${item.quantity} x ${item.name}`).join("\n");
  return buildWhatsAppLink(`Bonjour, je souhaite confirmer la commande ${order.id}:\n${lines}`);
}