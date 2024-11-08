import { getToken } from "@/lib/utils";

const apiBaseUrl = process.env.BACKEND_URI || "http://localhost:5000/api";

export async function getAllAttributes() {
  const response = await fetch(`${apiBaseUrl}/attributes`, {
    method: "GET",
  });
  const data = response.json();
  return data;
}

export async function createAttribute(formData: FormData) {
  const response = await fetch(`${apiBaseUrl}/attributes`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}

export async function getAttributeById(id: string) {
  const response = await fetch(`${apiBaseUrl}/attributes/${id}`, {
    method: "GET",
  });
  const data = response.json();
  return data;
}

export async function updateAttributeById(id: string, formData: FormData) {
  const response = await fetch(`${apiBaseUrl}/attributes/${id}`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}

export async function deleteAttributeById(id: string) {
  const response = await fetch(`${apiBaseUrl}/attributes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}
