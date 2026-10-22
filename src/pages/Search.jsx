import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import BusinessCard from "../components/BusinessCard.jsx";
import DestinationCard from "../components/DestinationCard.jsx";
import ExampleNote from "../components/ExampleNote.jsx";
import Icon from "../components/Icon.jsx";
import { businesses } from "../content/businesses.js";
import { categories, towns } from "../content/categories.js";
import { searchBusinesses, searchDestinations, describeSearch, parseQuery } from "../lib/search.js";
import { usePageTitle } from "../lib/usePageTitle.js";

const TOGGLES = [
  ["mobileMoney", "Mobile money"],
  ["cards", "Cards"],
  ["delivery", "Delivers"],
  ["whatsapp", "On WhatsApp"],
];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const q = params.get("q") || "";
  const opts = {
    q,
    category: params.get("category") || "",
    town: params.get("town") || "",
    ...Object.fromEntries(TOGGLES.map(([k]) => [k, params.get(k) === "1"])),
  };
  const parsed = parseQuery(q);
  const results = useMemo(() => searchBusinesses(businesses, opts), [params]); // eslint-disable-line react-hooks/exhaustive-deps
  const places = useMemo(() => searchDestinations(q), [q]);
  const title = describeSearch(opts);
  usePageTitle(title === "All businesses" ? "Search" : title);

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const activeFilters = TOGGLES.filter(([k]) => opts[k]).length + (opts.category ? 1 : 0) + (opts.town ? 1 : 0);

  return (
    <div className="container page">
      <SearchBar initial={q} />
      <div className="results-head">
        <div>
          <h1>{title}</h1>
          <p className="muted">
            {results.length} {results.length === 1 ? "business" : "businesses"}
            {places.length ? ` and ${places.length} ${places.length === 1 ? "place" : "places"} to visit` : ""}
          </p>
        </div>
        <button
          className="btn btn-secondary btn-small filter-toggle"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
        >
          <Icon name="sliders" size={16} /> Filters{activeFilters ? ` (${activeFilters})` : ""}
        </button>
      </div>

      <div className={`results-layout${filtersOpen ? " filters-open" : ""}`}>
        <aside className="filters" aria-label="Filters">
          <label className="field">
            <span>Category</span>
            <select value={opts.category || parsed.category} onChange={(e) => set("category", e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Town</span>
            <select value={opts.town || parsed.town} onChange={(e) => set("town", e.target.value)}>
              <option value="">All of Zimbabwe</option>
              {towns.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <fieldset className="toggles">
            <legend>Show businesses that</legend>
            {TOGGLES.map(([k, label]) => (
              <label key={k} className="check">
                <input type="checkbox" checked={opts[k]} onChange={(e) => set(k, e.target.checked ? "1" : "")} />
                {k === "delivery" ? "Deliver" : k === "whatsapp" ? "Use WhatsApp" : `Take ${label.toLowerCase()}`}
              </label>
            ))}
          </fieldset>
          {activeFilters > 0 && (
            <button className="link-button" onClick={() => setParams(q ? { q } : {}, { replace: true })}>
              Clear filters
            </button>
          )}
        </aside>

        <div className="results">
          <ExampleNote />
          {places.length > 0 && (
            <section className="results-places" aria-label="Places to visit">
              <h2 className="results-sub">Places to visit</h2>
              <div className="dest-grid compact">
                {places.map((d) => (
                  <DestinationCard key={d.slug} destination={d} />
                ))}
              </div>
              {results.length > 0 && <h2 className="results-sub">Businesses</h2>}
            </section>
          )}
          {results.length > 0 ? (
            <div className="biz-list">
              {results.map((b) => (
                <BusinessCard key={b.id} business={b} />
              ))}
            </div>
          ) : (
            !places.length && (
              <div className="empty">
                <h2>Nothing matches yet.</h2>
                <p className="muted">
                  Try a broader search, like a kind of business (“mechanics”, “hotels”) or a town. Alfa Places is new,
                  so some businesses aren't listed yet.
                </p>
                <p>
                  <Link className="btn" to="/add-your-business">
                    Add a business
                  </Link>
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
