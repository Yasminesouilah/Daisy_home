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
				<p className="admin-login__eyebrow">Administration</p>
				<h1>Daisy Home</h1>
				<p className="admin-login__subtitle">Espace administrateur</p>

				<div className="admin-login__field">
					<label htmlFor="admin-email">Adresse e-mail</label>
					<div className="admin-login__input-wrap">
						<input
							id="admin-email"
							type="email"
							autoComplete="username"
							placeholder="Adresse e-mail"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							required
						/>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
							<circle cx="12" cy="8" r="4" />
							<path d="M5 21a7 7 0 0 1 14 0" />
						</svg>
					</div>
				</div>

				<div className="admin-login__field">
					<label htmlFor="admin-password">Mot de passe</label>
					<div className="admin-login__input-wrap">
						<input
							id="admin-password"
							type="password"
							autoComplete="current-password"
							placeholder="Mot de passe"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							required
						/>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
							<rect x="4" y="10" width="16" height="11" rx="2" />
							<path d="M8 10V7a4 4 0 1 1 8 0v3M12 14v3" />
						</svg>
					</div>
				</div>

				{error && <p className="admin-login__error" role="alert">{error}</p>}

				<button className="admin-login__submit" type="submit" disabled={submitting}>
					{submitting ? "Connexion..." : "Se connecter"}
				</button>
			</form>
		</main>
	);
}