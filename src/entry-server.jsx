// Build-time entry: renders a page to HTML so search engines, AI assistants and link previews get the page's text
// without running JavaScript. Used only by scripts/prerender.js; the browser still starts from src/main.jsx, which
// replaces this HTML with the live page (createRoot), so the two never need to match exactly.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App.jsx";

export { getMeta, headTags, routes, sitemap, llmsTxt } from "./lib/seo.js";

export function render(url) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}
