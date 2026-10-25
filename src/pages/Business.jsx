import { Suspense, lazy, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { businesses } from "../content/businesses.js";
import { categoryById } from "../content/categories.js";
import { destinations } from "../content/destinations.js";
import { allPhotos, photos, photoUrl } from "../content/photos.js";
import BusinessPhoto from "../components/BusinessPhoto.jsx";
import ListingCard from "../components/ListingCard.jsx";
import DestinationCard from "../components/DestinationCard.jsx";
import Badges from "../components/Badges.jsx";
import { KINDS } from "../lib/kinds.js";
import Stars from "../components/Stars.jsx";
import Modal from "../components/Modal.jsx";
import Icon from "../components/Icon.jsx";
import NotFound from "./NotFound.jsx";
import { usePageTitle } from "../lib/usePageTitle.js";
import { DAYS, hoursSummary, openStatus } from "../lib/hours.js";
import { distanceKm, placeOf } from "../lib/geo.js";
import { timeAgo } from "../lib/time.js";
import { useSavedBusinesses } from "../lib/saved.js";

const BusinessMap = lazy(() => import("../components/BusinessMap.jsx"));

const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function enquiry(b) {
  return `Hi ${b.name}, I found you on Alfa Finda. I'd like to ask about ${
    b.services?.[0]?.name?.toLowerCase?.() || b.services?.[0]?.toLowerCase?.() || "your services"
  }.`;
}

export default function Business() {
  const { id } = useParams();
  const b = businesses.find((x) => x.id === id);
  usePageTitle(b?.name, b?.tagline || b?.description);
  const { has, toggle } = useSavedBusinesses();
  const [gallery, setGallery] = useState(-1);
  const [demoAction, setDemoAction] = useState("");
  const [writing, setWriting] = useState(false);
  const [myReviews, setMyReviews] = useState([]);
  const [shared, setShared] = useState(false);
  const [allReviews, setAllReviews] = useState(false);

  const related = useMemo(() => {
    if (!b) return [];
    const at = placeOf(b);
    return businesses
      .filter((x) => x.category === b.category && x.id !== b.id)
      .map((x) => ({ x, d: at && placeOf(x) ? distanceKm(at, placeOf(x)) : 1e9 }))
      .sort((p, q) => p.d - q.d)
      .slice(0, 4)
      .map((p) => p.x);
  }, [b]);

  if (!b) return <NotFound />;
  const c = categoryById[b.category];
  const status = openStatus(b.hours);
  const pics = allPhotos(b);
  const nearby = destinations.filter((d) => d.region === b.province || d.location.includes(b.city)).slice(0, 2);
  const reviews = [...myReviews, ...(b.reviews || [])];
  const shownReviews = allReviews ? reviews : reviews.slice(0, 3);
  const services = (b.services || []).map((s) => (typeof s === "string" ? { name: s } : s));
  const contact = b.example
    ? { phone: "+263 00 000 0000", email: `hello@${b.id}.example`, whatsapp: "example" }
    : b.contact || {};
  const at = placeOf(b);
  const whatsappUrl =
    !b.example && contact.whatsapp
      ? `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(enquiry(b))}`
      : "";

  // Example listings reach nobody: their buttons explain what would happen instead.
  const act = (label) => (e) => {
    if (b.example || !whatsappUrl) {
      e.preventDefault();
      setDemoAction(label);
    }
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: b.name, url });
      else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      }
    } catch {
      /* the visitor closed the share sheet */
    }
  };

  return (
    <div className="container page biz-page">
      <Link className="back" to={`/search?category=${b.category}`}>
        <Icon name="back" size={16} /> {c?.name}
      </Link>

      <header className={`biz-cover${photos[b.photos?.banner] ? "" : " plain"}`}>
        <BusinessPhoto business={b} width={1600} eager icon={96} />
        <div className="biz-cover-shade" aria-hidden="true" />
        <div className="biz-cover-content">
          <div>
            <div className="biz-cover-badges">
              <Badges business={b} large only={["verified", "founding", "example"]} />
              {b.rating ? (
                <span className="cover-rating">
                  <Stars rating={b.rating} size={15} />
                  {b.rating.toFixed(1)} ({b.reviewCount} reviews)
                </span>
              ) : null}
            </div>
            <h1>{b.name}</h1>
            <p className="biz-tagline">{b.tagline || c?.name}</p>
          </div>
          <div className="biz-cover-actions">
            <button className="glass-button" onClick={share}>
              <Icon name="share" size={18} /> {shared ? "Link copied" : "Share"}
            </button>
            <button className="glass-button" onClick={() => toggle(b.id)} aria-pressed={has(b.id)}>
              <Icon name="heart" size={18} /> {has(b.id) ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </header>

      <div className="biz-grid">
        <div className="biz-main">
          <section className="card">
            <h2>About the business</h2>
            <p className="biz-desc">{b.description}</p>
            {(b.tags?.length > 0 || KINDS[b.kind]) && (
              <ul className="chips large">
                {KINDS[b.kind] && (
                  <li>
                    <Icon name={KINDS[b.kind].icon} size={15} /> {KINDS[b.kind].label}
                  </li>
                )}
                {(b.tags || []).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            )}
          </section>

          {services.length > 0 && (
            <section>
              <h2 className="biz-h2">Services</h2>
              <div className="service-grid">
                {services.map((s) => (
                  <div key={s.name} className="service-card">
                    <span className="cat-dot small" aria-hidden="true">
                      <Icon name={c?.icon || "check"} size={18} />
                    </span>
                    <h3>{s.name}</h3>
                    {s.text && <p>{s.text}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {b.products?.length > 0 && (
            <section className="card">
              <h2>Products</h2>
              <ul className="chips large">
                {b.products.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>
          )}

          {pics.length > 0 && (
            <section>
              <div className="biz-h2-row">
                <h2 className="biz-h2">Photos</h2>
                <button className="link-button" onClick={() => setGallery(0)}>
                  View all ({pics.length})
                </button>
              </div>
              <div className={`gallery count-${Math.min(pics.length, 3)}`}>
                {pics.slice(0, 3).map((k, i) => (
                  <button key={k} className={`gallery-item g${i}`} onClick={() => setGallery(i)}>
                    <img
                      src={photoUrl(photos[k], i === 0 ? 1200 : 600)}
                      alt={photos[k].alt || `${b.name} photo ${i + 1}`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                    {i === 2 && pics.length > 3 && <span className="gallery-more">+{pics.length - 3}</span>}
                  </button>
                ))}
              </div>
              {b.example && <p className="note">Stock photos showing the kind of work. They aren't of this business.</p>}
            </section>
          )}

          <section className="card" id="reviews">
            <div className="biz-h2-row">
              <h2>Customer reviews</h2>
              <button className="btn btn-small btn-outline" onClick={() => setWriting(true)}>
                Write a review
              </button>
            </div>
            {b.rating ? (
              <div className="review-summary">
                <strong>{b.rating.toFixed(1)}</strong>
                <div>
                  <Stars rating={b.rating} size={18} />
                  <p className="muted">
                    {b.reviewCount} reviews{b.example ? " (sample reviews for testing)" : ""}
                  </p>
                </div>
              </div>
            ) : (
              !myReviews.length && <p className="muted">No reviews yet. Be the first to write one.</p>
            )}
            {shownReviews.length > 0 && (
              <ul className="reviews">
                {shownReviews.map((r, i) => (
                  <li key={`${r.name}-${i}`} className="review">
                    <div className="review-head">
                      <span className="avatar" aria-hidden="true">
                        {initials(r.name)}
                      </span>
                      <div>
                        <strong>{r.name}</strong>
                        <p className="meta">{r.mine ? "Just now, on this device only" : timeAgo(r.date)}</p>
                      </div>
                      <span className="review-stars" aria-label={`${r.rating} out of 5`}>
                        <Stars rating={r.rating} size={16} />
                      </span>
                    </div>
                    <p className="review-text">“{r.text}”</p>
                  </li>
                ))}
              </ul>
            )}
            {reviews.length > 3 && (
              <button className="link-button" onClick={() => setAllReviews((v) => !v)}>
                {allReviews ? "Show fewer reviews" : `Show all ${reviews.length} reviews`}
              </button>
            )}
          </section>
        </div>

        <aside className="biz-side">
          <section className="card contact-card" id="contact">
            {b.priceFrom && (
              <div className="price-from">
                <p className="price-label">Starting from</p>
                <p>
                  <strong>${b.priceFrom.amount.toLocaleString()}</strong> <span>/ {b.priceFrom.unit}</span>
                </p>
              </div>
            )}
            <div className="contact-actions">
              <a
                className="btn btn-block"
                href={whatsappUrl || "#contact"}
                target={whatsappUrl ? "_blank" : undefined}
                rel="noreferrer"
                onClick={act(b.cta || "Request a quote")}
              >
                {b.cta || "Request a quote"}
              </a>
              <a
                className="btn btn-block btn-outline"
                href={whatsappUrl || "#contact"}
                target={whatsappUrl ? "_blank" : undefined}
                rel="noreferrer"
                onClick={act("Send a message")}
              >
                <Icon name="chat" size={18} /> Send a message
              </a>
            </div>
            <ul className="contact-list">
              {contact.phone && (
                <li>
                  <Icon name="phone" size={18} />
                  {b.example ? (
                    <span>
                      {contact.phone} <span className="muted">(example)</span>
                    </span>
                  ) : (
                    <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
                  )}
                </li>
              )}
              {contact.email && (
                <li>
                  <Icon name="mail" size={18} />
                  {b.example ? (
                    <span>
                      {contact.email} <span className="muted">(example)</span>
                    </span>
                  ) : (
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  )}
                </li>
              )}
              {!b.example && contact.website && (
                <li>
                  <Icon name="globe" size={18} />
                  <a href={contact.website} target="_blank" rel="noreferrer">
                    {contact.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </li>
              )}
              {b.hours && (
                <li>
                  <Icon name="clock" size={18} />
                  <span>
                    {status && (
                      <strong className={`open-status${status.open ? " open" : ""}`}>
                        {status.label}
                        {status.detail ? ` · ${status.detail}` : ""}
                      </strong>
                    )}
                    <span className="hours-summary">{hoursSummary(b.hours)}</span>
                  </span>
                </li>
              )}
            </ul>
            {b.hours && typeof b.hours !== "string" && (
              <details className="hours-details">
                <summary>All opening hours</summary>
                <dl className="hours">
                  {DAYS.map((d) => (
                    <div key={d}>
                      <dt>{d}</dt>
                      <dd>{b.hours[d] || "Closed"}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}
            {b.example && (
              <p className="note">Example listing: the buttons show what would happen, and the contact details reach nobody.</p>
            )}
          </section>

          {at && (
            <section className="card map-card">
              <div className="map-card-head">
                <h3>Location</h3>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${at.join(",")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link small"
                >
                  Directions <Icon name="arrow" size={14} />
                </a>
              </div>
              <Suspense fallback={<div className="business-map" />}>
                <BusinessMap businesses={[b]} staticMap zoom={14} />
              </Suspense>
              <div className="map-card-foot">
                <strong>{b.contact?.address || [b.suburb, b.city].filter(Boolean).join(", ")}</strong>
                <span className="muted">
                  {b.province}
                  {b.serviceArea ? ` · Serves ${b.serviceArea}` : ""}
                </span>
              </div>
            </section>
          )}

          <section className="card quick-info">
            <h3>Quick info</h3>
            <dl className="facts">
              {KINDS[b.kind] && (
                <div>
                  <dt>Type</dt>
                  <dd>{KINDS[b.kind].label}</dd>
                </div>
              )}
              {b.founded && (
                <div>
                  <dt>Founded</dt>
                  <dd>{b.founded}</dd>
                </div>
              )}
              {b.team && (
                <div>
                  <dt>Team</dt>
                  <dd>{b.team}</dd>
                </div>
              )}
              {b.responseTime && (
                <div>
                  <dt>Usually replies</dt>
                  <dd>{b.responseTime}</dd>
                </div>
              )}
              {b.priceRange && (
                <div>
                  <dt>Price range</dt>
                  <dd>{b.priceRange}</dd>
                </div>
              )}
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
                  <dt>Delivers</dt>
                  <dd>{b.delivery ? "Yes" : "No"}</dd>
                </div>
              )}
            </dl>
          </section>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="section-block">
          <div className="section-head left">
            <h2>
              More {c ? c.name.charAt(0).toLowerCase() + c.name.slice(1) : "businesses"} near {b.city}
            </h2>
            <Link className="text-link" to={`/search?category=${b.category}&town=${encodeURIComponent(b.city)}`}>
              See all <Icon name="chevron" size={16} />
            </Link>
          </div>
          <div className="listing-grid">
            {related.map((x) => (
              <ListingCard key={x.id} business={x} />
            ))}
          </div>
        </section>
      )}
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

      <Modal open={gallery >= 0} onClose={() => setGallery(-1)} title={`${b.name} photos`} wide bare>
        {gallery >= 0 && pics[gallery] && (
          <figure className="lightbox">
            <img src={photoUrl(photos[pics[gallery]], 1600)} alt={photos[pics[gallery]].alt || ""} referrerPolicy="no-referrer" />
            <figcaption>
              <span>
                {gallery + 1} of {pics.length}
              </span>
              <span className="lightbox-nav">
                <button
                  className="glass-button dark"
                  onClick={() => setGallery((g) => (g - 1 + pics.length) % pics.length)}
                  aria-label="Previous photo"
                >
                  <Icon name="back" size={18} />
                </button>
                <button
                  className="glass-button dark"
                  onClick={() => setGallery((g) => (g + 1) % pics.length)}
                  aria-label="Next photo"
                >
                  <Icon name="chevron" size={18} />
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </Modal>

      <Modal open={!!demoAction} onClose={() => setDemoAction("")} title={demoAction}>
        <p>
          {b.example
            ? "This is an example listing, so nothing is sent. On a real listing this opens WhatsApp with this message ready to send:"
            : "This business hasn't added WhatsApp yet. Call or email them instead."}
        </p>
        {b.example && <blockquote className="message-preview">{enquiry(b)}</blockquote>}
        <button className="btn" onClick={() => setDemoAction("")}>
          OK
        </button>
      </Modal>

      <ReviewForm
        open={writing}
        business={b}
        onClose={() => setWriting(false)}
        onAdd={(r) => {
          setMyReviews((list) => [{ ...r, mine: true }, ...list]);
          setWriting(false);
        }}
      />
    </div>
  );
}

// Writing a review works for testing, but nothing is saved yet: reviews arrive with the Global Alfabet Account.
function ReviewForm({ open, onClose, onAdd, business: b }) {
  const [rating, setRating] = useState(0);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!rating || !text.trim()) return;
    onAdd({ name: name.trim() || "You", rating, text: text.trim(), date: new Date().toISOString() });
    setRating(0);
    setName("");
    setText("");
  };
  return (
    <Modal open={open} onClose={onClose} title={`Review ${b.name}`}>
      <form className="form review-form" onSubmit={submit}>
        <fieldset className="star-picker">
          <legend>Your rating</legend>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              className={n <= rating ? "on" : ""}
              onClick={() => setRating(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={n === rating}
            >
              <Icon name="star" size={28} />
            </button>
          ))}
        </fieldset>
        <label className="field">
          <span>Your name (optional)</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
        </label>
        <label className="field">
          <span>Your review</span>
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} required maxLength={600} />
        </label>
        <p className="note">Test version: your review shows on this page until you leave it, and isn't saved anywhere.</p>
        <button className="btn" type="submit" disabled={!rating || !text.trim()}>
          Post review
        </button>
      </form>
    </Modal>
  );
}
