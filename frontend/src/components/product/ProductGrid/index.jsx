import ProductCard from "../ProductCard";
import Reveal from "../../ui/Reveal";

export default function ProductGrid({ products }) {
	return (
		<div className="product-grid">
			{products.map((product, index) => (
				<Reveal key={product.id} delay={index % 4}>
					<ProductCard product={product} />
				</Reveal>
			))}
		</div>
	);
}