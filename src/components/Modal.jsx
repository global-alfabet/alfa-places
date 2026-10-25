import { useEffect, useRef } from "react";
import Icon from "./Icon.jsx";

// A dialog over the page. Closes on Escape, on the close button and on a click outside the panel.
export default function Modal({ open, onClose, title, children, wide = false, bare = false }) {
  const panel = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const last = document.activeElement;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");
    panel.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
      last?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className={`modal-panel${wide ? " wide" : ""}${bare ? " bare" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={panel}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={20} />
        </button>
        {title && !bare && <h2 className="modal-title">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
