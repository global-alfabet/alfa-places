import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import DestinationCard from "../components/DestinationCard.jsx";
import DestinationArt from "../components/DestinationArt.jsx";
import ListingCard, { FeaturedCard } from "../components/ListingCard.jsx";
import Icon from "../components/Icon.jsx";
import { KINDS } from "../lib/kinds.js";
import { categoryById } from "../content/categories.js";
import { destinations } from "../content/destinations.js";
import { businesses } from "../content/businesses.js";
import { usePageTitle } from "../lib/usePageTitle.js";
import { asset } from "../lib/asset.js";

// Section order follows the Alfa Finda Figma design (docs/figma.md): search, categories, featured partners,
// recently added, then places to visit and a banner for business owners.
const HINTS = ["Plumbers in Harare", "Solar installers", "Electricians in Bulawayo", "Braids", "Vets", "Waterfalls"];
const HOME_CATEGORIES = ["plumbing", "electrical", "solar", "restaurants", "beauty", "automotive", "health"];
const FEATURED_PLACES = ["victoria-falls", "great-zimbabwe", "mana-pools"];

const featured = businesses
  .filter((b) => b.featured && (b.rating || !b.example))
  .sort((a, b) => Number(!!b.example) - Number(!!a.example) || (b.rating || 0) - (a.rating || 0))
  .slice(0, 6);
const recent = businesses
  .filter((b) => b.added)
  .sort((a, b) => b.added.localeCompare(a.added))
  .slice(0, 4);
const kindCounts = Object.keys(KINDS).map((k) => [k, businesses.filter((b) => b.kind === k).length]);

export default function Home() {
  usePageTitle();
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <img className="hero-icon" src={asset("/alfa-finda-icon.svg")} alt="" width="88" height="88" />
          <p className="eyebrow">Alfa Finda</p>
          <h1>Find the right service, near you.</h1>
          <p className="lead">
            Plumbers, electricians, solar installers, salons, clinics and places to go across Zimbabwe, in one search.
          </p>
          <SearchBar size="large" withTown placeholder="What do you need done?" shortPlaceholder="Search" />
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

      {featured.length > 0 && (
        <section className="section tight-top">
          <div className="container">
            <div className="section-head left">
              <div>
                <h2>Featured partners</h2>
                <p className="muted">Businesses with a strong record of good service.</p>
              </div>
              <Link className="text-link" to="/search">
                All businesses <Icon name="chevron" size={16} />
              </Link>
            </div>
            <div className="featured-row">
              {featured.map((b) => (
                <FeaturedCard key={b.id} business={b} />
              ))}
            </div>
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="section tight-top">
          <div className="container">
            <div className="section-head left">
              <h2>Recently added</h2>
              <Link className="text-link" to="/search?sort=newest">
                See the newest <Icon name="chevron" size={16} />
              </Link>
            </div>
            <div className="listing-grid">
              {recent.map((b) => (
                <ListingCard key={b.id} business={b} showAdded />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section tight-top">
        <div className="container">
          <div className="kind-strip">
            {kindCounts.map(([k, n]) => (
              <Link key={k} className="kind-card" to={`/search?kind=${k}`}>
                <span className="cat-dot" aria-hidden="true">
                  <Icon name={KINDS[k].icon} size={22} />
                </span>
                <span>
                  <strong>{KINDS[k].plural}</strong>
                  <span className="muted">
                    {k === "company"
                      ? "Registered companies. Look for the Verified badge."
                      : k === "small"
                        ? "Shops, sole traders and family businesses."
                        : "Tradespeople and specialists who work for themselves."}
                  </span>
                </span>
                <span className="kind-count">{n}</span>
              </Link>
            ))}
          </div>
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
            {FEATURED_PLACES.map((slug) => destinations.find((d) => d.slug === slug)).map((d) => (
              <DestinationCard key={d.slug} destination={d} />
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
              <p className="eyebrow">For businesses and freelancers</p>
              <h2>List your business on Alfa Finda.</h2>
              <p className="lead">
                Companies, small businesses and freelancers can all add a listing. Tell us what you do, where you work
                and how to reach you. We check every listing before it goes live.
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
