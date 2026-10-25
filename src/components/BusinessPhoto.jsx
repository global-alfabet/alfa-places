import { useState } from "react";
import { photos, photoUrl } from "../content/photos.js";
import { categoryById } from "../content/categories.js";
import { CategoryIcon } from "./CategoryTile.jsx";

// A listing's banner (or gallery photo `index`), or a tinted panel with its logo or category icon when there's none.
export default function BusinessPhoto({ business: b, index = -1, width = 800, className = "", eager = false, icon = 64 }) {
  const [failed, setFailed] = useState(false);
  const key = index < 0 ? b.photos?.banner : b.photos?.gallery?.[index];
  const p = photos[key];
  if (!p || failed) {
    const c = categoryById[b.category];
    return (
      <div className={`biz-photo biz-photo-empty ${className}`} aria-hidden="true">
        {b.logo && !b.example ? (
          <img src={b.logo} alt="" width={icon} height={icon} style={{ borderRadius: icon * 0.22 }} />
        ) : (
          <CategoryIcon icon={c?.icon} size={icon} />
        )}
      </div>
    );
  }
  return (
    <img
      className={`biz-photo ${className}`}
      src={photoUrl(p, width)}
      srcSet={`${photoUrl(p, 640)} 640w, ${photoUrl(p, 1400)} 1400w`}
      sizes={width > 700 ? "(max-width: 760px) 100vw, 1100px" : "(max-width: 760px) 100vw, 360px"}
      alt={p.alt || ""}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
