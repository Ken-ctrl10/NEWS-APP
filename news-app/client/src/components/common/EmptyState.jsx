export default function EmptyState({
  title = "Nothing here yet",
  message = "Try changing filters or searching again.",
  actionLabel,
  onAction
}) {
  return (
    <div className="card card-surface p-4 text-center">
      <h5 className="mb-2">{title}</h5>
      <p className="opacity-75 mb-3">{message}</p>

      {actionLabel && onAction ? (
        <button className="btn btn-accent btn-sm" onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
