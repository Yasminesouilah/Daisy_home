
import { SITE } from "../../../config/site.js";
import { WhatsAppIcon } from "../../ui/Icons";
import "./WhatsAppButton.css";

export default function WhatsAppButton() {
  const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage)}`;

  return (
    <a
      className="whatsapp-fab"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Discuter sur WhatsApp"
    >
      <WhatsAppIcon width={28} height={28} />
    </a>
  );
}