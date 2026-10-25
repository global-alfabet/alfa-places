import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon.jsx";
import { towns } from "../content/categories.js";

// withTown adds the "where" field from the Figma home page: what you're looking for, then the town.
export default function SearchBar({
  initial = "",
  placeholder = "Try “vets in Harare” or “waterfalls”",
  size = "",
  autoFocus = false,
  withTown = false,
  shortPlaceholder = placeholder,
}) {
  const [q, setQ] = useState(initial);
  const [town, setTown] = useState("");
  const [narrow, setNarrow] = useState(false);
  const navigate = useNavigate();
  useEffect(() => setQ(initial), [initial]);
  // Phones get the short placeholder so it isn't cut off next to the town field.
  useEffect(() => {
    const m = window.matchMedia("(max-width: 760px)");
    const update = () => setNarrow(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("q", q.trim());
    if (town) params.set("town", town);
    navigate(`/search?${params}`);
  };
  return (
    <form className={`searchbar ${size}${withTown ? " with-town" : ""}`} role="search" onSubmit={submit}>
      <Icon name="search" size={size === "large" ? 22 : 18} />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={narrow ? shortPlaceholder : placeholder}
        aria-label="Search businesses and places to visit"
        autoFocus={autoFocus}
        enterKeyHint="search"
      />
      {withTown && (
        <label className="searchbar-town">
          <Icon name="pin" size={18} />
          <select value={town} onChange={(e) => setTown(e.target.value)} aria-label="Town">
            <option value="">Anywhere</option>
            {towns.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      )}
      <button className="btn btn-small" type="submit">
        Search
      </button>
    </form>
  );
}
