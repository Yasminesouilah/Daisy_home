import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../hooks/useCart";
import { formatPrice } from "../utils/formatPrice";
import { calcDiscount } from "../utils/calcDiscount";
import ProductGallery from "../components/product/ProductGallery";
import VariantPicker from "../components/product/VariantPicker";
import ProductInfoTabs from "../components/product/ProductInfoTabs";
import RelatedProducts from "../components/product/RelatedProducts";
import Badge from "../components/ui/Badge/Badge";
import QuantitySelector from "../components/ui/QuantitySelector/QuantitySelector";
import Button from "../components/ui/Button/Button";
import Skeleton from "../components/ui/Skeleton";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id: slug } = useParams();
  const { product, related, loading, notFound } = useProduct(slug);
  const { addItem } = useCart();
  const [variant, setVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
    setVariant(product?.variants?.[0]?.options?.[0] ?? null);
  }, [product]);

  if (notFound) return <Navigate to="/shop" replace />;
  if (loading || !product) {
    return (
      <main className="page container product-page" aria-label="Chargement du produit">
        <div className="product-page__layout" aria-hidden="true">
          <Skeleton variant="image" />
          <div className="product-page__skeleton-info">
            <Skeleton variant="line" style={{ width: "60%", height: 32 }} />
            <Skeleton variant="line" style={{ width: "30%" }} />
            <Skeleton variant="line" style={{ width: "40%", height: 28 }} />
            <Skeleton variant="line" style={{ width: "90%" }} />
            <Skeleton variant="line" style={{ width: "70%" }} />
          </div>
        </div>
      </main>
    );
  }

  const discount = calcDiscount(product.price, product.oldPrice);
  const needsVariant = product.variants?.length > 0;
  const handleAdd = () => {
    addItem(product.id, { quantity, variant });
    setAdded(true);
  };

  return (
    <main className="page container product-page">
      <nav className="breadcrumb" aria-label="Fil d’Ariane">
        <Link to="/">Accueil</Link><span aria-hidden="true">/</span><Link to="/shop">Boutique</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span>
      </nav>
      <div className="product-page__layout">
        <ProductGallery images={product.images} name={product.name} />
        <div className="product-page__info">
          {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
          {discount === 0 && product.isNew && <Badge variant="new">Nouveau</Badge>}
          <h1>{product.name}</h1>
          <div className="product-page__rating" aria-label={`${product.rating} sur 5, ${product.reviews} avis`}>
            <span aria-hidden="true">{"★".repeat(Math.round(product.rating))}</span><span>{product.reviews} avis</span>
          </div>
          <div className="product-page__price">
            <span>{formatPrice(product.price)}</span>
            {product.oldPrice && <s>{formatPrice(product.oldPrice)}</s>}
          </div>
          <p className="product-page__desc">{product.description}</p>
          {needsVariant && <VariantPicker variants={product.variants} selected={variant} onSelect={(value) => { setVariant(value); setAdded(false); }} />}
          <div className="product-page__add">
            <QuantitySelector value={quantity} onChange={setQuantity} max={Math.min(product.stock || 1, 10)} />
            <Button size="lg" full onClick={handleAdd} disabled={product.stock === 0}>
              {product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
            </Button>
          </div>
          {added && <p className="product-page__confirm" role="status" aria-live="polite">Ajouté à votre panier</p>}
          <ProductInfoTabs description={product.description} />
        </div>
      </div>
      <RelatedProducts products={related} />
    </main>
  );
}