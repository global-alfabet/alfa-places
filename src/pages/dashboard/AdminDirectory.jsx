import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHead, TestNote } from "../../components/dash/Dash.jsx";
import Icon from "../../components/Icon.jsx";
import BusinessPhoto from "../../components/BusinessPhoto.jsx";
import { categories, categoryById } from "../../content/categories.js";
import { ownerOf } from "../../content/demo-dashboard.js";
import { KINDS } from "../../lib/kinds.js";
import { useDirectory, useStore } from "../../lib/store.js";
import { directoryCsv, download } from "../../lib/admin.js";

const PER_PAGE = 10;
const BADGES = [
  ["", "All"],
  ["featured", "Featured"],
  ["verified", "Verified"],
  ["founding", "Founding"],
];

// Figma "Business Directory Management": every listing, with filters, badge switches and hide or show.
export default function AdminDirectory() {
  const { dispatch } = useStore();
  const all = useDirectory(true);
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const status = params.get("status") || "";
  const category = params.get("category") || "";
  const kind = params.get("kind") || "";
  const badge = params.get("badge") || "";
  const [page, setPage] = useState(1);
  const [text, setText] = useState(q);
  useEffect(() => setText(q), [q]);
  useEffect(() => setPage(1), [q, status, category, kind, badge]);

  const setParam = (k, v) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };

  const rows = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    return all
      .map((b) => ({ ...b, owner: b.example ? ownerOf(b) : null }))
      .filter((b) => !status || (status === "hidden" ? b.hidden : !b.hidden))
      .filter((b) => !category || b.category === category)
      .filter((b) => !kind || b.kind === kind)
      .filter((b) => !badge || b[badge])
      .filter((b) => {
        const hay =
          `${b.name} ${b.id} ${b.city} ${b.suburb || ""} ${b.owner?.name || ""} ${b.owner?.email || ""}`.toLowerCase();
        return words.every((w) => hay.includes(w));
      });
  }, [all, q, status, category, kind, badge]);
  const pages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const shown = rows.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggle = (b, field, value) =>
    dispatch({
      type: "edit",
      id: b.id,
      fields: { [field]: value },
      log: {
        business: b.id,
        icon:
          field === "hidden" ? "eye" : field === "verified" ? "verified" : field === "founding" ? "award" : "sparkles",
        title:
          field === "hidden"
            ? `${b.name} ${value ? "hidden" : "shown again"}`
            : `${{ featured: "Featured", verified: "Verified", founding: "Founding partner" }[field]} ${value ? "given to" : "removed from"} ${b.name}`,
        text: "By the Alfa Finda team.",
      },
    });

  return (
    <>
      <PageHead title="Directory" sub="Every listing on Alfa Finda.">
        <button
          className="btn btn-small btn-secondary"
          onClick={() => download("alfa-finda-listings.csv", directoryCsv(rows))}
        >
          <Icon name="share" size={16} /> Export {rows.length === all.length ? "all" : rows.length}
        </button>
        <Link className="btn btn-small" to="/admin/approvals">
          <Icon name="plus" size={16} /> Approvals
        </Link>
      </PageHead>
      <TestNote>
        Test admin: badge switches and hiding work across the site until you reload. Real listings change only in
        businesses.js, so their switches are off.
      </TestNote>

      <section className="panel filter-panel">
        <form
          className="dir-search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            setParam("q", text.trim());
          }}
        >
          <Icon name="search" size={18} />
          <label className="sr-only" htmlFor="dir-q">
            Search listings
          </label>
          <input
            id="dir-q"
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => setParam("q", text.trim())}
            placeholder="Name, owner or town"
          />
        </form>
        <label className="field compact">
          <span>Status</span>
          <select value={status} onChange={(e) => setParam("status", e.target.value)}>
            <option value="">All</option>
            <option value="live">Live</option>
            <option value="hidden">Hidden</option>
          </select>
        </label>
        <label className="field compact">
          <span>Category</span>
          <select value={category} onChange={(e) => setParam("category", e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field compact">
          <span>Type</span>
          <select value={kind} onChange={(e) => setParam("kind", e.target.value)}>
            <option value="">All types</option>
            {Object.entries(KINDS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.plural}
              </option>
            ))}
          </select>
        </label>
        <div className="field compact">
          <span>Badge</span>
          <div className="segmented" role="group" aria-label="Badge">
            {BADGES.map(([v, l]) => (
              <button
                key={v}
                type="button"
                className={badge === v ? "on" : ""}
                aria-pressed={badge === v}
                onClick={() => setParam("badge", v)}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <p className="filter-total">
          <strong>{rows.length}</strong>
          <span className="muted">of {all.length} listings</span>
        </p>
      </section>

      <section className="panel table-panel">
        <div className="table-scroll">
          <table className="dtable">
            <thead>
              <tr>
                <th scope="col">Business</th>
                <th scope="col">Owner</th>
                <th scope="col">Joined</th>
                <th scope="col">Featured</th>
                <th scope="col">Verified</th>
                <th scope="col">Founding</th>
                <th scope="col">Status</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((b) => {
                const locked = !b.example;
                return (
                  <tr key={b.id} className={b.hidden ? "is-hidden" : ""}>
                    <td data-label="Business">
                      <div className="dt-biz">
                        <span className="dt-thumb">
                          <BusinessPhoto business={b} width={200} icon={22} />
                        </span>
                        <span>
                          <Link to={`/business/${b.id}`}>
                            <strong>{b.name}</strong>
                          </Link>
                          <span className="meta">
                            {categoryById[b.category]?.short || b.category} · {KINDS[b.kind]?.label} · {b.city}
                            {b.example ? "" : " · Real"}
                            {b.approvedNow ? " · Approved today" : ""}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td data-label="Owner">
                      {b.owner ? (
                        <>
                          <span>{b.owner.name}</span>
                          <span className="meta">{b.owner.email}</span>
                        </>
                      ) : (
                        <span className="muted">{b.example ? "–" : "Not shown"}</span>
                      )}
                    </td>
                    <td data-label="Joined" className="num">
                      {b.added
                        ? new Date(b.added).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "–"}
                    </td>
                    <td data-label="Featured">
                      <input
                        type="checkbox"
                        role="switch"
                        className="switch"
                        aria-label={`Featured: ${b.name}`}
                        checked={!!b.featured}
                        disabled={locked}
                        onChange={(e) => toggle(b, "featured", e.target.checked)}
                      />
                    </td>
                    <td data-label="Verified">
                      <input
                        type="checkbox"
                        role="switch"
                        className="switch"
                        aria-label={`Verified: ${b.name}`}
                        title={b.kind !== "company" ? "Only registered companies can be Verified" : undefined}
                        checked={!!b.verified}
                        disabled={locked || b.kind !== "company"}
                        onChange={(e) => toggle(b, "verified", e.target.checked)}
                      />
                    </td>
                    <td data-label="Founding">
                      <input
                        type="checkbox"
                        role="switch"
                        className="switch"
                        aria-label={`Founding partner: ${b.name}`}
                        checked={!!b.founding}
                        disabled={locked}
                        onChange={(e) => toggle(b, "founding", e.target.checked)}
                      />
                    </td>
                    <td data-label="Status">
                      <span className={`status-dot ${b.hidden ? "off" : "on"}`}>{b.hidden ? "Hidden" : "Live"}</span>
                    </td>
                    <td className="dt-actions">
                      {b.example && (
                        <>
                          <Link className="chip-button" to={`/dashboard?business=${b.id}`}>
                            Manage
                          </Link>
                          <button className="chip-button" onClick={() => toggle(b, "hidden", !b.hidden)}>
                            {b.hidden ? "Show" : "Hide"}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!shown.length && <p className="muted inbox-empty">No listings match.</p>}
        </div>
        {pages > 1 && (
          <nav className="dt-foot" aria-label="Pages">
            <span className="muted">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, rows.length)} of {rows.length}
            </span>
            <span className="pager">
              <button
                className="icon-button"
                disabled={page === 1}
                aria-label="Previous page"
                onClick={() => setPage((p) => p - 1)}
              >
                <Icon name="back" size={16} />
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`pager-num${n === page ? " on" : ""}`}
                  aria-current={n === page ? "page" : undefined}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button
                className="icon-button"
                disabled={page === pages}
                aria-label="Next page"
                onClick={() => setPage((p) => p + 1)}
              >
                <Icon name="chevron" size={16} />
              </button>
            </span>
          </nav>
        )}
      </section>
    </>
  );
}
