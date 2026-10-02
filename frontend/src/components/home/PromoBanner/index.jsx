import Button from "../../ui/Button/Button";
import Reveal from "../../ui/Reveal";

export default function PromoBanner() {
	return (
		<section className="promo container">
			<div className="promo__content">
				<div className="promo__text">
					<Reveal as="p" className="eyebrow" delay={0}>Collection déco</Reveal>
					<Reveal as="h2" delay={1}>Little details, warmer spaces.</Reveal>
					<Reveal as="p" delay={2} className="promo__copy">
						Des pièces choisies avec soin pour rendre votre intérieur plus chaleureux, chaque jour.
					</Reveal>
					<Reveal delay={3} className="promo__cta">
						<Button to="/shop" variant="dark">Shop the collection</Button>
					</Reveal>
				</div>
				<Reveal className="promo__image">
					<img src="/images/Gemini_Generated_Image_5brz1p5brz1p5brz.jfif" alt="Détails déco de la collection Daisy Home" loading="lazy" />
				</Reveal>
			</div>
		</section>
	);
}
