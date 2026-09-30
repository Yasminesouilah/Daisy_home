import { useState } from "react";
import "./ProductInfoTabs.css";
import "./ProductInfoTabs.css";

const TABS = [
  { id: "description", label: "Description" },
  { id: "info", label: "Informations" },
  { id: "delivery", label: "Livraison" },
];

export default function ProductInfoTabs({ description = "" }) {
  const [active, setActive] = useState("description");
  const panelId = `product-info-${active}`;

  return (
    <section className="info-tabs">
      <div className="info-tabs__head" role="tablist" aria-label="Informations produit">
        {TABS.map((tab) => (
          <button key={tab.id} id={`tab-${tab.id}`} type="button" role="tab" aria-selected={active === tab.id} aria-controls={`product-info-${tab.id}`} tabIndex={active === tab.id ? 0 : -1} className={active === tab.id ? "is-active" : ""} onClick={() => setActive(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="info-tabs__panel" id={panelId} role="tabpanel" aria-labelledby={`tab-${active}`}>
        {active === "description" && <p>{description}</p>}
        {active === "info" && (
          <ul>
            <li>Produit sélectionné avec soin par Daisy Home</li>
            <li>Matériaux et finitions choisis pour durer</li>
            <li>Entretien : nettoyer avec un chiffon doux et sec</li>
          </ul>
        )}
        {active === "delivery" && (
          <ul>
            <li>Livraison disponible dans toutes les wilayas</li>
            <li>Délai estimé : 2 à 5 jours ouvrés</li>
            <li>Paiement à la livraison</li>
            <li>Nous vous contactons par téléphone pour confirmer la commande</li>
          </ul>
        )}
      </div>
    </section>
  );
}