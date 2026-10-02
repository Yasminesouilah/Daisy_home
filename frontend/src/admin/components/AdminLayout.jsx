import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAdminAuth } from "../context/AuthContext.jsx";
import "./AdminLayout.css";

const LINKS = [
  { to: "/admin", label: "Dashboard", end: true, icon: "overview" },
  { to: "/admin/orders", label: "Commandes", icon: "orders" },
  { to: "/admin/products", label: "Produits", icon: "products" },
  { to: "/admin/messages", label: "Messages", icon: "messages" },
  { to: "/admin/delivery", label: "Livraison", icon: "delivery" },
];

const NAV_ICONS = {
  overview: <><rect x="4" y="4" width="6" height="6" rx="1.4" /><rect x="14" y="4" width="6" height="6" rx="1.4" /><rect x="4" y="14" width="6" height="6" rx="1.4" /><rect x="14" y="14" width="6" height="6" rx="1.4" /></>,
  products: <><path d="m4 7 8-4 8 4v10l-8 4-8-4z" /><path d="m4 7 8 4 8-4M12 11v10" /></>,
  orders: <><path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M8 12h8M8 16h5" /></>,
  messages: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  delivery: <><path d="M3 6h11v12H3zM14 10h4l3 3v5h-7z" /><circle cx="7.5" cy="18" r="1.5" /><circle cx="17.5" cy="18" r="1.5" /></>,
};

export default function AdminLayout() {
  const { admin, signOut } = useAdminAuth();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);

  const pageTitle = LINKS.find((link) =>
    link.end ? location.pathname === link.to : location.pathname.startsWith(link.to),
  )?.label || "Administration";
  const isDashboard = location.pathname === "/admin";

  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__brand">Daisy Home</div>

        <nav className="admin-layout__nav" aria-label="Navigation principale">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `admin-layout__link${isActive ? " is-active" : ""}`}
            >
              <span className="admin-layout__icon-badge">
                <svg
                  className="admin-layout__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {NAV_ICONS[link.icon]}
                </svg>
              </span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-layout__bottom">
          <a
            className="admin-layout__ghost-icon"
            href="mailto:contact@daisyhome.dz"
            title="Aide"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9.2a2.5 2.5 0 0 1 4.8 1c0 1.6-2.3 1.8-2.3 3.3" />
              <circle cx="12" cy="16.8" r="0.4" fill="currentColor" />
            </svg>
          </a>

          <div className="admin-layout__account">
            <button
              type="button"
              className="admin-layout__avatar"
              onClick={() => setAccountOpen((open) => !open)}
              aria-expanded={accountOpen}
              title={admin?.email}
            >
              {admin?.email?.slice(0, 1).toUpperCase() || "A"}
            </button>

            {accountOpen && (
              <div className="admin-layout__account-menu">
                <span className="admin-layout__account-email">{admin?.email}</span>
                <button type="button" onClick={signOut}>Se déconnecter</button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="admin-layout__main">
        <header className="admin-layout__topbar">
          <h1 className="admin-layout__page-title">{pageTitle}</h1>
          {isDashboard && (
            <label className="admin-layout__search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Rechercher un produit, une commande..."
                aria-label="Rechercher un produit ou une commande"
              />
            </label>
          )}
        </header>
        <div className="admin-layout__content">
          <Outlet context={{ searchQuery }} />
        </div>
      </main>
    </div>
  );
}