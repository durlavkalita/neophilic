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
