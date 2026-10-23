import { Link } from "react-router-dom";
import { usePageTitle } from "../lib/usePageTitle.js";

export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <div className="container page center not-found">
      <h1>We couldn't find that page.</h1>
      <p className="lead">It may have moved, or the address may be mistyped.</p>
      <p>
        <Link className="btn" to="/">
          Go to Alfa Finda
        </Link>
      </p>
    </div>
  );
}
