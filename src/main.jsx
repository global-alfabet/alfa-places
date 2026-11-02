import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import "@fontsource-variable/inter";
import "./styles/site.css";
import App from "./App.jsx";
import { site } from "./config.js";
import { initWebAnalytics } from "./lib/webAnalytics.js";

// Previews hosted under a sub-path use hash addresses (#/plan); the live site uses normal addresses.
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);

// Visit counts for everyone, without cookies. Google Analytics waits for Accept (CookieBanner).
initWebAnalytics(site.analytics.cloudflare);
