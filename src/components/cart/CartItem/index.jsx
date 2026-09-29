import { Link } from "react-router-dom";
import { formatPrice } from "../../../utils/formatPrice";
import { PLACEHOLDER_IMAGE } from "../../../config/constants";
import { TrashIcon } from "../../ui/Icons";
import QuantitySelector from "../../ui/QuantitySelector/QuantitySelector";
import "./CartItem.css";
import "./CartItem.css";

const onImageError = (event) => {
	event.currentTarget.onerror = null;
	event.currentTarget.src = PLACEHOLDER_IMAGE;
};

export default function CartItem({ line, onUpdateQty, onRemove }) {
	const { key, product, variant, quantity } = line;
	const productUrl = `/product/${product.slug ?? product.id}`;

	return (
		<article className="cart-row">
			<Link to={productUrl} className="cart-row__img">
				<img src={product.images?.[0] ?? product.image ?? PLACEHOLDER_IMAGE} alt={product.name} onError={onImageError} loading="lazy" />
			</Link>
			<div className="cart-row__info">
				<Link to={productUrl} className="cart-row__name">{product.name}</Link>
				{variant && <span className="cart-row__variant">{variant}</span>}
				<span className="cart-row__unit-mobile">{formatPrice(product.price)}</span>
			</div>
			<span className="cart-row__unit">{formatPrice(product.price)}</span>
			<QuantitySelector value={quantity} onChange={(value) => onUpdateQty(key, value)} />
			<span className="cart-row__total">{formatPrice(product.price * quantity)}</span>
			<button type="button" className="cart-row__remove" onClick={() => onRemove(key)} aria-label={`Retirer ${product.name}`}>
				<TrashIcon />
			</button>
		</article>
	);
}