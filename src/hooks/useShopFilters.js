import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const DEFAULT_SORT = "newest";
const parsePrice = (value) => value !== null && value.trim() !== "" && Number.isFinite(Number(value))
  ? Number(value)
  : null;

export function useShopFilters(products) {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const q = params.get("q") || "";
  const minParam = params.get("min");
  const maxParam = params.get("max");
  const min = parsePrice(minParam);
  const max = parsePrice(maxParam);
  const sort = params.get("sort") || DEFAULT_SORT;

  const updateParams = (updates) => {
    const next = new URLSearchParams(params);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === null || value === undefined) next.delete(key);
      else next.set(key, String(value));
    });
    setParams(next, { replace: true });
  };

  const setCategory = (value) => updateParams({ category: value });
  const setQuery = (value) => updateParams({ q: value });
  const setPriceRange = (minValue, maxValue) => updateParams({ min: minValue, max: maxValue });
  const setSort = (value) => updateParams({ sort: value === DEFAULT_SORT ? "" : value });
  const clearAll = () => setParams({}, { replace: true });

  const filtered = useMemo(() => {
    let result = [...products];
    if (category === "nouveautes") result = result.filter((product) => product.isNew);
    else if (category) result = result.filter((product) => product.category === category);

    if (q.trim()) {
      const query = q.trim().toLocaleLowerCase();
      result = result.filter((product) => product.name.toLocaleLowerCase().includes(query));
    }
    if (min !== null && Number.isFinite(min)) result = result.filter((product) => product.price >= min);
    if (max !== null && Number.isFinite(max)) result = result.filter((product) => product.price <= max);

    switch (sort) {
      case "price-asc":
        result.sort((first, second) => first.price - second.price);
        break;
      case "price-desc":
        result.sort((first, second) => second.price - first.price);
        break;
      case "popular":
        result.sort((first, second) => second.popularity - first.popularity);
        break;
      case "newest":
      default:
        result.sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt));
    }
    return result;
  }, [products, category, q, min, max, sort]);

  return {
    category,
    q,
    min,
    max,
    sort,
    setCategory,
    setQuery,
    setPriceRange,
    setSort,
    clearAll,
    filtered,
    activeCount: [category, q, min, max].filter((value) => value !== "" && value !== null).length,
  };
}