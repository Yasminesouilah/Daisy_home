import { useProducts } from "../hooks/useProducts";
import { useShopFilters } from "../hooks/useShopFilters";
import FilterSidebar from "../components/shop/FilterSidebar";
import SearchBar from "../components/shop/SearchBar";
import SortSelect from "../components/shop/SortSelect";
import ActiveFilters from "../components/shop/ActiveFilters";
import ProductGrid from "../components/product/ProductGrid";
import Button from "../components/ui/Button/Button";
import { ProductGridSkeleton } from "../components/ui/Skeleton";
import "./Shop.css";

export default function Shop() {
  const { products, loading, error } = useProducts();
  const filters = useShopFilters(products);
  const { filtered, q, setQuery, sort, setSort, category, setCategory, categories } = filters;

  return (
    <main className="page shop container">
      <div className="shop__head">
        <p className="eyebrow">Boutique Daisy Home</p>
        <h1>Tous nos produits</h1>
        <SearchBar value={q} onChange={setQuery} />
      </div>

      <nav className="shop__categories" aria-label="Catégories de produits">
        <button
          type="button"
          aria-pressed={!category}
          className={!category ? "is-active" : ""}
          onClick={() => setCategory("")}
        >
          Tout
        </button>
        {categories.map((item) => (
          <button
            key={item.slug}
            type="button"
            aria-pressed={category === item.slug}
            className={category === item.slug ? "is-active" : ""}
            onClick={() => setCategory(item.slug)}
          >
            {item.name}
          </button>
        ))}
      </nav>

      <p className="shop__count" aria-live="polite">
        {loading ? "Chargement..." : `${filtered.length} pièce${filtered.length !== 1 ? "s" : ""}`}
      </p>

      <div className="shop__toolbar">
        <FilterSidebar {...filters} />
        <ActiveFilters {...filters} />
        <SortSelect value={sort} onChange={setSort} />
      </div>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : error ? (
        <p className="shop__state" role="alert">Les produits sont momentanément indisponibles.</p>
      ) : filtered.length === 0 ? (
        <div className="shop__state shop__empty">
          <p>Aucun produit ne correspond à votre recherche.</p>
          <Button variant="outline" onClick={filters.clearAll}>Réinitialiser les filtres</Button>
        </div>
      ) : (
        <ProductGrid products={filtered} variant="shop" />
      )}
    </main>
  );
}