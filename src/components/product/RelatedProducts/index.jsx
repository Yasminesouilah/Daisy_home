import ProductGrid from "../ProductGrid";
import SectionTitle from "../../ui/SectionTitle";
import "./RelatedProducts.css";

export default function RelatedProducts({ products }) {
	if (!products?.length) return null;
	return (
		<section className="related">
			<SectionTitle eyebrow="Découvrir aussi" title="Vous aimerez aussi" />
			<ProductGrid products={products} />
		</section>
	);
}