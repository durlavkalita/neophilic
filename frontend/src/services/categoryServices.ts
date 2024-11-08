import { getToken } from "@/lib/utils";

const apiBaseUrl = process.env.BACKEND_URI || "http://localhost:5000/api";

export async function getAllCategories() {
  const response = await fetch(`${apiBaseUrl}/categories`, {
    method: "GET",
  });
  const data = response.json();
  return data;
}

export async function createCategory(formData: FormData) {
  const response = await fetch(`${apiBaseUrl}/categories`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}

export async function getCategoryById(id: string) {
  const response = await fetch(`${apiBaseUrl}/categories/${id}`, {
    method: "GET",
  });
  const data = response.json();
  return data;
}

export async function updateCategoryById(id: string, formData: FormData) {
  const response = await fetch(`${apiBaseUrl}/categories/${id}`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}

export async function deleteCategoryById(id: string) {
  const response = await fetch(`${apiBaseUrl}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}
