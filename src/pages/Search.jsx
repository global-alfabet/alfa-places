import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import BusinessCard from "../components/BusinessCard.jsx";
import DestinationCard from "../components/DestinationCard.jsx";
import Icon from "../components/Icon.jsx";
import { useDirectory } from "../lib/store.js";
import { categories, towns } from "../content/categories.js";
import { KINDS } from "../lib/kinds.js";
import { SORTS, searchBusinesses, searchDestinations, describeSearch, parseQuery } from "../lib/search.js";
import { townCentres } from "../lib/geo.js";
import { usePageTitle } from "../lib/usePageTitle.js";

const BusinessMap = lazy(() => import("../components/BusinessMap.jsx"));

const PER_PAGE = 8;
const TOGGLES = [
  ["open", "Open now"],
  ["verified", "Verified only"],
  ["founding", "Founding partners"],
  ["mobileMoney", "Takes mobile money"],
  ["cards", "Takes cards"],
  ["delivery", "Delivers"],
  ["whatsapp", "On WhatsApp"],
];
const RATINGS = [
  ["", "Any"],
  ["3.5", "3.5+"],
  ["4", "4.0+"],
  ["4.5", "4.5+"],
];
const DISTANCES = ["", "2", "5", "10", "25", "50"];
const PRICES = ["$", "$$", "$$$", "$$$$"];
const TOP_CATEGORIES = 8;

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [allCats, setAllCats] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [near, setNear] = useState(null); // the visitor's own location: kept in this page only, never in the address
  const [locating, setLocating] = useState("");
  const q = params.get("q") || "";
  const parsed = parseQuery(q);
  const listParam = (k) => (params.get(k) || "").split(",").filter(Boolean);
  const opts = {
    q,
    category: params.get("category") || "",
    town: params.get("town") || "",
    kind: params.get("kind") || "",
    rating: params.get("rating") || "",
    price: params.get("price") || "",
    km: params.get("km") || "",
    sort: params.get("sort") || "recommended",
    ...Object.fromEntries(TOGGLES.map(([k]) => [k, params.get(k) === "1"])),
  };
  const page = Math.max(1, Number(params.get("page")) || 1);
  const town = opts.town || parsed.town;
  const centre = near || (town && townCentres[town]) || null;
  const directory = useDirectory();
  const results = useMemo(() => searchBusinesses(directory, { ...opts, centre }), [directory, params, near]); // eslint-disable-line react-hooks/exhaustive-deps
  const places = useMemo(() => (page === 1 ? searchDestinations(q) : []), [q, page]);
  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const shown = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const title = near && !town ? `${describeSearch(opts).replace("All businesses", "Businesses")} near you` : describeSearch(opts);
  usePageTitle(title === "All businesses" ? "Search" : title);

  const set = useCallback(
    (key, value) => {
      const next = new URLSearchParams(params);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== "page") next.delete("page");
      setParams(next, { replace: key !== "page" });
    },
    [params, setParams],
  );
  const toggleIn = (key, value) => {
    const now = listParam(key);
    set(key, (now.includes(value) ? now.filter((v) => v !== value) : [...now, value]).join(","));
  };
  const cats = listParam("category").length ? listParam("category") : parsed.category ? [parsed.category] : [];
  const activeFilters =
    TOGGLES.filter(([k]) => opts[k]).length +
    cats.length +
    (opts.town ? 1 : 0) +
    listParam("kind").length +
    listParam("price").length +
    (opts.rating ? 1 : 0) +
    (opts.km ? 1 : 0);

  useEffect(() => {
    if (page > pages) set("page", "");
  }, [page, pages, set]);

  const locate = () => {
    if (!navigator.geolocation) return setLocating("Your browser can't share your location.");
    setLocating("Finding you…");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setNear([pos.coords.latitude, pos.coords.longitude]);
        setLocating("");
        const next = new URLSearchParams(params);
        next.delete("town");
        if (!next.get("km")) next.set("km", "25");
        next.set("sort", "distance");
        setParams(next, { replace: true });
      },
      () => setLocating("Location is off. Pick a town instead."),
      { timeout: 10000 },
    );
  };

  const selectFromMap = useCallback((id) => {
    setHovered(id);
    document.getElementById(`result-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const visibleCats = allCats ? categories : categories.slice(0, TOP_CATEGORIES);

  return (
    <div className={`search-page${mapOpen ? " map-open" : ""}`}>
      <aside className={`search-filters${filtersOpen ? " open" : ""}`} aria-label="Filters">
        <div className="filters-head">
          <h2>Filters</h2>
          <button className="filters-close" onClick={() => setFiltersOpen(false)} aria-label="Close filters">
            <Icon name="close" size={20} />
          </button>
        </div>

        <fieldset className="filter-group">
          <legend>Category</legend>
          {visibleCats.map((c) => (
            <label key={c.id} className="check">
              <input type="checkbox" checked={cats.includes(c.id)} onChange={() => toggleIn("category", c.id)} />
              {c.name}
            </label>
          ))}
          <button className="link-button" onClick={() => setAllCats((v) => !v)}>
            {allCats ? "Fewer categories" : `All ${categories.length} categories`}
          </button>
        </fieldset>

        <fieldset className="filter-group">
          <legend>Type of business</legend>
          {Object.entries(KINDS).map(([k, v]) => (
            <label key={k} className="check">
              <input type="checkbox" checked={listParam("kind").includes(k)} onChange={() => toggleIn("kind", k)} />
              <Icon name={v.icon} size={15} /> {v.plural}
            </label>
          ))}
        </fieldset>

        <fieldset className="filter-group">
          <legend>Where</legend>
          <label className="field compact">
            <span className="sr-only">Town</span>
            <select value={near ? "__near" : town} onChange={(e) => (setNear(null), set("town", e.target.value === "__near" ? "" : e.target.value))}>
              {near && <option value="__near">Near my location</option>}
              <option value="">All towns</option>
              {towns.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <button className="btn btn-small btn-outline btn-block" onClick={locate}>
            <Icon name="locate" size={16} /> Use my location
          </button>
          {locating && <p className="note">{locating}</p>}
          <div className="filter-sub">
            <span>Distance</span>
            <div className="chip-row">
              {DISTANCES.map((d) => (
                <button
                  key={d || "any"}
                  className={`chip-button${opts.km === d ? " on" : ""}`}
                  onClick={() => set("km", d)}
                  disabled={!centre && d !== ""}
                  title={!centre && d ? "Pick a town or use your location first" : undefined}
                >
                  {d ? `${d} km` : "Any"}
                </button>
              ))}
            </div>
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend>Minimum rating</legend>
          <div className="chip-row">
            {RATINGS.map(([v, label]) => (
              <button key={v || "any"} className={`chip-button${opts.rating === v ? " on" : ""}`} onClick={() => set("rating", v)}>
                {v && <Icon name="star" size={13} />} {label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend>Price range</legend>
          <div className="chip-row">
            {PRICES.map((p) => (
              <button key={p} className={`chip-button${listParam("price").includes(p) ? " on" : ""}`} onClick={() => toggleIn("price", p)}>
                {p}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="filter-group">
          <legend>Show only</legend>
          {TOGGLES.map(([k, label]) => (
            <label key={k} className="check">
              <input type="checkbox" checked={opts[k]} onChange={(e) => set(k, e.target.checked ? "1" : "")} />
              {label}
            </label>
          ))}
        </fieldset>

        <button
          className="btn btn-secondary btn-block"
          disabled={!activeFilters && !near}
          onClick={() => {
            setNear(null);
            setParams(q ? { q } : {}, { replace: true });
          }}
        >
          Clear all filters
        </button>
        <button className="btn btn-block filters-done" onClick={() => setFiltersOpen(false)}>
          Show {results.length} results
        </button>
      </aside>

      <section className="search-results" aria-label="Results">
        <SearchBar initial={q} withTown placeholder="Search businesses, services and places" shortPlaceholder="Search" />
        <div className="results-head">
          <div>
            <h1>{title}</h1>
            <p className="muted">
              Showing {results.length} {results.length === 1 ? "business" : "businesses"}
              {places.length ? ` and ${places.length} ${places.length === 1 ? "place" : "places"} to visit` : ""}
            </p>
          </div>
          <label className="sort">
            <span>Sort by</span>
            <select value={opts.sort} onChange={(e) => set("sort", e.target.value === "recommended" ? "" : e.target.value)}>
              {SORTS.filter(([k]) => k !== "distance" || centre).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="results-tools">
          <button className="btn btn-secondary btn-small" onClick={() => setFiltersOpen(true)} aria-expanded={filtersOpen}>
            <Icon name="sliders" size={16} /> Filters{activeFilters ? ` (${activeFilters})` : ""}
          </button>
          <button className="btn btn-secondary btn-small map-toggle" onClick={() => setMapOpen((v) => !v)} aria-pressed={mapOpen}>
            <Icon name={mapOpen ? "grid" : "map"} size={16} /> {mapOpen ? "Show list" : "Show map"}
          </button>
        </div>

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

        {shown.length > 0 ? (
          <div className="result-list">
            {shown.map((b) => (
              <BusinessCard key={b.id} business={b} onHover={setHovered} active={hovered === b.id} />
            ))}
          </div>
        ) : (
          !places.length && (
            <div className="empty">
              <h2>Nothing matches yet.</h2>
              <p className="muted">
                Try fewer filters or a broader search, like a kind of business (“plumbers”, “hotels”) or a town. Alfa
                Finda is new, so some businesses aren't listed yet.
              </p>
              <p>
                <Link className="btn" to="/add-your-business">
                  Add a business
                </Link>
              </p>
            </div>
          )
        )}

        {pages > 1 && (
          <nav className="pagination" aria-label="Pages">
            <button onClick={() => set("page", String(page - 1))} disabled={page === 1} aria-label="Previous page">
              <Icon name="back" size={16} />
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} className={n === page ? "on" : ""} onClick={() => set("page", n === 1 ? "" : String(n))} aria-current={n === page ? "page" : undefined}>
                {n}
              </button>
            ))}
            <button onClick={() => set("page", String(page + 1))} disabled={page === pages} aria-label="Next page">
              <Icon name="chevron" size={16} />
            </button>
          </nav>
        )}
      </section>

      <section className="search-map" aria-label="Map of results">
        <Suspense fallback={<div className="business-map" />}>
          <BusinessMap businesses={results} active={hovered} onSelect={selectFromMap} centre={centre} />
        </Suspense>
        <button className="map-locate" onClick={locate} aria-label="Use my location">
          <Icon name="locate" size={20} />
        </button>
      </section>
    </div>
  );
}
