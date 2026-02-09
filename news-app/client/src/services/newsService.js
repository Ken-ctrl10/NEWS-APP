import { apiGet } from "./apiClient";

export function getTopHeadlines({
  country = "ph",
  category = "",
  q = "",
  sources = "",
  page = 1,
  pageSize = 12
} = {}) {
  return apiGet("/news/top-headlines", { country, category, q, sources, page, pageSize });
}

export function searchNews({
  q,
  sources = "",
  language = "en",
  sortBy = "publishedAt",
  page = 1,
  pageSize = 12
} = {}) {
  return apiGet("/news/search", { q, sources, language, sortBy, page, pageSize });
}