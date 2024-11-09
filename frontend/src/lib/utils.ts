export function getToken() {
  return localStorage.getItem("accessToken");
}

export function setToken(token: string) {
  localStorage.setItem("accessToken", token);
}

export function removeToken() {
  localStorage.removeItem("accessToken");
}

export function humanReadableDate(dateString: string) {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return formattedDate;
}
