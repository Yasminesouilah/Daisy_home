import { adminApi } from "./adminApi.js";

export function getDashboardStats() {
  return adminApi.get("/dashboard");
}