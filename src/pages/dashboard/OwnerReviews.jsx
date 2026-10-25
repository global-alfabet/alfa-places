import { useState } from "react";
import { PageHead, StatCard, TestNote } from "../../components/dash/Dash.jsx";
import { BarList } from "../../components/dash/Charts.jsx";
import { useToast } from "../../components/dash/useToast.jsx";
import Icon from "../../components/Icon.jsx";
import Modal from "../../components/Modal.jsx";
import Stars from "../../components/Stars.jsx";
import { initials, ratingSpread, shortTime } from "../../lib/sample.js";
import { timeAgo } from "../../lib/time.js";
import { useStore } from "../../lib/store.js";

const FILTERS = [
  ["all", "All"],
  ["reply", "Needs a reply"],
  ["5", "5 stars"],
  ["4", "4 stars"],
  ["3", "3 stars"],
  ["low", "1–2 stars"],
];
const REASONS = [
  "This isn't a real customer",
  "It's about a different business",
  "Rude or hateful language",
  "It shares private details",
];

// The spread of stars for the review count, never fewer at a star than the reviews shown here.
function spread(b) {
  const rows = ratingSpread(b.rating, b.reviewCount);
  const total = rows.reduce((n, r) => n + r.count, 0);
  if (!total) return rows;
  rows.forEach((r) => {
    const shown = b.reviews.filter((x) => x.rating === r.stars).length;
    if (r.count < shown) {
      rows[0].count -= shown - r.count;
      r.count = shown;
    }
  });
  return rows.map((r) => ({ ...r, share: r.count / total }));
}

