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
  const { filtered, q, setQuery, sort, setSort } = filters;

  return (
    <main className="page shop container">
      <div className="shop__head">
        <div>
          <p className="eyebrow">Boutique</p>
          <h1>Tous nos produits</h1>
        </div>
        <SearchBar value={q} onChange={setQuery} />
      </div>

      <div className="shop__layout">
        <FilterSidebar {...filters} />
        <div className="shop__results">
          <div className="shop__toolbar">
            <span className="shop__count">
              {loading ? "Chargement..." : `${filtered.length} produit${filtered.length !== 1 ? "s" : ""}`}
            </span>
            <SortSelect value={sort} onChange={setSort} />
          </div>
          <ActiveFilters {...filters} />
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
            <ProductGrid products={filtered} />
          )}
        </div>
      </div>
    </main>
  );
}