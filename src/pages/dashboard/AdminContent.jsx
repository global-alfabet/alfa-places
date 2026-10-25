import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead, TestNote } from "../../components/dash/Dash.jsx";
import { useToast } from "../../components/dash/useToast.jsx";
import Icon from "../../components/Icon.jsx";
import { categories } from "../../content/categories.js";
import { HOME_DEFAULTS, useDirectory, useStore } from "../../lib/store.js";
import { asset } from "../../lib/asset.js";

const MAX_CATEGORIES = 7;

// Figma "Content and Taxonomy Management": the home page headline and categories, and the category list.
export default function AdminContent() {
  const { state, dispatch } = useStore();
  const live = useDirectory();
  const [form, setForm] = useState(state.home);
  const [toast, setToast] = useToast();
  const dirty = JSON.stringify(form) !== JSON.stringify(state.home);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const count = (id) => live.filter((b) => b.category === id).length;
  const featured = live.filter((b) => b.featured);

  const toggleCat = (id) =>
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(id)
        ? f.categories.filter((x) => x !== id)
        : [...f.categories, id].slice(0, MAX_CATEGORIES),
    }));
  const publish = (e) => {
    e.preventDefault();
    dispatch({ type: "home", content: form, log: { icon: "home", title: "Home page updated", text: form.headline } });
    setToast({
      title: "Published",
      text: "The home page shows it until you reload.",
      link: { to: "/", label: "View home page" },
    });
  };

  return (
    <>
      <PageHead title="Home page and categories" sub="What everyone sees first, and how listings are sorted." />
      <TestNote>
        Test admin: changes show on the home page until you reload. The real wording lives in the code.
      </TestNote>

      <form className="content-grid" onSubmit={publish}>
        <section className="panel form-panel">
          <div className="panel-head">
            <h2>
              <Icon name="edit" size={20} /> Home page headline
            </h2>
            {!dirty && <span className="status-dot on">Live</span>}
          </div>
          <label className="field">
            <span>Headline</span>
            <input value={form.headline} onChange={set("headline")} maxLength={60} required />
            <small className="count">{form.headline.length} / 60</small>
          </label>
          <label className="field">
            <span>Introduction</span>
            <textarea value={form.lead} onChange={set("lead")} rows={3} maxLength={160} required />
            <small className="count">{form.lead.length} / 160</small>
          </label>
          <label className="field">
            <span>Search box hint</span>
            <input value={form.placeholder} onChange={set("placeholder")} maxLength={40} required />
          </label>
          <fieldset>
            <legend>
              Browse by category ({form.categories.length} of {MAX_CATEGORIES})
            </legend>
            <div className="cat-picks">
              {categories.map((c) => {
                const on = form.categories.includes(c.id);
                return (
                  <label key={c.id} className={`cat-pick${on ? " on" : ""}`}>
                    <input
                      type="checkbox"
                      checked={on}
                      disabled={!on && form.categories.length >= MAX_CATEGORIES}
                      onChange={() => toggleCat(c.id)}
                    />
                    <Icon name={c.icon} size={16} />
                    {c.short}
                    {on && <span className="cat-pick-n">{form.categories.indexOf(c.id) + 1}</span>}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <div className="form-actions">
            <button className="btn btn-small" type="submit" disabled={!dirty || !form.categories.length}>
              Publish
            </button>
            <button
              type="button"
              className="btn btn-small btn-secondary"
              disabled={!dirty}
              onClick={() => setForm(state.home)}
            >
              Discard
            </button>
            {JSON.stringify(state.home) !== JSON.stringify(HOME_DEFAULTS) && (
              <button type="button" className="link-button" onClick={() => setForm(HOME_DEFAULTS)}>
                Back to the original wording
              </button>
            )}
          </div>
        </section>

        <section className="panel preview-panel" aria-label="Preview">
          <div className="panel-head">
            <h2>Preview</h2>
            <Link className="text-link small" to="/">
              Home page <Icon name="arrow" size={14} />
            </Link>
          </div>
          <div className="hero-preview">
            <img src={asset("/alfa-finda-icon.svg")} alt="" width="40" height="40" />
            <p className="eyebrow">Alfa Finda</p>
            <h3>{form.headline || "Headline"}</h3>
            <p>{form.lead}</p>
            <span className="hero-preview-search">
              <Icon name="search" size={14} /> {form.placeholder}
            </span>
            <ul>
              {form.categories.map((id) => {
                const c = categories.find((x) => x.id === id);
                return (
                  <li key={id}>
                    <Icon name={c.icon} size={14} /> {c.short}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </form>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Featured partners</h2>
            <p className="muted">Shown on the home page. Change them with the Featured switch in the directory.</p>
          </div>
          <Link className="btn btn-small btn-secondary" to="/admin/directory?badge=featured">
            Open directory
          </Link>
        </div>
        <ul className="chips large">
          {featured.map((b) => (
            <li key={b.id}>
              <Icon name="sparkles" size={14} /> {b.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="section-block">
        <div className="panel-head">
          <div>
            <h2>Categories</h2>
            <p className="muted">
              {categories.length} categories. Each has the words people search with. They're set in categories.js.
            </p>
          </div>
        </div>
        <ul className="cat-admin">
          {categories.map((c) => (
            <li key={c.id} className="panel">
              <span className="cat-dot" aria-hidden="true">
                <Icon name={c.icon} size={20} />
              </span>
              <h3>{c.name}</h3>
              <p className="muted">{c.words.slice(0, 5).join(", ")}</p>
              <Link className="tag" to={`/admin/directory?category=${c.id}`}>
                {count(c.id)} {count(c.id) === 1 ? "listing" : "listings"}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      {toast}
    </>
  );
}
