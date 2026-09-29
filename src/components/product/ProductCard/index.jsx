import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../hooks/useCart";
import { PLACEHOLDER_IMAGE } from "../../../config/constants";
import { calcDiscount } from "../../../utils/calcDiscount";
import { formatPrice } from "../../../utils/formatPrice";
import Badge from "../../ui/Badge/Badge";
import Button from "../../ui/Button/Button";
import QuantitySelector from "../../ui/QuantitySelector/QuantitySelector";

const onImageError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = PLACEHOLDER_IMAGE;
};

export default function ProductCard({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const productUrl = `/product/${product.slug ?? product.id}`;
  const discount = calcDiscount(product.price, product.oldPrice);
  const hasVariants = product.variants?.length > 0;

  const handleAdd = () => {
    if (hasVariants) {
      navigate(productUrl);
      return;
    }
    addItem(product.id, { quantity });
  };

  return (
    <article className="product-card">
      <Link to={productUrl} className="product-card__media">
        {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
        {discount === 0 && product.isNew && <Badge variant="new">Nouveau</Badge>}
        <img
          src={product.images?.[0] ?? product.image ?? PLACEHOLDER_IMAGE}
          alt={product.name}
          loading="lazy"
          onError={onImageError}
        />
      </Link>
      <div className="product-card__body">
        <Link to={productUrl} className="product-card__name">{product.name}</Link>
        <div className="product-card__rating" aria-label={`${product.rating} sur 5, ${product.reviews} avis`}>
          <span aria-hidden="true">{"★".repeat(Math.round(product.rating ?? 0))}</span>
          <span>({product.reviews ?? 0})</span>
        </div>
        <div className="product-card__price">
          <span>{formatPrice(product.price)}</span>
          {product.oldPrice && <s>{formatPrice(product.oldPrice)}</s>}
        </div>
        <div className="product-card__actions">
          {!hasVariants && <QuantitySelector size="sm" value={quantity} onChange={setQuantity} />}
          <Button size="sm" full={hasVariants} onClick={handleAdd}>
            {hasVariants ? "Voir le produit" : "Ajouter au panier"}
          </Button>
        </div>
      </div>
    </article>
  );
}