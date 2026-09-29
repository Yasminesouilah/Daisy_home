import { CATEGORIES } from "../../../data/categories";
import { formatPrice } from "../../../utils/formatPrice";
import { CloseIcon } from "../../ui/Icons";
import "./ActiveFilters.css";

export default function ActiveFilters({ category, q, min, max, setCategory, setQuery, setPriceRange, clearAll }) {
  const chips = [];
  if (category) {
    const item = CATEGORIES.find((candidate) => candidate.slug === category);
    chips.push({ label: item?.name || category, onRemove: () => setCategory("") });
  }
  if (q) chips.push({ label: `“${q}”`, onRemove: () => setQuery("") });
  if (min !== null || max !== null) {
    const label = min !== null && max !== null
      ? `${formatPrice(min)} – ${formatPrice(max)}`
      : min !== null
        ? `À partir de ${formatPrice(min)}`
        : `Jusqu'à ${formatPrice(max)}`;
    chips.push({ label, onRemove: () => setPriceRange(null, null) });
  }

  if (chips.length === 0) return null;
  return (
    <div className="active-filters" aria-label="Filtres actifs">
      {chips.map((chip, index) => (
        <button key={`${chip.label}-${index}`} type="button" className="active-filters__chip" onClick={chip.onRemove}>{chip.label}<CloseIcon width={13} height={13} /></button>
      ))}
      <button type="button" className="active-filters__clear" onClick={clearAll}>Tout effacer</button>
    </div>
  );
}