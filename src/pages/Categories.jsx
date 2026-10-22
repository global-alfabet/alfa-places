import { Link } from "react-router-dom";
import CategoryTile from "../components/CategoryTile.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { categories } from "../content/categories.js";
import { usePageTitle } from "../lib/usePageTitle.js";

export default function Categories() {
  usePageTitle(
    "Businesses",
    "Browse businesses in Zimbabwe by category: food, places to stay, tours, vets, mechanics and more.",
  );
  return (
    <div className="container page">
      <div className="page-head">
        <p className="eyebrow">Businesses</p>
        <h1>What are you looking for?</h1>
      </div>
      <SearchBar placeholder="Search for a business, a service or a town" />
      <ul className="cat-grid">
        {categories.map((c) => (
          <li key={c.id}>
            <CategoryTile category={c} label={c.name} />
          </li>
        ))}
      </ul>
      <p className="muted center">
        Can't find your kind of business? <Link to="/add-your-business">Add it</Link> and we'll create the category.
      </p>
    </div>
  );
}
