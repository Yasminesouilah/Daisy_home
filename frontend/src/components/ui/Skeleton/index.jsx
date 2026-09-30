import "./Skeleton.css";

export default function Skeleton({ variant = "line", style, className = "" }) {
  return <span className={`skeleton skeleton--${variant} ${className}`} style={style} aria-hidden="true" />;
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="product-grid" role="status" aria-label="Chargement des produits">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeleton-card">
          <Skeleton variant="image" />
          <Skeleton variant="line" style={{ width: "80%" }} />
          <Skeleton variant="line" style={{ width: "40%" }} />
        </div>
      ))}
    </div>
  );
}