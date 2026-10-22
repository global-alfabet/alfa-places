import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { destinations, interests } from "../content/destinations.js";
import Icon from "../components/Icon.jsx";
import Scene from "../components/Scene.jsx";
import { BUDGETS, START_TOWNS, planTrip } from "../lib/planner.js";
import { useTrip } from "../lib/trip.js";
import { usePageTitle } from "../lib/usePageTitle.js";

const bySlug = Object.fromEntries(destinations.map((d) => [d.slug, d]));

// The choices live in the address (?i=wildlife,nature&d=5&b=Moderate&s=Harare), so a plan can be shared as a link.
export default function Plan() {
  usePageTitle("Plan a trip", "Pick your interests, days and budget, and get a day-by-day trip around Zimbabwe.");
  const [params, setParams] = useSearchParams();
  const trip = useTrip();
  const [copied, setCopied] = useState(false);

  const chosen = (params.get("i") || "").split(",").filter((i) => interests.some((x) => x.id === i));
  const days = Math.min(14, Math.max(1, Number(params.get("d")) || 4));
  const budget = BUDGETS.includes(params.get("b")) ? params.get("b") : "Moderate";
  const start = START_TOWNS[params.get("s")] ? params.get("s") : "";

  const update = (patch) => {
    const next = { i: chosen.join(","), d: String(days), b: budget, s: start, ...patch };
    setParams(Object.fromEntries(Object.entries(next).filter(([, v]) => v)), { replace: true });
    setCopied(false);
  };
  const toggleInterest = (id) =>
    update({ i: (chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id]).join(",") });

  const plan = useMemo(
    () =>
      chosen.length || trip.saved.length
        ? planTrip({ interests: chosen, days, budget, start, saved: trip.saved })
        : null,
    [chosen.join(","), days, budget, start, trip.saved.join(",")], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="container page">
      <div className="page-head">
        <p className="eyebrow">Plan a trip</p>
        <h1>Your trip around Zimbabwe.</h1>
        <p className="lead">Choose what you'd like to do. The plan updates as you go.</p>
      </div>

      <div className="planner">
        <section className="panel planner-form" aria-label="Your choices">
          <fieldset>
            <legend>What do you enjoy?</legend>
            <div className="chip-filter wrap">
              {interests.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  className={chosen.includes(i.id) ? "on" : ""}
                  aria-pressed={chosen.includes(i.id)}
                  onClick={() => toggleInterest(i.id)}
                >
                  {i.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>How many days?</legend>
            <div className="stepper">
              <button
                type="button"
                aria-label="Fewer days"
                disabled={days <= 1}
                onClick={() => update({ d: String(days - 1) })}
              >
                <Icon name="minus" size={18} />
              </button>
              <output aria-live="polite">
                {days} {days === 1 ? "day" : "days"}
              </output>
              <button
                type="button"
                aria-label="More days"
                disabled={days >= 14}
                onClick={() => update({ d: String(days + 1) })}
              >
                <Icon name="plus" size={18} />
              </button>
            </div>
          </fieldset>

          <fieldset>
            <legend>Budget</legend>
            <div className="segmented" role="radiogroup">
              {BUDGETS.map((b) => (
                <button
                  key={b}
                  type="button"
                  role="radio"
                  aria-checked={budget === b}
                  className={budget === b ? "on" : ""}
                  onClick={() => update({ b })}
                >
                  {b}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="field">
            <span>Starting from</span>
            <select value={start} onChange={(e) => update({ s: e.target.value })}>
              <option value="">Anywhere</option>
              {Object.keys(START_TOWNS).map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>

          {trip.saved.length > 0 && (
            <div className="saved-places">
              <p className="legend">Saved places</p>
              <ul className="chips">
                {trip.saved.map((slug) =>
                  bySlug[slug] ? (
                    <li key={slug} className="removable">
                      {bySlug[slug].name}
                      <button
                        type="button"
                        aria-label={`Remove ${bySlug[slug].name}`}
                        onClick={() => trip.toggle(slug)}
                      >
                        <Icon name="close" size={12} />
                      </button>
                    </li>
                  ) : null,
                )}
              </ul>
            </div>
          )}
        </section>

        <section className="planner-result" aria-live="polite">
          {!plan || !plan.stops.length ? (
            <div className="panel empty">
              <h2>Pick at least one interest.</h2>
              <p className="muted">
                Or save places you like from the places to visit, and we'll build the trip around them.
              </p>
              <Link className="text-link" to="/destinations">
                Browse places to visit <Icon name="chevron" size={15} />
              </Link>
            </div>
          ) : (
            <>
              <div className="route">
                {plan.stops.map((s, i) => (
                  <Link key={s.destination.slug} className="route-stop" to={`/destinations/${s.destination.slug}`}>
                    <span className="route-art">
                      <Scene kind={s.destination.scene} label="" />
                    </span>
                    <span className="route-n">{i + 1}</span>
                    <strong>{s.destination.name}</strong>
                    <span className="meta">
                      {s.days} {s.days === 1 ? "day" : "days"}
                    </span>
                  </Link>
                ))}
              </div>

              <ol className="itinerary">
                {plan.itinerary.map((day) => (
                  <li key={day.day}>
                    <div>
                      <span className="day-label">Day {day.day}</span>
                      <strong>{day.travel ? `Travel to ${day.destination.name}` : day.destination.name}</strong>
                      <p className="muted">{day.activities.join(". ")}.</p>
                    </div>
                  </li>
                ))}
                {plan.spare > 0 && (
                  <li className="spare">
                    <div>
                      <span className="day-label">Spare</span>
                      <strong>
                        {plan.spare} free {plan.spare === 1 ? "day" : "days"}
                      </strong>
                      <p className="muted">
                        Nothing else close by matches your interests. Rest, add an interest, or save another place.
                      </p>
                    </div>
                  </li>
                )}
              </ol>

              <div className="plan-actions">
                <button className="btn btn-secondary btn-small" onClick={share}>
                  <Icon name="share" size={16} /> {copied ? "Link copied" : "Copy link to this plan"}
                </button>
                <Link className="text-link" to="/search?category=hotels">
                  Places to stay <Icon name="chevron" size={15} />
                </Link>
              </div>
              <p className="meta">
                Travel times are not included. Check roads, park opening times and fees before you go.
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