// Figma "Manage Reviews": the rating summary, filters, and a reply to each review.
export default function OwnerReviews({ b }) {
  const { state, dispatch } = useStore();
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [replying, setReplying] = useState("");
  const [draft, setDraft] = useState("");
  const [reporting, setReporting] = useState(null);
  const [reason, setReason] = useState(REASONS[0]);
  const [toast, setToast] = useToast();

  const reported = new Set(state.newReports.filter((r) => r.business === b.id).map((r) => r.review));
  const needsReply = (r) => r.rating <= 3 && !r.reply;
  const list = b.reviews
    .filter((r) =>
      filter === "all"
        ? true
        : filter === "reply"
          ? needsReply(r)
          : filter === "low"
            ? r.rating <= 2
            : r.rating === Number(filter),
    )
    .sort((x, y) =>
      sort === "lowest"
        ? x.rating - y.rating || y.date.localeCompare(x.date)
        : sort === "highest"
          ? y.rating - x.rating || y.date.localeCompare(x.date)
          : y.date.localeCompare(x.date),
    );
  const replied = b.reviews.filter((r) => r.reply).length;

  const startReply = (r) => {
    setReplying(r.key);
    setDraft(r.reply?.text || "");
  };
  const postReply = (r) => {
    dispatch({
      type: "reply",
      key: r.key,
      text: draft.trim(),
      log: { business: b.id, icon: "chat", title: `You replied to ${r.name}`, text: draft.trim() },
    });
    setReplying("");
    setToast({
      title: "Reply posted",
      text: "It shows under the review on your listing.",
      link: { to: `/business/${b.id}#reviews`, label: "View" },
    });
  };
  const sendReport = () => {
    dispatch({
      type: "newReport",
      report: { id: `n-${reporting.key}`, business: b.id, review: reporting.key, by: "The business", reason },
      log: { business: b.id, icon: "shield", title: `You reported ${reporting.name}'s review`, text: reason },
    });
    setReporting(null);
    setToast({ title: "Report sent", text: "The Alfa Finda team will look at it." });
  };

  return (
    <>
      <PageHead
        title="Reviews"
        sub="Thank happy customers and answer the unhappy ones. Replies show on your listing."
      />
      <TestNote>
        Test mode: ratings and reviews on example listings are samples. Reviews written on your listing appear here
        until you reload the page.
      </TestNote>

      <div className="reviews-top">
        <section className="panel rating-panel">
          <h2>Customer rating</h2>
          <div className="rating-big">
            <strong>{b.rating ? b.rating.toFixed(1) : "–"}</strong>
            <div>
              <Stars rating={b.rating || 0} size={18} />
              <p className="muted">{b.reviewCount || 0} reviews</p>
            </div>
          </div>
          <BarList
            title="Reviews by star rating"
            max={1}
            rows={spread(b).map((r) => ({
              label: `${r.stars} ★`,
              value: r.share,
              display: r.count && r.share < 0.01 ? "<1%" : `${Math.round(r.share * 100)}%`,
            }))}
          />
        </section>
        <div className="stat-grid two">
          <StatCard
            icon="chat"
            label="Replied to"
            value={`${replied} of ${b.reviews.length}`}
            note="Reviews shown on your listing"
          />
          <StatCard
            icon="bell"
            label="Need a reply"
            value={b.reviews.filter(needsReply).length}
            note="3 stars or fewer, not answered yet"
          />
        </div>
      </div>

      <div className="review-tools">
        <div className="chip-row" role="group" aria-label="Show">
          {FILTERS.map(([v, l]) => (
            <button
              key={v}
              className={`chip-button${filter === v ? " on" : ""}`}
              aria-pressed={filter === v}
              onClick={() => setFilter(v)}
            >
              {l}
            </button>
          ))}
        </div>
        <label className="field compact inline">
          <span>Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="lowest">Lowest rating</option>
            <option value="highest">Highest rating</option>
          </select>
        </label>
      </div>

      {list.length ? (
        <ul className="manage-reviews">
          {list.map((r) => (
            <li key={r.key} className={`panel${needsReply(r) ? " attention" : ""}`}>
              <div className="review-head">
                <span className="avatar" aria-hidden="true">
                  {initials(r.name)}
                </span>
                <div>
                  <strong>{r.name}</strong>
                  <p className="meta">{r.mine ? "Just now" : timeAgo(r.date)}</p>
                </div>
                <span className="review-stars" aria-label={`${r.rating} out of 5`}>
                  <Stars rating={r.rating} size={16} />
                </span>
              </div>
              {needsReply(r) && <span className="badge badge-attention">Needs a reply</span>}
              <p className="review-text">“{r.text}”</p>

              {r.reply && replying !== r.key && (
                <div className="owner-reply">
                  <p className="owner-reply-head">
                    <strong>Your reply</strong> <span className="meta">{shortTime(r.reply.at)}</span>
                  </p>
                  <p>{r.reply.text}</p>
                </div>
              )}

              {replying === r.key ? (
                <div className="reply-box">
                  <label className="field">
                    <span>Reply to {r.name}</span>
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={3}
                      maxLength={500}
                      autoFocus
                    />
                  </label>
                  <div className="reply-actions">
                    <button className="btn btn-small" disabled={!draft.trim()} onClick={() => postReply(r)}>
                      Post reply
                    </button>
                    <button className="btn btn-small btn-secondary" onClick={() => setReplying("")}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="reply-actions">
                  <button className={`btn btn-small${r.reply ? " btn-secondary" : ""}`} onClick={() => startReply(r)}>
                    <Icon name={r.reply ? "edit" : "chat"} size={16} /> {r.reply ? "Edit reply" : "Reply"}
                  </button>
                  {r.reply && (
                    <button
                      className="link-button"
                      onClick={() =>
                        dispatch({
                          type: "reply",
                          key: r.key,
                          text: "",
                          log: {
                            business: b.id,
                            icon: "chat",
                            title: "Reply deleted",
                            text: `Your reply to ${r.name}`,
                          },
                        })
                      }
                    >
                      Delete reply
                    </button>
                  )}
                  {reported.has(r.key) ? (
                    <span className="meta">Reported</span>
                  ) : (
                    <button className="link-button muted-link" onClick={() => setReporting(r)}>
                      Report
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="panel empty">
          <p>No reviews match.</p>
        </div>
      )}

      {b.removedReviews?.length > 0 && (
        <section className="removed-reviews">
          <h2>Removed by Alfa Finda</h2>
          <ul>
            {b.removedReviews.map((r) => (
              <li key={r.key} className="muted">
                {r.name}, {r.rating} {r.rating === 1 ? "star" : "stars"}: “{r.text}”
              </li>
            ))}
          </ul>
        </section>
      )}

      <Modal open={!!reporting} onClose={() => setReporting(null)} title="Report a review">
        {reporting && (
          <div className="form">
            <p>
              The Alfa Finda team checks every report. We remove reviews that break the rules, not reviews that are
              simply negative.
            </p>
            <blockquote className="message-preview">“{reporting.text}”</blockquote>
            <label className="field">
              <span>Why are you reporting it?</span>
              <select value={reason} onChange={(e) => setReason(e.target.value)}>
                {REASONS.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <button className="btn" onClick={sendReport}>
              Send report
            </button>
          </div>
        )}
      </Modal>
      {toast}
    </>
  );
}
