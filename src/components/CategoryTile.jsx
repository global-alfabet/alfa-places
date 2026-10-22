import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

export function CategoryIcon({ icon, size = 56 }) {
  return (
    <span className="cat-icon" style={{ width: size, height: size, borderRadius: size * 0.27 }} aria-hidden="true">
      <Icon name={icon} size={size * 0.48} stroke={1.8} />
    </span>
  );
}

export default function CategoryTile({ category, label = category.short }) {
  return (
    <Link className="cat-tile" to={`/search?category=${category.id}`}>
      <CategoryIcon icon={category.icon} />
      <span>{label}</span>
    </Link>
  );
}
