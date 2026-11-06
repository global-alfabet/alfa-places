// The privacy notice's "Advertising with Meta" part, shown only when the site has a Meta Pixel ID (analytics.metaPixel
// in src/config.js). Wording drafted by legal (hq: work/legal/meta-pixel-privacy.md, section 3) and approved by Julius
// before the ID goes in. The same file on every Global Alfabet website; each site passes what Meta receives and why.
//
// Left out until they're checked (legal's [bracketed] facts): how many days people stay in our ad audiences (Julius
// sets it in Ads Manager), and how long _fbp and _fbc last (check in the browser once the pixel runs). Add them here
// then: "People stay in these ad audiences for up to N days after their last visit." and "Lasts N days." per cookie.
export default function MetaPixelNotice({ receives, why }) {
  return (
    <>
      <h3 id="advertising">Advertising with Meta</h3>
      <p>
        If you allow advertising on the cookie banner, we use the Meta Pixel, a small piece of code from Meta, the
        company behind Facebook and Instagram. Until you allow it, Meta's code isn't loaded and our site sets no Meta
        cookies.
      </p>
      <p>
        <b>What Meta receives:</b> {receives}
      </p>
      <p>
        <b>Why:</b> {why}
      </p>
      <p>
        <b>Who is responsible:</b> Global Alfabet and Meta are jointly responsible for collecting this data on our
        website and sending it to Meta (for visitors in the EU and EEA, Meta Platforms Ireland Limited; in the UK, Meta
        Platforms, Inc.). When Meta measures our ads, it does so for us. Meta also uses the data for its own purposes,
        such as delivering and improving ads, as a separate company in charge of that data, under the{" "}
        <a href="https://www.facebook.com/privacy/policy/">Meta Privacy Policy</a>. Meta explains the joint arrangement{" "}
        <a href="https://www.facebook.com/legal/terms/businesstools_jointprocessing">here</a>. Meta may process the data
        outside your country, including in the United States.
      </p>
      <p>
        <b>Meta cookies:</b>
      </p>
      <ul>
        <li>
          <b>_fbp</b> tells your browser apart from others, so Meta can count visits and measure our ads. Set only if you
          allow advertising.
        </li>
        <li>
          <b>_fbc</b> is set only if you arrive by tapping one of our Meta ads, and records which ad. Set only if you allow
          advertising.
        </li>
        <li>
          <b>Meta's own cookies</b> on facebook.com, such as fr, are set by Meta when you use Facebook or Instagram. If your
          browser allows them, they reach Meta with our events. They're explained in{" "}
          <a href="https://www.facebook.com/privacy/policies/cookies/">Meta's Cookies Policy</a>; we can't change or delete
          them.
        </li>
      </ul>
      <p>
        <b>Ad choices outside our site:</b> in Facebook or Instagram, open Accounts Center, then Ad preferences, to stop
        Meta using information from ad partners like us to choose your ads; and Your information and permissions, then
        Your activity off Meta technologies, to see and disconnect what websites share with Meta. You can also use{" "}
        <a href="http://www.aboutads.info/choices">aboutads.info/choices</a> or{" "}
        <a href="http://www.youronlinechoices.eu/">youronlinechoices.eu</a>.
      </p>
    </>
  );
}
