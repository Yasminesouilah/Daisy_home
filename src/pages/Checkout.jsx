import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useOrder } from "../hooks/useOrder";
import { WILAYAS } from "../data/wilayas";
import { validateCheckout } from "../utils/validators";
import { createOrder } from "../services/orderService";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";
import PaymentMethod from "../components/checkout/PaymentMethod";
import Button from "../components/ui/Button/Button";
import "./Checkout.css";

const EMPTY_VALUES = { fullName: "", phone: "", wilaya: "", commune: "", address: "", notes: "" };

export default function Checkout() {
  const { lines, subtotal, clearCart, loading } = useCart();
  const { setLastOrder } = useOrder();
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const wilaya = WILAYAS.find((item) => item.code === values.wilaya);
  const deliveryFee = wilaya ? wilaya.fee : 0;
  const total = subtotal + deliveryFee;

  const handleChange = (field, value) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setSubmitError("");
  };

  if (loading) return <main className="page container checkout-page"><p role="status">Chargement du panier...</p></main>;
  if (lines.length === 0) return <Navigate to="/cart" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;
    const validationErrors = validateCheckout(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const order = await createOrder({
        customer: { ...values, wilayaName: wilaya?.name ?? "" },
        lines,
        subtotal,
        deliveryFee,
        total,
      });
      setLastOrder(order);
      clearCart();
      navigate("/order-confirmation");
    } catch {
      setSubmitError("Une erreur est survenue. Veuillez réessayer.");
      setSubmitting(false);
    }
  };

  return (
    <main className="page container checkout-page">
      <p className="eyebrow">Commande</p>
      <h1>Finaliser la commande</h1>
      <form className="checkout-page__layout" onSubmit={handleSubmit} noValidate>
        <div className="checkout-page__form">
          <CheckoutForm values={values} errors={errors} onChange={handleChange} />
          <PaymentMethod />
        </div>
        <div className="checkout-page__summary">
          <OrderSummary lines={lines} subtotal={subtotal} deliveryFee={deliveryFee} total={total} wilayaName={wilaya?.name} />
          {submitError && <p className="checkout-page__error" role="alert">{submitError}</p>}
          <Button type="submit" size="lg" full disabled={submitting}>{submitting ? "Envoi en cours..." : "Confirmer la commande"}</Button>
          <p className="checkout-page__note">Aucun compte requis. Nous vous contacterons par téléphone pour confirmer votre commande.</p>
        </div>
      </form>
    </main>
  );
}