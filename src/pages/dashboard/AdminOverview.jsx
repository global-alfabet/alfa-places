import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PageHead, StatCard, TestNote } from "../../components/dash/Dash.jsx";
import { BarChart, BarList } from "../../components/dash/Charts.jsx";
import Icon from "../../components/Icon.jsx";
import { categoryById } from "../../content/categories.js";
import { KINDS } from "../../lib/kinds.js";
import { useDirectory, useStore } from "../../lib/store.js";
import { directoryCsv, download, openReports, pendingSubmissions, verifyQueue } from "../../lib/admin.js";
import { dayMonth, shortTime } from "../../lib/sample.js";

const DAY = 86400000;
const monday = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
};

/** Listings that joined each week, from the first one to this week. */
function weekly(list) {
  const dated = list.filter((b) => b.added).map((b) => new Date(b.added));
  if (!dated.length) return [];
  const first = monday(Math.min(...dated));
  const last = monday(new Date());
  const weeks = [];
  for (let t = first.getTime(); t <= last.getTime(); t += 7 * DAY) {
    const start = new Date(t);
    const end = new Date(t + 7 * DAY);
    // A week belongs to the month its Thursday is in.
    const month = new Date(t + 3 * DAY).getMonth();
    const startsMonth = weeks.length === 0 || month !== new Date(t - 4 * DAY).getMonth();
    weeks.push({
      label: startsMonth ? new Date(t + 3 * DAY).toLocaleDateString("en-GB", { month: "short" }) : "",
      tip: `Week of ${start.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`,
      value: dated.filter((d) => d >= start && d < end).length,
    });
  }
  return weeks;
}

export default function AdminOverview() {
  const { state } = useStore();
  const all = useDirectory(true);
  const live = all.filter((b) => !b.hidden);
  const subs = pendingSubmissions(state);
  const verify = verifyQueue(state);
  const reports = openReports(state);
  const weeks = useMemo(() => weekly(all), [all]);

  const byCategory = Object.entries(
    live.reduce((acc, b) => ({ ...acc, [b.category]: (acc[b.category] || 0) + (b.reviewCount || 0) }), {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id, n]) => ({ label: categoryById[id]?.short || id, value: n }));
  const byKind = Object.keys(KINDS).map((k) => ({
    label: KINDS[k].plural,
    value: live.filter((b) => b.kind === k).length,
  }));

  const attention = [
    ...subs
      .slice(0, 3)
      .map((s) => ({
        icon: "store",
        title: `New business: ${s.name}`,
        text: `${s.city} · sent ${dayMonth(s.submitted)}`,
        to: "/admin/approvals",
      })),
    ...verify.slice(0, 2).map((v) => ({
      icon: "verified",
      title: `Verified request: ${all.find((b) => b.id === v.id)?.name || v.id}`,
      text: v.note,
      to: "/admin/approvals?tab=verified",
    })),
    ...reports.slice(0, 2).map((r) => ({
      icon: "shield",
      title: `Reported review on ${all.find((b) => b.id === r.business)?.name || r.business}`,
      text: `${r.by}: ${r.reason}`,
      to: "/admin/reports",
    })),
    ...all
      .filter((b) => b.hidden)
      .map((b) => ({
        icon: "eye",
        title: `Hidden: ${b.name}`,
        text: "The business switched its listing off.",
        to: "/admin/directory?status=hidden",
      })),
  ];

  const activity = [
    ...state.activity.map((a) => ({ ...a, business: all.find((b) => b.id === a.business)?.name })),
    ...[...all]
      .filter((b) => b.added)
      .sort((a, b) => b.added.localeCompare(a.added))
      .slice(0, 5)
      .map((b) => ({
        at: b.added,
        icon: "plus",
        title: `${b.name} joined`,
        text: `${categoryById[b.category]?.name} · ${b.city}`,
      })),
  ]
    .sort((x, y) => new Date(y.at) - new Date(x.at))
    .slice(0, 7);

  return (
    <>
      <PageHead title="Overview" sub="Alfa Finda at a glance.">
        <button
          className="btn btn-small btn-secondary"
          onClick={() => download("alfa-finda-listings.csv", directoryCsv(all))}
        >
          <Icon name="share" size={16} /> Export listings
        </button>
        <Link className="btn btn-small" to="/admin/approvals">
          Review approvals
        </Link>
      </PageHead>
      <TestNote>
        Test admin: counts come from the listings on the site, most of them examples. What you change here shows across
        the site until you reload the page.
      </TestNote>

      <div className="stat-grid">
        <StatCard
          icon="store"
          label="Live listings"
          value={live.length}
          note={`${live.filter((b) => !b.example).length} real, ${live.filter((b) => b.example).length} examples`}
        />
        <StatCard
          icon="verified"
          label="Verified companies"
          value={live.filter((b) => b.verified).length}
          note={`Of ${live.filter((b) => b.kind === "company").length} companies`}
        />
        <StatCard
          icon="check"
          label="Waiting for approval"
          value={subs.length + verify.length}
          note={`${subs.length} new, ${verify.length} Verified requests`}
        />
        <StatCard icon="shield" label="Reported reviews" value={reports.length} note="Open reports" />
      </div>

      <div className="dash-grid">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>New listings</h2>
              <p className="muted">Listings that joined each week</p>
            </div>
          </div>
          <BarChart title="Listings that joined each week" unit="listings" data={weeks} />
        </section>
        <section className="panel">
          <div className="panel-head">
            <h2>Needs attention</h2>
            {attention.length > 0 && <span className="badge badge-attention">{attention.length}</span>}
          </div>
          {attention.length ? (
            <ul className="timeline">
              {attention.slice(0, 6).map((a, i) => (
                <li key={i}>
                  <span className="timeline-icon" aria-hidden="true">
                    <Icon name={a.icon} size={16} />
                  </span>
                  <div>
                    <Link to={a.to}>
                      <strong>{a.title}</strong>
                    </Link>
                    <p>{a.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">All done. Nothing waiting.</p>
          )}
        </section>
      </div>

      <div className="dash-grid thirds">
        <section className="panel">
          <div className="panel-head">
            <div>
              <h2>Most reviewed</h2>
              <p className="muted">Reviews by category (samples)</p>
            </div>
          </div>
          <BarList rows={byCategory} title="Reviews by category" />
          <Link className="text-link small" to="/admin/content">
            All categories <Icon name="chevron" size={14} />
          </Link>
        </section>
        <section className="panel">
          <div className="panel-head">
            <h2>Types and badges</h2>
          </div>
          <BarList rows={byKind} max={live.length} title="Live listings by type" />
          <dl className="mini-stats">
            <div>
              <dt>Verified</dt>
              <dd>{live.filter((b) => b.verified).length}</dd>
            </div>
            <div>
              <dt>Founding</dt>
              <dd>{live.filter((b) => b.founding).length}</dd>
            </div>
            <div>
              <dt>Featured</dt>
              <dd>{live.filter((b) => b.featured).length}</dd>
            </div>
          </dl>
        </section>
        <section className="panel">
          <div className="panel-head">
            <h2>Recent activity</h2>
          </div>
          <ul className="timeline compact">
            {activity.map((a, i) => (
              <li key={i}>
                <span className="timeline-icon" aria-hidden="true">
                  <Icon name={a.icon} size={14} />
                </span>
                <div>
                  <strong>{a.title}</strong>
                  <p>{a.business ? `${a.business}: ${a.text}` : a.text}</p>
                  <span className="meta">{shortTime(a.at)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
