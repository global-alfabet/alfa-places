import { useEffect } from "react";
import { Link, Route, Routes, useSearchParams } from "react-router-dom";
import { DashShell } from "../../components/dash/Dash.jsx";
import BusinessPhoto from "../../components/BusinessPhoto.jsx";
import { KindLabel } from "../../components/Badges.jsx";
import Icon from "../../components/Icon.jsx";
import { KINDS } from "../../lib/kinds.js";
import { useDirectory, useStore, useThreads } from "../../lib/store.js";
import { ownerOf } from "../../content/demo-dashboard.js";
import { usePageTitle } from "../../lib/usePageTitle.js";
import NotFound from "../NotFound.jsx";
import OwnerOverview from "./OwnerOverview.jsx";
import OwnerListing from "./OwnerListing.jsx";
import OwnerPhotos from "./OwnerPhotos.jsx";
import OwnerReviews from "./OwnerReviews.jsx";
import OwnerMessages from "./OwnerMessages.jsx";
import OwnerSettings from "./OwnerSettings.jsx";

// The business owner's test dashboard (Figma "Admin Dashboard", "Edit Profile", "Photo Gallery", "Manage Reviews",
// "Messages" and "Settings"). It manages one example business at a time; ?business=<id> picks which.
export default function Owner() {
  usePageTitle("Business dashboard");
  const { state, dispatch } = useStore();
  const [params, setParams] = useSearchParams();
  const examples = useDirectory(true).filter((b) => b.example);
  const wanted = examples.find((b) => b.id === params.get("business"));
  const b = wanted || examples.find((x) => x.id === state.ownerId) || examples[0];

  // ?business=<id> switches to that business once, then leaves the address so the switcher keeps working.
  useEffect(() => {
    if (!wanted) return;
    if (wanted.id !== state.ownerId) dispatch({ type: "owner", id: wanted.id });
    setParams({}, { replace: true });
  }, [wanted, state.ownerId, dispatch, setParams]);

  const [threads] = useThreads(b);
  if (!b) return <NotFound />;
  const owner = ownerOf(b);
  const unread = threads.filter((t) => t.unread && !t.archived).length;
  const toAnswer = b.reviews.filter((r) => r.rating <= 3 && !r.reply).length;

  const nav = [
    { to: "/dashboard", end: true, icon: "grid", label: "Overview" },
    { to: "/dashboard/listing", icon: "edit", label: "Listing" },
    { to: "/dashboard/photos", icon: "image", label: "Photos" },
    { to: "/dashboard/reviews", icon: "star", label: "Reviews", count: toAnswer },
    { to: "/dashboard/messages", icon: "chat", label: "Messages", count: unread },
    { to: "/dashboard/settings", icon: "settings", label: "Settings" },
  ];

  const top = (
    <div className="biz-switch">
      <div className="biz-switch-card">
        <span className="biz-switch-photo">
          <BusinessPhoto business={b} width={200} icon={28} />
        </span>
        <span>
          <strong>{b.name}</strong>
          <span className="meta">
            <KindLabel business={b} /> · {b.city}
          </span>
        </span>
      </div>
      <label className="field compact">
        <span className="sr-only">Switch business</span>
        <select value="" onChange={(e) => e.target.value && dispatch({ type: "owner", id: e.target.value })}>
          <option value="" disabled>
            Switch business (test)
          </option>
          {Object.keys(KINDS).map((k) => (
            <optgroup key={k} label={KINDS[k].plural}>
              {examples
                .filter((x) => x.kind === k)
                .map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
      </label>
    </div>
  );

  const foot = (
    <>
      <Link className="dash-link" to={`/business/${b.id}`}>
        <Icon name="eye" size={19} /> <span>View listing</span>
      </Link>
      <Link className="dash-link" to="/sign-in">
        <Icon name="logout" size={19} /> <span>Sign out</span>
      </Link>
    </>
  );

  const bar = (
    <div className="dash-bar-owner">
      <span className="dash-bar-name">
        <span className="muted">Managing</span> <strong>{b.name}</strong>
        {b.hidden && <span className="badge badge-hidden">Hidden</span>}
      </span>
      <Link className="btn btn-small btn-outline" to={`/business/${b.id}`}>
        View listing
      </Link>
    </div>
  );

  return (
    <DashShell
      variant="owner"
      label="Business dashboard"
      nav={nav}
      top={top}
      foot={foot}
      bar={bar}
      user={owner}
      closeKey={b.id}
    >
      <Routes>
        <Route index element={<OwnerOverview b={b} owner={owner} threads={threads} />} />
        <Route path="listing" element={<OwnerListing key={b.id} b={b} />} />
        <Route path="photos" element={<OwnerPhotos b={b} />} />
        <Route path="reviews" element={<OwnerReviews b={b} />} />
        <Route path="messages" element={<OwnerMessages key={b.id} b={b} />} />
        <Route path="settings" element={<OwnerSettings b={b} owner={owner} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashShell>
  );
}
