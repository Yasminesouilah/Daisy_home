import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	createAdminProduct,
	getAdminProduct,
	updateAdminProduct,
} from "../services/adminProductService.js";
import {
	getAdminCategories,
	createAdminCategory,
} from "../services/adminCategoryService.js";
import "./ProductForm.css";

const EMPTY_PRODUCT = {
	name: "",
	slug: "",
	category: "",
	price: "",
	oldPrice: "",
	description: "",
	variants: [],
	isNew: false,
	stock: 0,
	isActive: true,
};
const NEW_CATEGORY = "__new_category__";

function slugify(value) {
	return value
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

export default function ProductForm() {
	const { id } = useParams();
	const isEditing = Boolean(id);
	const navigate = useNavigate();
	const [values, setValues] = useState(EMPTY_PRODUCT);
	const [existingImages, setExistingImages] = useState([]);
	const [newFiles, setNewFiles] = useState([]);
	const [loading, setLoading] = useState(isEditing);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [creatingCategory, setCreatingCategory] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [newCategorySlug, setNewCategorySlug] = useState("");
	const [newCategoryImage, setNewCategoryImage] = useState(null);

	useEffect(() => {
		let active = true;
		getAdminCategories()
			.then((categories) => {
				if (!active) return;
				setCategoryOptions(categories);
				setValues((current) =>
					current.category ? current : { ...current, category: categories[0]?.slug || "" },
				);
			})
			.catch(() => {});

		return () => {
			active = false;
		};
	}, []);

	useEffect(() => {
		if (!isEditing) return undefined;

		let active = true;
		getAdminProduct(id)
			.then((product) => {
				if (!active) return;
				setValues({
					name: product.name,
					slug: product.slug,
					category: product.category,
					price: String(product.price),
					oldPrice: product.oldPrice == null ? "" : String(product.oldPrice),
					description: product.description || "",
					variants: Array.isArray(product.variants) ? product.variants : [],
					isNew: product.isNew,
					stock: product.stock,
					isActive: product.isActive,
				});
				setExistingImages(Array.isArray(product.images) ? product.images : []);
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
	}, [id, isEditing]);

	function updateField(field, value) {
		setValues((current) => ({ ...current, [field]: value }));
	}

	function updateName(value) {
		setValues((current) => ({
			...current,
			name: value,
			slug: isEditing ? current.slug : slugify(value),
		}));
	}

	function handleCategorySelect(value) {
		if (value === NEW_CATEGORY) {
			setCreatingCategory(true);
			setNewCategoryName("");
			setNewCategorySlug("");
			setNewCategoryImage(null);
			updateField("category", "");
			return;
		}

		setCreatingCategory(false);
		updateField("category", value);
	}

	function handleNewCategoryName(value) {
		const slug = slugify(value);
		setNewCategoryName(value);
		setNewCategorySlug(slug);
	}

	function handleNewCategorySlug(value) {
		setNewCategorySlug(value.trim().toLocaleLowerCase());
	}

	function handleNewCategoryImage(event) {
		const file = event.target.files?.[0] || null;
		event.target.value = "";

		if (file && file.size > 5 * 1024 * 1024) {
			setError("L'image de la catégorie doit faire 5 MB maximum.");
			return;
		}

		setError("");
		setNewCategoryImage(file);
	}

	function addVariant() {
		updateField("variants", [...values.variants, { label: "", options: [] }]);
	}

	function updateVariant(index, field, value) {
		setValues((current) => ({
			...current,
			variants: current.variants.map((variant, variantIndex) =>
				variantIndex === index ? { ...variant, [field]: value } : variant,
			),
		}));
	}

	function removeVariant(index) {
		updateField("variants", values.variants.filter((_, variantIndex) => variantIndex !== index));
	}

	function handleFiles(event) {
		const selected = Array.from(event.target.files || []);
		event.target.value = "";

		if (selected.some((file) => file.size > 5 * 1024 * 1024)) {
			setError("Chaque image doit faire 5 MB maximum.");
			return;
		}

		if (existingImages.length + newFiles.length + selected.length > 5) {
			setError("Un produit ne peut pas avoir plus de 5 images.");
			return;
		}

		setError("");
		setNewFiles((current) => [...current, ...selected]);
	}

	function removeNewFile(index) {
		setNewFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setError("");

		if (creatingCategory) {
			if (!newCategoryName.trim() || !newCategorySlug.trim()) {
				setError("Le nom et le slug de la nouvelle catégorie sont requis.");
				return;
			}
			if (!newCategoryImage) {
				setError("Une image est requise pour la nouvelle catégorie.");
				return;
			}
		}

		setSubmitting(true);

		try {
			let categorySlug = values.category;

			if (creatingCategory) {
				const category = await createAdminCategory(
					newCategoryName.trim(),
					newCategorySlug.trim(),
					newCategoryImage,
				);
				categorySlug = category.slug;
				setCategoryOptions((current) => [...current, category]);
				setCreatingCategory(false);
			}

			const payload = {
				...values,
				category: categorySlug,
				price: Number(values.price),
				oldPrice: values.oldPrice === "" ? null : Number(values.oldPrice),
				stock: Number(values.stock),
			};

			if (isEditing) {
				await updateAdminProduct(id, payload, newFiles, existingImages);
			} else {
				await createAdminProduct(payload, newFiles);
			}
			navigate("/admin/products");
		} catch (requestError) {
			setError(requestError.message || "Impossible d'enregistrer le produit.");
			setSubmitting(false);
		}
	}

	if (loading) return <p className="product-form__loading">Chargement du produit...</p>;

	return (
		<section className="product-form-page">
			<header className="product-form-page__header">
				<p className="product-form-page__eyebrow">Catalogue</p>
				<h1>{isEditing ? "Modifier le produit" : "Nouveau produit"}</h1>
			</header>

			<form className="product-form" onSubmit={handleSubmit}>
				<div className="product-form__grid">
					<div className="product-form__field">
						<label htmlFor="product-name">Nom *</label>
						<input id="product-name" value={values.name} onChange={(event) => updateName(event.target.value)} required />
					</div>

					<div className="product-form__field">
						<label htmlFor="product-slug">Slug *</label>
						<input id="product-slug" value={values.slug} onChange={(event) => updateField("slug", event.target.value)} required />
					</div>

					<div className="product-form__field">
						<label htmlFor="product-category">Catégorie *</label>
						<select
							id="product-category"
							value={creatingCategory ? NEW_CATEGORY : values.category}
							onChange={(event) => handleCategorySelect(event.target.value)}
							required
						>
							<option value="" disabled>Choisir une catégorie</option>
							{categoryOptions.map((category) => (
								<option key={category.slug} value={category.slug}>{category.name}</option>
							))}
							<option value={NEW_CATEGORY}>+ Créer une catégorie</option>
						</select>
					</div>

					<div className="product-form__field">
						<label htmlFor="product-stock">Stock *</label>
						<input id="product-stock" type="number" min="0" step="1" value={values.stock} onChange={(event) => updateField("stock", event.target.value)} required />
					</div>

					<div className="product-form__field">
						<label htmlFor="product-price">Prix (DA) *</label>
						<input id="product-price" type="number" min="0.01" step="0.01" value={values.price} onChange={(event) => updateField("price", event.target.value)} required />
					</div>

					<div className="product-form__field">
						<label htmlFor="product-old-price">Ancien prix (optionnel)</label>
						<input id="product-old-price" type="number" min="0.01" step="0.01" value={values.oldPrice} onChange={(event) => updateField("oldPrice", event.target.value)} />
					</div>
				</div>

				{creatingCategory && (
					<div className="product-form__new-category">
						<div className="product-form__field">
							<label htmlFor="new-category-name">Nom de la catégorie *</label>
							<input
								id="new-category-name"
								value={newCategoryName}
								onChange={(event) => handleNewCategoryName(event.target.value)}
								placeholder="Ex. Luminaires"
								required
							/>
						</div>
						<div className="product-form__field">
							<label htmlFor="new-category-slug">Slug *</label>
							<input
								id="new-category-slug"
								value={newCategorySlug}
								onChange={(event) => handleNewCategorySlug(event.target.value)}
								pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
								placeholder="luminaires"
								required
							/>
						</div>
						<div className="product-form__field">
							<label htmlFor="new-category-image">Image de la catégorie *</label>
							<input
								id="new-category-image"
								type="file"
								accept="image/*"
								onChange={handleNewCategoryImage}
							/>
							{newCategoryImage && <span className="product-form__hint">{newCategoryImage.name}</span>}
						</div>
					</div>
				)}

				<div className="product-form__field">
					<label htmlFor="product-description">Description</label>
					<textarea id="product-description" rows="4" value={values.description} onChange={(event) => updateField("description", event.target.value)} />
				</div>

				<fieldset className="product-form__toggles">
					<legend>Visibilité</legend>
					<label><input type="checkbox" checked={values.isNew} onChange={(event) => updateField("isNew", event.target.checked)} /> Nouveauté</label>
					<label><input type="checkbox" checked={values.isActive} onChange={(event) => updateField("isActive", event.target.checked)} /> Produit actif</label>
				</fieldset>

				<fieldset className="product-form__variants">
					<legend>Variantes</legend>
					{values.variants.map((variant, index) => (
						<div className="product-form__variant" key={`variant-${index}`}>
							<label>
								<span>Groupe</span>
								<input value={variant.label} placeholder="Ex. Taille" onChange={(event) => updateVariant(index, "label", event.target.value)} />
							</label>
							<label>
								<span>Options, séparées par des virgules</span>
								<input
									value={variant.options.join(", ")}
									placeholder="Petit, Moyen"
									onChange={(event) => updateVariant(index, "options", event.target.value.split(",").map((option) => option.trim()).filter(Boolean))}
								/>
							</label>
							<button type="button" className="product-form__remove" onClick={() => removeVariant(index)} aria-label={`Supprimer le groupe ${index + 1}`}>Supprimer</button>
						</div>
					))}
					<button type="button" className="product-form__secondary" onClick={addVariant}>Ajouter un groupe</button>
				</fieldset>

				<fieldset className="product-form__images">
					<legend>Images</legend>
					{existingImages.length > 0 && (
						<div className="product-form__image-list">
							{existingImages.map((image) => (
								<div className="product-form__image" key={image}>
									<img src={image} alt="" />
									<button type="button" onClick={() => setExistingImages((current) => current.filter((item) => item !== image))} aria-label="Retirer cette image">Retirer</button>
								</div>
							))}
						</div>
					)}
					{newFiles.length > 0 && (
						<ul className="product-form__file-list">
							{newFiles.map((file, index) => (
								<li key={`${file.name}-${file.lastModified}`}>
									<span>{file.name}</span>
									<button type="button" onClick={() => removeNewFile(index)} aria-label={`Retirer ${file.name}`}>Retirer</button>
								</li>
							))}
						</ul>
					)}
					<label className="product-form__file-picker">
						<span>Ajouter des images</span>
						<input type="file" accept="image/*" multiple onChange={handleFiles} />
					</label>
					<p className="product-form__hint">5 images maximum, 5 MB par fichier.</p>
					{!isEditing && newFiles.length === 0 && <p className="product-form__hint">Ajoutez au moins une image pour créer le produit.</p>}
				</fieldset>

				{error && <p className="product-form__error" role="alert">{error}</p>}

				<footer className="product-form__actions">
					<button type="button" className="product-form__secondary" onClick={() => navigate("/admin/products")}>Annuler</button>
					<button type="submit" className="product-form__submit" disabled={submitting}>
						{submitting ? "Enregistrement..." : isEditing ? "Enregistrer" : "Créer le produit"}
					</button>
				</footer>
			</form>
		</section>
	);
}