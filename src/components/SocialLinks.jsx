// Round buttons linking to our social media profiles. Networks with no link in config are left out.
import { SOCIAL_ICONS } from "../lib/social-icons.js";

const LABELS = { instagram: "Instagram", facebook: "Facebook", linkedin: "LinkedIn", youtube: "YouTube" };

export default function SocialLinks({ links = {}, name }) {
  const list = Object.entries(links).filter(([k, url]) => url && SOCIAL_ICONS[k]);
  if (!list.length) return null;
  return (
    <ul className="social" aria-label={`${name} on social media`}>
      {list.map(([k, url]) => {
        const icon = SOCIAL_ICONS[k];
        const external = /^https?:\/\//.test(url);
        return (
          <li key={k}>
            <a href={url} aria-label={`${name} on ${LABELS[k]}`} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <svg viewBox={icon.viewBox} width="17" height="17" aria-hidden="true" focusable="false">
                <path fill="currentColor" d={icon.d} />
              </svg>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
