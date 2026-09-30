import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../../hooks/useCart";
import { useUI } from "../../../hooks/useUI";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";
import { formatPrice } from "../../../utils/formatPrice";
import { FREE_DELIVERY_THRESHOLD, PLACEHOLDER_IMAGE } from "../../../config/constants";
import { CloseIcon, TrashIcon, ArrowIcon } from "../../ui/Icons";
import QuantitySelector from "../../ui/QuantitySelector/QuantitySelector";
import Button from "../../ui/Button/Button";
import "./CartDrawer.css";

const onImageError = (e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = PLACEHOLDER_IMAGE;
};

export default function CartDrawer() {
  const { isCartOpen, closeCart } = useUI();
  const { lines, count, subtotal, deliveryFee, total, updateQuantity, removeItem } = useCart();

  useLockBodyScroll(isCartOpen);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCartOpen, closeCart]);

  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;

  return (
    <>
      <div
        className={`drawer-overlay ${isCartOpen ? "is-open" : ""}`}
        onClick={closeCart}
      />
      <aside
        className={`drawer ${isCartOpen ? "is-open" : ""}`}
        aria-hidden={!isCartOpen}
        aria-label="Panier"
      >
        <div className="drawer__head">
          <h2 aria-live="polite">Votre panier {count > 0 && <span>({count})</span>}</h2>
          <button className="drawer__close" onClick={closeCart} aria-label="Fermer le panier">
            <CloseIcon />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer__empty">
            <p className="drawer__empty-title">Votre panier est vide</p>
            <p>Découvrez nos pièces pour une maison plus chaleureuse.</p>
            <Button to="/shop" onClick={closeCart} icon={<ArrowIcon />}>
              Découvrir la boutique
            </Button>
          </div>
        ) : (
          <>
            <ul className="drawer__items">
              {lines.map(({ key, product, variant, quantity }) => (
                <li key={key} className="cart-line">
                  <Link to={`/product/${product.slug}`} onClick={closeCart} className="cart-line__img">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      onError={onImageError}
                      loading="lazy"
                    />
                  </Link>

                  <div className="cart-line__info">
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={closeCart}
                      className="cart-line__name"
                    >
                      {product.name}
                    </Link>
                    {variant && <span className="cart-line__variant">{variant}</span>}
                    <span className="cart-line__unit">{formatPrice(product.price)}</span>

                    <div className="cart-line__controls">
                      <QuantitySelector
                        size="sm"
                        value={quantity}
                        onChange={(q) => updateQuantity(key, q)}
                      />
                      <button
                        className="cart-line__remove"
                        onClick={() => removeItem(key)}
                        aria-label={`Retirer ${product.name}`}
                      >
                        <TrashIcon width={18} height={18} />
                      </button>
                    </div>
                  </div>

                  <span className="cart-line__total">{formatPrice(product.price * quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="drawer__footer">
              {remaining > 0 ? (
                <p className="drawer__hint">
                  Plus que <strong>{formatPrice(remaining)}</strong> pour la livraison gratuite
                </p>
              ) : (
                <p className="drawer__hint drawer__hint--ok">Livraison offerte 🌸</p>
              )}

              <dl className="drawer__totals">
                <div><dt>Sous-total</dt><dd>{formatPrice(subtotal)}</dd></div>
                <div>
                  <dt>Livraison</dt>
                  <dd>{deliveryFee === 0 ? "Offerte" : formatPrice(deliveryFee)}</dd>
                </div>
                <div className="drawer__total"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
              </dl>

              <div className="drawer__actions">
                <Button to="/checkout" onClick={closeCart} full size="lg">
                  Checkout
                </Button>
                <Button variant="outline" full onClick={closeCart}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}