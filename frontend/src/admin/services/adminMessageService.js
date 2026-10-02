import { adminApi } from "./adminApi.js";

export function getAdminMessages({ isRead, page = 1 } = {}) {
  const params = new URLSearchParams();
  if (isRead !== undefined) params.set("isRead", String(isRead));
  params.set("page", String(page));
  return adminApi.get(`/messages?${params.toString()}`);
}

export function markMessageRead(id) {
  return adminApi.patch(`/messages/${encodeURIComponent(id)}/read`, {});
}

export function deleteAdminMessage(id) {
  return adminApi.delete(`/messages/${encodeURIComponent(id)}`);
}