import { useProducts } from "../../../hooks/useProducts";
import ProductGrid from "../../product/ProductGrid";
import SectionTitle from "../../ui/SectionTitle";
import { ProductGridSkeleton } from "../../ui/Skeleton";

export default function BestSellers() {
	const { data, loading, error } = useProducts();
	const products = [...data].sort((first, second) => second.popularity - first.popularity).slice(0, 4);

	return (
		<section className="best-sellers container">
			<SectionTitle eyebrow="Best sellers" title="Nos coups de cœur" viewAllTo="/shop?sort=popular" />
			{loading && <ProductGridSkeleton count={4} />}
			{error && <p className="best-sellers__status" role="alert">Les produits sont momentanément indisponibles.</p>}
			{!loading && !error && <ProductGrid products={products} />}
		</section>
	);
}