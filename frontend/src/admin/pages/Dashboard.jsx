import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../../config/constants.js";
import { formatPrice } from "../../utils/formatPrice.js";
import StatusBadge from "../components/StatusBadge.jsx";
import { getDashboardStats } from "../services/adminDashboardService.js";
import "./Dashboard.css";

function formatDate(value) {
	return new Date(value).toLocaleString("fr-FR", {
		dateStyle: "medium",
		timeStyle: "short",
	});
}

export default function Dashboard() {
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let active = true;
		getDashboardStats()
			.then((data) => {
				if (active) setStats(data);
			})
			.catch((requestError) => {
				if (active) setError(requestError.message);
			})
			.finally(() => {
				if (active) setLoading(false);
			});

		return () => {
			active = false;
		};
	}, []);

	if (loading) return <p className="dashboard__state">Chargement du tableau de bord...</p>;
	if (error) return <p className="dashboard__error" role="alert">{error}</p>;
	if (!stats) return null;

	const metrics = [
		{ label: "Commandes aujourd'hui", value: stats.ordersToday },
		{ label: "Commandes cette semaine", value: stats.ordersThisWeek },
		{ label: "En attente", value: stats.pendingOrders, href: "/admin/orders" },
		{ label: "Revenu cumulé", value: formatPrice(stats.totalRevenue) },
		{ label: "Messages non lus", value: stats.unreadMessages, href: "/admin/messages" },
	];

	return (
		<section className="dashboard">
			<header className="dashboard__header">
				<p className="dashboard__eyebrow">Daisy Home · Administration</p>
				<h1>Vue d'ensemble</h1>
			</header>

			<div className="dashboard__metrics">
				{metrics.map((metric) => {
					const content = (
						<>
							<span className="dashboard__metric-label">{metric.label}</span>
							<strong className="dashboard__metric-value">{metric.value}</strong>
						</>
					);
					return metric.href ? (
						<Link className="dashboard__metric" key={metric.label} to={metric.href}>{content}</Link>
					) : (
						<div className="dashboard__metric" key={metric.label}>{content}</div>
					);
				})}
			</div>

			<div className="dashboard__sections">
				<section className="dashboard__section">
					<header className="dashboard__section-header">
						<h2>Commandes récentes</h2>
						<Link to="/admin/orders">Voir tout</Link>
					</header>
					{stats.recentOrders.length === 0 ? (
						<p className="dashboard__empty">Aucune commande pour le moment.</p>
					) : (
						<ul className="dashboard__list">
							{stats.recentOrders.map((order) => (
								<li key={order.id}>
									<Link className="dashboard__order" to={`/admin/orders/${order.id}`}>
										<strong>{order.orderNumber}</strong>
										<span>{order.customer?.fullName || "Client"}</span>
										<time dateTime={order.createdAt}>{formatDate(order.createdAt)}</time>
									</Link>
									<div className="dashboard__order-side">
										<span>{formatPrice(order.total)}</span>
										<StatusBadge status={order.status} />
									</div>
								</li>
							))}
						</ul>
					)}
				</section>

				<section className="dashboard__section">
					<header className="dashboard__section-header">
						<h2>Stock faible</h2>
						<Link to="/admin/products">Voir les produits</Link>
					</header>
					{stats.lowStockProducts.length === 0 ? (
						<p className="dashboard__empty">Aucun produit avec 5 unités ou moins.</p>
					) : (
						<ul className="dashboard__list">
							{stats.lowStockProducts.map((product) => (
								<li key={product.id}>
									<Link className="dashboard__product" to={`/admin/products/${product.id}/edit`}>
										<img src={resolveImageUrl(product.images?.[0])} alt="" />
										<span>{product.name}</span>
									</Link>
									<strong className="dashboard__stock">{product.stock} restant(s)</strong>
								</li>
							))}
						</ul>
					)}
				</section>
			</div>
		</section>
	);
}