import Button from "../../ui/Button/Button";
import Reveal from "../../ui/Reveal";

export default function BrandIntro() {
	return (
		<section className="brand-intro container">
			<Reveal className="brand-intro__image">
				<img src="/images/Gemini_Generated_Image_75iptm75iptm75ip.jfif" alt="Un intérieur chaleureux signé Daisy Home" loading="lazy" />
			</Reveal>
			<Reveal delay={1} className="brand-intro__text">
				<p className="eyebrow">Notre histoire</p>
				<h2>Daisy Home</h2>
				<p>Chez Daisy Home, nous croyons que chaque maison a une histoire. Nous sélectionnons avec soin des pièces de décoration et d'art de vivre pour créer un intérieur chaleureux, élégant et authentique.</p>
				<Button to="/about" variant="ghost">En savoir plus</Button>
				<span className="brand-intro__script">Home Sweet Home</span>
			</Reveal>
		</section>
	);
}
