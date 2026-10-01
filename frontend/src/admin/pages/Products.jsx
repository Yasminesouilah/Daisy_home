import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice.js";
import DataTable from "../components/DataTable.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { deleteAdminProduct, getAdminProducts } from "../services/adminProductService.js";
import "./Products.css";

export default function Products() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [productToDelete, setProductToDelete] = useState(null);
	const [deleteError, setDeleteError] = useState("");
	const [deleting, setDeleting] = useState(false);
	const cancelDeleteRef = useRef(null);

	useEffect(() => {
		let active = true;
		getAdminProducts()
			.then((items) => {
				if (active) setProducts(items);
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

	useEffect(() => {
		if (!productToDelete) return undefined;
		const previouslyFocused = document.activeElement;
		cancelDeleteRef.current?.focus();
		const closeOnEscape = (event) => {
			if (event.key === "Escape" && !deleting) setProductToDelete(null);
		};
		window.addEventListener("keydown", closeOnEscape);
		return () => {
			window.removeEventListener("keydown", closeOnEscape);
			previouslyFocused?.focus?.();
		};
	}, [productToDelete, deleting]);

	async function confirmDelete() {
		if (!productToDelete || deleting) return;
		setDeleteError("");
		setDeleting(true);
		try {
			await deleteAdminProduct(productToDelete.id);
			setProducts((current) => current.filter((item) => item.id !== productToDelete.id));
			setProductToDelete(null);
		} catch (requestError) {
			setDeleteError(requestError.message);
		} finally {
			setDeleting(false);
		}
	}

	const columns = [
		{
			key: "image",
			label: "",
			render: (product) => (
				<img className="admin-products__thumb" src={product.images?.[0]} alt="" />
			),
		},
		{ key: "name", label: "Produit" },
		{ key: "category", label: "Catégorie" },
		{ key: "price", label: "Prix", render: (product) => formatPrice(product.price) },
		{ key: "stock", label: "Stock" },
		{
			key: "isActive",
			label: "Statut",
			render: (product) => <StatusBadge status={product.isActive ? "active" : "inactive"} />,
		},
		{
			key: "actions",
			label: "Actions",
			render: (product) => (
				<div className="admin-products__actions">
					<Link to={`/admin/products/${product.id}/edit`}>Modifier</Link>
							<button
								type="button"
								className="admin-products__delete-trigger"
								onClick={() => {
									setDeleteError("");
									setProductToDelete(product);
								}}
							>
								Supprimer
							</button>
				</div>
			),
		},
	];

	return (
		<section className="admin-products">
			<header className="admin-products__header">
				<div>
					<p className="admin-products__eyebrow">Catalogue</p>
					<h1>Produits</h1>
				</div>
				<Link className="admin-products__add" to="/admin/products/new">Ajouter un produit</Link>
			</header>
			{error && <p className="admin-products__error" role="alert">{error}</p>}
			{loading ? (
				<p className="admin-products__loading">Chargement des produits...</p>
			) : (
				<DataTable
					columns={columns}
					rows={products}
					emptyMessage="Aucun produit pour le moment."
				/>
			)}
			{productToDelete && (
				<div
					className="admin-delete-dialog__backdrop"
					onMouseDown={(event) => {
						if (event.target === event.currentTarget && !deleting) setProductToDelete(null);
					}}
				>
					<section
						className="admin-delete-dialog"
						role="alertdialog"
						aria-modal="true"
						aria-labelledby="admin-delete-title"
						aria-describedby="admin-delete-description"
					>
						<p className="admin-delete-dialog__eyebrow">Suppression définitive</p>
						<h2 id="admin-delete-title">Supprimer ce produit ?</h2>
						<p id="admin-delete-description">
							<strong>{productToDelete.name}</strong> sera supprimé du catalogue. Cette action est irréversible.
						</p>
						{deleteError && <p className="admin-delete-dialog__error" role="alert">{deleteError}</p>}
						<div className="admin-delete-dialog__actions">
							<button
								ref={cancelDeleteRef}
								type="button"
								className="admin-delete-dialog__cancel"
								disabled={deleting}
								onClick={() => setProductToDelete(null)}
							>
								Annuler
							</button>
							<button
								type="button"
								className="admin-delete-dialog__confirm"
								disabled={deleting}
								onClick={confirmDelete}
							>
								{deleting ? "Suppression..." : "Supprimer le produit"}
							</button>
						</div>
					</section>
				</div>
			)}
		</section>
	);
}