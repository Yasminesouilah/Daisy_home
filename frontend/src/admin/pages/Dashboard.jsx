import { useAdminAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
	const { admin, signOut } = useAdminAuth();

	return (
		<section className="admin-dashboard">
			<header className="admin-dashboard__heading">
				<p className="admin-dashboard__eyebrow">Daisy Home · Administration</p>
				<h1>Bonjour, Admin.</h1>
				<p>Bienvenue dans votre espace de gestion, {admin?.email}.</p>
			</header>

			<section className="admin-dashboard__welcome">
				<div className="admin-dashboard__welcome-mark" aria-hidden="true">D</div>
				<div className="admin-dashboard__welcome-copy">
					<p className="admin-dashboard__welcome-label">Votre boutique</p>
					<h2>Une maison, mille attentions.</h2>
					<p>Le tableau de bord complet arrive dans une prochaine phase.</p>
				</div>
				<button type="button" className="admin-dashboard__logout" onClick={signOut}>
					Se déconnecter
				</button>
			</section>
		</section>
	);
}