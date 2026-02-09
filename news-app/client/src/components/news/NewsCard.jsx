import { useState } from "react";
import { formatDate } from "../../utils/formatDate";
import fallbackImg from "../../assets/fallback-news.jpg";

export default function NewsCard({ article, onRead, isFavorite, onToggleFavorite }) {
  const { title, description, url, urlToImage, source, publishedAt } = article;

  // Start with article image if available, otherwise fallback
  const [imgSrc, setImgSrc] = useState(urlToImage || fallbackImg);

  return (
    <div className="card card-surface h-100">
      <img
        src={imgSrc}
        className="card-img-top"
        alt={title || "News image"}
        style={{ objectFit: "cover", maxHeight: 180 }}
        loading="lazy"
        onError={() => setImgSrc(fallbackImg)}   // ✅ if URL breaks, switch to fallback
      />

      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between gap-2">
          <small className="text-warning">{source}</small>
          <small className="opacity-75">{formatDate(publishedAt)}</small>
        </div>

        <h6 className="mt-2">{title}</h6>
        <p className="small opacity-75">{description}</p>

        <div className="mt-auto d-flex gap-2 flex-wrap">
          <button className="btn btn-accent btn-sm" type="button" onClick={() => onRead?.(article)}>
            Read
          </button>

          <button
            className={`btn btn-sm ${isFavorite ? "btn-warning" : "btn-outline-warning"}`}
            type="button"
            onClick={() => onToggleFavorite?.(article)}
          >
            {isFavorite ? "Saved" : "Save"}
          </button>

          <a className="btn btn-outline-light btn-sm" href={url} target="_blank" rel="noreferrer">
            Open Source
          </a>
        </div>
      </div>
    </div>
  );
}