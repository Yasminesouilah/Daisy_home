import { api } from "./api.js";

export async function getCategories() {
  return api("/categories");
}