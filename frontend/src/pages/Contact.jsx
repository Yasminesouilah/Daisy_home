import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";
import HoursTable from "../components/contact/HoursTable";
import "./Contact.css";

export default function Contact() {
	return (
		<main className="page container contact-page">
			<p className="eyebrow">Contact</p>
			<h1>Parlons de votre intérieur</h1>
			<p className="contact-page__intro">Une question sur un produit, une commande ou une livraison ? Notre équipe vous répond avec plaisir.</p>
			<div className="contact-page__layout">
				<ContactForm />
				<aside className="contact-page__side">
					<ContactInfo />
					<HoursTable />
				</aside>
			</div>
		</main>
	);
}