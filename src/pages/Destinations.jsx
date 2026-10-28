import { useState } from "react";
import DestinationCard from "../components/DestinationCard.jsx";
import { destinations, interests } from "../content/destinations.js";
import { usePageTitle } from "../lib/usePageTitle.js";

export default function Destinations() {
  usePageTitle(
    "Places to visit",
    "Waterfalls, national parks, ancient stone cities and mountains: places worth the trip.",
  );
  const [only, setOnly] = useState("");
  const list = only ? destinations.filter((d) => d.interests.includes(only)) : destinations;
  const used = interests.filter((i) => destinations.some((d) => d.interests.includes(i.id)));
  return (
    <div className="container page">
      <div className="page-head">
        <p className="eyebrow">Places to visit</p>
        <h1>Places worth the trip.</h1>
        <p className="lead">Waterfalls, wildlife, granite hills, an ancient stone city and cool mountains.</p>
      </div>
      <div className="chip-filter" role="group" aria-label="Filter by interest">
        <button className={only ? "" : "on"} aria-pressed={!only} onClick={() => setOnly("")}>
          All
        </button>
        {used.map((i) => (
          <button
            key={i.id}
            className={only === i.id ? "on" : ""}
            aria-pressed={only === i.id}
            onClick={() => setOnly(only === i.id ? "" : i.id)}
          >
            {i.label}
          </button>
        ))}
      </div>
      <div className="dest-grid">
        {list.map((d) => (
          <DestinationCard key={d.slug} destination={d} />
        ))}
      </div>
    </div>
  );
}
