import { getToken } from "@/lib/utils";

const apiBaseUrl = process.env.BACKEND_URI || "http://localhost:5000/api";

export async function getAllCollections() {
  const response = await fetch(`${apiBaseUrl}/collections`, {
    method: "GET",
  });
  const data = response.json();
  return data;
}

export async function createCollection(formData: FormData) {
  const response = await fetch(`${apiBaseUrl}/collections`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}

export async function getCollectionById(id: string) {
  const response = await fetch(`${apiBaseUrl}/collections/${id}`, {
    method: "GET",
  });
  const data = response.json();
  return data;
}

export async function updateCollectionById(id: string, formData: FormData) {
  const response = await fetch(`${apiBaseUrl}/collections/${id}`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}

export async function deleteCollectionById(id: string) {
  const response = await fetch(`${apiBaseUrl}/collections/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}
