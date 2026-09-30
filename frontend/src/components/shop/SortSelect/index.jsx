import "./SortSelect.css";

const OPTIONS = [
	{ value: "newest", label: "Nouveautés" },
	{ value: "price-asc", label: "Prix : croissant" },
	{ value: "price-desc", label: "Prix : décroissant" },
	{ value: "popular", label: "Popularité" },
];

export default function SortSelect({ value, onChange }) {
	return (
		<select className="sort-select" value={value} onChange={(event) => onChange(event.target.value)} aria-label="Trier les produits">
			{OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
		</select>
	);
}