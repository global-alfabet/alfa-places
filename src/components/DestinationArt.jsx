import { useState } from "react";
import Scene from "./Scene.jsx";

// A destination's photo, or its drawn illustration when there's no photo or the photo fails to load.
// Photos load from the sites that host them, so send no referrer: some sites block images shown elsewhere.
export default function DestinationArt({ destination: d, eager = false }) {
  const [failed, setFailed] = useState(false);
  if (!d.photo || failed) return <Scene kind={d.scene} label={`Illustration of ${d.name}`} />;
  return (
    <img
      className="dest-photo"
      src={d.photo}
      alt={d.name}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}
