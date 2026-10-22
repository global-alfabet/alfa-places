import { useState } from "react";
import Scene from "./Scene.jsx";

// A destination's photo, or its drawn illustration when there's no photo or the photo fails to load.
// Photos are free-licensed and hosted on Wikimedia Commons: the browser picks the 960px or the large copy.
export default function DestinationArt({ destination: d, eager = false, sizes = "(max-width: 760px) 100vw, 400px" }) {
  const [failed, setFailed] = useState(false);
  if (!d.photo || failed) return <Scene kind={d.scene} label={`Illustration of ${d.name}`} />;
  return (
    <img
      className="dest-photo"
      src={d.photo.small}
      srcSet={`${d.photo.small} 960w, ${d.photo.large} 1920w`}
      sizes={sizes}
      alt={d.photo.caption || d.name}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

// "Photo: Bernard Gagnon, CC BY-SA 4.0". The licences ask for the author and licence next to the photo.
export function PhotoCredit({ photo, className = "" }) {
  if (!photo) return null;
  return (
    <p className={`photo-credit ${className}`}>
      {photo.caption}. Photo:{" "}
      <a href={photo.source} target="_blank" rel="noreferrer">
        {photo.author}
      </a>
      ,{" "}
      <a href={photo.licenseUrl} target="_blank" rel="noreferrer">
        {photo.license}
      </a>
    </p>
  );
}
