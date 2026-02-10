const express = require("express");
const { ok, fail } = require("../lib/response");
const { callNewsApi, normalizeArticle, clampInt } = require("../lib/newsapi");

const router = express.Router();

// GET /api/news/search?q=...&sources=&language=en&sortBy=publishedAt&page=1&pageSize=20
router.get("/search", async (req, res) => {
  try {
    const {
      q = "",
      sources = "",
      language = "en",
      sortBy = "publishedAt",
      page = "1",
      pageSize = "20"
    } = req.query;

    if (!q.trim()) {
      return fail(res, "parametersMissing", "Query parameter 'q' is required.", 400);
    }

    const safePage = clampInt(page, { min: 1, max: 100, fallback: 1 });
    const safePageSize = clampInt(pageSize, { min: 1, max: 100, fallback: 20 });

    const data = await callNewsApi("/everything", {
      q, sources, language, sortBy,
      page: safePage,
      pageSize: safePageSize
    });

    const articles = (data.articles || []).map(normalizeArticle);
    return ok(res, { totalResults: data.totalResults ?? 0, articles });
  } catch (e) {
    return fail(
      res,
      e.code || "searchFailed",
      e.message || "Failed to search news",
      e.status || 500,
      e.payload ? { upstream: e.payload } : {}
    );
  }
});

// GET /api/news/top-headlines?country=ph&category=&q=&sources=&page=1&pageSize=20
router.get("/top-headlines", async (req, res) => {
  try {
    const {
      country = "ph",
      category = "",
      q = "",
      sources = "",
      page = "1",
      pageSize = "20"
    } = req.query;

    const safePage = clampInt(page, { min: 1, max: 100, fallback: 1 });
    const safePageSize = clampInt(pageSize, { min: 1, max: 100, fallback: 20 });

    // NewsAPI rule: if sources is set, do NOT include country/category.
    const params = { q, page: safePage, pageSize: safePageSize };
    if (sources) {
      params.sources = sources;
    } else {
      params.country = country;
      if (category) params.category = category;
    }

    const data = await callNewsApi("/top-headlines", params);
    const articles = (data.articles || []).map(normalizeArticle);

    return ok(res, { totalResults: data.totalResults ?? 0, articles });
  } catch (e) {
    return fail(
      res,
      e.code || "topHeadlinesFailed",
      e.message || "Failed to fetch top headlines",
      e.status || 500,
      e.payload ? { upstream: e.payload } : {}
    );
  }
});

module.exports = router;