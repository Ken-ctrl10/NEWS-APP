import fallbackImg from "../../assets/fallback-news.jpg";
import { formatDate } from "../../utils/formatDate";

export default function ArticleModal({ article, onClose, isFavorite, onToggleFavorite }) {
  if (!article) return null;

  const {
    title,
    description,
    content,
    url,
    urlToImage,
    author,
    source,
    publishedAt
  } = article;

  const imgSrc = urlToImage || fallbackImg;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      style={{ background: "rgba(0,0,0,0.6)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content card-surface">
          <div className="modal-header border-0">
            <div>
              <h5 className="modal-title mb-1">{title}</h5>
              <div className="small opacity-75">
                <span className="text-warning">{source}</span>
                {author ? <> • {author}</> : null}
                {publishedAt ? <> • {formatDate(publishedAt)}</> : null}
              </div>
            </div>

            <button
              type="button"
              className="btn-close btn-close-white"
              aria-label="Close"
              onClick={onClose}
            />
          </div>

          <img
            src={imgSrc}
            alt={title || "News image"}
            style={{ maxHeight: 320, objectFit: "cover", width: "100%" }}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null; // prevent infinite loop
              e.currentTarget.src = fallbackImg;
            }}
          />

          <div className="modal-body">
            {description ? <p className="opacity-75">{description}</p> : null}
            {content ? <p className="mb-0">{content}</p> : <p className="mb-0 opacity-75">No content preview.</p>}
          </div>

          <div className="modal-footer border-0 d-flex gap-2 flex-wrap">
            <button
              className={`btn btn-sm ${isFavorite ? "btn-warning" : "btn-outline-warning"}`}
              type="button"
              onClick={() => onToggleFavorite?.(article)}
            >
              {isFavorite ? "Saved" : "Save"}
            </button>

            <a className="btn btn-accent btn-sm" href={url} target="_blank" rel="noreferrer">
              Open Source
            </a>

            <button className="btn btn-outline-light btn-sm" type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}