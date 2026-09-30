import { CloseIcon, SearchIcon } from "../../ui/Icons";
import "./SearchBar.css";

export default function SearchBar({ value, onChange }) {
	return (
		<div className="search-bar">
			<SearchIcon width={18} height={18} />
			<input type="search" placeholder="Rechercher un produit..." value={value} onChange={(event) => onChange(event.target.value)} aria-label="Rechercher un produit" />
			{value && <button type="button" onClick={() => onChange("")} aria-label="Effacer la recherche"><CloseIcon width={16} height={16} /></button>}
		</div>
	);
}