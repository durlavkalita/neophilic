import { getToken } from "@/lib/utils";

const apiBaseUrl = process.env.BACKEND_URI || "http://localhost:5000/api";

export async function getAllCollections(page?: string, limit?: string) {
  const response = await fetch(
    `${apiBaseUrl}/collections?page=${page}&limit=${limit}`,
    {
      method: "GET",
    }
  );
  const data = response.json();
  return data;
}

export async function createCollection(reqBody: {
  name: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const response = await fetch(`${apiBaseUrl}/collections`, {
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

export async function getCollectionById(id: string) {
  const response = await fetch(`${apiBaseUrl}/collections/${id}`, {
    method: "GET",
  });
  const data = response.json();
  return data;
}

export async function updateCollectionById(
  id: string,
  reqBody: {
    name: string;
    description: string;
    startDate?: Date;
    endDate?: Date;
  }
) {
  const response = await fetch(`${apiBaseUrl}/collections/${id}`, {
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
