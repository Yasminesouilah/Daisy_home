import { Navigate } from "react-router-dom";
import { useOrder } from "../hooks/useOrder";
import { formatPrice } from "../utils/formatPrice";
import SuccessAnimation from "../components/order/SuccessAnimation";
import Button from "../components/ui/Button/Button";
import "./OrderConfirmation.css";
import "./OrderConfirmation.css";

export default function OrderConfirmation() {
	const { lastOrder } = useOrder();
	if (!lastOrder) return <Navigate to="/" replace />;

	const { orderNumber, customer, items, subtotal, deliveryFee, total } = lastOrder;

	return (
		<main className="page container confirmation-page">
			<SuccessAnimation />
			<p className="eyebrow">Commande reçue</p>
			<h1>Merci pour votre commande</h1>
			<p className="confirmation-page__thanks">Merci, {customer.fullName}.</p>
			<p className="confirmation-page__number">Référence <strong>#{orderNumber}</strong></p>

			<section className="confirmation-page__card" aria-label="Détail de la commande">
				<ul className="confirmation-page__items">
					{items.map((item) => (
						<li key={`${item.productId}-${item.variant ?? "default"}`}>
							<span>{item.name}{item.variant ? ` (${item.variant})` : ""} × {item.quantity}</span>
							<span>{formatPrice(item.price * item.quantity)}</span>
						</li>
					))}
				</ul>
				<dl className="confirmation-page__totals">
					<div><dt>Sous-total</dt><dd>{formatPrice(subtotal)}</dd></div>
					<div><dt>Livraison</dt><dd>{deliveryFee === 0 ? "Offerte" : formatPrice(deliveryFee)}</dd></div>
					<div className="confirmation-page__total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
				</dl>
			</section>

			<section className="confirmation-page__delivery">
				<h2>Adresse de livraison</h2>
				<p>{customer.address}, {customer.commune}, {customer.wilayaName}</p>
				<p>{customer.phone}</p>
			</section>
			<p className="confirmation-page__next">Nous vous contacterons par téléphone pour confirmer votre commande.</p>
			<div className="confirmation-page__actions">
				<Button to="/shop" variant="outline">Continuer mes achats</Button>
				<Button to="/">Retour à l’accueil</Button>
			</div>
		</main>
	);
}