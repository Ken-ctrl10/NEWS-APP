const { ok, fail } = require("../_lib/response");
const { callNewsApi, normalizeArticle, clampInt } = require("../_lib/newsapi");

module.exports = async (req, res) => {
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
    const safePageSize = clampInt(pageSize, { min: 1, max: 100, fallback: 20 }); // max 100 [1](https://www.mongodb.com/docs/manual/reference/connection-string-formats/)

    // NewsAPI rule: if sources is set, do NOT include country/category. [1](https://www.mongodb.com/docs/manual/reference/connection-string-formats/)
    const params = { q, page: safePage, pageSize: safePageSize };

    if (sources) {
      params.sources = sources;
    } else {
      params.country = country;
      if (category) params.category = category;
    }

    const data = await callNewsApi("/top-headlines", params); // Top headlines endpoint [1](https://www.mongodb.com/docs/manual/reference/connection-string-formats/)
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
};