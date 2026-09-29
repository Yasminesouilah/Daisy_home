import Button from "../../ui/Button/Button";
import { ArrowIcon } from "../../ui/Icons";

export default function Hero() {
	return (
		<section className="hero">
			<div className="hero__image">
				<img
					  src="/images/Gemini_Generated_Image_lk6ltdlk6ltdlk6l.jfif"
					alt="Sélection de décoration Daisy Home"
					fetchPriority="high"
				/>
			</div>
			<div className="hero__content">
				<p className="eyebrow">Daisy Home · Algerie</p>
				<h1>Make your space feel like home.</h1>
				<p className="hero__text">Elegant home decor, thoughtfully curated for a warmer, more beautiful everyday.</p>
				<div className="hero__actions">
					<Button to="/shop" size="lg" icon={<ArrowIcon />}>Shop now</Button>
					<Button to="/shop" size="lg" variant="outline">Explore collection</Button>
				</div>
			</div>
		</section>
	);
}