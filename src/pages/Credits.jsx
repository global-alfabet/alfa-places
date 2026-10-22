import { Link } from "react-router-dom";
import { destinations } from "../content/destinations.js";
import { PhotoCredit } from "../components/DestinationArt.jsx";
import { usePageTitle } from "../lib/usePageTitle.js";

export default function Credits() {
  usePageTitle("Photo credits");
  const withPhotos = destinations.filter((d) => d.photo);
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
      <p>
        Logos and illustrations on this site are by Global Alfabet. To report a credit that's wrong, email{" "}
        <a href="mailto:hello@globalalfabet.com">hello@globalalfabet.com</a>.
      </p>
    </div>
  );
}
