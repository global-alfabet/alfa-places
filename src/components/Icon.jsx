// Line icons drawn on a 24px grid. Colour follows the text colour.
const paths = {
  // interface
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M15.5 15.5L20 20" />
    </>
  ),
  chevron: <path d="M9 6l6 6-6 6" />,
  back: <path d="M15 6l-6 6 6 6" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  menu: <path d="M4 8h16M4 16h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  pin: (
    <>
      <path d="M12 21s-6.5-5.4-6.5-11a6.5 6.5 0 0113 0c0 5.6-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="3" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <path d="M8.5 18H16a3 3 0 000-6H8a3 3 0 010-6h7.5" />
    </>
  ),
  bookmark: <path d="M6.5 4h11a1 1 0 011 1v15.5L12 16.5l-6.5 4V5a1 1 0 011-1z" />,
  bookmarkFilled: <path d="M6.5 4h11a1 1 0 011 1v15.5L12 16.5l-6.5 4V5a1 1 0 011-1z" fill="currentColor" />,
  map: <path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5zM9 4v13.5M15 6.5V20" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M4 7l8 6 8-6" />
    </>
  ),
  phone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2 2A16.5 16.5 0 014.5 5.5a2 2 0 012-2z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z" />
    </>
  ),
  chat: <path d="M4 18.5l1.4-4.1A7.5 7.5 0 1111.9 19.5a7.6 7.6 0 01-3.6-.9L4 18.5z" />,
  store: (
    <>
      <path d="M4 9.5l1.5-5h13L20 9.5" />
      <path d="M4 9.5a2.7 2.7 0 005.3 0 2.7 2.7 0 005.4 0 2.7 2.7 0 005.3 0" />
      <path d="M5.5 12v8h13v-8M10 20v-4.5h4V20" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.8v.2" />
    </>
  ),
  share: <path d="M12 3.5v11M7.5 8L12 3.5 16.5 8M5 12v6.5a2 2 0 002 2h10a2 2 0 002-2V12" />,
  sliders: <path d="M4 7h10M18 7h2M4 17h4M12 17h8M16 4.5v5M10 14.5v5" />,
  // business categories
  utensils: <path d="M7 3v8M4.5 3v5.5a2.5 2.5 0 005 0V3M7 11v10M16.5 21V3c-2.5 1.5-3.5 4.5-3.5 8h3.5" />,
  bed: <path d="M3 18.5V6M3 14h18v4.5M21 14v-2.5a3 3 0 00-3-3h-7.5V14M6.75 11.25a1.75 1.75 0 100-.01" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15.5 8.5l-2 5-5 2 2-5z" />
    </>
  ),
  binoculars: (
    <>
      <circle cx="6.5" cy="15.5" r="3.5" />
      <circle cx="17.5" cy="15.5" r="3.5" />
      <path d="M10 15.5h4M4 13l2-7.5h3l1 5M20 13l-2-7.5h-3l-1 5" />
    </>
  ),
  paw: (
    <>
      <path d="M8 16.5c0-2.5 2-4.5 4-4.5s4 2 4 4.5c0 1.6-1.2 2.5-2.5 2.5-.8 0-1-.4-1.5-.4s-.7.4-1.5.4C9.2 19 8 18.1 8 16.5z" />
      <circle cx="7" cy="10.5" r="1.6" />
      <circle cx="10" cy="7" r="1.6" />
      <circle cx="14" cy="7" r="1.6" />
      <circle cx="17" cy="10.5" r="1.6" />
    </>
  ),
  cross: <path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z" />,
  sparkles: (
    <path d="M10 3.5l1.6 4.4L16 9.5l-4.4 1.6L10 15.5l-1.6-4.4L4 9.5l4.4-1.6zM17.5 14l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9z" />
  ),
  car: (
    <>
      <path d="M4 16.5v-4l2-5.5h12l2 5.5v4M4 12.5h16M4 16.5h16M6.5 16.5V19M17.5 16.5V19" />
      <circle cx="7.5" cy="14.5" r=".3" />
      <circle cx="16.5" cy="14.5" r=".3" />
    </>
  ),
  laptop: <path d="M5 16V6.5a1 1 0 011-1h12a1 1 0 011 1V16M2.5 16h19l-1 2.5h-17z" />,
  droplet: <path d="M12 3.5s6 6.4 6 10.5a6 6 0 01-12 0c0-4.1 6-10.5 6-10.5zM9.5 14.5a2.5 2.5 0 002.5 2.5" />,
  home: <path d="M4 11l8-6.5 8 6.5M6 9.5V20h12V9.5M10 20v-5.5h4V20" />,
  hardhat: <path d="M3.5 17h17M5 17v-3a7 7 0 0114 0v3M10 7.5V11M14 7.5V11M9.5 7.6a7 7 0 015 0" />,
  building: (
    <path d="M5 20.5V5a1 1 0 011-1h8a1 1 0 011 1v15.5M15 9.5h3a1 1 0 011 1v10M3 20.5h18M8.5 8h3M8.5 11.5h3M8.5 15h3" />
  ),
  scale: <path d="M12 4v16M8 20h8M5 7h14M5 7l-2.5 6a2.5 2.5 0 005 0zM19 7l-2.5 6a2.5 2.5 0 005 0z" />,
  wallet: (
    <>
      <path d="M4 7.5V17a2 2 0 002 2h13a1 1 0 001-1v-9a1 1 0 00-1-1H6a2 2 0 01-2-2 2 2 0 012-2h11" />
      <circle cx="16" cy="13.5" r=".4" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M9 7.5V6a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0115 6v1.5M3 12.5h18" />
    </>
  ),
  graduation: (
    <path d="M2.5 9.5L12 5l9.5 4.5L12 14zM6.5 11.5V16c1.5 1.5 3.5 2.5 5.5 2.5s4-1 5.5-2.5v-4.5M21.5 9.5V15" />
  ),
  leaf: <path d="M5 19C5 10 10 5 19.5 4.5 19.5 14 14.5 19 6 19zM5 19l7.5-7.5" />,
  bag: <path d="M5 8h14l-1 12H6zM9 10.5V7a3 3 0 016 0v3.5" />,
  music: (
    <>
      <path d="M9 18V5.5l11-2V16" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="17.5" cy="16" r="2.5" />
    </>
  ),
  camera: (
    <>
      <path d="M3.5 8.5a2 2 0 012-2h2.5l1.5-2h5l1.5 2h2.5a2 2 0 012 2v9a2 2 0 01-2 2h-13a2 2 0 01-2-2z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3.5v3h-7" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0115 0" />
    </>
  ),
  wrench: (
    <>
      <path d="M12.6 9.8l-8 8a1.7 1.7 0 002.4 2.4l8-8" />
      <path d="M12.6 9.8a4.6 4.6 0 015.8-6.3L15.6 6.3l.6 2.3 2.3.6 2.8-2.8a4.6 4.6 0 01-6.3 5.8" />
    </>
  ),
  bolt: <path d="M13 2.5L5 13.5h6l-1 8 8-11h-6z" />,
  star: <path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9l-5.3 2.7 1-5.8-4.2-4.1 5.9-.9z" />,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0112 7a4.3 4.3 0 017.5 2.8C19.5 15.4 12 20 12 20z" />,
  verified: (
    <>
      <path d="M12 2.8l2.3 1.7 2.9-.1.9 2.7 2.3 1.7-.9 2.7.9 2.7-2.3 1.7-.9 2.7-2.9-.1L12 21.2l-2.3-1.7-2.9.1-.9-2.7-2.3-1.7.9-2.7-.9-2.7 2.3-1.7.9-2.7 2.9.1z" />
      <path d="M8.5 12.2l2.4 2.4 4.6-4.8" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.3L7 21l5-2.5 5 2.5-1.5-7.7" />
    </>
  ),
  locate: (
    <>
      <circle cx="12" cy="12" r="6.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M20.5 16l-5-5-8.5 8" />
    </>
  ),
  grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  bell: (
    <>
      <path d="M6 16.5V11a6 6 0 0112 0v5.5l1.5 1.5h-15z" />
      <path d="M10 20.5a2.2 2.2 0 004 0" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" />
    </>
  ),
  chart: <path d="M4 20.5h16M6.5 17V11M11 17V6.5M15.5 17v-4M20 17V8.5" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  logout: <path d="M14.5 4.5h4a1 1 0 011 1v13a1 1 0 01-1 1h-4M10 16.5L5.5 12 10 7.5M5.5 12h10" />,
  edit: <path d="M4.5 19.5l1-4L15.8 5.2a2 2 0 012.9 2.9L8.5 18.4zM14 7l3 3" />,
  shield: <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.2-7.5 9.5-4.3-1.3-7.5-4.9-7.5-9.5V6z" />,
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0113 0M16 5.2a3.5 3.5 0 010 6.6M18 14.5a6.5 6.5 0 013.5 5.5" />
    </>
  ),
  tag: (
    <>
      <path d="M3.5 12.3V4.5a1 1 0 011-1h7.8l8.2 8.2a1.5 1.5 0 010 2.1l-6.1 6.1a1.5 1.5 0 01-2.1 0z" />
      <circle cx="8" cy="8" r="1.4" />
    </>
  ),
};

export default function Icon({ name, size = 20, stroke = 1.75, className = "", title }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {paths[name] || paths.store}
    </svg>
  );
}
