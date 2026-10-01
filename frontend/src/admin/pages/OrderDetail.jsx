import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PLACEHOLDER_IMAGE } from "../../config/constants.js";
import { formatPrice } from "../../utils/formatPrice.js";
import StatusBadge from "../components/StatusBadge.jsx";
import { getAdminOrder, updateOrderStatus } from "../services/adminOrderService.js";
import "./OrderDetail.css";

const STATUS_OPTIONS = [
  { value: "pending", label: "En attente" },
  { value: "confirmed", label: "Confirmée" },
  { value: "shipped", label: "Expédiée" },
  { value: "delivered", label: "Livrée" },
  { value: "cancelled", label: "Annulée" },
];

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    getAdminOrder(id)
      .then((data) => {
        if (active) setOrder(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function changeStatus(status) {
    setUpdating(true);
    setError("");
    try {
      setOrder(await updateOrderStatus(id, status));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <p className="order-detail__loading">Chargement de la commande...</p>;
  if (error && !order) return <p className="order-detail__error" role="alert">{error}</p>;
  if (!order) return null;

  const customer = order.customer || {};
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <section className="order-detail">
      <Link to="/admin/orders" className="order-detail__back">Retour aux commandes</Link>

      <header className="order-detail__header">
        <div>
          <p className="order-detail__eyebrow">Commande</p>
          <h1>{order.orderNumber}</h1>
          <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleString("fr-FR")}</time>
        </div>
        <StatusBadge status={order.status} />
      </header>

      {error && <p className="order-detail__error" role="alert">{error}</p>}

      <div className="order-detail__grid">
        <section className="order-detail__section">
          <h2>Articles</h2>
          {items.length ? (
            <ul className="order-detail__items">
              {items.map((item, index) => (
                <li key={`${item.productId}-${index}`}>
                  <img src={item.image || PLACEHOLDER_IMAGE} alt="" />
                  <div className="order-detail__item-info">
                    <strong>{item.name}{item.variant ? ` (${item.variant})` : ""}</strong>
                    <span>Quantité : {item.quantity}</span>
                  </div>
                  <span className="order-detail__item-price">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun article enregistré pour cette commande.</p>
          )}
          <dl className="order-detail__totals">
            <div><dt>Sous-total</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            <div><dt>Livraison</dt><dd>{formatPrice(order.deliveryFee)}</dd></div>
            <div className="order-detail__total"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
          </dl>
        </section>

        <aside className="order-detail__aside">
          <section className="order-detail__section">
            <h2>Statut</h2>
            <div className="order-detail__status-options">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status.value}
                  type="button"
                  aria-pressed={order.status === status.value}
                  className={order.status === status.value ? "is-active" : ""}
                  disabled={updating || order.status === status.value || order.status === "cancelled"}
                  onClick={() => changeStatus(status.value)}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </section>

          <section className="order-detail__section">
            <h2>Client</h2>
            <dl className="order-detail__customer">
              <div><dt>Nom</dt><dd>{customer.fullName || "—"}</dd></div>
              <div><dt>Téléphone</dt><dd>{customer.phone || "—"}</dd></div>
              <div><dt>Wilaya</dt><dd>{customer.wilayaName || customer.wilaya || "—"}</dd></div>
              <div><dt>Commune</dt><dd>{customer.commune || "—"}</dd></div>
              <div><dt>Adresse</dt><dd>{customer.address || "—"}</dd></div>
              {customer.notes && <div><dt>Notes</dt><dd>{customer.notes}</dd></div>}
            </dl>
          </section>
        </aside>
      </div>
    </section>
  );
}