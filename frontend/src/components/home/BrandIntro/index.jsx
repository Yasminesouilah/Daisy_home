import Button from "../../ui/Button/Button";
import Reveal from "../../ui/Reveal";

export default function BrandIntro() {
	return (
		<section className="brand-intro container">
			<Reveal className="brand-intro__image">
				<img src="/images/Gemini_Generated_Image_75iptm75iptm75ip.jfif" alt="Un intérieur chaleureux signé Daisy Home" loading="lazy" />
			</Reveal>
			<div className="brand-intro__text">
				<Reveal as="p" className="eyebrow" delay={0}>Notre histoire</Reveal>
				<Reveal as="h2" delay={1} className="brand-intro__title">Daisy Home</Reveal>
				<Reveal as="p" delay={2} className="brand-intro__copy">
					Chez Daisy Home, nous croyons que chaque maison a une histoire. Nous sélectionnons avec soin des pièces de décoration et d'art de vivre pour créer un intérieur chaleureux, élégant et authentique.
				</Reveal>
				<Reveal delay={3} className="brand-intro__cta">
					<Button to="/about" variant="ghost">En savoir plus</Button>
				</Reveal>
				<Reveal as="span" delay={3} className="brand-intro__script">Home Sweet Home ♡</Reveal>
			</div>
		</section>
	);
}
