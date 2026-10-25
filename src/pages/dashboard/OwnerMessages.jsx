import { useState } from "react";
import { PageHead, TestNote } from "../../components/dash/Dash.jsx";
import Icon from "../../components/Icon.jsx";
import { initials, shortTime } from "../../lib/sample.js";
import { useThreads } from "../../lib/store.js";

const TABS = [
  ["all", "All"],
  ["unread", "Unread"],
  ["starred", "Starred"],
  ["archived", "Archived"],
];
const QUICK = [
  "Thanks for your message. We'll get back to you today.",
  "Can you send a photo?",
  "What's your address?",
];

// Figma "Messages": the inbox, one conversation at a time, with replies.
export default function OwnerMessages({ b }) {
  const [threads, setThreads] = useThreads(b);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState("");
  const [draft, setDraft] = useState("");

  const shown = threads
    .filter((t) => (tab === "archived" ? t.archived : !t.archived))
    .filter((t) => (tab === "unread" ? t.unread : tab === "starred" ? t.starred : true))
    .filter((t) => !q || `${t.name} ${t.messages.map((m) => m.text).join(" ")}`.toLowerCase().includes(q.toLowerCase()))
    .sort((x, y) => new Date(y.messages.at(-1).at) - new Date(x.messages.at(-1).at));
  const current = threads.find((t) => t.id === openId);

  const change = (id, fields, log) =>
    setThreads(
      threads.map((t) => (t.id === id ? { ...t, ...fields } : t)),
      log,
    );
  const open = (t) => {
    setOpenId(t.id);
    setDraft("");
    if (t.unread) change(t.id, { unread: false });
  };
  const send = (e) => {
    e.preventDefault();
    if (!draft.trim()) return;
    const message = { from: "business", text: draft.trim(), at: new Date().toISOString() };
    change(
      current.id,
      { messages: [...current.messages, message] },
      {
        business: b.id,
        icon: "chat",
        title: `You replied to ${current.name}`,
        text: draft.trim(),
      },
    );
    setDraft("");
  };

  return (
    <>
      <PageHead title="Messages" sub="Enquiries from people who found you on Alfa Finda." />
      <TestNote>
        Test inbox: sample enquiries, plus any message sent with Send a message on your listing. Replies aren't sent to
        anyone.
      </TestNote>

      <div className={`inbox panel${current ? " reading" : ""}`}>
        <div className="inbox-list">
          <label className="inbox-search">
            <Icon name="search" size={18} />
            <span className="sr-only">Search messages</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" />
          </label>
          <div className="chip-row inbox-tabs" role="group" aria-label="Show">
            {TABS.map(([v, l]) => (
              <button
                key={v}
                className={`chip-button${tab === v ? " on" : ""}`}
                aria-pressed={tab === v}
                onClick={() => setTab(v)}
              >
                {l}
                {v === "unread" && threads.some((t) => t.unread && !t.archived)
                  ? ` (${threads.filter((t) => t.unread && !t.archived).length})`
                  : ""}
              </button>
            ))}
          </div>
          {shown.length ? (
            <ul>
              {shown.map((t) => {
                const last = t.messages.at(-1);
                return (
                  <li key={t.id}>
                    <button
                      className={`thread-row${t.unread ? " unread" : ""}${t.id === openId ? " on" : ""}`}
                      onClick={() => open(t)}
                    >
                      <span className="avatar" aria-hidden="true">
                        {initials(t.name)}
                      </span>
                      <span className="thread-text">
                        <span className="thread-top">
                          <strong>{t.name}</strong>
                          <span className="meta">{shortTime(last.at)}</span>
                        </span>
                        <span className="thread-preview">
                          {last.from === "business" ? "You: " : ""}
                          {last.text}
                        </span>
                      </span>
                      {t.starred && <Icon name="star" size={14} className="thread-star" title="Starred" />}
                      {t.unread && <span className="dot" aria-label="Unread" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="muted inbox-empty">No messages here.</p>
          )}
        </div>

        <div className="inbox-thread">
          {current ? (
            <>
              <div className="thread-head">
                <button className="icon-button thread-back" aria-label="Back to messages" onClick={() => setOpenId("")}>
                  <Icon name="back" size={18} />
                </button>
                <span className="avatar" aria-hidden="true">
                  {initials(current.name)}
                </span>
                <strong>{current.name}</strong>
                <span className="thread-actions">
                  <button
                    className={`icon-button${current.starred ? " on" : ""}`}
                    aria-pressed={!!current.starred}
                    aria-label="Star"
                    onClick={() => change(current.id, { starred: !current.starred })}
                  >
                    <Icon name="star" size={18} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Mark as unread"
                    onClick={() => {
                      change(current.id, { unread: true });
                      setOpenId("");
                    }}
                  >
                    <Icon name="mail" size={18} />
                  </button>
                  <button
                    className="chip-button"
                    onClick={() => {
                      change(current.id, { archived: !current.archived });
                      setOpenId("");
                    }}
                  >
                    {current.archived ? "Move to inbox" : "Archive"}
                  </button>
                </span>
              </div>
              <ol className="bubbles">
                {current.messages.map((m, i) => (
                  <li key={i} className={m.from === "business" ? "mine" : ""}>
                    <p>{m.text}</p>
                    <span className="meta">
                      {m.from === "business" ? "You · " : ""}
                      {shortTime(m.at)}
                    </span>
                  </li>
                ))}
              </ol>
              <form className="composer" onSubmit={send}>
                <div className="chip-row">
                  {QUICK.map((x) => (
                    <button type="button" key={x} className="chip-button" onClick={() => setDraft(x)}>
                      {x}
                    </button>
                  ))}
                </div>
                <div className="composer-row">
                  <label className="sr-only" htmlFor="reply">
                    Reply
                  </label>
                  <textarea
                    id="reply"
                    rows={2}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={`Reply to ${current.name}`}
                    maxLength={1000}
                  />
                  <button className="btn btn-small" type="submit" disabled={!draft.trim()}>
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="inbox-pick">
              <Icon name="chat" size={36} />
              <p className="muted">Choose a conversation.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
