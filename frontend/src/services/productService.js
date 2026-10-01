import { PRODUCTS } from "../data/products";
import { api, hasApi } from "./api.js";

// Small delay to behave like a real API (and to test loading states)
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts() {
  if (hasApi()) {
    const firstPage = await api("/products?page=1");
    if (firstPage.totalPages <= 1) return firstPage.items;

    const remainingPages = await Promise.all(
      Array.from({ length: firstPage.totalPages - 1 }, (_, index) =>
        api(`/products?page=${index + 2}`),
      ),
    );
    return [firstPage, ...remainingPages].flatMap((page) => page.items);
  }

  await delay();
  return PRODUCTS;
}

export async function getProductsByIds(ids) {
  if (hasApi()) {
    const products = await getProducts();
    return products.filter((product) => ids.includes(product.id));
  }

  await delay();
  return PRODUCTS.filter((p) => ids.includes(p.id));
}

export async function getProductBySlug(slug) {
  if (hasApi()) return api(`/products/${encodeURIComponent(slug)}`);

  await delay();
  return PRODUCTS.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function getRelatedProducts(product, limit = 4) {
  if (hasApi()) {
    const related = await api(`/products/${encodeURIComponent(product.slug)}/related`);
    return related.slice(0, limit);
  }

  await delay();
  return PRODUCTS.filter((item) => item.category === product.category && item.id !== product.id).slice(0, limit);
}