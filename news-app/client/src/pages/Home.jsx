import { useEffect, useState } from "react";
import { getTopHeadlines } from "../services/newsService";
import NewsList from "../components/news/NewsList";
import Loader from "../components/common/Loader";
import Pagination from "../components/news/Pagination";
import ArticleModal from "../components/news/ArticleModal";

export default function Home({ user, isFavorite, onToggleFavorite, onRequireLogin }) {
  const [category, setCategory] = useState("");
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);

  async function load(p = page) {
    setLoading(true);
    setError("");

    try {
      const data = await getTopHeadlines({
        country: "us",
        category,
        pageSize,
        page: p
      });

      setArticles(data.articles || []);
      setTotalResults(data.totalResults || 0);
    } catch (e) {
      setError(e.message || "Failed to load headlines");
    } finally {
      setLoading(false);
    }
  }

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [category, pageSize]);

  // Fetch on change
  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, pageSize, page]);

  const safeToggle = (article) => {
    try {
      onToggleFavorite?.(article);
    } catch (err) {
      if (err?.code === "authRequired") onRequireLogin?.();
    }
  };

  const showingCount = articles.length;
  const requestedCount = pageSize;
  const isShortPage = !loading && !error && showingCount > 0 && showingCount < requestedCount;

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h3 className="m-0">Top Headlines (US)</h3>
          <div className="small opacity-75">
            Mode:{" "}
            <span className="text-warning">
              {user ? `Registered (${user.name})` : "Guest"}
            </span>
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <select
            className="form-select w-auto bg-dark text-light"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Category"
          >
            <option value="">All categories</option>
            <option value="business">Business</option>
            <option value="entertainment">Entertainment</option>
            <option value="general">General</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
          </select>

          <select
            className="form-select w-auto bg-dark text-light"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            aria-label="Items per page"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
          </select>

          <button
            className="btn btn-outline-light"
            onClick={() => load(page)}
            disabled={loading}
            type="button"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* ✅ Debug Counter (your request) */}
      {!loading && !error ? (
        <div className="small opacity-75 mb-2">
          Showing{" "}
          <span className="text-warning">{showingCount}</span> of{" "}
          <span className="text-warning">{requestedCount}</span> requested • Total available:{" "}
          <span className="text-warning">{totalResults}</span>
        </div>
      ) : null}

      {/* Optional note if API returns fewer than requested */}
      {isShortPage ? (
        <div className="alert alert-warning py-2 mb-3">
          Fewer results were returned than requested for this page/filter. Try another category or hit Refresh.
        </div>
      ) : null}

      {error ? <div className="alert alert-danger">{error}</div> : null}

      {loading ? (
        <Loader text="Loading headlines..." />
      ) : (
        <>
          <NewsList
            articles={articles}
            onRead={(a) => setSelected(a)}
            isFavorite={isFavorite}
            onToggleFavorite={safeToggle}
          />

          <Pagination
            page={page}
            pageSize={pageSize}
            totalResults={totalResults}
            loading={loading}
            onPageChange={setPage}
          />
        </>
      )}

      {/* ✅ Only render modal when selected exists */}
      {selected ? (
        <ArticleModal
          article={selected}
          onClose={() => setSelected(null)}
          isFavorite={isFavorite?.(selected) || false}
          onToggleFavorite={safeToggle}
        />
      ) : null}
    </div>
  );
}