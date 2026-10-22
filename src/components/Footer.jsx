import { Link } from "react-router-dom";
import { site } from "../config.js";
import { asset } from "../lib/asset.js";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cols">
          <div>
            <h3>Explore</h3>
            <ul>
              <li>
                <Link to="/destinations">Places to visit</Link>
              </li>
              <li>
                <Link to="/plan">Plan a trip</Link>
              </li>
              <li>
                <Link to="/search">Search</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Businesses</h3>
            <ul>
              <li>
                <Link to="/categories">All categories</Link>
              </li>
              <li>
                <Link to="/add-your-business">Add your business</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Global Alfabet</h3>
            <ul>
              <li>
                <a href={site.parent.url}>About Global Alfabet</a>
              </li>
              <li>
                <a href={site.maps}>Alfa Maps</a>
              </li>
              <li>
                <Link to="/privacy">Privacy</Link>
              </li>
              <li>
                <Link to="/credits">Photo credits</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Talk to us</h3>
            <ul>
              <li>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer">
                  WhatsApp {site.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-base">
          <img src={asset("/global-alfabet-glyph-black.svg")} alt="" height="14" />
          <span>
            Alfa Places is a <a href={site.parent.url}>{site.parent.name}</a> product. © {new Date().getFullYear()}
          </span>
          <span className="footer-note">Listings marked Example aren't real businesses.</span>
        </div>
      </div>
    </footer>
  );
}
