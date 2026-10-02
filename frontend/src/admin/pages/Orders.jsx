import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice.js";
import DataTable from "../components/DataTable.jsx";
import { getAdminOrders, searchAdminOrders, updateOrderStatus } from "../services/adminOrderService.js";
import "./Orders.css";

const STATUS_FILTERS = [
	{ value: "", label: "Toutes" },
	{ value: "pending", label: "En attente" },
	{ value: "confirmed", label: "Confirmée" },
	{ value: "shipped", label: "Expédiée" },
	{ value: "delivered", label: "Livrée" },
	{ value: "cancelled", label: "Annulée" },
];

export default function Orders() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [status, setStatus] = useState("");
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [updatingOrderId, setUpdatingOrderId] = useState(null);

	useEffect(() => {
		let active = true;
		setLoading(true);
		setError("");

		const timer = setTimeout(() => {
			const request = search.trim()
				? searchAdminOrders(search.trim()).then((data) => ({ items: data.items, totalPages: 1 }))
				: getAdminOrders({ status, page });

			request
				.then((data) => {
					if (!active) return;
					setOrders(data.items);
					setTotalPages(data.totalPages || 1);
				})
				.catch((requestError) => {
					if (active) setError(requestError.message);
				})
				.finally(() => {
					if (active) setLoading(false);
				});
		}, search.trim() ? 250 : 0);

		return () => {
			active = false;
			clearTimeout(timer);
		};
	}, [status, page, search]);

	async function changeOrderStatus(orderId, nextStatus) {
		setError("");
		setUpdatingOrderId(orderId);
		try {
			const updatedOrder = await updateOrderStatus(orderId, nextStatus);
			setOrders((current) => {
				const updated = current.map((order) => order.id === orderId ? updatedOrder : order);
				return !search.trim() && status && updatedOrder.status !== status
					? updated.filter((order) => order.id !== orderId)
					: updated;
			});
		} catch (requestError) {
			setError(requestError.message || "Impossible de modifier le statut de la commande.");
		} finally {
			setUpdatingOrderId(null);
		}
	}

	const columns = [
		{
			key: "orderNumber",
			label: "Commande",
			render: (order) => <Link to={`/admin/orders/${order.id}`}>{order.orderNumber}</Link>,
		},
		{ key: "customer", label: "Client", render: (order) => order.customer?.fullName || "—" },
		{ key: "phone", label: "Téléphone", render: (order) => order.customer?.phone || "—" },
		{ key: "total", label: "Total", render: (order) => formatPrice(order.total) },
		{
			key: "deliveryMethod",
			label: "Livraison",
			render: (order) => order.deliveryMethod === "office" ? "Au bureau" : "À domicile",
		},
		{
			key: "status",
			label: "Statut",
			render: (order) => (
				<select
					className="admin-orders__status-select"
					aria-label={`Modifier le statut de la commande ${order.orderNumber}`}
					value={order.status}
					disabled={updatingOrderId !== null || order.status === "cancelled"}
					onChange={(event) => changeOrderStatus(order.id, event.target.value)}
				>
					{STATUS_FILTERS.filter((option) => option.value).map((option) => (
						<option key={option.value} value={option.value}>{option.label}</option>
					))}
				</select>
			),
		},
		{
			key: "date",
			label: "Date",
			render: (order) => new Date(order.createdAt).toLocaleDateString("fr-FR"),
		},
	];

	return (
		<section className="admin-orders">
			<header className="admin-orders__header">
				<div>
					<p className="admin-orders__eyebrow">Ventes</p>
					<h1>Commandes</h1>
				</div>
			</header>

			<div className="admin-orders__toolbar">
				<label className="admin-orders__search">
					<span className="admin-orders__visually-hidden">Rechercher une commande</span>
					<input
						type="search"
						placeholder="Nom, téléphone ou numéro de commande"
						value={search}
						onChange={(event) => {
							setSearch(event.target.value);
							setStatus("");
							setPage(1);
						}}
					/>
				</label>
				<div className="admin-orders__filters" aria-label="Filtrer par statut">
					{STATUS_FILTERS.map((filter) => (
						<button
							key={filter.value || "all"}
							type="button"
							aria-pressed={status === filter.value && !search}
							className={status === filter.value && !search ? "is-active" : ""}
							onClick={() => {
								setStatus(filter.value);
								setSearch("");
								setPage(1);
							}}
						>
							{filter.label}
						</button>
					))}
				</div>
			</div>

			{error && <p className="admin-orders__error" role="alert">{error}</p>}
			{loading ? (
				<p className="admin-orders__loading">Chargement des commandes...</p>
			) : (
				<>
					<DataTable columns={columns} rows={orders} emptyMessage="Aucune commande trouvée." />
					{!search && totalPages > 1 && (
						<nav className="admin-orders__pagination" aria-label="Pagination des commandes">
							<button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
								Précédent
							</button>
							<span>Page {page} / {totalPages}</span>
							<button type="button" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>
								Suivant
							</button>
						</nav>
					)}
				</>
			)}
		</section>
	);
}