import { Link } from "react-router-dom";
import { categoryById } from "../content/categories.js";
import { openStatus } from "../lib/hours.js";
import { formatKm } from "../lib/geo.js";
import { useSavedBusinesses } from "../lib/saved.js";
import BusinessPhoto from "./BusinessPhoto.jsx";
import Badges, { KindLabel } from "./Badges.jsx";
import { Rating } from "./Stars.jsx";
import Icon from "./Icon.jsx";

// A search result (the wide card from the Figma design): photo on the left, details and actions on the right.
export default function BusinessCard({ business: b, onHover, active = false }) {
  const c = categoryById[b.category];
  const status = openStatus(b.hours);
  const { has, toggle } = useSavedBusinesses();
  const saved = has(b.id);
  return (
    <article
      className={`result-card${active ? " active" : ""}`}
      id={`result-${b.id}`}
      onMouseEnter={() => onHover?.(b.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <Link className="result-photo" to={`/business/${b.id}`} tabIndex={-1} aria-hidden="true">
        <BusinessPhoto business={b} width={560} icon={56} />
      </Link>
      <button
        className={`save-button${saved ? " saved" : ""}`}
        onClick={() => toggle(b.id)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${b.name} from saved` : `Save ${b.name}`}
      >
        <Icon name="heart" size={18} />
      </button>
      <div className="result-body">
        <div className="result-top">
          <Badges business={b} only={["featured", "verified", "founding", "example"]} />
          {status && <span className={`open-status${status.open ? " open" : ""}`}>{status.label}</span>}
        </div>
        <h3>
          <Link to={`/business/${b.id}`}>{b.name}</Link>
        </h3>
        <p className="result-meta">
          {c?.name} · {b.suburb ? `${b.suburb}, ` : ""}
          {b.city}
        </p>
        <Rating business={b} size={14} />
        <p className="result-desc">{b.tagline || b.description}</p>
        <div className="result-foot">
          <span className="result-facts">
            {b.distance !== null && b.distance !== undefined && (
              <span>
                <Icon name="pin" size={14} /> {formatKm(b.distance)}
              </span>
            )}
            <KindLabel business={b} />
            {b.rating >= 4.7 && b.reviewCount >= 40 && (
              <span>
                <Icon name="award" size={14} /> Top rated
              </span>
            )}
          </span>
          <span className="result-actions">
            <Link className="btn btn-small btn-outline" to={`/business/${b.id}`}>
              Details
            </Link>
            <Link className="btn btn-small" to={`/business/${b.id}#contact`}>
              {b.cta || "Contact"}
            </Link>
          </span>
        </div>
      </div>
    </article>
  );
}
