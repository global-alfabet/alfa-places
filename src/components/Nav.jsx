import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Icon from "./Icon.jsx";
import { asset } from "../lib/asset.js";

const links = [
  { to: "/destinations", label: "Places to visit" },
  { to: "/categories", label: "Businesses" },
  { to: "/plan", label: "Plan a trip" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location]);
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
  }, [open]);

  return (
    <header className={`nav${open ? " is-open" : ""}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand" aria-label="Alfa Places home">
          <img src={asset("/alfa-places-lockup-light.svg")} alt="Alfa Places" height="26" />
        </Link>
        <nav className="nav-links" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className="nav-link">
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/search" className="nav-link nav-search" aria-label="Search">
            <Icon name="search" size={17} />
          </NavLink>
        </nav>
        <Link to="/add-your-business" className="btn btn-small nav-cta">
          Add your business
        </Link>
        <button
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "menu"} size={22} />
        </button>
      </div>
      <nav className="nav-sheet" aria-label="Mobile">
        <Link to="/search">Search</Link>
        {links.map((l) => (
          <Link key={l.to} to={l.to}>
            {l.label}
          </Link>
        ))}
        <Link to="/add-your-business">Add your business</Link>
      </nav>
    </header>
  );
}
