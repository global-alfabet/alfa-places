import { useId } from "react";

// Illustrations of each place to visit, drawn in code so they stay sharp and light.
// Replace with real photos when we have licensed ones (set `photo` on a destination).
const W = 800;
const H = 500;

// A soft ridge line across the picture, closed to the bottom edge.
function ridge(y, amp, freq, phase = 0, wobble = 0.35) {
  const pts = [];
  for (let x = 0; x <= W; x += 20) {
    const t = x / W;
    const v =
      y + amp * Math.sin(t * Math.PI * freq + phase) + amp * wobble * Math.sin(t * Math.PI * freq * 2.7 + phase * 1.7);
    pts.push(`${x},${v.toFixed(1)}`);
  }
  return `M0,${H} L${pts.join(" L")} L${W},${H} Z`;
}

const Acacia = ({ x, y, s = 1, fill }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
    <path d="M-2 0 L-1 -34 L-12 -48 L-9 -49 L0 -40 L8 -52 L11 -50 L2 -36 L2 0 Z" />
    <ellipse cx="-14" cy="-52" rx="22" ry="6" />
    <ellipse cx="12" cy="-56" rx="26" ry="7" />
    <ellipse cx="-2" cy="-60" rx="20" ry="5.5" />
  </g>
);

const RoundTree = ({ x, y, s = 1, fill }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
    <rect x="-2" y="-26" width="4" height="26" />
    <circle cx="0" cy="-36" r="16" />
    <circle cx="-11" cy="-28" r="11" />
    <circle cx="11" cy="-27" r="12" />
  </g>
);

const Pine = ({ x, y, s = 1, fill }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
    <path d="M0 -70 L14 -38 L7 -38 L18 -14 L4 -14 L4 0 L-4 0 L-4 -14 L-18 -14 L-7 -38 L-14 -38 Z" />
  </g>
);

