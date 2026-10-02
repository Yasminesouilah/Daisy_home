import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

const STATUS_DOT = {
	pending: "status-dot--pending",
	confirmed: "status-dot--confirmed",
	shipped: "status-dot--shipped",
	delivered: "status-dot--delivered",
	cancelled: "status-dot--cancelled",
};

function initials(name = "") {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part.charAt(0).toUpperCase())
		.join("") || "?";
}

function OrderActionsMenu({ order, updatingOrderId, onChangeStatus }) {
	const [open, setOpen] = useState(false);
	const [coords, setCoords] = useState(null);
	const menuRef = useRef(null);
	const triggerRef = useRef(null);

	function openMenu() {
		const rect = triggerRef.current.getBoundingClientRect();
		setCoords({
			top: rect.bottom + 6,
			right: window.innerWidth - rect.right,
		});
		setOpen(true);
	}

	useEffect(() => {
		if (!open) return undefined;

		function reposition() {
			const rect = triggerRef.current.getBoundingClientRect();
			setCoords({
				top: rect.bottom + 6,
				right: window.innerWidth - rect.right,
			});
		}

		function handleOutside(event) {
			if (
				menuRef.current?.contains(event.target) ||
				triggerRef.current?.contains(event.target)
			) {
				return;
			}
			setOpen(false);
		}
		function handleEscape(event) {
			if (event.key === "Escape") setOpen(false);
		}

		window.addEventListener("mousedown", handleOutside);
		window.addEventListener("keydown", handleEscape);
		window.addEventListener("scroll", reposition, true);
		window.addEventListener("resize", reposition);
		return () => {
			window.removeEventListener("mousedown", handleOutside);
			window.removeEventListener("keydown", handleEscape);
			window.removeEventListener("scroll", reposition, true);
			window.removeEventListener("resize", reposition);
		};
	}, [open]);

	const availableStatuses = STATUS_FILTERS.filter(
		(option) => option.value && option.value !== order.status,
	);

	return (
		<div className="order-menu">
			<button
				ref={triggerRef}
				type="button"
				className="order-menu__trigger"
				aria-haspopup="true"
				aria-expanded={open}
				aria-label={`Actions pour la commande ${order.orderNumber}`}
				onClick={() => (open ? setOpen(false) : openMenu())}
			>
				<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
					<circle cx="12" cy="5" r="1.8" />
					<circle cx="12" cy="12" r="1.8" />
					<circle cx="12" cy="19" r="1.8" />
				</svg>
			</button>

			{open && coords && createPortal(
				<div
					ref={menuRef}
					className="order-menu__panel"
					role="menu"
					style={{ top: coords.top, right: coords.right }}
				>
					<Link
						to={`/admin/orders/${order.id}`}
						className="order-menu__item"
						role="menuitem"
						onClick={() => setOpen(false)}
					>
						Voir le détail
					</Link>

					{order.status !== "cancelled" && (
						<>
							<div className="order-menu__divider" />
							{availableStatuses.map((option) => (
								<button
									key={option.value}
									type="button"
									role="menuitem"
									className={`order-menu__item${option.value === "cancelled" ? " order-menu__item--danger" : ""}`}
									disabled={updatingOrderId !== null}
									onClick={() => {
										onChangeStatus(order.id, option.value);
										setOpen(false);
									}}
								>
									{updatingOrderId === order.id ? "Mise à jour..." : `Marquer ${option.label.toLowerCase()}`}
								</button>
							))}
						</>
					)}
				</div>,
				document.body,
			)}
		</div>
	);
}

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
			label: "N°",
			render: (order) => (
				<Link to={`/admin/orders/${order.id}`} className="order-id-link">
					#{order.orderNumber}
				</Link>
			),
		},
		{
			key: "customer",
			label: "Client",
			render: (order) => (
				<div className="order-customer">
					<span className="order-customer__avatar">{initials(order.customer?.fullName)}</span>
					<span className="order-customer__name">{order.customer?.fullName || "—"}</span>
				</div>
			),
		},
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
				<span className="status-pill">
					<span className={`status-dot ${STATUS_DOT[order.status] || ""}`} aria-hidden="true" />
					{STATUS_FILTERS.find((option) => option.value === order.status)?.label || order.status}
				</span>
			),
		},
		{
			key: "date",
			label: "Date",
			render: (order) => new Date(order.createdAt).toLocaleDateString("fr-FR"),
		},
		{
			key: "actions",
			label: "",
			render: (order) => (
				<OrderActionsMenu
					order={order}
					updatingOrderId={updatingOrderId}
					onChangeStatus={changeOrderStatus}
				/>
			),
		},
	];

	return (
		<section className="admin-orders">
			<header className="admin-orders__page-header">
				<p className="admin-orders__eyebrow">Ventes</p>
				<h1>Commandes</h1>
			</header>

			<div className="admin-orders__card">
				<div className="admin-orders__card-head">
					<h2 className="admin-orders__card-title">Historique des commandes</h2>

					<label className="admin-orders__search">
						<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
							<circle cx="11" cy="11" r="7" />
							<path d="m20 20-3.5-3.5" />
						</svg>
						<span className="admin-orders__visually-hidden">Rechercher une commande</span>
						<input
							type="search"
							placeholder="Nom, téléphone ou numéro"
							value={search}
							onChange={(event) => {
								setSearch(event.target.value);
								setStatus("");
								setPage(1);
							}}
						/>
					</label>
				</div>

				<div className="admin-orders__tabs" role="tablist" aria-label="Filtrer par statut">
					{STATUS_FILTERS.map((filter) => (
						<button
							key={filter.value || "all"}
							type="button"
							role="tab"
							aria-selected={status === filter.value && !search}
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
			</div>
		</section>
	);
}