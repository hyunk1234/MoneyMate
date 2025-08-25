export const API_BASE = "http://localhost:5000/api";

export async function api(path, method = "GET", body = null) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  const token = localStorage.getItem("token");
  if (token) opts.headers["Authorization"] = "Bearer ${token}";

  if (body !== null) {
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(BASE + path, opts);
  if (!res.ok) {
    const text = await res.json();
    throw new Error(text || "HTTP ${res.status}");
  }

  return res.json();
}
