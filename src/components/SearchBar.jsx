import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon.jsx";

export default function SearchBar({
  initial = "",
  placeholder = "Try “vets in Harare” or “waterfalls”",
  size = "",
  autoFocus = false,
}) {
  const [q, setQ] = useState(initial);
  const navigate = useNavigate();
  useEffect(() => setQ(initial), [initial]);
  const submit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };
  return (
    <form className={`searchbar ${size}`} role="search" onSubmit={submit}>
      <Icon name="search" size={size === "large" ? 22 : 18} />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        aria-label="Search businesses and places to visit"
        autoFocus={autoFocus}
        enterKeyHint="search"
      />
      <button className="btn btn-small" type="submit">
        Search
      </button>
    </form>
  );
}
