export default function Filters({
  category = "",
  onCategoryChange,
  pageSize = 12,
  onPageSizeChange
}) {
  return (
    <div className="d-flex gap-2 flex-wrap">
      <select
        className="form-select w-auto"
        value={category}
        onChange={(e) => onCategoryChange?.(e.target.value)}
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
        className="form-select w-auto"
        value={pageSize}
        onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
      >
        <option value={6}>6</option>
        <option value={12}>12</option>
        <option value={20}>20</option>
      </select>
    </div>
  );
}