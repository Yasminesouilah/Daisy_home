import ProductCard from "../ProductCard";
import Reveal from "../../ui/Reveal";

export default function ProductGrid({ products, variant, accessibleStartIndex = 0, accessibleEndIndex = products.length }) {
	return (
		<div className="product-grid">
			{products.map((product, index) => {
				const isDuplicate = index < accessibleStartIndex || index >= accessibleEndIndex;
				return (
					<Reveal
						key={`${product.id}-${index}`}
						delay={index % 4}
						aria-hidden={isDuplicate || undefined}
						inert={isDuplicate || undefined}
					>
						<ProductCard product={product} variant={variant} />
					</Reveal>
				);
			})}
		</div>
	);
}