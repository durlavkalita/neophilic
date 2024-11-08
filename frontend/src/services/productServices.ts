import { getToken } from "@/lib/utils";

const apiBaseUrl = process.env.BACKEND_URI || "http://localhost:5000/api";

export async function getAllProducts(page: string, limit: string) {
  const response = await fetch(
    `${apiBaseUrl}/products?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
  const data = response.json();
  return data;
}

export async function createProduct(formData: FormData) {
  const response = await fetch(`${apiBaseUrl}/products`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}

export async function getProductById(id: string) {
  const response = await fetch(`${apiBaseUrl}/products/${id}`, {
    method: "GET",
  });
  const data = response.json();
  return data;
}

export async function updateProductById(id: string, formData: FormData) {
  const response = await fetch(`${apiBaseUrl}/products/${id}`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}

export async function deleteProductById(id: string) {
  const response = await fetch(`${apiBaseUrl}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}

export async function getSearchedProduct(
  keyword: string,
  page: string,
  limit: string
) {
  const response = await fetch(
    `${apiBaseUrl}/products/search/name?keyword=${keyword}&page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
  const data = response.json();
  return data;
}
