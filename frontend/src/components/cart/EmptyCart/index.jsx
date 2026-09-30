import Button from "../../ui/Button/Button";
import { ArrowIcon } from "../../ui/Icons";
import "./EmptyCart.css";
import "./EmptyCart.css";

export default function EmptyCart() {
	return (
		<div className="empty-cart">
			<h2>Votre panier est vide</h2>
			<p>Découvrez nos pièces pour une maison plus chaleureuse.</p>
			<Button to="/shop" icon={<ArrowIcon />}>Découvrir la boutique</Button>
		</div>
	);
}