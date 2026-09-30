import { formatPrice } from "../../../utils/formatPrice";
import { PLACEHOLDER_IMAGE } from "../../../config/constants";
import "./OrderSummary.css";

const onImageError = (event) => {
	event.currentTarget.onerror = null;
	event.currentTarget.src = PLACEHOLDER_IMAGE;
};

export default function OrderSummary({ lines, subtotal, deliveryFee, total, wilayaName }) {
	return (
		<section className="order-summary" aria-label="Récapitulatif de la commande">
			<h2>Votre commande</h2>
			<ul className="order-summary__items">
				{lines.map((line) => (
					<li key={line.key}>
						<div className="order-summary__thumb">
							<img src={line.product.images?.[0] ?? line.product.image ?? PLACEHOLDER_IMAGE} alt={line.product.name} onError={onImageError} />
							<span className="order-summary__qty">{line.quantity}</span>
						</div>
						<div className="order-summary__info">
							<span className="order-summary__name">{line.product.name}</span>
							{line.variant && <span className="order-summary__variant">{line.variant}</span>}
						</div>
						<span className="order-summary__price">{formatPrice(line.product.price * line.quantity)}</span>
					</li>
				))}
			</ul>
			<dl className="order-summary__totals">
				<div><dt>Sous-total</dt><dd>{formatPrice(subtotal)}</dd></div>
				<div><dt>Livraison{wilayaName ? ` (${wilayaName})` : ""}</dt><dd>{!wilayaName ? "À calculer" : deliveryFee === 0 ? "Offerte" : formatPrice(deliveryFee)}</dd></div>
				<div className="order-summary__total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
			</dl>
		</section>
	);
}