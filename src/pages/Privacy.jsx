import { site } from "../config.js";
import { usePageTitle } from "../lib/usePageTitle.js";
import { openCookieSettings } from "../lib/consent.js";

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
        record of them.{site.analytics.ga4 ? " If you accept analytics cookies, Google Analytics counts which pages are opened (see Cookies below)." : ""}
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
        role, and we don't sell or share your details. We send a short email confirming we've received the details
        through Resend, our email provider.
      </p>

      <h2 id="cookies">Cookies and browser storage</h2>
      <p>
        <b>Saved places:</b> the places and businesses you save are kept in your browser's local storage (not a cookie)
        so they're still there next time. They never leave your device. Your location is never put in a web address.
      </p>
      {site.analytics.ga4 ? (
        <>
          <p>
            <b>Analytics:</b> we use Google Analytics to count visits and see which pages help people, but only if you
            press Accept on the cookie banner. Until then Google's code isn't loaded and no analytics cookies are set.
          </p>
          <ul>
            <li>
              <b>ga_consent</b> remembers your answer (Accept or Reject). It's needed for the banner to work, so it's set
              either way. It lasts 6 months, then we ask again. It's set for globalalfabet.com, so one answer covers all
              Global Alfabet sites, including Alfa Maps and Alfa Shop.
            </li>
            <li>
              <b>_ga</b> and <b>_ga_&lt;ID&gt;</b> are Google Analytics cookies. They tell visits apart so they can be
              counted. They're set only after you accept, and last up to 13 months.
            </li>
          </ul>
          <p>
            <b>What's measured:</b> the pages you open (including search words in the page address), how you arrived,
            your approximate region (worked out from your IP address, which Google Analytics doesn't store), your type of
            device and browser, and clicks on email, phone and WhatsApp links. We never send Google your name, email,
            phone number, your location or anything you type into the Add your business form. Google signals and
            advertising features are off.
          </p>
          <p>
            Google processes this data for us as our processor, under its data processing terms, and may process it
            outside your country. We keep the reports for no longer than 14 months.
          </p>
          <p>
            <b>Changing your mind:</b> choose{" "}
            <button type="button" className="inline-link" onClick={openCookieSettings}>
              Cookie settings
            </button>{" "}
            (also at the bottom of every page). If you reject after accepting, we stop measuring straight away and delete
            the Google Analytics cookies. If your browser sends Global Privacy Control, we treat that as Reject unless you
            accept in Cookie settings.
          </p>
        </>
      ) : (
        <p>
          <b>Cookies:</b> Alfa Finda doesn't set cookies, and doesn't use analytics, advertising or tracking tools.
        </p>
      )}

      <h2>Changes and removal</h2>
      <p>
        To change or remove a listing, or to ask what we hold about you, email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </div>
  );
}
