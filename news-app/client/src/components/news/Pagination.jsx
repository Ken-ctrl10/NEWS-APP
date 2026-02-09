export default function Pagination({ page, pageSize, totalResults, onPageChange, loading }) {
  const totalPages = Math.max(1, Math.ceil((totalResults || 0) / pageSize));
  const canPrev = page > 1 && !loading;
  const canNext = page < totalPages && !loading;

  return (
    <div className="d-flex align-items-center justify-content-between gap-2 mt-3 flex-wrap">
      <div className="small opacity-75">
        Page <span className="text-warning">{page}</span> of{" "}
        <span className="text-warning">{totalPages}</span>{" "}
        • Results: <span className="text-warning">{totalResults || 0}</span>
      </div>

      <div className="d-flex gap-2">
        <button
          className="btn btn-outline-light btn-sm"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          type="button"
        >
          Prev
        </button>
        <button
          className="btn btn-outline-light btn-sm"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}