const Elephant = ({ x, y, s = 1, fill, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill={fill}>
    <path d="M-30 -8 C-32 -30 -18 -42 4 -42 C18 -42 26 -36 30 -28 C36 -30 42 -26 42 -18 C42 -10 40 -2 38 6 L35 6 C36 -2 36 -8 34 -12 L32 -6 L30 0 L24 0 L24 -10 L10 -10 L10 0 L4 0 L3 -12 C-6 -12 -12 -10 -16 -8 L-16 0 L-22 0 L-22 -6 L-24 0 L-30 0 Z" />
    <path d="M14 -40 C22 -44 30 -38 28 -26 C26 -20 20 -20 16 -24 Z" opacity=".75" />
  </g>
);

const Mist = ({ y, o = 0.5, id }) => (
  <rect x="-40" y={y} width={W + 80} height="60" fill="#fff" opacity={o} filter={`url(#${id}-blur)`} />
);

function Sky({ id, top, bottom }) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
        <filter id={`${id}-blur`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-sky)`} />
    </>
  );
}

const scenes = {
  waterfall: (id) => (
    <>
      <Sky id={id} top="#7cc4ea" bottom="#e3f3fb" />
      <path d={ridge(150, 8, 2, 1)} fill="#a9cdb8" />
      <path d={ridge(206, 6, 3, 0.4)} fill="#5f9a6e" />
      {/* the basalt wall, with one long curtain of water falling down it */}
      <rect x="0" y="222" width={W} height="170" fill="#4a5250" />
      <path d="M60 226 Q140 218 220 226 T380 224 T540 228 T740 224 L740 380 L60 380 Z" fill="#f4fbff" />
      <g stroke="#cfe3ee" strokeWidth="3" strokeLinecap="round" opacity=".9">
        {Array.from({ length: 26 }, (_, i) => {
          const x = 78 + i * 25 + ((i * 7) % 9);
          return <path key={i} d={`M${x} ${236 + ((i * 11) % 18)} V${300 + ((i * 17) % 60)}`} />;
        })}
      </g>
      <rect x="60" y="222" width="680" height="6" fill="#fff" />
      <rect x="0" y="372" width={W} height="128" fill="#2f3a3a" />
      {/* spray rising out of the gorge, and the rainbow inside it */}
      <g filter={`url(#${id}-blur)`} fill="#fff">
        <ellipse cx="220" cy="372" rx="200" ry="70" opacity=".95" />
        <ellipse cx="560" cy="366" rx="230" ry="80" opacity=".95" />
        <ellipse cx="400" cy="330" rx="260" ry="54" opacity=".6" />
      </g>
      <g fill="none" strokeWidth="6" opacity=".26">
        <path d="M250 430 A170 170 0 0 1 590 430" stroke="#ff5f57" />
        <path d="M256 430 A164 164 0 0 1 584 430" stroke="#ffbd2e" />
        <path d="M262 430 A158 158 0 0 1 578 430" stroke="#5ac85a" />
        <path d="M268 430 A152 152 0 0 1 572 430" stroke="#3b9cff" />
      </g>
      <path d={ridge(446, 16, 2.4, 2)} fill="#2f6b45" />
      <RoundTree x={70} y={470} s={1.8} fill="#255a39" />
      <RoundTree x={730} y={476} s={1.6} fill="#255a39" />
    </>
  ),
  savanna: (id) => (
    <>
      <Sky id={id} top="#f7b267" bottom="#fde9c9" />
      <circle cx="560" cy="250" r="70" fill="#fff4dc" opacity=".9" />
      <path d={ridge(300, 4, 2, 1)} fill="#d9a35f" opacity=".7" />
      <path d={ridge(330, 3, 3, 0.2)} fill="#c98c45" />
      <ellipse cx="400" cy="420" rx="230" ry="34" fill="#f6c88a" />
      <ellipse cx="400" cy="420" rx="230" ry="34" fill="#9fb7b5" opacity=".55" />
      <path d={`M0 ${H} L0 380 Q200 360 400 386 T${W} 372 L${W} ${H} Z`} fill="#b0773a" opacity=".55" />
      <Acacia x={120} y={340} s={1.5} fill="#5b3a1e" />
      <Acacia x={690} y={334} s={1.1} fill="#6b4524" />
      <Acacia x={330} y={330} s={0.7} fill="#7a5130" />
      <Elephant x={430} y={400} s={1.25} fill="#4a3322" />
      <Elephant x={520} y={404} s={0.9} fill="#4a3322" flip />
      <path d={`M0 ${H} L0 455 Q260 430 520 452 T${W} 440 L${W} ${H} Z`} fill="#8a5a2b" />
    </>
  ),
  river: (id) => (
    <>
      <Sky id={id} top="#f6c6a6" bottom="#fdeee2" />
      <circle cx="210" cy="190" r="46" fill="#fff6ec" />
      <path d={ridge(220, 18, 2.2, 0.8)} fill="#9cabc4" />
      <path d={ridge(250, 10, 3, 2)} fill="#b4bfd0" />
      <rect x="0" y="282" width={W} height="90" fill="#cfd8e6" />
      <g stroke="#fff" strokeWidth="2" opacity=".6">
        <path d="M80 310 h90M300 330 h120M560 300 h80M470 352 h110" />
      </g>
      <path d="M340 322 q30 8 60 0 l-6 6 q-24 5 -48 0z" fill="#3c4a5c" />
      <path d={`M0 ${H} L0 372 Q300 360 520 376 T${W} 366 L${W} ${H} Z`} fill="#c9b07a" />
      <path d={`M0 ${H} L0 420 Q220 400 460 424 T${W} 412 L${W} ${H} Z`} fill="#8f8a4a" />
      {/* ana trees on the floodplain */}
      <g fill="#4e5a2e">
        <path d="M600 420 l4 -110 l6 0 l4 110z" />
        <ellipse cx="610" cy="300" rx="110" ry="26" />
        <ellipse cx="575" cy="284" rx="60" ry="16" />
        <ellipse cx="650" cy="290" rx="64" ry="18" />
        <path d="M150 430 l3 -80 l5 0 l3 80z" />
        <ellipse cx="156" cy="344" rx="80" ry="18" />
      </g>
    </>
  ),
  kopjes: (id) => (
    <>
      <Sky id={id} top="#7b6fb8" bottom="#f7b79a" />
      <circle cx="640" cy="218" r="44" fill="#ffd9b8" opacity=".9" />
      <path d={ridge(318, 10, 2, 2.4)} fill="#a27d93" opacity=".7" />
      {/* granite kopjes: heaps of rounded boulders, with one balancing on top */}
      <g fill="#9a7468">
        <path d="M30 360 Q40 300 110 292 Q150 250 200 268 Q250 262 280 300 Q330 310 340 360 Z" />
        <rect x="118" y="214" width="92" height="62" rx="30" />
        <rect x="150" y="166" width="56" height="50" rx="24" />
        <rect x="160" y="128" width="40" height="40" rx="18" transform="rotate(-8 180 148)" />
      </g>
      <g fill="#866054">
        <path d="M420 370 Q430 300 500 300 Q540 256 600 270 Q660 262 690 304 Q760 314 780 370 Z" />
        <rect x="520" y="222" width="110" height="60" rx="30" />
        <rect x="548" y="182" width="58" height="44" rx="21" />
      </g>
      <g fill="#fff" opacity=".14">
        <rect x="130" y="222" width="40" height="14" rx="7" />
        <rect x="532" y="230" width="44" height="14" rx="7" />
        <rect x="160" y="174" width="24" height="10" rx="5" />
      </g>
      <g fill="#000" opacity=".12">
        <rect x="118" y="256" width="92" height="20" rx="10" />
        <rect x="520" y="262" width="110" height="20" rx="10" />
      </g>
      <path d={`M0 ${H} L0 396 Q220 378 430 400 T${W} 390 L${W} ${H} Z`} fill="#6c5a3a" />
      <RoundTree x={370} y={408} s={1.2} fill="#4a4a2a" />
      <RoundTree x={740} y={402} s={0.9} fill="#4a4a2a" />
      <path d={`M0 ${H} L0 452 Q300 436 560 456 T${W} 448 L${W} ${H} Z`} fill="#55462c" />
    </>
  ),
  ruins: (id) => (
    <>
      <Sky id={id} top="#5fa8e0" bottom="#d9eefa" />
      {/* the Hill Complex: boulders and walls on the hilltop */}
      <path d="M380 260 Q470 150 600 166 Q700 176 800 240 L800 300 L380 300 Z" fill="#8e9a72" />
      <g fill="#8a7c66">
        <ellipse cx="560" cy="170" rx="44" ry="24" />
        <ellipse cx="612" cy="162" rx="30" ry="22" />
        <ellipse cx="520" cy="186" rx="26" ry="16" />
      </g>
      <path d="M500 194 L640 186 L644 198 L502 206 Z" fill="#b39a7c" />
      <path d={`M0 ${H} L0 300 Q400 270 ${W} 300 L${W} ${H} Z`} fill="#a6a07a" />
      {/* the conical tower inside the Great Enclosure */}
      <path d="M330 330 L342 218 Q362 200 382 218 L394 330 Z" fill="#a58c6e" />
      <g stroke="#8f7860" strokeWidth="2" opacity=".75">
        <path d="M340 236 h44M338 256 h48M336 276 h52M334 296 h56M333 316 h58" />
      </g>
      {/* the great curved outer wall */}
      <path d="M-20 470 C140 330 600 300 820 380 L820 470 Z" fill="#b39a7c" />
      <path d="M-20 470 C140 330 600 300 820 380 L820 394 C600 318 140 350 -20 486 Z" fill="#c9b293" />
      <g stroke="#8f7860" strokeWidth="2" fill="none" opacity=".6">
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={`M-20 ${484 + i * 2} C140 ${352 + i * 14} 600 ${322 + i * 14} 820 ${400 + i * 14}`} />
        ))}
      </g>
      <g stroke="#7c6550" strokeWidth="3" fill="none" opacity=".5">
        <path d="M120 404 l14 -10 l14 10 l14 -10 l14 10 l14 -10 l14 10 l14 -10 l14 10" />
      </g>
      <path d={`M0 ${H} L0 478 Q400 456 ${W} 478 L${W} ${H} Z`} fill="#6f7a4a" />
      <RoundTree x={680} y={360} s={1.1} fill="#4f5a32" />
      <RoundTree x={60} y={330} s={0.9} fill="#4f5a32" />
    </>
  ),
  lake: (id) => (
    <>
      <Sky id={id} top="#ff8f6b" bottom="#ffd7a8" />
      <circle cx="400" cy="262" r="56" fill="#fff1d6" />
      <path d={ridge(270, 14, 1.6, 0.4)} fill="#c86a5c" opacity=".6" />
      <path d={ridge(284, 8, 2.4, 2.2)} fill="#a8524f" opacity=".75" />
      <defs>
        <linearGradient id={`${id}-water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e88a78" />
          <stop offset="1" stopColor="#6a4a78" />
        </linearGradient>
      </defs>
      <rect x="0" y="298" width={W} height="202" fill={`url(#${id}-water)`} />
      {/* the sun's reflection as glitter on the water */}
      <g stroke="#fff1d6" strokeWidth="4" strokeLinecap="round" opacity=".8">
        <path d="M372 310 h56M380 324 h40M366 338 h68M384 354 h32M374 370 h52M388 388 h24M378 406 h44M392 426 h16" />
      </g>
      {/* drowned trees standing in the water, and a houseboat */}
      <g stroke="#3d2a3a" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M120 430 V318 M120 352 L96 326 M120 340 L146 312 M146 312 L156 300 M96 326 L88 316" />
        <path d="M650 450 V300 M650 340 L624 312 M650 326 L682 292 M624 312 L612 300 M682 292 L692 280" />
        <path d="M720 420 V346 M720 368 L738 350" />
      </g>
      <g fill="#3d2a3a">
        <rect x="470" y="372" width="110" height="10" rx="3" />
        <rect x="486" y="358" width="74" height="14" rx="2" />
        <rect x="498" y="350" width="40" height="8" rx="2" />
      </g>
    </>
  ),
  highlands: (id) => (
    <>
      <Sky id={id} top="#8fc6e8" bottom="#eef7fb" />
      <path d={ridge(200, 40, 1.2, 0.3)} fill="#8db39a" />
      {/* a tall waterfall dropping off the escarpment */}
      <path d="M520 168 C522 230 524 300 526 360 L534 360 C532 300 530 230 528 166 Z" fill="#fff" opacity=".95" />
      <ellipse cx="530" cy="366" rx="34" ry="12" fill="#fff" opacity=".7" filter={`url(#${id}-soft)`} />
      <path d={ridge(300, 22, 1.8, 1.8)} fill="#5f9a6e" />
      <Mist y={300} o={0.45} id={id} />
      <path d={ridge(370, 18, 2.2, 0.9)} fill="#3f7d52" />
      <Pine x={90} y={430} s={1.4} fill="#24553a" />
      <Pine x={140} y={440} s={1.1} fill="#24553a" />
      <Pine x={690} y={436} s={1.3} fill="#24553a" />
      <Pine x={735} y={444} s={1} fill="#24553a" />
      <path d={ridge(440, 12, 2.6, 2.2)} fill="#2e6644" />
    </>
  ),
  peaks: (id) => (
    <>
      <Sky id={id} top="#4f9ad8" bottom="#d8ecf8" />
      <path
        d="M0 330 L90 220 L140 260 L230 150 L300 230 L360 190 L450 120 L540 210 L600 170 L690 250 L760 200 L800 230 L800 500 L0 500 Z"
        fill="#c4c7cc"
      />
      <path d="M230 150 L300 230 L258 236 Z M450 120 L540 210 L494 214 Z M600 170 L690 250 L650 252 Z" fill="#a9adb4" />
      <path
        d="M0 360 L120 300 L200 330 L320 270 L420 320 L520 280 L640 330 L800 290 L800 500 L0 500 Z"
        fill="#9aa1aa"
      />
      <path d={ridge(390, 14, 2, 1)} fill="#7f9a5a" />
      <path
        d="M430 392 C424 410 444 420 438 440 C432 460 452 474 448 500"
        stroke="#cfe6f4"
        strokeWidth="9"
        fill="none"
        strokeLinecap="round"
      />
      <path d={ridge(452, 10, 3, 2.4)} fill="#5f7d40" />
      <path d="M448 470 C450 484 452 492 452 500" stroke="#cfe6f4" strokeWidth="12" fill="none" />
    </>
  ),
  cliffs: (id) => (
    <>
      <Sky id={id} top="#6bb6e6" bottom="#e7f4fb" />
      <path
        d="M0 300 L0 180 Q120 170 200 186 Q300 168 400 184 Q520 160 620 182 Q720 170 800 180 L800 300 Z"
        fill="#c9562f"
      />
      <g stroke="#a8401f" strokeWidth="3" opacity=".7">
        <path d="M0 214 Q400 196 800 210M0 244 Q400 228 800 240M0 272 Q400 260 800 268" fill="none" />
      </g>
      <path d="M0 300 Q400 286 800 300 L800 310 L0 310 Z" fill="#7e9a4a" />
      <rect x="0" y="310" width={W} height="70" fill="#d8b98c" />
      <rect x="0" y="330" width={W} height="34" fill="#9cc3d6" />
      <path d="M0 342 Q400 330 800 342 L800 352 Q400 340 0 352 Z" fill="#c9562f" opacity=".35" />
      <path d={`M0 ${H} L0 380 Q300 366 560 384 T${W} 376 L${W} ${H} Z`} fill="#d1a873" />
      <Elephant x={250} y={386} s={0.8} fill="#5b4636" />
      <Elephant x={300} y={388} s={0.6} fill="#5b4636" />
      <Acacia x={640} y={430} s={1.3} fill="#5c4027" />
      <path d={`M0 ${H} L0 450 Q260 434 520 452 T${W} 446 L${W} ${H} Z`} fill="#a77d4c" />
    </>
  ),
  cave: (id) => (
    <>
      <rect width={W} height={H} fill="#3b3a36" />
      <defs>
        <radialGradient id={`${id}-pool`} cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#3fd0ff" />
          <stop offset=".6" stopColor="#1a7ad8" />
          <stop offset="1" stopColor="#0e3c8a" />
        </radialGradient>
        <linearGradient id={`${id}-ray`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="400" cy="300" rx="330" ry="210" fill="#5b5850" />
      <ellipse cx="400" cy="312" rx="282" ry="172" fill="#6e6a61" />
      <ellipse cx="400" cy="330" rx="230" ry="120" fill={`url(#${id}-pool)`} />
      <path d="M330 90 L380 90 L430 330 L360 330 Z" fill={`url(#${id}-ray)`} />
      <path d="M410 90 L440 90 L470 320 L440 320 Z" fill={`url(#${id}-ray)`} />
      {/* plants hanging over the rim */}
      <g fill="#4d7a3a">
        <path d="M130 120 Q190 96 250 116 Q240 150 220 170 Q200 140 180 160 Q160 140 130 120 Z" />
        <path d="M560 112 Q630 92 690 120 Q672 150 650 166 Q632 140 612 158 Q590 138 560 112 Z" />
      </g>
      <g stroke="#fff" strokeWidth="2" opacity=".35">
        <path d="M300 340 h70M430 360 h90M360 386 h60" />
      </g>
    </>
  ),
  dome: (id) => (
    <>
      <Sky id={id} top="#f28c5b" bottom="#ffe0b5" />
      <circle cx="600" cy="200" r="40" fill="#fff4dc" />
      <path d={ridge(330, 8, 2, 0.6)} fill="#c88a5c" opacity=".6" />
      <path d="M90 420 C150 250 300 200 420 210 C540 220 650 300 720 420 Z" fill="#a8897a" />
      <path
        d="M180 360 C240 270 330 240 420 244 C460 246 500 256 530 270 C460 262 360 270 280 320 Z"
        fill="#fff"
        opacity=".18"
      />
      <g fill="#3a2b2a">
        <circle cx="404" cy="200" r="3.5" />
        <rect x="401" y="203" width="6" height="12" rx="2" />
        <circle cx="418" cy="202" r="3" />
        <rect x="415.5" y="205" width="5" height="10" rx="2" />
      </g>
      <path d={`M0 ${H} L0 410 Q260 390 520 414 T${W} 402 L${W} ${H} Z`} fill="#6e6440" />
      <RoundTree x={80} y={430} s={1.3} fill="#4a4a2a" />
      <RoundTree x={740} y={424} s={1.1} fill="#4a4a2a" />
      <path d={`M0 ${H} L0 460 Q300 444 560 462 T${W} 454 L${W} ${H} Z`} fill="#565033" />
    </>
  ),
  forest: (id) => (
    <>
      <Sky id={id} top="#a9c9d9" bottom="#eef4f2" />
      <path d={ridge(190, 26, 1.4, 1.2)} fill="#9fbcb4" />
      <Mist y={200} o={0.6} id={id} />
      <path d={ridge(260, 22, 1.8, 0.2)} fill="#7aa38f" />
      <Mist y={270} o={0.5} id={id} />
      <path d={ridge(330, 18, 2.2, 2)} fill="#4f8669" />
      {Array.from({ length: 14 }, (_, i) => (
        <RoundTree
          key={i}
          x={20 + i * 58}
          y={430 + ((i * 17) % 20)}
          s={1 + ((i * 7) % 5) / 10}
          fill={i % 2 ? "#2f6648" : "#376f51"}
        />
      ))}
      <path d={ridge(460, 10, 2.8, 1.4)} fill="#2a5a40" />
    </>
  ),
};

export default function Scene({ kind, label, className = "" }) {
  const id = useId().replace(/:/g, "");
  const draw = scenes[kind] || scenes.savanna;
  return (
    <svg
      className={`scene ${className}`}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
    >
      {draw(id)}
    </svg>
  );
}
