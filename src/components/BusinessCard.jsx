import { Link } from "react-router-dom";
import { categoryById } from "../content/categories.js";
import BusinessLogo from "./BusinessLogo.jsx";
import Icon from "./Icon.jsx";

export default function BusinessCard({ business: b }) {
  const c = categoryById[b.category];
  return (
    <Link className="biz-card" to={`/business/${b.id}`}>
      <BusinessLogo business={b} category={c} size={52} />
      <div className="biz-card-body">
        <div className="biz-card-top">
          <h3>{b.name}</h3>
          {b.example && <span className="tag">Example</span>}
        </div>
        <p className="meta">
          {c?.name} · <Icon name="pin" size={13} /> {b.city}
        </p>
        <p className="biz-card-desc">{b.description}</p>
        <ul className="chips">
          {(b.payments || []).slice(0, 3).map((p) => (
            <li key={p}>{p}</li>
          ))}
          {b.delivery && <li>Delivers</li>}
        </ul>
      </div>
    </Link>
  );
}
