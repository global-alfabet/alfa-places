import { CategoryIcon } from "./CategoryTile.jsx";

// A real business's own logo (public/logos/<id>.svg or .png, sent by the business), otherwise its category icon.
// Example listings never get a logo.
export default function BusinessLogo({ business, category, size }) {
  if (business.logo && !business.example) {
    return (
      <img
        className="biz-logo"
        src={business.logo}
        width={size}
        height={size}
        alt=""
        style={{ borderRadius: size * 0.22 }}
        loading="lazy"
        decoding="async"
      />
    );
  }
  return <CategoryIcon icon={category?.icon} size={size} />;
}
