import { Link } from "react-router-dom";
import { PageHead, TestNote } from "../../components/dash/Dash.jsx";
import { useToast } from "../../components/dash/useToast.jsx";
import Stars from "../../components/Stars.jsx";
import { useDirectory, useStore } from "../../lib/store.js";
import { allReports } from "../../lib/admin.js";
import { shortTime } from "../../lib/sample.js";

// Reported reviews: keep them, or remove them from the listing.
export default function AdminReports() {
  const { state, dispatch } = useStore();
  const all = useDirectory(true);
  const [toast, setToast] = useToast();
  const reports = allReports(state)
    .map((r) => {
      const b = all.find((x) => x.id === r.business);
      const review = b && [...b.reviews, ...b.removedReviews].find((x) => x.key === r.review);
      return review ? { ...r, b, review } : null;
    })
    .filter(Boolean)
    .sort((x, y) => Number(!!x.status) - Number(!!y.status) || y.at.localeCompare(x.at));

  const decide = (r, status) => {
    dispatch({
      type: "report",
      id: r.id,
      key: r.review.key,
      status,
      log: {
        business: r.b.id,
        icon: "shield",
        title:
          status === "removed"
            ? `Review by ${r.review.name} removed`
            : status === "kept"
              ? `Review by ${r.review.name} kept`
              : "Report reopened",
        text: `On ${r.b.name}.`,
      },
    });
    if (status)
      setToast({
        title: status === "removed" ? "Review removed" : "Review kept",
        text: status === "removed" ? "It no longer shows on the listing." : undefined,
        link: { to: `/business/${r.b.id}#reviews`, label: "View listing" },
      });
  };

  return (
    <>
      <PageHead
        title="Reported reviews"
        sub="Remove reviews that break the rules. Keep honest ones, even when they're negative."
      />
      <TestNote>
        Test admin: the reviews and reports are samples. Reports a business sends from its dashboard land here.
      </TestNote>

      {reports.length ? (
        <ul className="approval-list">
          {reports.map((r) => (
            <li key={r.id} className={`panel approval${r.status ? " done" : ""}`}>
              <div className="report-head">
                <span>
                  <Link to={`/business/${r.b.id}#reviews`}>
                    <strong>{r.b.name}</strong>
                  </Link>
                  <span className="meta">
                    Reported by {r.by.toLowerCase()} · {shortTime(r.at)}
                  </span>
                </span>
                {r.status && (
                  <span className={`status-dot ${r.status === "kept" ? "on" : "off"}`}>
                    {r.status === "kept" ? "Kept" : "Removed"}
                  </span>
                )}
              </div>
              <p className="report-reason">“{r.reason}”</p>
              <blockquote className="reported-review">
                <span className="reported-meta">
                  <Stars rating={r.review.rating} size={14} /> <strong>{r.review.name}</strong>
                </span>
                <p>{r.review.text}</p>
              </blockquote>
              <div className="approval-actions">
                {r.status ? (
                  <button className="chip-button" onClick={() => decide(r, undefined)}>
                    Undo
                  </button>
                ) : (
                  <>
                    <button className="btn btn-small" onClick={() => decide(r, "kept")}>
                      Keep review
                    </button>
                    <button className="btn btn-small btn-outline-danger" onClick={() => decide(r, "removed")}>
                      Remove review
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="panel empty">
          <p>No reported reviews.</p>
        </div>
      )}
      {toast}
    </>
  );
}
