import { Suspense, lazy, useMemo, useState } from "react";
import { PageHead, Switch, TestNote } from "../../components/dash/Dash.jsx";
import { useToast } from "../../components/dash/useToast.jsx";
import Icon from "../../components/Icon.jsx";
import { categories, towns } from "../../content/categories.js";
import { DAYS } from "../../lib/hours.js";
import { KINDS } from "../../lib/kinds.js";
import { townCentres } from "../../lib/geo.js";
import { useStore } from "../../lib/store.js";

const BusinessMap = lazy(() => import("../../components/BusinessMap.jsx"));

const PAYMENTS = ["Cash", "EcoCash", "Cards", "Bank transfer", "Payment plans", "Medical aid"];
const PRICE_RANGES = [
  ["", "Not shown"],
  ["$", "$ · Budget"],
  ["$$", "$$ · Mid-range"],
  ["$$$", "$$$ · Premium"],
  ["$$$$", "$$$$ · Luxury"],
];

function parseDay(text) {
  const m = text && !/closed/i.test(text) ? text.match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/) : null;
  return m
    ? { open: true, from: m[1].padStart(5, "0"), to: m[2].padStart(5, "0") }
    : { open: false, from: "08:00", to: "17:00" };
}

function toForm(b) {
  return {
    name: b.name,
    kind: b.kind,
    category: b.category,
    tagline: b.tagline || "",
    description: b.description || "",
    live: !b.hidden,
    services: (b.services || []).map((s) =>
      typeof s === "string" ? { name: s, text: "" } : { name: s.name, text: s.text || "" },
    ),
    priceAmount: b.priceFrom?.amount ?? "",
    priceUnit: b.priceFrom?.unit ?? "",
    priceRange: b.priceRange || "",
    payments: b.payments || [],
    delivery: !!b.delivery,
    city: b.city,
    suburb: b.suburb || "",
    serviceArea: b.serviceArea || "",
    all24: typeof b.hours === "string" && /24 hours/i.test(b.hours),
    days: DAYS.map((d) => parseDay(b.hours && typeof b.hours === "object" ? b.hours[d] : "")),
  };
}

function fromForm(f, b) {
  const fields = {
    name: f.name.trim() || b.name,
    kind: f.kind,
    category: f.category,
    tagline: f.tagline.trim(),
    description: f.description.trim(),
    hidden: !f.live,
    services: f.services.filter((s) => s.name.trim()).map((s) => ({ name: s.name.trim(), text: s.text.trim() })),
    priceFrom:
      f.priceAmount !== "" && f.priceUnit.trim()
        ? { amount: Number(f.priceAmount), unit: f.priceUnit.trim() }
        : undefined,
    priceRange: f.priceRange || undefined,
    payments: f.payments,
    delivery: f.delivery,
    city: f.city,
    suburb: f.suburb.trim(),
    serviceArea: f.serviceArea.trim(),
    hours: f.all24
      ? "Open 24 hours"
      : Object.fromEntries(DAYS.map((d, i) => [d, f.days[i].open ? `${f.days[i].from}–${f.days[i].to}` : "Closed"])),
  };
  if (f.city !== b.city) fields.at = townCentres[f.city] || b.at;
  if (f.kind !== "company") fields.verified = false;
  return fields;
}

