import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AuthContext.jsx";
import "./Login.css";

export default function Login() {
	const { signIn, token } = useAdminAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	if (token) return <Navigate to="/admin" replace />;

	async function handleSubmit(event) {
		event.preventDefault();
		setError("");
		setSubmitting(true);
		try {
			await signIn(email, password);
			navigate("/admin", { replace: true });
		} catch (loginError) {
			setError(loginError.message || "Échec de connexion.");
			setSubmitting(false);
		}
	}

	return (
		<main className="admin-login">
			<form className="admin-login__form" onSubmit={handleSubmit}>
				<p className="admin-login__eyebrow">Espace de gestion</p>
				<h1>Daisy Home</h1>
				<p className="admin-login__subtitle">Connectez-vous à votre espace administrateur.</p>

				<div className="admin-login__field">
					<label htmlFor="admin-email">Adresse e-mail</label>
					<input
						id="admin-email"
						type="email"
						autoComplete="username"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						required
					/>
				</div>

				<div className="admin-login__field">
					<label htmlFor="admin-password">Mot de passe</label>
					<input
						id="admin-password"
						type="password"
						autoComplete="current-password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						required
					/>
				</div>

				{error && <p className="admin-login__error" role="alert">{error}</p>}

				<button className="admin-login__submit" type="submit" disabled={submitting}>
					{submitting ? "Connexion..." : "Se connecter"}
				</button>
			</form>
		</main>
	);
}