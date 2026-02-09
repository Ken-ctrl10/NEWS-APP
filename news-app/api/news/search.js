const { ok, fail } = require("../_lib/response");
const { callNewsApi, normalizeArticle, clampInt } = require("../_lib/newsapi");

module.exports = async (req, res) => {
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
    const safePageSize = clampInt(pageSize, { min: 1, max: 100, fallback: 20 }); // max 100 [2](https://dev.to/abhay_yt_52a8e72b213be229/comprehensive-guide-to-mongodb-installation-and-configuration-498d)

    const data = await callNewsApi("/everything", {
      q,
      sources,
      language,
      sortBy,
      page: safePage,
      pageSize: safePageSize
    }); // Everything endpoint [2](https://dev.to/abhay_yt_52a8e72b213be229/comprehensive-guide-to-mongodb-installation-and-configuration-498d)

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
};