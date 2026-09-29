import Hero from "../components/home/Hero";
import CategoryStrip from "../components/home/CategoryStrip";
import BestSellers from "../components/home/BestSellers";
import PromoBanner from "../components/home/PromoBanner";
import BrandIntro from "../components/home/BrandIntro";
import Testimonials from "../components/home/Testimonials";
import InstagramFeed from "../components/home/InstagramFeed";

export default function Home() {
	return (
		<main>
			<Hero />
			<CategoryStrip />
			<BestSellers />
			<PromoBanner />
			<BrandIntro />
			<Testimonials />
			<InstagramFeed />
		</main>
	);
}