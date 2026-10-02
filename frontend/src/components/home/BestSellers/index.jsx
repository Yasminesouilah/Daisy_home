import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../../hooks/useProducts";
import ProductGrid from "../../product/ProductGrid";
import Reveal from "../../ui/Reveal";
import { ProductGridSkeleton } from "../../ui/Skeleton";
import { ArrowIcon } from "../../ui/Icons";

export default function BestSellers() {
	const { data, loading, error } = useProducts();
	const railRef = useRef(null);
	const [loopMetrics, setLoopMetrics] = useState(null);
	const products = [...data].sort((first, second) => second.popularity - first.popularity).slice(0, 8);

	useLayoutEffect(() => {
		const rail = railRef.current;
		if (!rail || products.length < 2) return;

		const measureTrack = () => {
			const card = rail.querySelector(".product-grid > .reveal");
			const track = rail.querySelector(".product-grid");
			if (!card || !track) return;

			const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 24;
			const step = card.getBoundingClientRect().width + gap;
			const distance = step * products.length;
			const centeredStart = distance
				+ Number.parseFloat(getComputedStyle(track).paddingLeft)
				+ step / 2;
			setLoopMetrics({
				start: centeredStart,
				distance,
				duration: distance / 55,
			});
		};

		measureTrack();
		window.addEventListener("resize", measureTrack);
		return () => window.removeEventListener("resize", measureTrack);
	}, [products.length]);

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
				<div
					className={`best-sellers__viewport${loopMetrics ? " best-sellers__viewport--animated" : ""}`}
					ref={railRef}
					tabIndex={0}
					role="region"
					aria-roledescription="carousel"
					aria-label="Produits les plus populaires"
					style={loopMetrics ? {
						"--carousel-start": `${loopMetrics.start}px`,
						"--carousel-distance": `${loopMetrics.distance}px`,
						"--carousel-duration": `${loopMetrics.duration}s`,
					} : undefined}
				>
					<ProductGrid
						products={[...products, ...products, ...products]}
						variant="rail"
						accessibleStartIndex={products.length}
						accessibleEndIndex={products.length * 2}
					/>
				</div>
			)}
		</section>
	);
}