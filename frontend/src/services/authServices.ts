import { apiBaseUrl, getToken } from "@/lib/utils";
import { apiClient } from "./apiClient";

export async function loginService(credentials: {
  email: string;
  password: string;
}) {
  const data = await apiClient("auth/login", {
    method: "POST",
    body: credentials,
  });
  return data;
}

export async function getAllUsers(page?: string, limit?: string) {
  const response = await fetch(
    `${apiBaseUrl}/auth/users?page=${page}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  const data = response.json();
  return data;
}

export async function getUserById(id: string) {
  const response = await fetch(`${apiBaseUrl}/auth/users/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}
