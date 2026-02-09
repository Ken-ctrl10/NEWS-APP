import EmptyState from "../common/EmptyState";
import NewsCard from "./NewsCard";

export default function NewsList({ articles = [], onRead, isFavorite, onToggleFavorite }) {
  if (!articles.length) {
    return <EmptyState title="No articles found" message="Try another keyword or category." />;
  }

  return (
    <div className="row g-3">
      {articles.map((a, i) => {
        const key =
          a.url ||
          `${a.source || "src"}-${a.publishedAt || "date"}-${a.title || "title"}-${i}`;

        return (
          <div className="col-12 col-md-6 col-lg-4" key={key}>
            <NewsCard
              article={a}
              onRead={onRead}
              isFavorite={isFavorite?.(a)}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        );
      })}
    </div>
  );
}