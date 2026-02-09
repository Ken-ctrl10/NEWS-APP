export default function Loader({ text = "Loading..." }) {
  return (
    <div className="d-flex align-items-center gap-2 py-3">
      <div className="spinner-border spinner-border-sm text-warning" role="status" aria-label="Loading" />
      <span className="opacity-75">{text}</span>
    </div>
  );
}