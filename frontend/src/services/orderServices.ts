import { getToken } from "@/lib/utils";

const apiBaseUrl = process.env.BACKEND_URI || "http://localhost:5000/api";

export async function getAllOrders(page?: string, limit?: string) {
  const response = await fetch(
    `${apiBaseUrl}/orders?page=${page}&limit=${limit}`,
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

export async function createOrder(formData: FormData) {
  const response = await fetch(`${apiBaseUrl}/orders`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}

export async function getOrderById(id: string) {
  const response = await fetch(`${apiBaseUrl}/orders/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
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

export async function getOrdersByUser(userId: string) {
  const response = await fetch(`${apiBaseUrl}/orders/user/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}

export async function orderStatusChange(
  orderId: string,
  reqBody: {
    status: "SHIPPED" | "DELIVERED";
  }
) {
  const response = await fetch(
    `${apiBaseUrl}/orders/${orderId}/status/change`,
    {
      method: "PATCH",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  const data = response.json();
  return data;
}
