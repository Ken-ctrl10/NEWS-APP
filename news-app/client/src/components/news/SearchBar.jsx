import { useState } from "react";

export default function SearchBar({ onSearch, initialValue = "" }) {
  const [value, setValue] = useState(initialValue);

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(value.trim());
  };

  return (
    <form onSubmit={submit} className="d-flex gap-2 flex-wrap">
      <input
        className="form-control"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search keyword (e.g., technology, philippines...)"
      />

      <button className="btn btn-accent" disabled={!value.trim()} type="submit">
        Search
      </button>
    </form>
  );
}