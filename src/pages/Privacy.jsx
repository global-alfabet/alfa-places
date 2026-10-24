import { site } from "../config.js";
import { usePageTitle } from "../lib/usePageTitle.js";

export default function Privacy() {
  usePageTitle("Privacy");
  return (
    <div className="container page narrow prose">
      <p className="eyebrow">Privacy</p>
      <h1>Your privacy on Alfa Finda</h1>
      <p className="lead">Alfa Finda is run by {site.parent.name}. We collect as little as we can.</p>

      <h2>Browsing and searching</h2>
      <p>
        You don't need an account. We don't use advertising trackers. Searches run in your browser, and we don't keep a
        record of them.
      </p>

      <h2>Saved places and trip plans</h2>
      <p>
        Places you save for a trip are kept in your own browser, on your device. We never receive them. Clearing your
        browser's site data removes them. A trip plan link only contains the choices you made (interests, days, budget
        and starting town).
      </p>

      <h2>Adding a business</h2>
      <p>
        When you add a business, we receive the details in the form: the business details, how customers reach it, and
        your name and role. The form is handled by our hosting provider, Netlify. We use the details to review the
        listing, contact you about it, and publish the business details you gave us. We don't publish your own name or
        role, and we don't sell or share your details.
      </p>

      <h2>Changes and removal</h2>
      <p>
        To change or remove a listing, or to ask what we hold about you, email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </div>
  );
}
