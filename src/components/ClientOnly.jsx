import { useEffect, useState } from "react";

// Shows its children only in the browser, once the page has started; until then (and in the build's prerender) it
// shows the fallback. The prerender (renderToString) can't wait for lazy-loaded parts such as the map or the test
// dashboards: without this, React writes an error into the page's HTML instead.
export default function ClientOnly({ children, fallback = null }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready ? children : fallback;
}
