import { apiBaseUrl, getToken } from "@/lib/utils";

export async function getAllCategories(page?: string, limit?: string) {
  const response = await fetch(
    `${apiBaseUrl}/categories?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
  const data = response.json();
  return data;
}

export async function createCategory(reqBody: {
  name: string;
  description: string;
}) {
  const response = await fetch(`${apiBaseUrl}/categories`, {
    method: "POST",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json",
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

export async function updateCategoryById(
  id: string,
  reqBody: {
    name: string;
    description: string;
  }
) {
  const response = await fetch(`${apiBaseUrl}/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(reqBody),
    headers: {
      "Content-Type": "application/json",
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
