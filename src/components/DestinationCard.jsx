import { Link } from "react-router-dom";
import DestinationArt from "./DestinationArt.jsx";
import Icon from "./Icon.jsx";

export default function DestinationCard({ destination: d, size = "" }) {
  return (
    <Link className={`dest-card ${size}`} to={`/destinations/${d.slug}`}>
      <div className="dest-card-art">
        <DestinationArt destination={d} />
      </div>
      <div className="dest-card-body">
        <p className="meta">
          <Icon name="pin" size={13} /> {d.location}
        </p>
        <h3>{d.name}</h3>
        <p className="dest-card-sum">{d.summary}</p>
        <p className="meta dest-card-time">
          <Icon name="clock" size={14} /> {d.duration}
        </p>
      </div>
    </Link>
  );
}
