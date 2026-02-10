const { http } = require('./http');

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

async function callNewsApi(endpoint, params) {
  const apiKey = process.env.NEWS_API_KEY; // <- matches your .env

  if (!apiKey) {
    const err = new Error("Missing NEWS_API_KEY environment variable.");
    err.code = "serverMisconfigured";
    err.status = 500;
    throw err;
  }

  const url = `${NEWS_API_BASE}${endpoint}?${buildQuery(params)}`;

  try {
    const res = await http.get(url, {
      headers: { "X-Api-Key": apiKey },
    });
    return res.data;
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data;
    const e = new Error(data?.message || err.message || "fetch failed");
    e.code = data?.code || err.code || "fetchFailed";
    e.status = status;
    e.payload = data || {
      url,
      cause: err.cause?.message || err.code || String(err.name),
    };
    throw e;
  }
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

module.exports = { callNewsApi, normalizeArticle, clampInt, buildQuery };