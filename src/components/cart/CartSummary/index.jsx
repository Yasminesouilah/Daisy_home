import { formatPrice } from "../../../utils/formatPrice";
import Button from "../../ui/Button/Button";
import { ArrowIcon } from "../../ui/Icons";
import "./CartSummary.css";
import "./CartSummary.css";

export default function CartSummary({ subtotal, deliveryFee, total, showCheckoutButton = true }) {
	return (
		<section className="cart-summary" aria-label="Récapitulatif du panier">
			<h2>Récapitulatif</h2>
			<dl>
				<div><dt>Sous-total</dt><dd>{formatPrice(subtotal)}</dd></div>
				<div><dt>Livraison</dt><dd>{deliveryFee === 0 ? "Offerte" : formatPrice(deliveryFee)}</dd></div>
				<div className="cart-summary__total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
			</dl>
			{showCheckoutButton && <Button to="/checkout" size="lg" full icon={<ArrowIcon />}>Passer la commande</Button>}
		</section>
	);
}