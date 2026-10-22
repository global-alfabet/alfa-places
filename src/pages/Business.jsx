import { Link, useParams } from "react-router-dom";
import { businesses } from "../content/businesses.js";
import { categoryById } from "../content/categories.js";
import { destinations } from "../content/destinations.js";
import { CategoryIcon } from "../components/CategoryTile.jsx";
import BusinessCard from "../components/BusinessCard.jsx";
import DestinationCard from "../components/DestinationCard.jsx";
import Icon from "../components/Icon.jsx";
import NotFound from "./NotFound.jsx";
import { usePageTitle } from "../lib/usePageTitle.js";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Business() {
  const { id } = useParams();
  const b = businesses.find((x) => x.id === id);
  usePageTitle(b?.name, b?.description);
  if (!b) return <NotFound />;
  const c = categoryById[b.category];
  const similar = businesses.filter((x) => x.category === b.category && x.id !== b.id).slice(0, 3);
  const nearby = destinations.filter((d) => d.region === b.province || d.location.includes(b.city)).slice(0, 2);

  return (
    <div className="container page">
      <Link className="back" to={`/search?category=${b.category}`}>
        <Icon name="back" size={16} /> {c?.name}
      </Link>
      <header className="biz-head">
        <CategoryIcon icon={c?.icon} size={88} />
        <div>
          {b.example && <span className="tag">Example listing</span>}
          <h1>{b.name}</h1>
          <p className="meta">
            {c?.name} · {b.city}, {b.province}
          </p>
        </div>
      </header>

      <div className="biz-layout">
        <div className="biz-main">
          <section className="panel">
            <h2>About</h2>
            <p className="biz-desc">{b.description}</p>
          </section>
          {b.services?.length > 0 && (
            <section className="panel">
              <h2>Services</h2>
              <ul className="ticks">
                {b.services.map((s) => (
                  <li key={s}>
                    <Icon name="check" size={18} /> {s}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {b.products?.length > 0 && (
            <section className="panel">
              <h2>Products</h2>
              <ul className="chips large">
                {b.products.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="biz-side">
          <section className="panel contact-panel">
            <h2>Contact</h2>
            {b.example ? (
              <>
                <p className="muted">
                  This is an example listing, so there are no contact details. A real business shows its phone,
                  WhatsApp, email and address here.
                </p>
                <Link className="btn btn-small" to="/add-your-business">
                  Add your business
                </Link>
              </>
            ) : (
              <ul className="contact-list">
                {b.contact?.phone && (
                  <li>
                    <Icon name="phone" size={18} />{" "}
                    <a href={`tel:${b.contact.phone.replace(/\s/g, "")}`}>{b.contact.phone}</a>
                  </li>
                )}
                {b.contact?.whatsapp && (
                  <li>
                    <Icon name="chat" size={18} />{" "}
                    <a href={`https://wa.me/${b.contact.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                      WhatsApp
                    </a>
                  </li>
                )}
                {b.contact?.email && (
                  <li>
                    <Icon name="mail" size={18} /> <a href={`mailto:${b.contact.email}`}>{b.contact.email}</a>
                  </li>
                )}
                {b.contact?.website && (
                  <li>
                    <Icon name="globe" size={18} />{" "}
                    <a href={b.contact.website} target="_blank" rel="noreferrer">
                      {b.contact.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </li>
                )}
                {b.contact?.address && (
                  <li>
                    <Icon name="pin" size={18} /> {b.contact.address}
                  </li>
                )}
              </ul>
            )}
          </section>
          {b.hours && (
            <section className="panel">
              <h2>Opening hours</h2>
              {typeof b.hours === "string" ? (
                <p>{b.hours}</p>
              ) : (
                <dl className="hours">
                  {DAYS.map((d) => (
                    <div key={d}>
                      <dt>{d}</dt>
                      <dd>{b.hours[d] || "Closed"}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          )}
          {(b.payments?.length > 0 ||
            b.languages?.length > 0 ||
            b.delivery !== undefined ||
            b.amenities?.length > 0) && (
            <section className="panel">
              <h2>Good to know</h2>
              <dl className="facts">
                {b.payments?.length > 0 && (
                  <div>
                    <dt>Payments</dt>
                    <dd>{b.payments.join(", ")}</dd>
                  </div>
                )}
                {b.languages?.length > 0 && (
                  <div>
                    <dt>Languages</dt>
                    <dd>{b.languages.join(", ")}</dd>
                  </div>
                )}
                {b.delivery !== undefined && (
                  <div>
                    <dt>Delivery</dt>
                    <dd>{b.delivery ? "Yes" : "No"}</dd>
                  </div>
                )}
                {b.amenities?.length > 0 && (
                  <div>
                    <dt>Extras</dt>
                    <dd>{b.amenities.join(", ")}</dd>
                  </div>
                )}
              </dl>
            </section>
          )}
        </aside>
      </div>

      {nearby.length > 0 && (
        <section className="section-block">
          <h2>Places to visit nearby</h2>
          <div className="dest-grid compact">
            {nearby.map((d) => (
              <DestinationCard key={d.slug} destination={d} />
            ))}
          </div>
        </section>
      )}
      {similar.length > 0 && (
        <section className="section-block">
          <h2>More {c?.name.toLowerCase()}</h2>
          <div className="biz-list">
            {similar.map((x) => (
              <BusinessCard key={x.id} business={x} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
