import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead, Switch, TestNote } from "../../components/dash/Dash.jsx";
import { useToast } from "../../components/dash/useToast.jsx";
import Icon from "../../components/Icon.jsx";
import Modal from "../../components/Modal.jsx";
import { useStore } from "../../lib/store.js";
import { verificationRequests } from "../../content/demo-dashboard.js";

// Figma "Settings": account, notifications, the Verified badge and hiding the listing.
export default function OwnerSettings({ b, owner }) {
  const { state, dispatch } = useStore();
  const [note, setNote] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useToast();
  const prefs = state.notifications[b.id] || { messages: true, reviews: true, weekly: false };
  const setPref = (k) => (v) => dispatch({ type: "notifications", id: b.id, value: { ...prefs, [k]: v } });
  const request =
    state.verify[b.id] || (verificationRequests.some((r) => r.id === b.id) ? { status: "requested" } : null);

  const ask = (e) => {
    e.preventDefault();
    dispatch({
      type: "verify",
      id: b.id,
      status: "requested",
      note: note.trim(),
      log: {
        business: b.id,
        icon: "verified",
        title: "You asked for Verified",
        text: "The Alfa Finda team will check your registration.",
      },
    });
    setToast({ title: "Request sent", text: "It's in the admin dashboard's Approvals." });
  };

  return (
    <>
      <PageHead title="Settings" />
      <TestNote>Test mode: settings last until you reload the page, and no emails are sent.</TestNote>

      <section className="panel form-panel">
        <h2>
          <Icon name="user" size={20} /> Account
        </h2>
        <div className="row">
          <label className="field">
            <span>Name</span>
            <input value={owner.name} readOnly />
          </label>
          <label className="field">
            <span>Role</span>
            <input value={owner.role} readOnly />
          </label>
        </div>
        <label className="field">
          <span>Email</span>
          <input value={owner.email} readOnly />
        </label>
        <p className="muted">Accounts, passwords and team members arrive with the Global Alfabet Account.</p>
      </section>

      <section className="panel form-panel">
        <h2>
          <Icon name="bell" size={20} /> Email me when
        </h2>
        <Switch checked={prefs.messages} onChange={setPref("messages")} label="Someone sends a message" />
        <Switch checked={prefs.reviews} onChange={setPref("reviews")} label="Someone writes a review" />
        <Switch
          checked={prefs.weekly}
          onChange={setPref("weekly")}
          label="Weekly summary"
          hint="Views, enquiries and new reviews."
        />
      </section>

      <section className="panel form-panel" id="verified">
        <h2>
          <Icon name="verified" size={20} /> Verified badge
        </h2>
        {b.verified ? (
          <p>
            <span className="badge badge-verified">Verified</span> Alfa Finda checked your company registration. The
            badge shows on your listing and in search, and verified listings come first in Recommended results.
          </p>
        ) : request?.status === "requested" ? (
          <p>
            <strong>Request sent.</strong> The Alfa Finda team is checking your registration. Open the{" "}
            <Link to="/admin/approvals">admin dashboard</Link> to approve it while testing.
          </p>
        ) : request?.status === "declined" ? (
          <p>
            <strong>Not approved yet.</strong> We couldn't match your registration. Email us your certificate and we'll
            look again.
          </p>
        ) : b.kind === "company" ? (
          <form className="form" onSubmit={ask}>
            <p className="muted">
              For registered companies. Tell us your registration number, and we check it before adding the badge.
            </p>
            <label className="field">
              <span>Company registration number (test: anything works)</span>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="For example 1234/2024"
                maxLength={40}
              />
            </label>
            <button className="btn btn-small" type="submit" disabled={!note.trim()}>
              Ask for Verified
            </button>
          </form>
        ) : (
          <p className="muted">
            Verified is for registered companies. If you've registered one, change your type of business to Company on
            the <Link to="/dashboard/listing">Listing</Link> page, then ask here.
          </p>
        )}
      </section>

      <section className="panel form-panel danger-zone">
        <h2>
          <Icon name="eye" size={20} /> Visibility
        </h2>
        <Switch
          checked={!b.hidden}
          onChange={(v) =>
            dispatch({
              type: "edit",
              id: b.id,
              fields: { hidden: !v },
              log: {
                business: b.id,
                icon: "eye",
                title: v ? "Listing is live" : "Listing hidden",
                text: v ? "People can find you again." : "Your listing is out of search.",
              },
            })
          }
          label="Live on Alfa Finda"
          hint="Switch off to hide your listing from search and categories."
        />
        <button className="btn btn-small btn-danger" onClick={() => setDeleting(true)}>
          Delete listing
        </button>
      </section>

      <Modal open={deleting} onClose={() => setDeleting(false)} title="Delete listing">
        <p>Example listings can't be deleted. A real business emails us to have its listing removed.</p>
        <button className="btn" onClick={() => setDeleting(false)}>
          OK
        </button>
      </Modal>
      {toast}
    </>
  );
}
