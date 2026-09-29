import { PRODUCTS } from "../data/products";

// Small delay to behave like a real API (and to test loading states)
const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getProducts() {
  await delay();
  return PRODUCTS;
}

export async function getProductsByIds(ids) {
  await delay();
  return PRODUCTS.filter((p) => ids.includes(p.id));
}

export async function getProductBySlug(slug) {
  await delay();
  return PRODUCTS.find((p) => p.slug === slug || p.id === slug) || null;
}

export async function getRelatedProducts(product, limit = 4) {
  await delay();
  return PRODUCTS.filter((item) => item.category === product.category && item.id !== product.id).slice(0, limit);
}