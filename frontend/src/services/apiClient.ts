import { apiBaseUrl, getToken } from "@/lib/utils";

export async function apiClient(
  endpoint: string,
  { method = "GET", body = {}, headers = {}, ...customConfig } = {}
) {
  const token = getToken();

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    ...(body && { body: JSON.stringify(body) }),
    ...customConfig,
  };

  try {
    const response = await fetch(`${apiBaseUrl}/${endpoint}`, config);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
}
