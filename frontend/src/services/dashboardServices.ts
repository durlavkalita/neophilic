import { apiBaseUrl, getToken } from "@/lib/utils";

export async function getDashboardStatistics() {
  const response = await fetch(`${apiBaseUrl}/statistics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}

export async function getInventoryHistory(productId: string) {
  const response = await fetch(`${apiBaseUrl}/inventory/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = response.json();
  return data;
}
