import { getToken } from "@/lib/utils";

const apiBaseUrl = process.env.BACKEND_URI || "http://localhost:5000/api";

export async function getAllAttributes(page?: string, limit?: string) {
  const response = await fetch(
    `${apiBaseUrl}/attributes?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
  const data = response.json();
  return data;
}

export async function createAttribute(reqBody: {
  name: string;
  values: string[];
}) {
  const response = await fetch(`${apiBaseUrl}/attributes`, {
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

export async function getAttributeById(id: string) {
  const response = await fetch(`${apiBaseUrl}/attributes/${id}`, {
    method: "GET",
  });
  const data = response.json();
  return data;
}

export async function updateAttributeById(
  id: string,
  reqBody: {
    name: string;
    values: string[];
  }
) {
  const response = await fetch(`${apiBaseUrl}/attributes/${id}`, {
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
