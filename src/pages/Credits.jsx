import { Link } from "react-router-dom";
import { destinations } from "../content/destinations.js";
import { businesses } from "../content/businesses.js";
import { photos } from "../content/photos.js";
import { PhotoCredit } from "../components/DestinationArt.jsx";
import { usePageTitle } from "../lib/usePageTitle.js";

export default function Credits() {
  usePageTitle("Photo credits");
  const withPhotos = destinations.filter((d) => d.photo);
  const used = new Set(businesses.flatMap((b) => [b.photos?.banner, ...(b.photos?.gallery || [])]));
  const stock = Object.entries(photos).filter(([k]) => used.has(k));
  return (
    <div className="container page narrow prose">
      <p className="eyebrow">Photo credits</p>
      <h1>The photographers behind these pictures</h1>
      <p className="lead">
        The photos of places to visit come from Wikimedia Commons, where photographers share them under free licences.
        Thank you to each of them.
      </p>
      <ul className="credits">
        {withPhotos.map((d) => (
          <li key={d.slug}>
            <Link to={`/destinations/${d.slug}`}>{d.name}</Link>
            <PhotoCredit photo={d.photo} />
          </li>
        ))}
      </ul>
      {stock.length > 0 && (
        <>
          <h2>Photos on example listings</h2>
          <p>
            While Alfa Finda is being tested, example listings use free-licensed photos that show the kind of work. They
            aren't photos of any business on Alfa Finda.
          </p>
          <ul className="credits">
            {stock.map(([k, p]) => (
              <li key={k}>
                <span>{p.alt || "Photo"}</span>
                <p className="photo-credit">
                  Photo:{" "}
                  <a href={p.page} target="_blank" rel="noreferrer">
                    {p.author}
                  </a>
                  ,{" "}
                  {p.licenseUrl ? (
                    <a href={p.licenseUrl} target="_blank" rel="noreferrer">
                      {p.license}
                    </a>
                  ) : (
                    p.license
                  )}
                  {p.source ? `, via ${p.source}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
      <p>
        Logos and illustrations on this site are by Global Alfabet. To report a credit that's wrong, email{" "}
        <a href="mailto:hello@globalalfabet.com">hello@globalalfabet.com</a>.
      </p>
    </div>
  );
}
