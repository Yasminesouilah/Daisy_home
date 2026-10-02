import { useEffect, useState } from "react";
import { CATEGORIES } from "../../../data/categories";
import { useLockBodyScroll } from "../../../hooks/useLockBodyScroll";
import Button from "../../ui/Button/Button";
import { CloseIcon } from "../../ui/Icons";
import "./FilterSidebar.css";

const PRICE_STEPS = [
	{ label: "Tous les prix", min: null, max: null },
	{ label: "Moins de 3 000 DA", min: null, max: 3000 },
	{ label: "3 000 – 6 000 DA", min: 3000, max: 6000 },
	{ label: "Plus de 6 000 DA", min: 6000, max: null },
];

function FilterContent({ category, categories = CATEGORIES, setCategory, min, max, setPriceRange, showCategories = true }) {
	return (
		<>
			{showCategories && <div className="filter-group">
				<h2>Catégories</h2>
				<ul>
					<li><button type="button" className={!category ? "is-active" : ""} onClick={() => setCategory("")}>Toutes</button></li>
					{categories.map((item) => (
						<li key={item.slug}>
							<button type="button" className={category === item.slug ? "is-active" : ""} onClick={() => setCategory(item.slug)}>{item.name}</button>
						</li>
					))}
				</ul>
			</div>}
			<div className="filter-group">
				<h2>Prix</h2>
				<ul>
					{PRICE_STEPS.map((step) => {
						const active = min === step.min && max === step.max;
						return (
							<li key={step.label}>
								<button type="button" className={active ? "is-active" : ""} aria-pressed={active} onClick={() => setPriceRange(step.min, step.max)}>{step.label}</button>
							</li>
						);
					})}
				</ul>
			</div>
		</>
	);
}

export default function FilterSidebar(props) {
	const [mobileOpen, setMobileOpen] = useState(false);
	useLockBodyScroll(mobileOpen);

	useEffect(() => {
		if (!mobileOpen) return undefined;
		const onKeyDown = (event) => {
			if (event.key === "Escape") setMobileOpen(false);
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [mobileOpen]);

	return (
		<>
			<aside className="filter-sidebar" aria-label="Filtres produits"><FilterContent {...props} showCategories={false} /></aside>
			<Button variant="outline" size="sm" className="filter-trigger" onClick={() => setMobileOpen(true)}>
				Filtres{props.activeCount > 0 ? ` (${props.activeCount})` : ""}
			</Button>
			<div className={`filter-drawer-overlay ${mobileOpen ? "is-open" : ""}`} onClick={() => setMobileOpen(false)} />
			<section className={`filter-drawer ${mobileOpen ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Filtres" aria-hidden={!mobileOpen}>
				<div className="filter-drawer__head">
					<h2>Filtres</h2>
					<button type="button" onClick={() => setMobileOpen(false)} aria-label="Fermer les filtres"><CloseIcon /></button>
				</div>
				<div className="filter-drawer__body"><FilterContent {...props} showCategories={false} /></div>
				<div className="filter-drawer__footer"><Button full onClick={() => setMobileOpen(false)}>Voir les résultats</Button></div>
			</section>
		</>
	);
}