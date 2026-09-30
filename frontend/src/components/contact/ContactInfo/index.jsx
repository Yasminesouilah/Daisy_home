import { SITE } from "../../../config/site";
import { InstagramIcon, WhatsAppIcon } from "../../ui/Icons";
import "./ContactInfo.css";
import "./ContactInfo.css";

export default function ContactInfo() {
	const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage)}`;
	const phoneUrl = `tel:${SITE.phone.replace(/[^\d+]/g, "")}`;

	return (
		<div className="contact-info">
			<div className="contact-info__item">
				<span className="contact-info__label">Téléphone</span>
				<a href={phoneUrl}>{SITE.phone}</a>
			</div>
			<div className="contact-info__item">
				<span className="contact-info__label">Email</span>
				<a href={`mailto:${SITE.email}`}>{SITE.email}</a>
			</div>
			<div className="contact-info__item">
				<span className="contact-info__label">Adresse</span>
				<span>{SITE.address}</span>
			</div>
			<div className="contact-info__actions">
				<a href={whatsappUrl} target="_blank" rel="noreferrer" className="contact-info__whatsapp">
					<WhatsAppIcon width={20} height={20} /> Discuter sur WhatsApp
				</a>
				<a href={SITE.instagramUrl} target="_blank" rel="noreferrer" className="contact-info__instagram">
					<InstagramIcon width={20} height={20} /> @{SITE.instagram}
				</a>
			</div>
		</div>
	);
}