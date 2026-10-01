import { adminApi } from "./adminApi.js";

export function getAdminOrders({ status, page = 1 } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page) params.set("page", String(page));
  const query = params.toString();
  return adminApi.get(`/orders${query ? `?${query}` : ""}`);
}

export function searchAdminOrders(query) {
  return adminApi.get(`/orders/search?${new URLSearchParams({ q: query })}`);
}

export function getAdminOrder(id) {
  return adminApi.get(`/orders/${encodeURIComponent(id)}`);
}

export function updateOrderStatus(id, status) {
  return adminApi.patch(`/orders/${encodeURIComponent(id)}/status`, { status });
}