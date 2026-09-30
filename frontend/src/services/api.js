const API_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export function hasApi() {
  return Boolean(API_URL);
}

export async function api(path, options = {}) {
  if (!API_URL) throw new Error("VITE_API_URL is not configured");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  if (response.status === 204) return null;
  return response.json();
}