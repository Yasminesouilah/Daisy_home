import { Link } from "react-router-dom";
import { CATEGORIES } from "../../../data/categories";
import { PLACEHOLDER_IMAGE } from "../../../config/constants";
import { ArrowIcon } from "../../ui/Icons";
import Reveal from "../../ui/Reveal";

const onImageError = (event) => {
	event.currentTarget.onerror = null;
	event.currentTarget.src = PLACEHOLDER_IMAGE;
};

export default function CategoryStrip() {
	return (
		<section id="categories" className="category-strip container" aria-label="Catégories">
			<div className="category-strip__scroll">
				{CATEGORIES.filter((category) => !category.virtual).map((category, index) => (
					<Reveal key={category.slug} delay={index % 4} className="category-card">
						<Link to={`/shop?category=${category.slug}`}>
							<div className="category-card__img">
								<img src={category.image} alt={category.name} loading="lazy" onError={onImageError} />
							</div>
							<span>{category.name}<ArrowIcon width={14} height={14} /></span>
						</Link>
					</Reveal>
				))}
			</div>
		</section>
	);
}
