export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(input, { ...init, headers });
}
