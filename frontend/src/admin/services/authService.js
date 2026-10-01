import { adminApi, clearToken, setToken } from "./adminApi.js";

export async function login(email, password) {
  const data = await adminApi.post("/login", { email, password });
  setToken(data.token);
  return data.admin;
}

export function logout() {
  clearToken();
}

export async function getCurrentAdmin() {
  const data = await adminApi.get("/me");
  return data.admin;
}