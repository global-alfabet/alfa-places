import { useState } from "react";
import { compact } from "../../lib/sample.js";

// Small single-series charts for the test dashboards, in the accent colour. Every value is also in a hidden table
// for screen readers; hovering or focusing a bar shows its value.

const niceStep = (max, steps = 4) => {
  const raw = max / steps || 1;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const n = raw / mag;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
};

/** Vertical bars from one baseline: data is [{ label, value, tip? }]; empty labels are skipped on the axis. */
export function BarChart({ data, title, unit = "", height = 220 }) {
  const [active, setActive] = useState(-1);
  const step = niceStep(Math.max(1, ...data.map((d) => d.value)));
  const top = step * Math.ceil(Math.max(1, ...data.map((d) => d.value)) / step);
  const ticks = [];
  for (let t = 0; t <= top + 1e-9; t += step) ticks.push(t);
  return (
    <figure className="chart">
      <div className="chart-plot" style={{ height }}>
        <div className="chart-ticks" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} style={{ bottom: `${(t / top) * 100}%` }}>
              {compact(t)}
            </span>
          ))}
        </div>
        <div className="chart-area">
          {ticks.map((t) => (
            <span key={t} className="chart-grid" style={{ bottom: `${(t / top) * 100}%` }} aria-hidden="true" />
          ))}
          {data.map((d, i) => (
            <button
              type="button"
              key={`${d.label}-${i}`}
              className={`chart-slot${active === i ? " on" : ""}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(-1)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(-1)}
              aria-label={`${d.tip || d.label}: ${d.value.toLocaleString("en-GB")}${unit ? ` ${unit}` : ""}`}
            >
              <span className="chart-bar" style={{ height: `${(d.value / top) * 100}%` }}>
                {active === i && (
                  <span className="chart-tip" role="presentation">
                    <strong>
                      {d.value.toLocaleString("en-GB")}
                      {unit ? ` ${unit}` : ""}
                    </strong>
                    <span>{d.tip || d.label}</span>
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="chart-x" aria-hidden="true">
        {data.map((d, i) => (
          <span key={`${d.label}-${i}`}>{d.label}</span>
        ))}
      </div>
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <th scope="row">{d.tip || d.label}</th>
              <td>{d.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** Horizontal bars with the value at the end: rows is [{ label, value, display? }]. */
export function BarList({ rows, max, title }) {
  const top = max || Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="bar-list" aria-label={title}>
      {rows.map((r) => (
        <li key={r.label}>
          <span className="bar-list-label">{r.label}</span>
          <span className="bar-list-track" aria-hidden="true">
            <span className="bar-list-fill" style={{ width: `${(r.value / top) * 100}%` }} />
          </span>
          <span className="bar-list-value">{r.display ?? r.value.toLocaleString("en-GB")}</span>
        </li>
      ))}
    </ul>
  );
}
