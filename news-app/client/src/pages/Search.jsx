import { useState } from "react";
import { searchNews } from "../services/newsService";
import NewsList from "../components/news/NewsList";
import Loader from "../components/common/Loader";
import Pagination from "../components/news/Pagination";
import ArticleModal from "../components/news/ArticleModal";

export default function Search({ user, isFavorite, onToggleFavorite, onRequireLogin }) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState("");

  const [pageSize] = useState(12);
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState(null);

  async function runSearch(p = 1) {
    setError("");
    setLoading(true);
    try {
      const data = await searchNews({ q, pageSize, page: p });
      setArticles(data.articles || []);
      setTotalResults(data.totalResults || 0);
    } catch (e2) {
      setError(e2.message || "Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setPage(1);
    await runSearch(1);
  }

  async function onPageChange(next) {
    setPage(next);
    await runSearch(next);
  }

  const safeToggle = (article) => {
    try {
      onToggleFavorite?.(article);
    } catch (err) {
      if (err?.code === "authRequired") onRequireLogin?.();
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center gap-2 flex-wrap mb-3">
        <div>
          <h3 className="m-0">Search News</h3>
          <div className="small opacity-75">
            Mode: <span className="text-warning">{user ? `Registered (${user.name})` : "Guest"}</span>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="d-flex gap-2 mb-3 flex-wrap">
        <input
          className="form-control"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search keyword (e.g., technology)"
        />
        <button className="btn btn-warning" disabled={!q.trim() || loading} type="submit">
          Search
        </button>
      </form>

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {loading ? (
        <Loader text="Searching..." />
      ) : (
        <>
          <NewsList
            articles={articles}
            onRead={(a) => setSelected(a)}
            isFavorite={isFavorite}
            onToggleFavorite={safeToggle}
          />

          {articles.length ? (
            <Pagination
              page={page}
              pageSize={pageSize}
              totalResults={totalResults}
              loading={loading}
              onPageChange={onPageChange}
            />
          ) : null}
        </>
      )}

      <ArticleModal
        article={selected}
        onClose={() => setSelected(null)}
        isFavorite={selected ? isFavorite?.(selected) : false}
        onToggleFavorite={safeToggle}
      />
    </div>
  );
}