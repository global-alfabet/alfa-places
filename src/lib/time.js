/** "today", "yesterday", "3 days ago", "2 weeks ago", "4 months ago" for an ISO date. */
export function timeAgo(iso, now = new Date()) {
  const days = Math.max(0, Math.floor((now - new Date(iso)) / 86400000));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} ${Math.floor(days / 7) === 1 ? "week" : "weeks"} ago`;
  if (days < 365) return `${Math.floor(days / 30)} ${Math.floor(days / 30) === 1 ? "month" : "months"} ago`;
  const y = Math.floor(days / 365);
  return `${y} ${y === 1 ? "year" : "years"} ago`;
}
