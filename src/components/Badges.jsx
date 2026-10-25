import Icon from "./Icon.jsx";
import { KINDS, isTopRated } from "../lib/kinds.js";

export function KindLabel({ business: b }) {
  const k = KINDS[b.kind];
  if (!k) return null;
  return (
    <span className="kind">
      <Icon name={k.icon} size={14} /> {k.label}
    </span>
  );
}

/** The badges a listing has earned, in a fixed order. `only` limits them (e.g. ["verified"]). */
export default function Badges({ business: b, only, large = false }) {
  const show = (k) => !only || only.includes(k);
  const list = [];
  if (b.verified && show("verified"))
    list.push(
      <span key="v" className="badge badge-verified">
        <Icon name="verified" size={large ? 16 : 14} /> Verified{large ? " business" : ""}
      </span>,
    );
  if (b.founding && show("founding"))
    list.push(
      <span key="f" className="badge badge-founding">
        <Icon name="award" size={large ? 16 : 14} /> Founding partner
      </span>,
    );
  if (b.featured && b.example && show("featured"))
    list.push(
      <span key="p" className="badge badge-featured">
        Featured
      </span>,
    );
  if (isTopRated(b) && show("top"))
    list.push(
      <span key="t" className="badge badge-top">
        <Icon name="star" size={large ? 16 : 14} /> Top rated
      </span>,
    );
  if (b.example && show("example"))
    list.push(
      <span key="e" className="badge badge-example">
        Example
      </span>,
    );
  return list.length ? <span className={`badges${large ? " large" : ""}`}>{list}</span> : null;
}
