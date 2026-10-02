import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { resolveImageUrl } from "../../config/constants.js";
import { formatPrice } from "../../utils/formatPrice.js";
import StatusBadge from "../components/StatusBadge.jsx";
import { getAdminProducts } from "../services/adminProductService.js";
import { getDashboardStats } from "../services/adminDashboardService.js";
import { useOutletContext } from "react-router-dom";
import "./Dashboard.css";

function formatDate(value) {
	return new Date(value).toLocaleString("fr-FR", {
		dateStyle: "medium",
		timeStyle: "short",
	});
}

export default function Dashboard() {
	const { searchQuery = "" } = useOutletContext() || {};
	const [stats, setStats] = useState(null);
	const [products, setProducts] = useState([]);
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
		getAdminProducts()
			.then((data) => {
				if (active) setProducts(data);
			})
			.catch(() => {});

		return () => {
			active = false;
		};
	}, []);

	if (loading) return <p className="dashboard__state">Chargement du tableau de bord...</p>;
	if (error) return <p className="dashboard__error" role="alert">{error}</p>;
	if (!stats) return null;

	const metrics = [
		{ label: "Revenu cumulé", value: formatPrice(stats.totalRevenue) },
		{ label: "Commandes aujourd'hui", value: stats.ordersToday },
		{ label: "En attente", value: stats.pendingOrders, href: "/admin/orders" },
		{ label: "Messages non lus", value: stats.unreadMessages, href: "/admin/messages" },
	];
	const query = searchQuery.trim().toLocaleLowerCase("fr");
	const visibleProducts = products
		.filter((product) => !query || product.name.toLocaleLowerCase("fr").includes(query))
		.slice(0, 5);
	const visibleOrders = stats.recentOrders.filter((order) =>
		!query || [order.orderNumber, order.customer?.fullName]
			.some((value) => value?.toLocaleLowerCase("fr").includes(query)),
	);
	const weeklyMax = Math.max(stats.ordersThisWeek, 1);

	return (
		<section className="dashboard">
			<header className="dashboard__header">
				<div>
					<p className="dashboard__eyebrow">Espace boutique</p>
					<h2>Bienvenue chez Daisy Home</h2>
				</div>
				<time className="dashboard__date" dateTime={new Date().toISOString()}>
					{new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
				</time>
			</header>

			<div className="dashboard__upper">
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

			<section className="dashboard__section dashboard__catalog">
					<header className="dashboard__section-header">
						<div>
							<p className="dashboard__section-kicker">Votre sélection</p>
							<h2>Catalogue</h2>
						</div>
						<Link to="/admin/products">Tout voir <span aria-hidden="true">›</span></Link>
					</header>
					{visibleProducts.length === 0 ? (
						<p className="dashboard__empty">{query ? "Aucun produit correspondant." : "Aucun produit dans le catalogue."}</p>
					) : (
						<div className="dashboard__catalog-grid">
							{visibleProducts.map((product) => (
								<Link className="dashboard__catalog-product" key={product.id} to={`/admin/products/${product.id}/edit`}>
									<img src={resolveImageUrl(product.images?.[0])} alt="" />
									<strong>{product.name}</strong>
									<span>{formatPrice(product.price)}</span>
								</Link>
							))}
						</div>
					)}
				</section>

				<section className="dashboard__section dashboard__insights">
					<header className="dashboard__section-header">
						<div>
							<p className="dashboard__section-kicker">Vue rapide</p>
							<h2>À suivre</h2>
						</div>
					</header>
					<div className="dashboard__insight-list">
						<Link to="/admin/orders"><span>Commandes en attente</span><strong>{stats.pendingOrders}</strong></Link>
						<Link to="/admin/messages"><span>Messages non lus</span><strong>{stats.unreadMessages}</strong></Link>
						<Link to="/admin/products"><span>Alertes de stock</span><strong>{stats.lowStockProducts.length}</strong></Link>
					</div>
				</section>
			</div>

			<div className="dashboard__lower">
				<section className="dashboard__section dashboard__activity">
					<header className="dashboard__section-header">
						<div>
							<p className="dashboard__section-kicker">Cette semaine</p>
							<h2>Activité des commandes</h2>
						</div>
					</header>
					<div className="dashboard__activity-bars">
						<div><span>Aujourd'hui</span><div className="dashboard__bar"><i style={{ width: `${Math.min((stats.ordersToday / weeklyMax) * 100, 100)}%` }} /></div><strong>{stats.ordersToday}</strong></div>
						<div><span>Cette semaine</span><div className="dashboard__bar"><i style={{ width: "100%" }} /></div><strong>{stats.ordersThisWeek}</strong></div>
					</div>
				</section>

				<section className="dashboard__section dashboard__recent-orders">
					<header className="dashboard__section-header">
						<div>
							<p className="dashboard__section-kicker">Activité récente</p>
							<h2>Commandes récentes</h2>
						</div>
						<Link to="/admin/orders">Tout voir <span aria-hidden="true">›</span></Link>
					</header>
					{visibleOrders.length === 0 ? (
						<p className="dashboard__empty">{query ? "Aucune commande correspondante." : "Aucune commande pour le moment."}</p>
					) : (
						<ul className="dashboard__list">
							{visibleOrders.map((order) => (
								<li key={order.id}>
									<Link className="dashboard__order" to={`/admin/orders/${order.id}`}>
										<strong>{order.customer?.fullName || "Client"}</strong>
										<span>{order.orderNumber} · {formatPrice(order.total)}</span>
									</Link>
									<StatusBadge status={order.status} />
								</li>
							))}
						</ul>
					)}
				</section>
				<section className="dashboard__section dashboard__inventory">
					<header className="dashboard__section-header">
						<div>
							<p className="dashboard__section-kicker">À surveiller</p>
							<h2>Stock faible</h2>
						</div>
						<Link to="/admin/products">Tout voir <span aria-hidden="true">›</span></Link>
					</header>
					{stats.lowStockProducts.length === 0 ? (
						<p className="dashboard__empty">Aucun produit avec 5 unités ou moins.</p>
					) : (
						<ul className="dashboard__inventory-list">
							{stats.lowStockProducts.map((product) => (
								<li key={product.id}>
									<Link to={`/admin/products/${product.id}/edit`}>{product.name}</Link>
									<div className="dashboard__bar"><i style={{ width: `${Math.max((product.stock / 5) * 100, 5)}%` }} /></div>
									<strong>{product.stock}</strong>
								</li>
							))}
						</ul>
					)}
				</section>
			</div>
		</section>
	);
}