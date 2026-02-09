import { useState } from "react";
import NewsList from "../components/news/NewsList";
import EmptyState from "../components/common/EmptyState";
import ArticleModal from "../components/news/ArticleModal";

export default function Favorites({
  user,
  favorites,
  isFavorite,
  onToggleFavorite,
  onClearFavorites,
  onRequireLogin
}) {
  const [selected, setSelected] = useState(null);

  if (!user) {
    return (
      <div className="container py-4">
        <EmptyState
          title="Favorites is for registered users"
          message="Please login to save and view your favorite articles."
          actionLabel="Go to Login"
          onAction={onRequireLogin}
        />
      </div>
    );
  }

  // Optional safety wrapper (even though Favorites already requires login)
  const safeToggle = (article) => {
    try {
      onToggleFavorite?.(article);
    } catch (err) {
      if (err?.code === "authRequired") onRequireLogin?.();
    }
  };

  const hasFavorites = Array.isArray(favorites) && favorites.length > 0;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center gap-2 mb-3 flex-wrap">
        <h3 className="m-0">Favorites</h3>

        <button
          className="btn btn-outline-light btn-sm"
          onClick={onClearFavorites}
          disabled={!hasFavorites}
          type="button"
        >
          Clear All
        </button>
      </div>

      {!hasFavorites ? (
        <EmptyState
          title="No favorites yet"
          message="Save articles from Home or Search and they will appear here."
        />
      ) : (
        <NewsList
          articles={favorites}
          onRead={(a) => setSelected(a)}
          isFavorite={isFavorite}
          onToggleFavorite={safeToggle}
        />
      )}

      {/* ✅ Only render modal when an article is selected */}
      {selected ? (
        <ArticleModal
          article={selected}
          onClose={() => setSelected(null)}
          isFavorite={isFavorite(selected)}
          onToggleFavorite={safeToggle}
        />
      ) : null}
    </div>
  );
}