import Icon from "./Icon.jsx";

// Five stars filled to the rating (4.6 → four and a bit). Decorative: the number is always shown next to it.
export default function Stars({ rating = 0, size = 15, className = "" }) {
  return (
    <span className={`stars ${className}`} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="star" style={{ width: size, height: size }}>
            <Icon name="star" size={size} stroke={1.5} />
            <span className="star-fill" style={{ width: `${fill * 100}%` }}>
              <Icon name="star" size={size} stroke={1.5} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** "4.8 (126 reviews)" with stars, or nothing for listings without reviews. */
export function Rating({ business: b, size, short = false, className = "" }) {
  if (!b.rating) return null;
  return (
    <span className={`rating ${className}`}>
      <Stars rating={b.rating} size={size} />
      <strong>{b.rating.toFixed(1)}</strong>
      <span className="rating-count">
        ({b.reviewCount}
        {short ? "" : ` ${b.reviewCount === 1 ? "review" : "reviews"}`})
      </span>
    </span>
  );
}
