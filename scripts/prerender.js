// Runs after `vite build`: writes one HTML file per page (its own title, description, canonical address, share tags
// and structured data, with the page's text already in it), plus 404.html, sitemap.xml and llms.txt.
// Netlify serves /destinations from destinations.html and any unknown address from 404.html (with a 404 status).
// New pages and listings need nothing here: the list of addresses comes from src/lib/seo.js.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const dist = resolve("dist");
const ssrDir = resolve("dist-ssr");

if (process.env.VITE_HASH_ROUTER) {
  // Sub-path previews use hash addresses (#/plan), so there is nothing to prerender.
  rmSync(ssrDir, { recursive: true, force: true });
  console.log("Prerender skipped (hash router preview).");
  process.exit(0);
}

const { render, getMeta, headTags, routes, sitemap, llmsTxt } = await import(
  pathToFileURL(join(ssrDir, "entry-server.js")).href
);

const template = readFileSync(join(dist, "index.html"), "utf8");
const HEAD = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
const ROOT = '<div id="root"></div>';
if (!HEAD.test(template) || !template.includes(ROOT)) {
  throw new Error('index.html needs <!--seo:start--> ... <!--seo:end--> in <head> and an empty <div id="root"></div>.');
}

const page = (url) =>
  template.replace(HEAD, headTags(getMeta(url))).replace(ROOT, `<div id="root">${render(url)}</div>`);

function write(file, content) {
  const path = join(dist, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

for (const url of routes) write(url === "/" ? "index.html" : `${url.slice(1)}.html`, page(url));
write("404.html", page("/404"));
write("sitemap.xml", sitemap());
write("llms.txt", llmsTxt());

rmSync(ssrDir, { recursive: true, force: true });
console.log(`Prerendered ${routes.length} pages and 404.html; wrote sitemap.xml and llms.txt.`);
