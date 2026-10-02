import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";
import HoursTable from "../components/contact/HoursTable";
import Reveal from "../components/ui/Reveal";
import "./Contact.css";

export default function Contact() {
	return (
		<main className="page container contact-page">
			<section className="contact-page__hero" aria-labelledby="contact-title">
				<img src="/images/hero/hero2.png" alt="" fetchPriority="high" />
				<div className="contact-page__hero-copy">
					<p className="eyebrow">Daisy Home · À votre écoute</p>
					<h1 id="contact-title">Parlons de votre intérieur</h1>
					<p>Une question sur une pièce, une commande ou une livraison ? Notre équipe est là pour vous aider.</p>
					<a href="#contact-details" className="contact-page__hero-link">Nous écrire <span aria-hidden="true">↓</span></a>
				</div>
			</section>

			<section className="contact-page__layout" id="contact-details" aria-label="Nous contacter">
				<Reveal className="contact-page__form-column" delay={1}>
					<p className="contact-page__section-label">Un mot suffit</p>
					<ContactForm />
				</Reveal>
				<Reveal as="aside" className="contact-page__side" delay={2}>
					<div className="contact-page__side-heading">
						<p className="contact-page__section-label">Restons en contact</p>
						<h2>Nous sommes tout près.</h2>
					</div>
					<ContactInfo />
					<HoursTable />
				</Reveal>
			</section>
		</main>
	);
}