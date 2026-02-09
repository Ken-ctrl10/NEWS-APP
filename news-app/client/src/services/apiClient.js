const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function buildQuery(params = {}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    qs.set(k, String(v));
  }
  return qs.toString();
}

export async function apiGet(path, params) {
  const qs = buildQuery(params);
  const url = `${BASE_URL}${path}${qs ? `?${qs}` : ""}`;

  const resp = await fetch(url);
  const data = await resp.json().catch(() => ({}));

  if (!resp.ok || data?.status === "error") {
    const err = new Error(data?.message || "Request failed");
    err.code = data?.code || "requestFailed";
    err.payload = data;
    throw err;
  }

  return data;
}