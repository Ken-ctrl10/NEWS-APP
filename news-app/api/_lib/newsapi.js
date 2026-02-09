const NEWS_API_BASE = "https://newsapi.org/v2";

function clampInt(value, { min, max, fallback }) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

function buildQuery(params) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params || {})) {
    if (v === undefined || v === null || v === "") continue;
    qs.set(k, String(v));
  }
  return qs.toString();
}

// Ensures we can call fetch in environments where it's missing (older Node)
async function safeFetch(url, options) {
  if (typeof fetch === "function") return fetch(url, options);
  const mod = await import("node-fetch");
  return mod.default(url, options);
}

async function callNewsApi(endpoint, params) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    const err = new Error("Missing NEWS_API_KEY environment variable.");
    err.code = "serverMisconfigured";
    err.status = 500;
    throw err;
  }

  const url = `${NEWS_API_BASE}${endpoint}?${buildQuery(params)}`;

  // ✅ Add a timeout (10s). Helps identify hangs/timeouts clearly.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  let resp;
  try {
    resp = await safeFetch(url, {
      method: "GET",
      headers: { "X-Api-Key": apiKey },
      signal: controller.signal
    });
  } catch (err) {
    // ✅ This is the REAL reason behind "fetch failed"
    console.error("NewsAPI fetch error:", err);
    console.error("Cause:", err?.cause);

    const e = new Error(err?.message || "fetch failed");
    e.code = "fetchFailed";
    e.status = 500;

    // attach useful debug info (safe to show in dev)
    e.payload = {
      url,
      cause: err?.cause ? String(err.cause) : "",
      name: err?.name || "",
    };

    throw e;
  } finally {
    clearTimeout(timeoutId);
  }

  const data = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    const err = new Error(data?.message || "NewsAPI request failed");
    err.code = data?.code || "newsApiError";
    err.status = resp.status || 500;
    err.payload = data;
    throw err;
  }

  return data;
}

function normalizeArticle(a = {}) {
  return {
    source: a?.source?.name || "Unknown",
    author: a?.author || "",
    title: a?.title || "",
    description: a?.description || "",
    url: a?.url || "",
    urlToImage: a?.urlToImage || "",
    publishedAt: a?.publishedAt || "",
    content: a?.content || ""
  };
}

module.exports = { callNewsApi, normalizeArticle, clampInt };