import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../Icon.jsx";

/** A short message that disappears after a few seconds. */
export function useToast() {
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);
  const view = toast ? (
    <div className="toast" role="status">
      <Icon name="check" size={18} stroke={2.2} />
      <span>
        <strong>{toast.title}</strong>
        {toast.text && <span>{toast.text}</span>}
      </span>
      {toast.link && (
        <Link className="toast-link" to={toast.link.to}>
          {toast.link.label}
        </Link>
      )}
      <button className="toast-close" aria-label="Dismiss" onClick={() => setToast(null)}>
        <Icon name="close" size={16} />
      </button>
    </div>
  ) : null;
  return [view, setToast];
}
