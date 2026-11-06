import { site } from "../config.js";
import { usePageTitle } from "../lib/usePageTitle.js";
import { openCookieSettings } from "../lib/consent.js";
import MetaPixelNotice from "../components/MetaPixelNotice.jsx";

// What Alfa Finda actually does. The cookie part follows src/config.js: Google Analytics only when a measurement ID is
// set, and the Meta Pixel (legal's draft wording, for Julius to approve) only when a pixel ID is set. The pixel runs
// only on the pages in analytics.metaPixelPages: keep the wording below in step with that list.
export default function Privacy() {
  usePageTitle("Privacy");
  const ga = !!site.analytics.ga4;
  const ads = !!site.analytics.metaPixel;
  return (
    <div className="container page narrow prose">
      <p className="eyebrow">Privacy</p>
      <h1>Your privacy on Alfa Finda</h1>
      <p className="lead">Alfa Finda is run by {site.parent.name}. We collect as little as we can.</p>

      <h2>Browsing and searching</h2>
      {ads ? (
        <p>
          You don't need an account. Searches run in your browser, and we don't keep a record of them. If you allow
          advertising cookies, Meta is told which of our general pages you open, but never your searches, the businesses
          you look at or your trip plans (see Cookies below).
          {ga
            ? " If you allow analytics cookies, Google Analytics counts which pages are opened and a few actions, such as the category a search matched (see Cookies below)."
            : ""}
        </p>
      ) : (
        <p>
          You don't need an account. We don't use advertising trackers. Searches run in your browser, and we don't keep
          a record of them.
          {ga
            ? " If you accept analytics cookies, Google Analytics counts which pages are opened and a few actions, such as the category a search matched (see Cookies below)."
            : ""}
        </p>
      )}

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
        {ads ? " If you allowed advertising cookies, Meta is told that the form was sent, not what was in it." : ""} We
        send a short email confirming we've received the details through Resend, our email provider.
      </p>

      <h2 id="cookies">Cookies and browser storage</h2>
      <p>
        <b>Saved places:</b> the places and businesses you save are kept in your browser's local storage (not a cookie)
        so they're still there next time. They never leave your device. Your location is never put in a web address.
      </p>
      {site.analytics.cloudflare && (
        <p>
          <b>Visit counts, without cookies:</b> we use Cloudflare Web Analytics to count visits, whatever you choose on
          the cookie banner. It sets no cookies, stores nothing on your device and doesn't follow you to other websites.
          It records the page address you open, the site you came from, your country, your type of device and browser,
          and how fast the page loaded. Cloudflare does this for us and may process it outside your country.
        </p>
      )}
      {ga || ads ? (
        <>
          {ga && (
            <p>
              <b>Analytics:</b> we use Google Analytics to count visits and see which pages help people, but only if you
              {ads ? " allow analytics" : " press Accept"} on the cookie banner. Until then Google's code isn't loaded
              and no analytics cookies are set.
            </p>
          )}
          <ul>
            {ga &&
              (ads ? (
                <li>
                  <b>ga_consent</b> remembers your answer about analytics. It's needed for the banner to work, so it's
                  set either way. It lasts 6 months, then we ask again. It's set for globalalfabet.com, so one answer
                  covers all Global Alfabet sites, including Alfa Maps and Alfa Shop.
                </li>
              ) : (
                <li>
                  <b>ga_consent</b> remembers your answer (Accept or Reject). It's needed for the banner to work, so
                  it's set either way. It lasts 6 months, then we ask again. It's set for globalalfabet.com, so one
                  answer covers all Global Alfabet sites, including Alfa Maps and Alfa Shop.
                </li>
              ))}
            {ads && (
              <li>
                <b>ad_consent</b> remembers your answer about advertising, in the same way. It lasts 6 months and covers
                the Global Alfabet websites.
              </li>
            )}
            {ga && (
              <li>
                <b>_ga</b> and <b>_ga_&lt;ID&gt;</b> are Google Analytics cookies. They tell visits apart so they can be
                counted. They're set only after you {ads ? "allow analytics" : "accept"}, and last up to 13 months.
              </li>
            )}
          </ul>
          {ga && (
            <>
              <p>
                <b>What's measured:</b> the pages you open (including search words in the page address), how you
                arrived, your approximate region (worked out from your IP address, which Google Analytics doesn't
                store), your type of device and browser, clicks on email, phone and WhatsApp links, our main buttons and
                links to our other sites, which businesses you open, the category a search matched and whether it named
                a town, places and businesses you save, how many days a trip plan covers, and that the Add your business
                form was sent. We never send Google your name, email, phone number, your location or anything you type
                into the Add your business form. Google signals and advertising features are off.
              </p>
              <p>
                Google processes this data for us as our processor, under its data processing terms, and may process it
                outside your country. We keep the reports for no longer than 14 months.
              </p>
            </>
          )}
          {ads && (
            <MetaPixelNotice
              receives="the address of each page you open on our home, categories, places to visit and Add your business pages, the page you came from, your IP address, details of your device and browser, and an ID kept in a cookie (_fbp). We don't load Meta's code on search results, business pages or trip plans. When you send the Add your business form, we tell Meta that a form was sent, not what was in it. If you're signed in to Facebook or Instagram in the same browser, Meta can link the visit to your account. We never send Meta your name, email, phone number, your location or anything you type into a form, and we've switched off Meta's automatic collection of button clicks and page details."
              why="to see whether our ads on Facebook and Instagram bring people to our websites and lead businesses to add a listing, and to show our ads again to people who have visited, on Facebook, Instagram and other apps where Meta shows ads."
            />
          )}
          <p>
            <b>Changing your mind:</b> choose{" "}
            <button type="button" className="inline-link" onClick={openCookieSettings}>
              Cookie settings
            </button>{" "}
            {ads
              ? "(also at the bottom of every page). You can switch analytics and advertising on or off separately. If you turn either off, we stop straight away and delete its cookies from our site (Google Analytics: _ga; Meta: _fbp and _fbc). What Meta already received stays with Meta under its policy. If your browser sends Global Privacy Control, we treat that as no to both, unless you allow them in Cookie settings."
              : "(also at the bottom of every page). If you reject after accepting, we stop measuring straight away and delete the Google Analytics cookies. If your browser sends Global Privacy Control, we treat that as Reject unless you accept in Cookie settings."}
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
