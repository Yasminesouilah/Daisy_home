import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { NAV_LINKS } from "../../../config/site";
import { SearchIcon, CartIcon, MenuIcon, CloseIcon } from "../../ui/Icons";
import { useCart } from "../../../hooks/useCart";
import { useUI } from "../../../hooks/useUI";
import "./Navbar.css";

function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Daisy Home, accueil">
      <span className="logo__name">Daisy Home</span>
      <span className="logo__sub">Home decor &amp; lifestyle</span>
    </Link>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const { count: cartCount } = useCart();
  const { openCart } = useUI();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close menu on route change
  useEffect(() => setMenuOpen(false), [pathname]);

  // lock body scroll while menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [menuOpen]);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        <button
          className="navbar__icon navbar__burger"
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
        >
          <MenuIcon />
        </button>

        <Logo />

        <nav className="navbar__links" aria-label="Navigation principale">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `navbar__link ${isActive && !l.to.includes("#") ? "is-active" : ""}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

              <div className="navbar__actions">
          <Link to="/shop" className="navbar__icon navbar__search" aria-label="Rechercher">
            <SearchIcon />
          </Link>
          <button
            className="navbar__icon"
            onClick={openCart}
            aria-label={`Panier, ${cartCount} articles`}
          >
            <CartIcon />
            <span className="navbar__badge">{cartCount}</span>
          </button>
        </div>

      </div>

      {/* Mobile menu */}
      <div
        className={`mobile-menu__overlay ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />
      <aside className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu__head">
          <Logo />
          <button
            className="navbar__icon"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="mobile-menu__links">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} to={l.to} className="mobile-menu__link">
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
    </header>
  );
}