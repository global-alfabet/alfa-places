import { Link, useParams } from "react-router-dom";
import { destinations, interests } from "../content/destinations.js";
import { useDirectory } from "../lib/store.js";
import { categoryById } from "../content/categories.js";
import DestinationArt, { PhotoCredit } from "../components/DestinationArt.jsx";
import Icon from "../components/Icon.jsx";
import ListingCard from "../components/ListingCard.jsx";
import DestinationCard from "../components/DestinationCard.jsx";
import NotFound from "./NotFound.jsx";
import { useTrip } from "../lib/trip.js";
import { km } from "../lib/planner.js";
import { usePageTitle } from "../lib/usePageTitle.js";

const label = Object.fromEntries(interests.map((i) => [i.id, i.label]));

export default function Destination() {
  const { slug } = useParams();
  const d = destinations.find((x) => x.slug === slug);
  const trip = useTrip();
  const businesses = useDirectory();
  usePageTitle(d?.name, d?.summary);
  if (!d) return <NotFound />;
  const saved = trip.has(d.slug);
  const forTrip = businesses
    .filter((b) => d.nearbyCategories.includes(b.category))
    .sort(
      (a, b) =>
        Number(b.province === d.region || d.location.includes(b.city)) -
        Number(a.province === d.region || d.location.includes(a.city)),
    )
    .slice(0, 4);
  const nearby = destinations
    .filter((x) => x.slug !== d.slug)
    .sort((a, b) => km(a.at, d.at) - km(b.at, d.at))
    .slice(0, 3);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${d.name}, Zimbabwe`)}`;

  return (
    <>
      <section className="dest-hero">
        <DestinationArt destination={d} eager sizes="100vw" />
        <div className="dest-hero-copy container">
          <Link className="back on-art" to="/destinations">
            <Icon name="back" size={16} /> Places to visit
          </Link>
          <h1>{d.name}</h1>
          <p>{d.summary}</p>
        </div>
      </section>
      {d.photo && (
        <div className="container">
          <PhotoCredit photo={d.photo} className="under-hero" />
        </div>
      )}

      <div className="container page">
        <div className="dest-actions">
          <button
            className={`btn${saved ? " btn-secondary" : ""}`}
            onClick={() => trip.toggle(d.slug)}
            aria-pressed={saved}
          >
            <Icon name={saved ? "bookmarkFilled" : "bookmark"} size={18} />{" "}
            {saved ? "Saved for your trip" : "Save for your trip"}
          </button>
          <Link className="btn btn-secondary" to="/plan">
            <Icon name="route" size={18} /> Plan a trip
          </Link>
          <a className="text-link" href={mapsUrl} target="_blank" rel="noreferrer">
            Open in Google Maps <Icon name="arrow" size={15} />
          </a>
        </div>

        <dl className="dest-facts">
          <div>
            <dt>
              <Icon name="pin" size={16} /> Where
            </dt>
            <dd>{d.location}</dd>
          </div>
          <div>
            <dt>
              <Icon name="clock" size={16} /> How long
            </dt>
            <dd>{d.duration}</dd>
          </div>
          <div>
            <dt>
              <Icon name="sun" size={16} /> Best time
            </dt>
            <dd>{d.bestTime}</dd>
          </div>
          <div>
            <dt>
              <Icon name="wallet" size={16} /> Typical cost
            </dt>
            <dd>{d.cost}</dd>
          </div>
        </dl>

        <div className="dest-body">
          <section>
            <h2>About {d.name}</h2>
            <p className="lead">{d.description}</p>
            <ul className="chips large">
              {d.interests.map((i) => (
                <li key={i}>{label[i]}</li>
              ))}
            </ul>
          </section>
          <section className="panel">
            <h2>Things to do</h2>
            <ul className="ticks">
              {d.activities.map((a) => (
                <li key={a}>
                  <Icon name="check" size={18} /> {a}
                </li>
              ))}
            </ul>
            <p className="meta">Check opening times, park fees and conditions before you go.</p>
          </section>
        </div>

        {forTrip.length > 0 && (
          <section className="section-block">
            <h2>For your trip</h2>
            <p className="muted">
              {d.nearbyCategories.map((c) => categoryById[c]?.short).join(", ")}.
            </p>
            <div className="listing-grid">
              {forTrip.slice(0, 4).map((b) => (
                <ListingCard key={b.id} business={b} />
              ))}
            </div>
          </section>
        )}

        <section className="section-block">
          <h2>Nearby</h2>
          <div className="dest-grid compact">
            {nearby.map((x) => (
              <DestinationCard key={x.slug} destination={x} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
