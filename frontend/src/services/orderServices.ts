import { getToken } from "@/lib/utils";

const apiBaseUrl = process.env.BACKEND_URI || "http://localhost:5000/api";

export async function getAllOrders() {
  const response = await fetch(`${apiBaseUrl}/orders`, {
    method: "GET",
  });
  const data = response.json();
  return data;
}

export async function createOrder(formData: FormData) {
  const response = await fetch(`${apiBaseUrl}/orders`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}

export async function getOrderById(id: string) {
  const response = await fetch(`${apiBaseUrl}/orders/${id}`, {
    method: "GET",
  });
  const data = response.json();
  return data;
}

export async function updateOrderById(id: string, formData: FormData) {
  const response = await fetch(`${apiBaseUrl}/orders/${id}`, {
    method: "PUT",
    body: formData,
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}

export async function getOrderByUser(userId: string) {
  const response = await fetch(`${apiBaseUrl}/orders/user/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}
