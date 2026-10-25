import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Icon from "../Icon.jsx";
import { asset } from "../../lib/asset.js";
import { initials } from "../../lib/sample.js";

// The frame of both test dashboards (Figma "Admin Dashboard" and "Super Admin Dashboard"): a sidebar with the
// sections, a top bar, and the page. Below 960px the sidebar becomes a sheet behind the menu button.
export function DashShell({ variant = "owner", label, nav, top, foot, bar, user, closeKey, children }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname, closeKey]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);
  // Test dashboards stay out of search engines.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <div className={`dash dash-${variant}${open ? " is-open" : ""}`}>
      <aside className="dash-side" id="dash-side">
        <div className="dash-brand">
          <Link to="/" className="dash-logo" aria-label="Alfa Finda home">
            <img src={asset("/alfa-finda-icon.svg")} alt="" width="36" height="36" />
          </Link>
          <div>
            <strong>Alfa Finda</strong>
            <span>{label}</span>
          </div>
          <span className="badge badge-test">Test</span>
        </div>
        {top}
        <nav className="dash-nav" aria-label={label}>
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className="dash-link">
              <Icon name={item.icon} size={19} />
              <span>{item.label}</span>
              {item.count ? <span className="dash-count">{item.count}</span> : null}
            </NavLink>
          ))}
        </nav>
        <div className="dash-side-foot">{foot}</div>
      </aside>
      <button className="dash-scrim" aria-label="Close menu" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} />
      <div className="dash-main">
        <header className="dash-top">
          <button
            className="dash-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="dash-side"
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
          <div className="dash-bar">{bar}</div>
          {user && (
            <div className="dash-user">
              <span className="avatar small" aria-hidden="true">
                {initials(user.name)}
              </span>
              <span className="dash-user-text">
                <strong>{user.name}</strong>
                <small>{user.role}</small>
              </span>
            </div>
          )}
        </header>
        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}

export function PageHead({ title, sub, children }) {
  return (
    <div className="dash-head">
      <div>
        <h1>{title}</h1>
        {sub && <p className="muted">{sub}</p>}
      </div>
      {children && <div className="dash-head-actions">{children}</div>}
    </div>
  );
}

/** A figure with a label and, optionally, the change since last week. */
export function StatCard({ icon, label, value, change, since = "on last week", note, upIsGood = true }) {
  const dir = change > 0 ? "up" : change < 0 ? "down" : "flat";
  const good = dir === "flat" ? "" : (dir === "up") === upIsGood ? " good" : " bad";
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span className="stat-icon" aria-hidden="true">
          <Icon name={icon} size={20} />
        </span>
        {change !== undefined && (
          <span className={`stat-change ${dir}${good}`}>
            {dir !== "flat" && <Icon name="arrow" size={13} stroke={2.2} />}
            {dir === "flat" ? "No change" : `${change > 0 ? "+" : "−"}${Math.abs(change)}%`}
            <span className="sr-only"> {since}</span>
          </span>
        )}
      </div>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {note && <p className="stat-note">{note}</p>}
    </div>
  );
}

/** An on/off switch with a label. */
export function Switch({ checked, onChange, label, hint, disabled }) {
  return (
    <label className={`switch-row${disabled ? " disabled" : ""}`}>
      <span className="switch-text">
        <span>{label}</span>
        {hint && <small>{hint}</small>}
      </span>
      <input
        type="checkbox"
        role="switch"
        className="switch"
        checked={!!checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

/** The note at the top of each test dashboard page. */
export function TestNote({ children }) {
  return (
    <p className="example-note dash-note">
      <Icon name="info" size={18} />
      <span>{children}</span>
    </p>
  );
}