// Figma "Edit Business Profile": everything a business can change about its listing.
export default function OwnerListing({ b }) {
  const { state, dispatch } = useStore();
  const original = useMemo(() => toForm(b), [b]);
  const [form, setForm] = useState(original);
  const [toast, setToast] = useToast();
  const dirty = JSON.stringify(form) !== JSON.stringify(original);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));
  const setService = (i, k, v) =>
    setForm((f) => ({ ...f, services: f.services.map((s, j) => (j === i ? { ...s, [k]: v } : s)) }));
  const setDay = (i, k, v) => setForm((f) => ({ ...f, days: f.days.map((d, j) => (j === i ? { ...d, [k]: v } : d)) }));
  const at = form.city !== b.city ? townCentres[form.city] || b.at : b.at;
  const pin = useMemo(() => [{ ...b, at }], [b, at]);

  const save = (e) => {
    e.preventDefault();
    const fields = fromForm(form, b);
    dispatch({
      type: "edit",
      id: b.id,
      fields,
      log: { business: b.id, icon: "edit", title: "Listing updated", text: "Your changes show on your listing." },
    });
    setForm(toForm({ ...b, ...fields }));
    setToast({
      title: "Saved",
      text: "Your listing shows the changes until you reload.",
      link: { to: `/business/${b.id}`, label: "View listing" },
    });
  };

  const undoAll = () => {
    dispatch({
      type: "reset",
      id: b.id,
      log: { business: b.id, icon: "edit", title: "Changes undone", text: "Back to the original listing." },
    });
    setToast({ title: "Back to the original listing" });
  };

  return (
    <form className="listing-form" onSubmit={save}>
      <PageHead title="Your listing" sub="What people see on your business page and in search.">
        {state.edits[b.id] && (
          <button type="button" className="btn btn-small btn-secondary" onClick={undoAll}>
            Undo all changes
          </button>
        )}
      </PageHead>
      <TestNote>Test mode: saved changes show on your listing and in search until you reload the page.</TestNote>

      <section className="panel form-panel">
        <h2>
          <Icon name="info" size={20} /> Basic information
        </h2>
        <label className="field">
          <span>Business name</span>
          <input value={form.name} onChange={set("name")} maxLength={70} required />
        </label>
        <div className="row">
          <label className="field">
            <span>Category</span>
            <select value={form.category} onChange={set("category")}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Type of business</span>
            <select value={form.kind} onChange={set("kind")}>
              {Object.entries(KINDS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {b.verified && form.kind !== "company" && (
          <p className="field-warning">
            Only registered companies can be Verified. Saving removes your Verified badge.
          </p>
        )}
        <label className="field">
          <span>Tagline</span>
          <input value={form.tagline} onChange={set("tagline")} maxLength={80} placeholder="What you do, in one line" />
          <small className="count">{form.tagline.length} / 80</small>
        </label>
        <label className="field">
          <span>Description</span>
          <textarea value={form.description} onChange={set("description")} rows={5} maxLength={600} />
          <small className="count">{form.description.length} / 600</small>
        </label>
        <Switch
          checked={form.live}
          onChange={set("live")}
          label="Live on Alfa Finda"
          hint={
            form.live
              ? "People can find your listing."
              : "Hidden: your listing is out of search until you switch this back on."
          }
        />
      </section>

      <section className="panel form-panel">
        <h2>
          <Icon name="briefcase" size={20} /> Services
        </h2>
        <ul className="service-edit">
          {form.services.map((s, i) => (
            <li key={i}>
              <input
                aria-label={`Service ${i + 1} name`}
                value={s.name}
                onChange={(e) => setService(i, "name", e.target.value)}
                placeholder="Service"
                maxLength={40}
              />
              <input
                aria-label={`Service ${i + 1} details`}
                value={s.text}
                onChange={(e) => setService(i, "text", e.target.value)}
                placeholder="A short description"
                maxLength={120}
              />
              <button
                type="button"
                className="icon-button"
                aria-label={`Remove ${s.name || "service"}`}
                onClick={() => setForm((f) => ({ ...f, services: f.services.filter((_, j) => j !== i) }))}
              >
                <Icon name="close" size={16} />
              </button>
            </li>
          ))}
        </ul>
        {form.services.length < 8 && (
          <button
            type="button"
            className="btn btn-small btn-secondary"
            onClick={() => setForm((f) => ({ ...f, services: [...f.services, { name: "", text: "" }] }))}
          >
            <Icon name="plus" size={16} /> Add a service
          </button>
        )}
      </section>

      <section className="panel form-panel" id="prices">
        <h2>
          <Icon name="tag" size={20} /> Prices and payment
        </h2>
        <div className="row">
          <label className="field">
            <span>Starting price (US$)</span>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={form.priceAmount}
              onChange={set("priceAmount")}
            />
          </label>
          <label className="field">
            <span>Per</span>
            <input
              value={form.priceUnit}
              onChange={set("priceUnit")}
              placeholder="call-out, night, lesson…"
              maxLength={24}
            />
          </label>
        </div>
        <label className="field">
          <span>Price range</span>
          <select value={form.priceRange} onChange={set("priceRange")}>
            {PRICE_RANGES.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <fieldset>
          <legend>Payments you take</legend>
          <div className="checks">
            {PAYMENTS.map((p) => (
              <label key={p} className="check">
                <input
                  type="checkbox"
                  checked={form.payments.includes(p)}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      payments: e.target.checked ? [...f.payments, p] : f.payments.filter((x) => x !== p),
                    }))
                  }
                />
                {p}
              </label>
            ))}
          </div>
        </fieldset>
        <Switch checked={form.delivery} onChange={set("delivery")} label="We deliver or come to you" />
      </section>

      <section className="panel form-panel">
        <h2>
          <Icon name="phone" size={20} /> Contact details
        </h2>
        <p className="muted">Example listings use placeholder details that reach nobody, so these can't be changed.</p>
        <div className="row">
          <label className="field">
            <span>Phone</span>
            <input value="+263 00 000 0000" readOnly />
          </label>
          <label className="field">
            <span>WhatsApp</span>
            <input value="+263 00 000 0000" readOnly />
          </label>
        </div>
        <label className="field">
          <span>Email</span>
          <input value={`hello@${b.id}.example`} readOnly />
        </label>
      </section>

      <section className="panel form-panel" id="location">
        <h2>
          <Icon name="pin" size={20} /> Location
        </h2>
        <div className="row">
          <label className="field">
            <span>Town</span>
            <select value={form.city} onChange={set("city")}>
              {towns.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Suburb</span>
            <input value={form.suburb} onChange={set("suburb")} maxLength={40} />
          </label>
        </div>
        <label className="field">
          <span>Areas you serve</span>
          <input
            value={form.serviceArea}
            onChange={set("serviceArea")}
            placeholder="For example: the city centre and nearby suburbs"
            maxLength={80}
          />
        </label>
        {at && (
          <div className="form-map">
            <Suspense fallback={<div className="business-map" />}>
              <BusinessMap businesses={pin} staticMap zoom={form.city !== b.city ? 12 : 14} />
            </Suspense>
            {form.city !== b.city && <p className="note">The pin moves to the centre of {form.city}.</p>}
          </div>
        )}
      </section>

      <section className="panel form-panel" id="hours">
        <h2>
          <Icon name="clock" size={20} /> Opening hours
        </h2>
        <Switch checked={form.all24} onChange={set("all24")} label="Open 24 hours" />
        {!form.all24 && (
          <ul className="hours-edit">
            {DAYS.map((d, i) => (
              <li key={d}>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={form.days[i].open}
                    onChange={(e) => setDay(i, "open", e.target.checked)}
                  />
                  {d}
                </label>
                {form.days[i].open ? (
                  <span className="hours-times">
                    <input
                      type="time"
                      aria-label={`${d} opens`}
                      value={form.days[i].from}
                      onChange={(e) => setDay(i, "from", e.target.value)}
                    />
                    <span aria-hidden="true">–</span>
                    <input
                      type="time"
                      aria-label={`${d} closes`}
                      value={form.days[i].to}
                      onChange={(e) => setDay(i, "to", e.target.value)}
                    />
                  </span>
                ) : (
                  <span className="closed-pill">Closed</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className={`save-bar${dirty ? " dirty" : ""}`}>
        <span className="muted">{dirty ? "You have unsaved changes." : "Everything is saved."}</span>
        <button
          type="button"
          className="btn btn-small btn-secondary"
          disabled={!dirty}
          onClick={() => setForm(original)}
        >
          Discard
        </button>
        <button type="submit" className="btn btn-small" disabled={!dirty}>
          Save changes
        </button>
      </div>
      {toast}
    </form>
  );
}
