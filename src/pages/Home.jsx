import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import CategoryTile from "../components/CategoryTile.jsx";
import DestinationCard from "../components/DestinationCard.jsx";
import DestinationArt from "../components/DestinationArt.jsx";
import Icon from "../components/Icon.jsx";
import { categories } from "../content/categories.js";
import { destinations } from "../content/destinations.js";
import { usePageTitle } from "../lib/usePageTitle.js";
import { asset } from "../lib/asset.js";

const HINTS = ["Vets in Harare", "Restaurants in Bulawayo", "Hotels in Victoria Falls", "Phone repairs", "Waterfalls"];
const FEATURED = [
  "victoria-falls",
  "great-zimbabwe",
  "mana-pools",
  "matobo-national-park",
  "lake-kariba",
  "chinhoyi-caves",
];

export default function Home() {
  usePageTitle();
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <img className="hero-icon" src={asset("/alfa-places-icon.svg")} alt="" width="88" height="88" />
          <p className="eyebrow">Alfa Places</p>
          <h1>Find places worth knowing.</h1>
          <p className="lead">Businesses, attractions and places to visit across Zimbabwe, in one search.</p>
          <SearchBar size="large" />
          <div className="hints" aria-label="Popular searches">
            {HINTS.map((h) => (
              <Link key={h} to={`/search?q=${encodeURIComponent(h)}`}>
                {h}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section tight-top">
        <div className="container">
          <ul className="cat-row" aria-label="Business categories">
            {categories.slice(0, 12).map((c) => (
              <li key={c.id}>
                <CategoryTile category={c} />
              </li>
            ))}
            <li>
              <Link className="cat-tile" to="/categories">
                <span className="cat-icon more" aria-hidden="true">
                  <Icon name="plus" size={26} />
                </span>
                <span>All</span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <div className="section-head left">
            <div>
              <p className="eyebrow">Places to visit</p>
              <h2>See Zimbabwe.</h2>
            </div>
            <Link className="text-link" to="/destinations">
              All places <Icon name="chevron" size={16} />
            </Link>
          </div>
          <div className="dest-grid">
            {FEATURED.map((slug) => destinations.find((d) => d.slug === slug)).map((d, i) => (
              <DestinationCard key={d.slug} destination={d} size={i === 0 ? "wide" : ""} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-card">
            <div className="feature-copy">
              <p className="eyebrow">Plan a trip</p>
              <h2>Tell us what you love. We'll plan the days.</h2>
              <p className="lead">
                Pick your interests, how long you have and your budget. Alfa Places suggests where to go, in an order
                that makes sense on the road, and what to do each day.
              </p>
              <Link className="btn" to="/plan">
                Plan a trip
              </Link>
            </div>
            <div className="feature-art">
              <DestinationArt destination={destinations.find((d) => d.slug === "lake-kariba")} />
            </div>
          </div>

          <div className="feature-card reverse">
            <div className="feature-copy">
              <p className="eyebrow">For businesses</p>
              <h2>Put your business on the map.</h2>
              <p className="lead">
                Add your business so customers and travellers can find you. Tell us what you do, where you are and how
                to reach you. We check every listing before it goes live.
              </p>
              <Link className="btn" to="/add-your-business">
                Add your business
              </Link>
            </div>
            <div className="feature-tiles" aria-hidden="true">
              {categories.slice(0, 9).map((c) => (
                <span key={c.id} className="cat-icon">
                  <Icon name={c.icon} size={30} stroke={1.8} />
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
