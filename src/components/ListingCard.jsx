import { Link } from "react-router-dom";
import { categoryById } from "../content/categories.js";
import { timeAgo } from "../lib/time.js";
import BusinessPhoto from "./BusinessPhoto.jsx";
import Badges from "./Badges.jsx";
import { Rating } from "./Stars.jsx";
import Icon from "./Icon.jsx";

// A small card with the photo on top (Figma "Recently added"). showAdded: "Added 3 days ago" instead of the town.
export default function ListingCard({ business: b, showAdded = false }) {
  const c = categoryById[b.category];
  return (
    <Link className="listing-card" to={`/business/${b.id}`}>
      <div className="listing-art">
        <BusinessPhoto business={b} width={480} icon={60} />
        <Badges business={b} only={["verified", "example"]} />
      </div>
      <div className="listing-body">
        <p className="listing-cat">{c?.name}</p>
        <h3>{b.name}</h3>
        <Rating business={b} size={13} short />
        <p className="meta">
          {showAdded && b.added ? (
            <>Added {timeAgo(b.added)}</>
          ) : (
            <>
              <Icon name="pin" size={13} /> {b.suburb ? `${b.suburb}, ` : ""}
              {b.city}
            </>
          )}
        </p>
      </div>
    </Link>
  );
}

// The horizontal card from the Figma "Featured partners" row.
export function FeaturedCard({ business: b }) {
  const c = categoryById[b.category];
  return (
    <Link className="featured-card" to={`/business/${b.id}`}>
      <div className="featured-photo">
        <BusinessPhoto business={b} width={360} icon={52} />
        <span className="badge badge-featured on-photo">Featured</span>
      </div>
      <div className="featured-body">
        <div className="featured-top">
          <h3>{b.name}</h3>
          {b.rating ? (
            <span className="rating-chip">
              <Icon name="star" size={12} /> {b.rating.toFixed(1)}
            </span>
          ) : null}
        </div>
        <Badges business={b} only={["verified", "founding", "example"]} />
        <p className="featured-desc">{b.tagline || c?.name}</p>
        <p className="featured-foot">
          <span className="meta">
            <Icon name="pin" size={13} /> {b.suburb ? `${b.suburb}, ` : ""}
            {b.city}
          </span>
          <span className="text-link small">
            Details <Icon name="arrow" size={14} />
          </span>
        </p>
      </div>
    </Link>
  );
}
