import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PageHead, StatCard, TestNote } from "../../components/dash/Dash.jsx";
import { BarChart, BarList } from "../../components/dash/Charts.jsx";
import Icon from "../../components/Icon.jsx";
import Stars from "../../components/Stars.jsx";
import { categoryById } from "../../content/categories.js";
import { isTopRated } from "../../lib/kinds.js";
import { compact, sampleStats, seeded, shortTime } from "../../lib/sample.js";
import { useStore } from "../../lib/store.js";
import { listingChecks } from "../../lib/listing.js";

const greeting = () => {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Harare", hour: "2-digit", hourCycle: "h23" }).format(
      new Date(),
    ),
  );
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
};

export default function OwnerOverview({ b, owner, threads }) {
  const { state } = useStore();
  const stats = useMemo(() => sampleStats(b), [b]);
  const c = categoryById[b.category];
  const checks = listingChecks(b);
  const score = Math.round((checks.filter((x) => x.done).length / checks.length) * 100);

  const activity = [
    ...threads
      .filter((t) => !t.archived)
      .map((t) => {
        const last = t.messages.filter((m) => m.from === "customer").at(-1);
        return (
          last && {
            at: last.at,
            icon: "chat",
            title: `Message from ${t.name}`,
            text: last.text,
            to: "/dashboard/messages",
            unread: t.unread,
          }
        );
      }),
    ...b.reviews.slice(0, 4).map((r) => ({
      at: r.date,
      icon: "star",
      title: `${r.name} left ${r.rating} ${r.rating === 1 ? "star" : "stars"}`,
      text: r.text,
      to: "/dashboard/reviews",
    })),
    ...state.activity.filter((a) => a.business === b.id).map((a) => ({ ...a, to: undefined })),
  ]
    .filter(Boolean)
    .sort((x, y) => new Date(y.at) - new Date(x.at))
    .slice(0, 5);

  const rand = seeded(`find:${b.id}`);
  const words = [...(c?.words || []).slice(0, 3).map((w) => `${w} ${b.city.toLowerCase()}`), b.name.toLowerCase()];
  const shares = words.map(() => 0.3 + rand());
  const totalShare = shares.reduce((n, x) => n + x, 0);
  const finds = words
    .map((w, i) => ({ label: w, value: Math.round((stats.searches * 0.6 * shares[i]) / totalShare) }))
    .sort((x, y) => y.value - x.value);

  const badges = [
    {
      on: b.verified,
      icon: "verified",
      name: "Verified",
      text: b.verified
        ? "Alfa Finda checked your company registration."
        : b.kind === "company"
          ? "Ask for it in Settings. We check your company registration."
          : "For registered companies.",
    },
    {
      on: b.founding,
      icon: "award",
      name: "Founding partner",
      text: b.founding ? "One of the first businesses on Alfa Finda." : "Given by Alfa Finda to early partners.",
    },
    {
      on: b.featured,
      icon: "sparkles",
      name: "Featured",
      text: b.featured ? "Shown in Featured partners on the home page." : "Chosen by Alfa Finda.",
    },
    {
      on: isTopRated(b),
      icon: "star",
      name: "Top rated",
      text: isTopRated(b)
        ? `${b.rating.toFixed(1)} stars from ${b.reviewCount} reviews.`
        : `Needs 4.7 stars from 40 reviews. You have ${b.rating?.toFixed(1) || "no"} from ${b.reviewCount || 0}.`,
    },
  ];

  return (
    <>
      <PageHead title={`${greeting()}, ${owner.name.split(" ")[0]}`} sub={`Here's how ${b.name} is doing this week.`}>
        <Link className="btn btn-small" to="/dashboard/listing">
          <Icon name="edit" size={16} /> Edit listing
        </Link>
      </PageHead>
      <TestNote>
        Test mode: the numbers on this page are samples, not real visits. Changes you make in this dashboard show on
        your listing until you reload the page.
      </TestNote>

      <div className="stat-grid">
        <StatCard icon="eye" label="Profile views" value={compact(stats.views)} change={stats.viewsChange} />
        <StatCard icon="chat" label="Enquiries" value={compact(stats.enquiries)} change={stats.enquiriesChange} />
        <StatCard
          icon="star"
          label="Average rating"
          value={b.rating ? b.rating.toFixed(1) : "–"}
          note={b.reviewCount ? `From ${b.reviewCount} reviews` : "No reviews yet"}
        />
        <StatCard icon="heart" label="Saved by visitors" value={compact(stats.saves)} change={stats.savesChange} />
      </div>

      <div className="dash-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Profile views</h2>
              <p className="muted">Last 7 days</p>
            </div>
          </div>
          <BarChart
            title="Profile views, last 7 days"
            unit="views"
            data={stats.days.map((d) => ({
              label: d.label,
              value: d.views,
              tip: d.date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" }),
            }))}
          />
          <dl className="mini-stats">
            <div>
              <dt>Calls</dt>
              <dd>{stats.calls}</dd>
            </div>
            <div>
              <dt>Directions</dt>
              <dd>{stats.directions}</dd>
            </div>
            <div>
              <dt>Shown in search</dt>
              <dd>{compact(stats.searches)}</dd>
            </div>
          </dl>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Recent activity</h2>
          </div>
          <ul className="timeline">
            {activity.map((a, i) => (
              <li key={i}>
                <span className={`timeline-icon${a.unread ? " unread" : ""}`} aria-hidden="true">
                  <Icon name={a.icon} size={16} />
                </span>
                <div>
                  <strong>{a.title}</strong>
                  <p>{a.text}</p>
                  <span className="meta">{shortTime(a.at)}</span>
                </div>
              </li>
            ))}
          </ul>
          <Link className="btn btn-small btn-outline btn-block" to="/dashboard/messages">
            Open messages
          </Link>
        </section>
      </div>

      <div className="dash-grid thirds">
        <section className="panel">
          <div className="panel-head">
            <h2>Listing strength</h2>
            <strong className="score">{score}%</strong>
          </div>
          <div
            className="meter"
            role="meter"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Listing strength"
          >
            <span style={{ width: `${score}%` }} />
          </div>
          <ul className="checklist">
            {checks.map((x) => (
              <li key={x.label} className={x.done ? "done" : ""}>
                <Icon name={x.done ? "check" : "plus"} size={16} stroke={2.2} />
                {x.done ? <span>{x.label}</span> : <Link to={x.to}>{x.label}</Link>}
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Badges</h2>
          </div>
          <ul className="badge-status">
            {badges.map((x) => (
              <li key={x.name} className={x.on ? "on" : ""}>
                <span className="badge-status-icon" aria-hidden="true">
                  <Icon name={x.icon} size={18} />
                </span>
                <span>
                  <strong>
                    {x.name}
                    <span className="sr-only">{x.on ? " (yours)" : " (not yet)"}</span>
                  </strong>
                  <span className="muted">{x.text}</span>
                </span>
                {x.on && <Icon name="check" size={18} stroke={2.4} className="badge-status-tick" />}
              </li>
            ))}
          </ul>
          {!b.verified && b.kind === "company" && (
            <Link className="text-link small" to="/dashboard/settings#verified">
              Ask for Verified <Icon name="chevron" size={14} />
            </Link>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>How people find you</h2>
              <p className="muted">Searches that showed your listing</p>
            </div>
          </div>
          <BarList rows={finds} title="Searches that showed your listing" />
          <p className="stat-note">
            <Stars rating={b.rating || 0} size={13} /> In Recommended results, Featured and Verified listings come
            first, then the best rated with the most reviews.
          </p>
        </section>
      </div>
    </>
  );
}
