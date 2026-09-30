import "./PaymentMethod.css";

export default function PaymentMethod() {
	return (
		<fieldset className="payment-method">
			<legend>Paiement</legend>
			<label className="payment-method__option">
				<input type="radio" name="paymentMethod" value="COD" checked readOnly />
				<span><strong>Paiement à la livraison</strong><span>Payez en espèces à la réception de votre commande.</span></span>
			</label>
		</fieldset>
	);
}