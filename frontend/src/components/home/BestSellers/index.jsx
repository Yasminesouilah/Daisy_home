import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../../hooks/useProducts";
import ProductGrid from "../../product/ProductGrid";
import Reveal from "../../ui/Reveal";
import { ProductGridSkeleton } from "../../ui/Skeleton";
import { ArrowIcon } from "../../ui/Icons";

export default function BestSellers() {
	const { data, loading, error } = useProducts();
	const railRef = useRef(null);
	const products = [...data].sort((first, second) => second.popularity - first.popularity).slice(0, 8);

	useEffect(() => {
		const rail = railRef.current;
		if (!rail || products.length === 0) return;

		const cards = rail.querySelectorAll(".product-grid > .reveal");
		const featuredCard = cards[Math.min(2, cards.length - 1)];
		if (!featuredCard) return;

		const railBounds = rail.getBoundingClientRect();
		const cardBounds = featuredCard.getBoundingClientRect();
		const cardCenter = cardBounds.left - railBounds.left + cardBounds.width / 2;
		rail.scrollLeft += cardCenter - rail.clientWidth / 2;
	}, [products.length]);

	const moveRail = (direction) => {
		const rail = railRef.current;
		const card = rail?.querySelector(".product-grid > .reveal");
		const track = rail?.querySelector(".product-grid");
		if (!rail || !card || !track) return;

		const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 24;
		rail.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap) });
	};

	return (
		<section className="best-sellers">
			<div className="container best-sellers__inner">
				<div className="best-sellers__intro">
					<Reveal className="best-sellers__heading">
						<h2>Best Sellers</h2>
					</Reveal>
					<div className="best-sellers__controls">
						<Link to="/shop?sort=popular" className="best-sellers__view-all">
							Voir tout <ArrowIcon width={18} height={18} />
						</Link>
						<div className="best-sellers__arrows">
							<button className="best-sellers__arrow best-sellers__arrow--previous" type="button" onClick={() => moveRail(-1)} aria-label="Produits précédents" disabled={products.length < 2}>
								<ArrowIcon width={18} height={18} />
							</button>
							<button className="best-sellers__arrow" type="button" onClick={() => moveRail(1)} aria-label="Produits suivants" disabled={products.length < 2}>
								<ArrowIcon width={18} height={18} />
							</button>
						</div>
					</div>
				</div>
				{error && <p className="best-sellers__status" role="alert">Les produits sont momentanément indisponibles.</p>}
				{!loading && !error && products.length === 0 && (
					<p className="best-sellers__status" role="status">Notre sélection du moment arrive bientôt.</p>
				)}
			</div>
			{loading && (
				<div className="best-sellers__viewport best-sellers__viewport--loading">
					<ProductGridSkeleton count={4} />
				</div>
			)}
			{!loading && !error && products.length > 0 && (
				<div className="best-sellers__viewport" ref={railRef} tabIndex={0} role="region" aria-roledescription="carousel" aria-label="Produits les plus populaires">
					<ProductGrid products={products} variant="rail" />
				</div>
			)}
		</section>
	);
}