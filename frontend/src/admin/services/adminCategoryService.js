import { adminApi, getToken } from "./adminApi";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function getAdminCategories() {
  return adminApi.get("/categories");
}

export async function createAdminCategory(name, slug, imageFile) {
  const token = getToken();
  const formData = new FormData();
  formData.append("name", name);
  formData.append("slug", slug);
  formData.append("image", imageFile);

  const response = await fetch(`${BASE_URL}/admin/categories`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    /* no JSON body */
  }

  if (!response.ok) {
    const error = new Error(data?.error || "Une erreur est survenue.");
    error.status = response.status;
    throw error;
  }

  return data;
}