import Button from "../../ui/Button/Button";
import Reveal from "../../ui/Reveal";

export default function PromoBanner() {
	return (
		<section className="promo container">
			<Reveal className="promo__content">
				<div className="promo__text">
					<p className="eyebrow">Collection déco</p>
					<h2>Little details, warmer spaces.</h2>
					<p>Des pièces choisies avec soin pour rendre votre intérieur plus chaleureux, chaque jour.</p>
					<Button to="/shop" variant="dark">Shop the collection</Button>
				</div>
				<div className="promo__image">
					<img src="/images/Gemini_Generated_Image_5brz1p5brz1p5brz.jfif" alt="Détails déco de la collection Daisy Home" loading="lazy" />
				</div>
			</Reveal>
		</section>
	);
}
