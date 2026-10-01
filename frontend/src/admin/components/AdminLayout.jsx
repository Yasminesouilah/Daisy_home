import { NavLink, Outlet } from "react-router-dom";
import { useAdminAuth } from "../context/AuthContext.jsx";
import "./AdminLayout.css";

const LINKS = [
  { to: "/admin", label: "Vue d'ensemble", end: true },
  { to: "/admin/products", label: "Produits" },
  { to: "/admin/orders", label: "Commandes" },
  { to: "/admin/messages", label: "Messages" },
];

export default function AdminLayout() {
  const { admin, signOut } = useAdminAuth();

  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__brand">
          <span className="admin-layout__brand-mark" aria-hidden="true">D</span>
          <span className="admin-layout__brand-name">Daisy Home</span>
          <span className="admin-layout__brand-caption">ADMINISTRATION</span>
        </div>
        <p className="admin-layout__section-label">Boutique</p>
        <nav aria-label="Navigation administration">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `admin-layout__link${isActive ? " is-active" : ""}`}
            >
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-layout__account">
          <span className="admin-layout__avatar" aria-hidden="true">
            {admin?.email?.slice(0, 1).toUpperCase() || "A"}
          </span>
          <span className="admin-layout__account-email" title={admin?.email}>{admin?.email}</span>
          <button type="button" onClick={signOut}>Se déconnecter</button>
        </div>
      </aside>
      <main className="admin-layout__main">
        <div className="admin-layout__content"><Outlet /></div>
      </main>
    </div>
  );
}