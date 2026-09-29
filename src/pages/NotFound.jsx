import Button from "../components/ui/Button/Button";
import "./NotFound.css";

export default function NotFound() {
	return (
		<main className="page container not-found">
			<p className="eyebrow">Erreur 404</p>
			<h1>Cette page n’existe pas</h1>
			<p>La page que vous cherchez a peut-être été déplacée ou n’existe plus. Retournez à la boutique pour continuer votre visite.</p>
			<div className="not-found__actions">
				<Button to="/">Retour à l’accueil</Button>
				<Button to="/shop" variant="outline">Voir la boutique</Button>
			</div>
		</main>
	);
}