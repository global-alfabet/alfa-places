import { useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { DashShell } from "../../components/dash/Dash.jsx";
import Icon from "../../components/Icon.jsx";
import { useStore } from "../../lib/store.js";
import { openReports, pendingSubmissions, verifyQueue } from "../../lib/admin.js";
import { usePageTitle } from "../../lib/usePageTitle.js";
import NotFound from "../NotFound.jsx";
import AdminOverview from "./AdminOverview.jsx";
import AdminDirectory from "./AdminDirectory.jsx";
import AdminApprovals from "./AdminApprovals.jsx";
import AdminReports from "./AdminReports.jsx";
import AdminContent from "./AdminContent.jsx";

// The Alfa Finda team's test dashboard (Figma "Super Admin Dashboard", "Business Directory Management", "Business
// Approvals" and "Content and Taxonomy Management").
export default function Admin() {
  usePageTitle("Admin");
  const { state } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const approvals = pendingSubmissions(state).length + verifyQueue(state).length;
  const reports = openReports(state).length;

  const nav = [
    { to: "/admin", end: true, icon: "grid", label: "Overview" },
    { to: "/admin/directory", icon: "store", label: "Directory" },
    { to: "/admin/approvals", icon: "check", label: "Approvals", count: approvals },
    { to: "/admin/reports", icon: "shield", label: "Reported reviews", count: reports },
    { to: "/admin/content", icon: "home", label: "Home page" },
  ];
  const foot = (
    <>
      <Link className="dash-link" to="/">
        <Icon name="globe" size={19} /> <span>View the site</span>
      </Link>
      <Link className="dash-link" to="/sign-in">
        <Icon name="logout" size={19} /> <span>Sign out</span>
      </Link>
    </>
  );
  const bar = (
    <form
      className="dash-search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        navigate(`/admin/directory?q=${encodeURIComponent(q.trim())}`);
      }}
    >
      <Icon name="search" size={18} />
      <label className="sr-only" htmlFor="admin-search">
        Search listings
      </label>
      <input
        id="admin-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search listings by name, owner or town"
      />
    </form>
  );

  return (
    <DashShell
      variant="admin"
      label="Admin"
      nav={nav}
      foot={foot}
      bar={bar}
      user={{ name: "Alfa Finda team", role: "Admin (test)" }}
    >
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="directory" element={<AdminDirectory />} />
        <Route path="approvals" element={<AdminApprovals />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashShell>
  );
}
