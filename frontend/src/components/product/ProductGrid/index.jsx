import ProductCard from "../ProductCard";
import Reveal from "../../ui/Reveal";

export default function ProductGrid({ products, variant }) {
	return (
		<div className="product-grid">
			{products.map((product, index) => (
				<Reveal key={product.id} delay={index % 4}>
					<ProductCard product={product} variant={variant} />
				</Reveal>
			))}
		</div>
	);
}