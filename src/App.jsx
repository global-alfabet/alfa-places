import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import DemoBanner from "./components/DemoBanner.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Categories from "./pages/Categories.jsx";
import Business from "./pages/Business.jsx";
import Destinations from "./pages/Destinations.jsx";
import Destination from "./pages/Destination.jsx";
import Plan from "./pages/Plan.jsx";
import AddBusiness from "./pages/AddBusiness.jsx";
import Privacy from "./pages/Privacy.jsx";
import Credits from "./pages/Credits.jsx";
import NotFound from "./pages/NotFound.jsx";
import DemoStore from "./components/DemoStore.jsx";
import CookieBanner from "./components/CookieBanner.jsx";
import { site } from "./config.js";

// The test dashboards load only when someone opens them.
const SignIn = lazy(() => import("./pages/dashboard/SignIn.jsx"));
const Owner = lazy(() => import("./pages/dashboard/Owner.jsx"));
const Admin = lazy(() => import("./pages/dashboard/Admin.jsx"));

// Scroll to the top on every new page (but not when only the search filters change).
function ScrollManager() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const inDashboard = /^\/(dashboard|admin)(\/|$)/.test(pathname);
  return (
    <DemoStore>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollManager />
      <DemoBanner />
      {!inDashboard && <Nav />}
      <main id="main">
        <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/business/:id" element={<Business />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:slug" element={<Destination />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/add-your-business" element={<AddBusiness />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/credits" element={<Credits />} />
            {site.demo && <Route path="/sign-in" element={<SignIn />} />}
            {site.demo && <Route path="/dashboard/*" element={<Owner />} />}
            {site.demo && <Route path="/admin/*" element={<Admin />} />}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!inDashboard && <Footer />}
      <CookieBanner measurementId={site.analytics.ga4} policyHref="/privacy#cookies" />
    </DemoStore>
  );
}
