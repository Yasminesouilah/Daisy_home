import { adminApi, getToken } from "./adminApi.js";

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "";

export function getAdminProducts() {
  return adminApi.get("/products");
}

export function getAdminProduct(id) {
  return adminApi.get(`/products/${encodeURIComponent(id)}`);
}

async function sendFormData(path, method, formData) {
  if (!BASE_URL) throw new Error("VITE_API_URL n'est pas configurée.");

  const token = getToken();
  let response;
  try {
    response = await fetch(`${BASE_URL}/admin${path}`, {
      method,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
  } catch {
    throw new Error("Impossible de contacter le serveur.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.error || "Une erreur est survenue.");
    error.status = response.status;
    throw error;
  }

  return data;
}

function buildProductFormData(values, files, keepImages) {
  const formData = new FormData();
  formData.append("name", values.name);
  formData.append("slug", values.slug);
  formData.append("category", values.category);
  formData.append("price", String(values.price));
  formData.append("oldPrice", values.oldPrice == null ? "" : String(values.oldPrice));
  formData.append("description", values.description || "");
  formData.append("variants", JSON.stringify(values.variants || []));
  formData.append("isNew", String(Boolean(values.isNew)));
  formData.append("stock", String(values.stock ?? 0));
  formData.append("isActive", String(values.isActive ?? true));
  if (keepImages) formData.append("keepImages", JSON.stringify(keepImages));
  files.forEach((file) => formData.append("images", file));
  return formData;
}

export function createAdminProduct(values, files) {
  return sendFormData("/products", "POST", buildProductFormData(values, files));
}

export function updateAdminProduct(id, values, files, keepImages) {
  return sendFormData(
    `/products/${encodeURIComponent(id)}`,
    "PUT",
    buildProductFormData(values, files, keepImages),
  );
}

export function deleteAdminProduct(id) {
  return adminApi.delete(`/products/${encodeURIComponent(id)}`);
}