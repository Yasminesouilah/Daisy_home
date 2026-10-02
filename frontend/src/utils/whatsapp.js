import { SITE } from "../config/site.js";

export function buildWhatsAppLink(message = SITE.whatsappMessage) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function buildOrderWhatsAppLink(order) {
  const lines = order.items.map((item) => `${item.quantity} x ${item.name}`).join("\n");
  return buildWhatsAppLink(`Bonjour, je souhaite confirmer la commande ${order.id}:\n${lines}`);
}

export function normalizeWhatsAppNumber(phone) {
  const raw = String(phone ?? "").trim();
  const hasInternationalPrefix = raw.startsWith("+") || raw.startsWith("00");
  let digits = raw.replace(/\D/g, "");

  if (digits.startsWith("00")) digits = digits.slice(2);

  if (digits.startsWith("213")) {
    let nationalNumber = digits.slice(3);
    if (nationalNumber.startsWith("0")) nationalNumber = nationalNumber.slice(1);
    return /^[5-7]\d{8}$/.test(nationalNumber) ? `213${nationalNumber}` : null;
  }

  if (digits.startsWith("0")) digits = digits.slice(1);
  if (/^[5-7]\d{8}$/.test(digits)) return `213${digits}`;
  if (hasInternationalPrefix && /^\d{8,15}$/.test(digits)) return digits;
  return null;
}

export function buildMessageWhatsAppLink(phone, name, originalMessage) {
  const number = normalizeWhatsAppNumber(phone);
  if (!number) return null;

  const reply = `Bonjour ${name}, merci d'avoir contacté Daisy Home. Nous revenons vers vous au sujet de votre message : « ${originalMessage} »`;
  const url = new URL(`https://wa.me/${number}`);
  url.searchParams.set("text", reply);
  return url.toString();
}