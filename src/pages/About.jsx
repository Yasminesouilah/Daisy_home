import Reveal from "../components/ui/Reveal";
import Button from "../components/ui/Button/Button";
import { PLACEHOLDER_IMAGE } from "../config/constants";
import "./About.css";

const onImageError = (event) => {
	event.currentTarget.onerror = null;
	event.currentTarget.src = PLACEHOLDER_IMAGE;
};

export default function About() {
	return (
		<main className="about-page">
			<section className="about-hero container">
				<p className="eyebrow">Notre histoire</p>
				<h1>Daisy Home</h1>
				<p className="about-hero__text">Une marque algérienne née de l’envie de rendre chaque maison plus belle, chaleureuse et personnelle.</p>
			</section>

			<section className="about-story container">
				<Reveal className="about-story__image">
					<img src="/images/Gemini_Generated_Image_75iptm75iptm75ip.jfif" alt="Un intérieur chaleureux imaginé par Daisy Home" loading="lazy" onError={onImageError} />
				</Reveal>
				<Reveal delay={1} className="about-story__text">
					<p className="eyebrow">Notre inspiration</p>
					<h2>Une histoire de détails</h2>
					<p>Daisy Home est né d’une conviction simple : ce sont les petits détails qui transforment un espace en un véritable foyer. Chaque pièce de notre collection est choisie pour sa qualité, sa douceur et son authenticité.</p>
					<p>Nous sélectionnons des objets utiles et beaux, pensés pour accompagner les moments ordinaires qui font une maison.</p>
				</Reveal>
			</section>

			<section className="about-story about-story--reverse container">
				<Reveal className="about-story__text">
					<p className="eyebrow">Notre engagement</p>
					<h2>Choisir avec soin, vivre pleinement</h2>
					<p>Nous croyons en une consommation plus consciente : des matériaux choisis avec attention, des finitions soignées et un service à l’écoute, du premier message jusqu’à la livraison.</p>
					<p>Chaque commande est préparée avec soin, comme si elle était destinée à notre propre maison.</p>
				</Reveal>
				<Reveal delay={1} className="about-story__image">
					<img src="/images/Gemini_Generated_Image_q1w1onq1w1onq1w1.jfif" alt="Détails décoratifs sélectionnés par Daisy Home" loading="lazy" onError={onImageError} />
				</Reveal>
			</section>

			<Reveal as="section" className="about-cta container">
				<h2>Faites de votre maison un lieu qui vous ressemble.</h2>
				<Button to="/shop" size="lg">Découvrir la boutique</Button>
			</Reveal>
		</main>
	);
}