import { Link } from "react-router-dom";
import { SITE } from "../../../config/site";
import { InstagramIcon, FacebookIcon, ArrowIcon } from "../../ui/Icons";
import "./Footer.css";

export default function Footer() {
  const handleSubmit = (e) => {
    e.preventDefault(); // newsletter wired up in a later phase
  };

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="footer__logo">Daisy Home</span>
          <span className="footer__sub">Home decor &amp; lifestyle</span>
          <p className="footer__text">
            Des pièces choisies avec soin pour une maison chaleureuse et personnelle.
          </p>
        </div>

        <div>
          <h4 className="footer__title">Liens rapides</h4>
          <ul className="footer__list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/shop#categories">Categories</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer__title">Aide</h4>
          <ul className="footer__list">
            <li><Link to="/contact">Livraison</Link></li>
            <li><Link to="/contact">Retours</Link></li>
            <li><Link to="/contact">FAQ</Link></li>
            <li><Link to="/contact">Conditions générales</Link></li>
            <li><Link to="/contact">Politique de confidentialité</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="footer__title">Restez connecté</h4>
          <p className="footer__small">Recevez nos nouveautés et offres exclusives.</p>
          <form className="footer__form" onSubmit={handleSubmit}>
            <input type="email" placeholder="Votre email" aria-label="Email" required />
            <button type="submit" aria-label="S'inscrire">
              <ArrowIcon width={18} height={18} />
            </button>
          </form>
          <div className="footer__social">
            <a href={SITE.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#" aria-label="Facebook">
              <FacebookIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Daisy Home. Tous droits réservés.</span>
        <span>Fait avec ♡ en Algérie</span>
      </div>
    </footer>
  );
}