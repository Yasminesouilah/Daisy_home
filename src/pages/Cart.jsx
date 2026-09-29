import { useCart } from "../hooks/useCart";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyCart from "../components/cart/EmptyCart";
import Button from "../components/ui/Button/Button";
import "./Cart.css";

export default function Cart() {
  const { lines, subtotal, deliveryFee, total, updateQuantity, removeItem, loading } = useCart();

  return (
    <main className="page container cart-page">
      <p className="eyebrow">Panier</p>
      <h1>Votre panier</h1>
      {loading ? (
        <p className="cart-page__loading" role="status">Chargement du panier...</p>
      ) : lines.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="cart-page__layout">
          <div className="cart-page__items">
            {lines.map((line) => <CartItem key={line.key} line={line} onUpdateQty={updateQuantity} onRemove={removeItem} />)}
            <Button variant="ghost" to="/shop">Continuer mes achats</Button>
          </div>
          <CartSummary subtotal={subtotal} deliveryFee={deliveryFee} total={total} />
        </div>
      )}
    </main>
  );
}