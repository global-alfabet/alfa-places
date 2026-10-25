import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import DestinationCard from "../components/DestinationCard.jsx";
import DestinationArt from "../components/DestinationArt.jsx";
import BusinessLogo from "../components/BusinessLogo.jsx";
import ExampleNote from "../components/ExampleNote.jsx";
import Icon from "../components/Icon.jsx";
import { categoryById } from "../content/categories.js";
import { destinations } from "../content/destinations.js";
import { businesses } from "../content/businesses.js";
import { usePageTitle } from "../lib/usePageTitle.js";
import { asset } from "../lib/asset.js";

// Section order follows the Alfa Finda Figma design (docs/figma.md): search, categories, featured, listings, and a
// banner for business owners.
const HINTS = ["Vets in Harare", "Restaurants in Bulawayo", "Hotels in Victoria Falls", "Phone repairs", "Waterfalls"];
const HOME_CATEGORIES = ["restaurants", "hotels", "retail", "health", "automotive", "real-estate", "education"];
const FEATURED = [
  "victoria-falls",
  "great-zimbabwe",
  "mana-pools",
  "matobo-national-park",
  "lake-kariba",
  "chinhoyi-caves",
];
// Real listings first, then examples to fill the row. Examples are labelled and explained below the row.
const LISTINGS = [...businesses.filter((b) => !b.example), ...businesses.filter((b) => b.example)].slice(0, 4);

function ListingCard({ business: b }) {
  const c = categoryById[b.category];
  return (
    <Link className="listing-card" to={`/business/${b.id}`}>
      <div className="listing-art">
        <BusinessLogo business={b} category={c} size={72} />
      </div>
      <div className="listing-body">
        <p className="listing-cat">{c?.name}</p>
        <h3>{b.name}</h3>
        <p className="meta">
          <Icon name="pin" size={13} /> {b.city}
          {b.example && <span className="tag">Example</span>}
        </p>
      </div>
    </Link>
  );
}

export default function Home() {
  usePageTitle();
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <img className="hero-icon" src={asset("/alfa-finda-icon.svg")} alt="" width="88" height="88" />
          <p className="eyebrow">Alfa Finda</p>
          <h1>Find places worth knowing.</h1>
          <p className="lead">Businesses, attractions and places to visit across Zimbabwe, in one search.</p>
          <SearchBar size="large" withTown placeholder="What are you looking for?" shortPlaceholder="Search" />
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
          <div className="section-head left">
            <h2>Browse by category</h2>
            <Link className="text-link" to="/categories">
              All categories <Icon name="chevron" size={16} />
            </Link>
          </div>
          <ul className="cat-cards" aria-label="Business categories">
            {HOME_CATEGORIES.map((id) => categoryById[id]).map((c) => (
              <li key={c.id}>
                <Link className="cat-card" to={`/search?category=${c.id}`}>
                  <span className="cat-dot" aria-hidden="true">
                    <Icon name={c.icon} size={22} stroke={1.8} />
                  </span>
                  <span>{c.short}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link className="cat-card" to="/categories">
                <span className="cat-dot" aria-hidden="true">
                  <Icon name="plus" size={22} />
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
          <div className="section-head left">
            <div>
              <p className="eyebrow">Businesses</p>
              <h2>On Alfa Finda.</h2>
            </div>
            <Link className="text-link" to="/search">
              All businesses <Icon name="chevron" size={16} />
            </Link>
          </div>
          <div className="listing-grid">
            {LISTINGS.map((b) => (
              <ListingCard key={b.id} business={b} />
            ))}
          </div>
          {LISTINGS.some((b) => b.example) && <ExampleNote />}
        </div>
      </section>

      <section className="section tight-top">
        <div className="container">
          <div className="feature-card">
            <div className="feature-copy">
              <p className="eyebrow">Plan a trip</p>
              <h2>Tell us what you love. We'll plan the days.</h2>
              <p className="lead">
                Pick your interests, how long you have and your budget. Alfa Finda suggests where to go, in an order
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

          <div className="cta-banner">
            <div className="cta-copy">
              <p className="eyebrow">For businesses</p>
              <h2>List your business on Alfa Finda.</h2>
              <p className="lead">
                Add your business so customers and travellers can find you. Tell us what you do, where you are and how
                to reach you. We check every listing before it goes live.
              </p>
              <div className="cta-actions">
                <Link className="btn btn-white" to="/add-your-business">
                  Add your business
                </Link>
                <Link className="btn btn-ghost" to="/categories">
                  Browse businesses
                </Link>
              </div>
            </div>
            <div className="cta-art" aria-hidden="true">
              <img src={asset("/alfa-finda-glyph-white.svg")} alt="" width="70" height="106" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
