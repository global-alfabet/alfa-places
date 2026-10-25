import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { PageHead, TestNote } from "../../components/dash/Dash.jsx";
import { useToast } from "../../components/dash/useToast.jsx";
import Icon from "../../components/Icon.jsx";
import { CategoryIcon } from "../../components/CategoryTile.jsx";
import { categoryById, towns } from "../../content/categories.js";
import { submissions } from "../../content/demo-dashboard.js";
import { KINDS } from "../../lib/kinds.js";
import { useDirectory, useStore } from "../../lib/store.js";
import { pendingSubmissions, verifyQueue } from "../../lib/admin.js";
import { dayMonth, shortTime } from "../../lib/sample.js";

const REJECT = ["Details are missing", "Not a real business", "Already listed", "Outside Zimbabwe"];

// Figma "Business Approvals": new businesses from the Add your business form, and Verified requests.
export default function AdminApprovals() {
  const { state, dispatch } = useStore();
  const all = useDirectory(true);
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "new";
  const [rejecting, setRejecting] = useState("");
  const [reason, setReason] = useState(REJECT[0]);
  const [toast, setToast] = useToast();
  const pending = pendingSubmissions(state);
  const verify = verifyQueue(state);
  const decided = [
    ...submissions.filter((s) => state.decisions[s.id]).map((s) => ({ ...s, kindOf: "new", ...state.decisions[s.id] })),
    ...Object.entries(state.verify)
      .filter(([, v]) => v.status === "approved" || v.status === "declined")
      .map(([id, v]) => ({ id, name: all.find((b) => b.id === id)?.name || id, kindOf: "verified", ...v })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  const decide = (s, status) => {
    dispatch({
      type: "decide",
      id: s.id,
      status,
      reason: status === "rejected" ? reason : undefined,
      log: {
        icon: status === "approved" ? "check" : "close",
        title: `${s.name} ${status}`,
        text: status === "approved" ? "Now live on Alfa Finda." : reason,
      },
    });
    setRejecting("");
    setToast(
      status === "approved"
        ? {
            title: `${s.name} is live`,
            text: "It shows in search and Recently added until you reload.",
            link: { to: `/business/${s.id}`, label: "View" },
          }
        : { title: `${s.name} rejected`, text: reason },
    );
  };
  const decideVerify = (v, status) => {
    const name = all.find((b) => b.id === v.id)?.name || v.id;
    dispatch({
      type: "verify",
      id: v.id,
      status,
      log: {
        business: v.id,
        icon: "verified",
        title: `Verified ${status === "approved" ? "given to" : "declined for"} ${name}`,
        text: "By the Alfa Finda team.",
      },
    });
    setToast({
      title: status === "approved" ? `${name} is Verified` : `Request from ${name} declined`,
      link: status === "approved" ? { to: `/business/${v.id}`, label: "View" } : undefined,
    });
  };

  const tabs = [
    ["new", `New businesses (${pending.length})`],
    ["verified", `Verified requests (${verify.length})`],
    ["decided", `Decided (${decided.length})`],
  ];

  return (
    <>
      <PageHead title="Approvals" sub="Check each business before it goes live." />
      <TestNote>
        Test admin: these businesses are made up. Approving one adds it to the site as an example listing until you
        reload. Real businesses still come through the Add your business form.
      </TestNote>

      <div className="chip-row tabs" role="tablist" aria-label="Approvals">
        {tabs.map(([v, l]) => (
          <button
            key={v}
            role="tab"
            aria-selected={tab === v}
            className={`chip-button${tab === v ? " on" : ""}`}
            onClick={() => setParams(v === "new" ? {} : { tab: v }, { replace: true })}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "new" &&
        (pending.length ? (
          <ul className="approval-list">
            {pending.map((s) => {
              const c = categoryById[s.category];
              const checks = [
                ["Description of a few sentences", s.description.length >= 60],
                ["Category chosen", !!c],
                ["Town is on our list", towns.includes(s.city)],
                ["Phone and email given", true],
              ];
              return (
                <li key={s.id} className="panel approval">
                  <div className="approval-head">
                    <CategoryIcon icon={c?.icon} size={48} />
                    <div>
                      <h2>{s.name}</h2>
                      <p className="meta">
                        {KINDS[s.kind].label} · {c?.name} · {s.suburb}, {s.city} · sent {dayMonth(s.submitted)}
                      </p>
                    </div>
                  </div>
                  <p className="approval-tagline">{s.tagline}</p>
                  <p className="muted">{s.description}</p>
                  <ul className="chips">
                    {s.services.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                  <dl className="facts approval-facts">
                    <div>
                      <dt>Sent by</dt>
                      <dd>{s.owner} (made up)</dd>
                    </div>
                    <div>
                      <dt>Contact</dt>
                      <dd>+263 00 000 0000</dd>
                    </div>
                  </dl>
                  <ul className="checklist">
                    {checks.map(([l, ok]) => (
                      <li key={l} className={ok ? "done" : ""}>
                        <Icon name={ok ? "check" : "close"} size={16} stroke={2.2} /> <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                  {rejecting === s.id ? (
                    <div className="reject-box">
                      <label className="field compact">
                        <span>Reason</span>
                        <select value={reason} onChange={(e) => setReason(e.target.value)}>
                          {REJECT.map((r) => (
                            <option key={r}>{r}</option>
                          ))}
                        </select>
                      </label>
                      <button className="btn btn-small btn-danger" onClick={() => decide(s, "rejected")}>
                        Reject
                      </button>
                      <button className="btn btn-small btn-secondary" onClick={() => setRejecting("")}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="approval-actions">
                      <button className="btn btn-small" onClick={() => decide(s, "approved")}>
                        <Icon name="check" size={16} stroke={2.2} /> Approve
                      </button>
                      <button className="btn btn-small btn-outline-danger" onClick={() => setRejecting(s.id)}>
                        Reject
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="panel empty">
            <p>No new businesses waiting.</p>
          </div>
        ))}

      {tab === "verified" &&
        (verify.length ? (
          <ul className="approval-list">
            {verify.map((v) => {
              const b = all.find((x) => x.id === v.id);
              if (!b) return null;
              return (
                <li key={v.id} className="panel approval">
                  <div className="approval-head">
                    <CategoryIcon icon={categoryById[b.category]?.icon} size={48} />
                    <div>
                      <h2>
                        <Link to={`/business/${b.id}`}>{b.name}</Link>
                      </h2>
                      <p className="meta">
                        Now: {KINDS[b.kind].label} · {b.city} · asked {dayMonth(v.at)}
                      </p>
                    </div>
                  </div>
                  {v.note && <p className="muted">{v.note}</p>}
                  <p className="note">Approving makes it a Company with the Verified badge.</p>
                  <div className="approval-actions">
                    <button className="btn btn-small" onClick={() => decideVerify(v, "approved")}>
                      <Icon name="verified" size={16} /> Give Verified
                    </button>
                    <button className="btn btn-small btn-outline-danger" onClick={() => decideVerify(v, "declined")}>
                      Decline
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="panel empty">
            <p>No Verified requests waiting.</p>
          </div>
        ))}

      {tab === "decided" &&
        (decided.length ? (
          <ul className="panel decided-list">
            {decided.map((d) => (
              <li key={`${d.kindOf}-${d.id}`}>
                <span className={`status-dot ${d.status === "approved" ? "on" : "off"}`}>
                  {d.status === "approved" ? "Approved" : d.status === "rejected" ? "Rejected" : "Declined"}
                </span>
                <span>
                  <strong>{d.name}</strong>
                  <span className="meta">
                    {d.kindOf === "new" ? "New business" : "Verified request"}
                    {d.reason ? ` · ${d.reason}` : ""} · {shortTime(d.at)}
                  </span>
                </span>
                {d.kindOf === "new" && (
                  <button
                    className="chip-button"
                    onClick={() =>
                      dispatch({
                        type: "decide",
                        id: d.id,
                        status: d.status === "approved" ? "rejected" : "approved",
                        reason: "Changed by the Alfa Finda team",
                      })
                    }
                  >
                    {d.status === "approved" ? "Take down" : "Approve instead"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="panel empty">
            <p>Nothing decided yet on this visit.</p>
          </div>
        ))}
      {toast}
    </>
  );
}
