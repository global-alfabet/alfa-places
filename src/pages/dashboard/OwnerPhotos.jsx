import { useState } from "react";
import { PageHead, TestNote } from "../../components/dash/Dash.jsx";
import { useToast } from "../../components/dash/useToast.jsx";
import Icon from "../../components/Icon.jsx";
import Modal from "../../components/Modal.jsx";
import { CategoryIcon } from "../../components/CategoryTile.jsx";
import { categoryById } from "../../content/categories.js";
import { allPhotos, photos, photoUrl } from "../../content/photos.js";
import { useStore } from "../../lib/store.js";
import { site } from "../../config.js";

// Figma "Photo Gallery": choose the cover photo, put photos in order, remove them.
export default function OwnerPhotos({ b }) {
  const { dispatch } = useStore();
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useToast();
  const list = allPhotos(b);

  const update = (next, title) => {
    dispatch({
      type: "edit",
      id: b.id,
      fields: { photos: { banner: next[0], gallery: next.slice(1) } },
      log: { business: b.id, icon: "image", title, text: "Your listing shows the new photos." },
    });
    setToast({ title, link: { to: `/business/${b.id}`, label: "View listing" } });
  };
  const move = (i, by) => {
    const next = [...list];
    [next[i], next[i + by]] = [next[i + by], next[i]];
    update(next, "Photo order saved");
  };

  return (
    <>
      <PageHead title="Photos" sub="The first photo is your cover. Listings with good photos get more enquiries.">
        <button className="btn btn-small" onClick={() => setAdding(true)}>
          <Icon name="plus" size={16} /> Add photos
        </button>
      </PageHead>
      <TestNote>
        Example listings use free-licensed stock photos that show the kind of work. They aren't of this business.
      </TestNote>

      {list.length ? (
        <ul className="photo-manager">
          {list.map((k, i) => (
            <li key={k} className={i === 0 ? "cover" : ""}>
              <figure>
                <img
                  src={photoUrl(photos[k], 600)}
                  alt={photos[k].alt || ""}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                {i === 0 && <span className="badge badge-cover">Cover</span>}
                <figcaption>
                  <span>Photo: {photos[k].author}</span>
                </figcaption>
              </figure>
              <div className="photo-actions">
                {i > 0 && (
                  <button
                    className="chip-button"
                    onClick={() => update([k, ...list.filter((x) => x !== k)], "Cover photo changed")}
                  >
                    Make cover
                  </button>
                )}
                <span className="photo-move">
                  <button
                    className="icon-button"
                    disabled={i === 0}
                    aria-label="Move earlier"
                    onClick={() => move(i, -1)}
                  >
                    <Icon name="back" size={16} />
                  </button>
                  <button
                    className="icon-button"
                    disabled={i === list.length - 1}
                    aria-label="Move later"
                    onClick={() => move(i, 1)}
                  >
                    <Icon name="chevron" size={16} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Remove photo"
                    onClick={() =>
                      update(
                        list.filter((x) => x !== k),
                        "Photo removed",
                      )
                    }
                  >
                    <Icon name="close" size={16} />
                  </button>
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="panel empty">
          <CategoryIcon icon={categoryById[b.category]?.icon} size={64} />
          <p>No photos yet. Your listing shows your category icon instead.</p>
        </div>
      )}

      <section className="panel logo-panel">
        <CategoryIcon icon={categoryById[b.category]?.icon} size={56} />
        <div>
          <h2>Logo</h2>
          <p className="muted">
            Example listings show their category icon. Real businesses can send a square logo, and it shows on their
            listing and in search.
          </p>
        </div>
      </section>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add photos">
        <p>
          Uploading photos arrives with the Global Alfabet Account. Until then, real businesses email their photos to{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> and we add them.
        </p>
        <button className="btn" onClick={() => setAdding(false)}>
          OK
        </button>
      </Modal>
      {toast}
    </>
  );
}
