import { useId } from 'react';
import type { CSSProperties } from 'react';
import './world.css';

export interface StoryWorldProps {
  chapter: number;
  phase: 'intro' | 'reading' | 'drawing' | 'outcome' | 'detour' | 'ending';
  object?: string;
  className?: string;
}

const CHAPTER_DESCRIPTIONS = [
  'Bob meets a group of young people beside the woodland path.',
  'A person gestures to Bob at a fork in the path. The well-lit way home is still open.',
  'Bob pauses beside a quiet bench, with another person nearby.',
  'Bob stays beside an unwell seated friend. A trusted adult is nearby to help.',
  'A small bridge leads toward a welcoming person and the light of home.',
];

const OBJECT_NAMES: Record<string, string> = {
  door: 'an open doorway', phone: 'a phone', speech: 'a speech bubble',
  stop: 'a raised hand in a stop sign', headphones: 'headphones',
  signal: 'a signal for help', bridge: 'a bridge',
};

/** Small irregular silhouettes give the forest an illustrated, cut-paper edge. */
function Fir({ x, y, scale = 1, color = '#31574f' }: {
  x: number; y: number; scale?: number; color?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-4 0 0-129 5 0Z" fill="#655a43" />
      <path d="M0-154-25-104-13-108-37-70-22-76-47-29-18-35-39-9 0-17 40-7 24-34 48-28 23-75 37-68 13-109 26-103Z" fill={color} />
      <path d="M0-139 0-25M0-94-15-81M1-71 19-57M0-48-25-31" fill="none" stroke="#e4d9aa" strokeOpacity=".13" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Sprig({ x, y, scale = 1, color = '#7d9270', flip = false }: {
  x: number; y: number; scale?: number; color?: string; flip?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`} fill={color}>
      <path d="M0 0Q-1-43 18-83" fill="none" stroke={color} strokeWidth="2.4" />
      <path d="M2-15Q-28-17-24-37 0-36 2-15M4-31Q28-31 32-50 10-51 4-31M8-47Q-15-50-13-68 8-64 8-47M13-62Q34-65 30-83 13-80 13-62M17-77Q10-92 23-103 31-88 17-77" />
    </g>
  );
}

function Bob({ x, y, scale = 1, hesitant = false, phone = false }: {
  x: number; y: number; scale?: number; hesitant?: boolean; phone?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cy="3" rx="29" ry="7" fill="#203e37" opacity=".19" />
      <path d="M-12-37-13-4-5-2 2-30 10-5 19-5 12-41" fill="#354c47" />
      <path d="m-14-7-5 7q-1 5 14 3l3-6M10-6l-1 8q8 4 16 0l-8-8" fill="#253e3b" />
      <path d="M-15-78Q-28-63-32-33Q-9-23 22-33L14-76Z" fill="#a77432" />
      <path d="M-13-79Q-23-68-24-37Q-3-28 26-38L12-77Z" fill="#dfad4e" />
      <path d="M-10-75Q-11-52-18-36M11-71 18-40" fill="none" stroke="#f8d47b" strokeWidth="3" strokeLinecap="round" />
      <path d="M-19-72Q-3-81 10-65" fill="none" stroke="#745838" strokeWidth="4" />
      <rect x="-26" y="-68" width="23" height="30" rx="8" fill="#976440" transform="rotate(-8 -14 -52)" />
      <path d="M-25-58Q-15-53-4-59M-15-58v6" fill="none" stroke="#d6a060" strokeWidth="2" />
      <path d="M3-83v10q7 7 12-2l-2-12" fill="#c99068" />
      <g transform={hesitant ? 'rotate(9 0 -94)' : undefined}>
        <path d="M-14-102Q-10-118 7-114 23-111 20-95L24-88 17-85Q14-72 0-79L-12-88Z" fill="#e0ae82" />
        <path d="M-14-88Q-28-105-13-116-6-126 7-120 26-120 22-104L10-106 5-96-3-102-7-90Z" fill="#283d3c" />
        <path d="M-14-112Q-1-119 10-113" fill="none" stroke="#49605a" strokeWidth="3" strokeLinecap="round" />
        <circle cx="15" cy="-96" r="1.7" fill="#34453e" />
        <path d="m17-83-5 1" fill="none" stroke="#aa7255" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      {phone ? (
        <g>
          <path d="M14-64 28-73 24-89" fill="none" stroke="#dfad4e" strokeWidth="10" strokeLinecap="round" />
          <rect x="19" y="-101" width="10" height="19" rx="3" fill="#34504b" transform="rotate(-12 24 -92)" />
          <path d="m23-97 2 9" stroke="#e9dbaa" strokeWidth="3" />
        </g>
      ) : (
        <g transform="rotate(-12 22 -47)">
          <rect x="14" y="-57" width="20" height="26" rx="2" fill="#f4e7bd" stroke="#856747" strokeWidth="2" />
          <path d="M19-55v22M23-49h6M23-44h5" stroke="#baa77c" strokeWidth="1.3" />
          <path d="M15-65 20-53" stroke="#dfad4e" strokeWidth="10" strokeLinecap="round" />
          <circle cx="22" cy="-51" r="4" fill="#e0ae82" />
        </g>
      )}
    </g>
  );
}

function Person({ x, y, scale = 1, coat = '#9f786c', seated = false, gesture = false, adult = false }: {
  x: number; y: number; scale?: number; coat?: string; seated?: boolean; gesture?: boolean; adult?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cy="3" rx="25" ry="6" fill="#243e3a" opacity=".15" />
      {seated ? (
        <>
          <path d="M-26-7Q-34-30-10-35 12-43 29-19L27 0Z" fill="#87917a" />
          <path d="M-6-35 17-31 23-5M-11-31 2-20 7-4" fill="none" stroke="#3d5353" strokeWidth="10" strokeLinecap="round" />
        </>
      ) : <path d="m-12-34-3 34h10l7-28L9 0h11l-8-38" fill="#405654" />}
      <g transform={seated ? 'translate(-6 20) rotate(-12 0 -65)' : undefined}>
        <path d="M-11-77Q-23-69-21-36 0-27 20-36 20-65 10-76Z" fill={coat} />
        <path d="M-9-75 0-65 10-74" fill="none" stroke="#eee2bd" strokeOpacity=".5" strokeWidth="3" />
        <path d={gesture ? 'M13-66 29-53 43-62' : 'M-15-66-23-43M14-64 22-42'} stroke={coat} strokeWidth="9" strokeLinecap="round" fill="none" />
        <circle cx={gesture ? 43 : 22} cy={gesture ? -62 : -40} r="4" fill="#c99a79" />
        <path d="M-4-86v12h11v-14" fill="#b98465" />
        <ellipse cy="-96" rx="15" ry="19" fill="#c99a79" />
        <path d={adult ? 'M-15-95Q-23-120 0-119 22-121 17-94L9-103-8-102-12-90Z' : 'M-14-90Q-23-111-8-119 14-128 20-106L7-108-2-102-9-105-10-91Z'} fill={adult ? '#78786b' : '#3d4942'} />
        <path d="M-6-94h1M7-94h1" stroke="#34463e" strokeWidth="2.3" strokeLinecap="round" />
        <path d={seated ? 'm-3-83 6-1' : 'M-3-85q4 3 7-1'} fill="none" stroke="#96674f" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <path d="m-15 0-4 3h15M10 1l13 2" fill="none" stroke="#2c4340" strokeWidth="5" strokeLinecap="round" />
    </g>
  );
}

function ToolGlyph({ object }: { object: string }) {
  switch (object) {
    case 'door': return <><path d="M-24 30v-61h48v61M-24-31 10-22v61l-34-9M15 30h17" /><circle cx="1" cy="5" r="2" fill="currentColor" stroke="none" /><path d="M-12 1h-29m8-8-8 8 8 8" /></>;
    case 'phone': return <><rect x="-20" y="-34" width="40" height="68" rx="7" /><path d="M-7-26H7M-5 25H5M28-22q10 9 0 18M35-30q17 17 0 34" /></>;
    case 'speech': return <><path d="M-32-24Q0-39 31-24 44-5 30 14 15 27-7 20L-28 34l4-22Q-42-2-32-24Z" /><path d="M-17-8h34M-17 3H7" /></>;
    case 'stop': return <><path d="m-14-34 29 0 20 20v29L15 35h-29l-21-20v-29Z" /><path d="M-10 14-17 0q-2-6 3-5l7 5v-17q0-6 5-3v13-18q4-6 7 0v18-15q5-4 7 2v16-10q6-5 6 3v17q-2 13-13 13Z" strokeWidth="3" /></>;
    case 'headphones': return <><path d="M-30 8v-12a30 30 0 0 1 60 0V8M-23-8a23 23 0 0 1 46 0" /><rect x="-33" y="2" width="14" height="28" rx="6" /><rect x="19" y="2" width="14" height="28" rx="6" /></>;
    case 'signal': return <><path d="M-34-9h19L24-28v56L-15 9h-19ZM-15 10l8 22H5L0 13M34-12l8-4M35 0h12M34 12l8 4" /></>;
    case 'bridge': return <><path d="M-37 29v-49M37 29v-49M-37-16Q0 23 37-16M-37 16H37M-24-4v20M-8 4v12M8 4v12M24-4v20M-43 29h13M30 29h13" /></>;
    default: return null;
  }
}

export default function StoryWorld({ chapter, phase, object, className = '' }: StoryWorldProps) {
  const uid = `world-${useId().replace(/:/g, '')}`;
  const paint = (name: string) => `url(#${uid}-${name})`;
  const page = Number.isFinite(chapter) ? Math.max(0, Math.min(4, Math.floor(chapter))) : 0;
  const intro = phase === 'intro';
  const ending = phase === 'ending';
  const outcome = phase === 'outcome';
  const night = !intro && page >= 3;
  const tool = outcome && object && OBJECT_NAMES[object] ? object : undefined;
  const bobX = ending ? 772 : intro ? 434 : outcome ? 505 : 452;
  const bobY = ending ? 323 : intro ? 523 : 493;
  const description = ending
    ? 'Bob has reached the warmly lit house. Someone trusted is waiting to welcome him home.'
    : intro
      ? 'A winding golden path leads through a layered green forest to a warmly lit house. Bob, wearing a mustard cape and carrying his sketchbook, begins the journey beneath a peach-coloured sky.'
      : `${CHAPTER_DESCRIPTIONS[page]}${tool ? ` A luminous drawing of ${OBJECT_NAMES[tool]} appears beside Bob, and the route ahead glows.` : ''}${phase === 'detour' ? ' Bob pauses; the welcoming path remains open.' : ''}`;

  return (
    <div className={`world-scene world-scene--${phase}${night ? ' world-scene--night' : ''}${className ? ` ${className}` : ''}`}>
      <svg className="world-art" viewBox="0 0 1000 660" role="img" aria-labelledby={`${uid}-title ${uid}-description`} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <title id={`${uid}-title`}>{ending ? 'A light to come home to' : 'Bob’s way through the evening woods'}</title>
        <desc id={`${uid}-description`}>{description}</desc>
        <defs>
          <linearGradient id={`${uid}-sky`} x2="0" y2="1">
            <stop stopColor={night ? '#71868b' : '#eab89a'} />
            <stop offset=".55" stopColor={night ? '#c6b8a2' : '#f4d6aa'} />
            <stop offset="1" stopColor="#f4e2b7" />
          </linearGradient>
          <linearGradient id={`${uid}-hill`} x2=".4" y2="1">
            <stop stopColor="#78947a" /><stop offset="1" stopColor="#476f5a" />
          </linearGradient>
          <linearGradient id={`${uid}-meadow`} x1="0" y1="0" x2=".6" y2="1">
            <stop stopColor="#698362" /><stop offset="1" stopColor="#284f44" />
          </linearGradient>
          <linearGradient id={`${uid}-path`} x1=".9" y1="0" x2=".3" y2="1">
            <stop stopColor="#f4d997" /><stop offset=".55" stopColor="#d4b477" /><stop offset="1" stopColor="#ead09a" />
          </linearGradient>
          <radialGradient id={`${uid}-sun`}><stop stopColor="#fff6c9" stopOpacity=".8" /><stop offset="1" stopColor="#ffe1a6" stopOpacity="0" /></radialGradient>
          <radialGradient id={`${uid}-lamp`}><stop stopColor="#fff1ad" stopOpacity=".7" /><stop offset="1" stopColor="#f6cf76" stopOpacity="0" /></radialGradient>
          <radialGradient id={`${uid}-magic`}><stop stopColor="#fff5c9" stopOpacity=".6" /><stop offset=".6" stopColor="#f9da8e" stopOpacity=".15" /><stop offset="1" stopColor="#f9da8e" stopOpacity="0" /></radialGradient>
          <filter id={`${uid}-paper`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" stitchTiles="stitch" seed="8" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Open sky and distant, hazy ridgelines. */}
        <path fill={paint('sky')} d="M0 0h1000v660H0z" />
        <circle cx="604" cy="158" r="153" fill={paint('sun')} />
        {night ? <path d="M641 102a43 43 0 1 1-47 64 43 43 0 0 0 47-64Z" fill="#fff0c4" /> : <circle cx="605" cy="161" r="49" fill="#fff0c5" opacity=".94" />}
        <g fill="none" stroke="#fff2d1" strokeLinecap="round" opacity=".35">
          <path d="M321 108q61-12 118 0M344 114h115M650 208q72-10 137-1M128 189q53-8 95-1" strokeWidth="5" />
          <path d="M726 96h61M749 103h57M462 61h77" strokeWidth="3" />
        </g>
        <g fill="#fff4d4" className="world-stars" opacity={night ? '.9' : '.6'}>
          {[[254, 79], [364, 44], [491, 122], [696, 53], [798, 144], [868, 77], [570, 48], [187, 131]].map(([x, y], i) => <path key={i} d={`M${x} ${y - 5}q0 5 5 5-5 0-5 5 0-5-5-5 5 0 5-5Z`} />)}
          <circle cx="417" cy="151" r="1.5" /><circle cx="751" cy="56" r="1.5" /><circle cx="544" cy="93" r="1.7" />
        </g>
        <g fill="none" stroke="#697c70" strokeWidth="2" strokeLinecap="round" opacity=".65">
          <path d="M698 164q6-5 12 0 6-5 12-1M726 153q4-4 8 0 4-4 8-1M464 195q5-5 10 0 5-5 10 0" />
        </g>
        <path d="M0 289Q110 209 209 254T399 235Q511 166 650 251T1000 218V660H0Z" fill="#acb59a" />
        <path d="M0 337Q105 252 248 311 365 365 518 284 665 212 787 263 912 309 1000 275V660H0Z" fill="#8eaa8c" />
        <g opacity=".65">
          {[60, 107, 160, 207, 267, 324, 675, 710, 919, 959].map((x, i) => <Fir key={x} x={x} y={i < 6 ? 318 + (i % 3) * 9 : 291} scale={.35 + (i % 3) * .09} color="#70947e" />)}
        </g>
        <path d="M0 365Q162 303 295 355 420 405 601 314 758 246 1000 334V660H0Z" fill={paint('hill')} />
        <path d="M0 421Q196 346 367 408T677 378Q854 308 1000 390V660H0Z" fill={paint('meadow')} />
        <path d="M0 487Q166 386 339 447T654 431Q855 398 1000 467V660H0Z" fill="#456c50" opacity=".58" />

        {/* A single continuous ribbon always leaves a visible way forward. */}
        <path d="M285 660C296 583 450 562 491 510S363 445 474 399 663 393 687 356 741 323 805 311L804 306C725 312 680 323 668 350S507 341 434 383 418 443 441 468 331 530 263 552 164 612 158 660Z" fill="#344f3e" opacity=".2" transform="translate(0 8)" />
        <path d="M285 660C296 583 450 562 491 510S363 445 474 399 663 393 687 356 741 323 805 311L804 306C725 312 680 323 668 350S507 341 434 383 418 443 441 468 331 530 263 552 164 612 158 660Z" fill={paint('path')} />
        <path d="M187 659C212 565 402 560 460 500S362 435 456 393 656 377 677 351 756 319 797 311" fill="none" stroke="#fff0bf" strokeOpacity=".32" strokeWidth="3" />
        <g stroke="#b09567" strokeWidth="2" strokeLinecap="round" opacity=".45">
          <path d="m234 624 14-6m51-39 12-4m91-35 10-3m55-28 6-5m-12-60 8 2m-28-32 7-4m70-30 10-1m90-11 7-1m74-24 5-2" />
        </g>
        {(outcome || ending) && <path className="world-route-glow" d="M465 479C390 421 425 397 525 387S660 378 678 352 743 323 798 311" fill="none" stroke="#ffebac" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 13" opacity=".85" />}

        {/* The destination is deliberately warm and readable, even at phone size. */}
        <g transform="translate(812 294)">
          <ellipse cy="29" rx="91" ry="13" fill="#2c5848" opacity=".2" />
          <circle cy="-10" r="105" fill={paint('lamp')} opacity=".55" />
          <path d="M-47-40 8-57 55-29V25L-47 26Z" fill="#e3c698" />
          <path d="M8-56 55-29V25L8 17Z" fill="#bea77e" />
          <path d="M-59-37 0-86 65-33 52-25 0-67-49-26Z" fill="#6c6253" />
          <path d="M-59-37 0-86 65-33" fill="none" stroke="#e5c397" strokeWidth="4" strokeLinejoin="round" />
          <path d="M27-64v-29h13v40" fill="#8b7962" />
          <path d="M24-93h19" stroke="#615c50" strokeWidth="5" strokeLinecap="round" />
          <path className="world-chimney-wisp" d="M33-107q-13-10 0-23t-3-22" fill="none" stroke="#f2e8cc" strokeWidth="8" strokeLinecap="round" opacity=".3" />
          <path d="M-15 25v-36q12-16 25 0v36" fill="#795f43" />
          <path d="M-10 23v-33q8-9 15 0v33" fill="#ffdda0" />
          <path d="M-15 26-35 44 18 40 10 26" fill="#f5d18a" opacity=".45" />
          <rect x="-38" y="-17" width="17" height="21" rx="2" fill="#ffe3a0" stroke="#8c7754" strokeWidth="3" />
          <path d="M-30-17V4m-8-11h17" stroke="#a78a5b" strokeWidth="2" />
          <path d="m24-17 17 6v19L24 3Z" fill="#f5d58a" stroke="#8f7b59" strokeWidth="3" />
          <circle cx="0" cy="-46" r="9" fill="#f8d791" stroke="#9b855f" strokeWidth="3" />
          <path d="M0-54v16m-8-8H8" stroke="#a58c60" strokeWidth="2" />
          <path d="M-45 27h57M-48 31h63" stroke="#a28c68" strokeWidth="3" />
        </g>
        <g fill="none" stroke="#b0af85" strokeWidth="3" strokeLinecap="round">
          <path d="M859 319v-23m16 27v-22m16 27v-23m16 27v-22m-50-7 54 14m-54-4 54 14" />
        </g>

        {/* Midground trees, hand-drawn meadow marks, and a guiding lantern. */}
        <Fir x={106} y={427} scale={1.25} color="#3b6656" />
        <Fir x={173} y={405} scale={.85} color="#49755e" />
        <Fir x={892} y={369} scale={.9} color="#4b735c" />
        <Fir x={947} y={412} scale={1.35} color="#315e50" />
        <g fill="none" stroke="#a4b184" strokeWidth="2" strokeLinecap="round" opacity=".5">
          <path d="m241 388-3-8m3 8 5-6m85 21-2-9m2 9 5-6m218 19 3-8m-3 8-4-5m177-58 3-7m-3 7-4-4m114 57 2-9m-2 9-5-5M91 480l-3-9m3 9 6-6m625-38-2-8m2 8 5-5m99 49 3-9m-3 9-5-5" />
        </g>
        <g fill="#e0cd96" opacity=".7">
          {[[225, 424], [288, 453], [579, 457], [621, 435], [711, 394], [841, 435], [752, 483], [337, 372]].map(([x, y]) => <g key={x}><circle cx={x} cy={y} r="2.3" /><circle cx={x + 8} cy={y - 4} r="1.6" /><path d={`M${x} ${y + 8}v-6`} stroke="#a4af7b" strokeWidth="1.5" /></g>)}
        </g>
        <g transform="translate(611 382)">
          <path d="M0 3v-75q0-8-8-8h-10" fill="none" stroke="#455849" strokeWidth="4" strokeLinecap="round" />
          <circle cx="-18" cy="-59" r="43" fill={paint('lamp')} />
          <path d="m-27-70 18 0-2 22h-14Z" fill="#f8d588" stroke="#626448" strokeWidth="2.5" />
          <path d="m-30-71 12-9 12 9ZM-26-46h16" fill="#53604b" stroke="#53604b" strokeWidth="2" />
          <path d="M-18-67v14" stroke="#fff1bf" strokeWidth="3" strokeLinecap="round" />
        </g>

        {!intro && !ending && <g className="world-encounter" key={`encounter-${page}`}>
          {page === 0 && <>
            <path d="M228 458q60-30 126 3l-2 19H225Z" fill="#506e56" />
            <Person x={279} y={480} scale={.86} coat="#8c8279" gesture />
            <Person x={349} y={488} scale={.94} coat="#9d7566" />
            <Person x={221} y={458} scale={.7} coat="#677d7d" />
          </>}
          {page === 1 && <>
            <Person x={588} y={485} scale={.94} coat="#a78170" gesture />
            <g transform="translate(338 448) rotate(-4)">
              <path d="M0 0v-87" stroke="#817454" strokeWidth="6" />
              <path d="M-26-82H24l13 11-13 11h-50Z" fill="#b9ab7e" stroke="#716f51" strokeWidth="2" />
              <path d="M-13-71H20m-6-5 6 5-6 5" fill="none" stroke="#687354" strokeWidth="2" />
            </g>
          </>}
          {page === 2 && <>
            <g transform="translate(327 496)">
              <path d="M-66-28 45-28M-61-42H40M-61-53H40" stroke="#a18e66" strokeWidth="9" strokeLinecap="round" />
              <path d="M-53-58v60M32-58V2M-61-23l-8 24M40-23l8 24" stroke="#4b5c49" strokeWidth="5" />
            </g>
            <Person x={588} y={472} scale={.82} coat="#899080" gesture />
            <Sprig x={266} y={495} scale={.52} color="#91a171" />
          </>}
          {page === 3 && <>
            <Person x={outcome ? 581 : 563} y={493} scale={1} coat="#8a939e" seated />
            <Person x={outcome ? 641 : 724} y={outcome ? 486 : 421} scale={outcome ? 1.05 : .8} coat="#c2ac87" adult />
            {outcome && <g transform="translate(663 414) rotate(-14)"><rect x="-5" y="-13" width="11" height="21" rx="2" fill="#314e48" /><path d="M-1-9h3v10h-3Z" fill="#f8dfa3" /></g>}
          </>}
          {page === 4 && <>
            <path d="M564 434q65 15 125 54t190 29" fill="none" stroke="#809d8f" strokeWidth="23" opacity=".7" />
            <path d="M588 443q58 17 94 39m38 18 87 17" fill="none" stroke="#c3cbb0" strokeWidth="2" opacity=".6" />
            <g transform="translate(577 450) rotate(-13)">
              <path d="M-31 12q50-25 105-5v18q-51-20-105 1Z" fill="#ab9468" />
              <path d="M-32-12Q20-37 75-17M-32 3Q20-22 75-2M-31-21v50M75-25v51M-5-29v48M23-34v49M50-31v49" fill="none" stroke="#d2ba86" strokeWidth="5" strokeLinecap="round" />
              <path d="m-20 10 2 11M0 4l2 11M22 1v12M43 2v12M63 6v11" stroke="#756f4d" strokeWidth="2" />
            </g>
            <Person x={689} y={413} scale={.8} coat="#c0ab87" adult gesture />
          </>}
        </g>}

        {ending && <Person x={828} y={323} scale={.48} coat="#bb9879" adult gesture />}
        <Bob x={bobX} y={bobY} scale={ending ? .51 : intro ? 1.02 : 1.08} hesitant={phase === 'detour' || (page === 2 && !outcome)} phone={outcome && object === 'phone'} />

        {tool && <g transform={`translate(${bobX + 10} ${bobY - 193})`}>
          <g className="world-materialized" key={`${page}-${tool}`}>
            <circle r="86" fill={paint('magic')} />
            <circle r="54" fill="#f7e5b8" fillOpacity=".12" stroke="#ffedb6" strokeOpacity=".55" strokeWidth="1" strokeDasharray="2 8" />
            <g fill="none" stroke="#ffe8a3" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" filter={paint('glow')} opacity=".65"><ToolGlyph object={tool} /></g>
            <g fill="none" stroke="#fff1c2" color="#fff1c2" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><ToolGlyph object={tool} /></g>
            <g fill="#fff2c6"><path d="M-53-40q0 8 8 8-8 0-8 8 0-8-8-8 8 0 8-8ZM53 18q0 6 6 6-6 0-6 6 0-6-6-6 6 0 6-6Z" /><circle cx="33" cy="-53" r="2.5" /><circle cx="-35" cy="46" r="2" /></g>
          </g>
        </g>}

        {/* Asymmetric foreground framing keeps the central story stage clear. */}
        <path d="M0 588Q100 518 224 581L289 660H0Z" fill="#294f42" />
        <path d="M652 660Q740 547 830 555T1000 527V660Z" fill="#2d5142" />
        <path d="M0 0H71Q44 143 75 297L104 526l-51 43Q26 362 20 227L0 173Z" fill="#2b4d43" />
        <path d="M44 313Q106 242 164 217M39 225Q4 148-16 132M57 145Q124 122 146 65" fill="none" stroke="#2b4d43" strokeWidth="17" strokeLinecap="round" />
        <path d="M43 37Q28 205 60 345L79 484" fill="none" stroke="#789073" strokeWidth="3" opacity=".3" />
        <path d="M0 0H255Q226 36 184 30 199 64 153 74 153 113 107 110 95 150 43 124L0 140Z" fill="#315747" />
        <path d="M0 0H205Q184 21 150 18 171 47 125 49 132 79 83 77 54 113 0 89Z" fill="#45684f" />
        <path d="M1000 0h-50q14 127-3 265l-46 298 46 31q22-206 29-293l24-90Z" fill="#294d43" />
        <path d="M957 258q-39-53-82-71M970 163q-44-64-73-82" fill="none" stroke="#294d43" strokeWidth="15" strokeLinecap="round" />
        <path d="M967 90q10 117-23 292" fill="none" stroke="#789073" strokeWidth="3" opacity=".25" />
        <path d="M1000 0H827q-24 34 22 49-20 41 33 48-4 44 48 49 19 35 70 23Z" fill="#315747" />
        <path d="M1000 0H873q-13 25 21 31-7 31 35 34 13 34 71 28Z" fill="#45694f" />
        <g fill="#71906a" opacity=".4">
          <ellipse cx="133" cy="28" rx="18" ry="6" transform="rotate(-22 133 28)" /><ellipse cx="86" cy="67" rx="16" ry="5" transform="rotate(-30 86 67)" /><ellipse cx="906" cy="29" rx="17" ry="5" transform="rotate(26 906 29)" />
        </g>
        <Sprig x={86} y={610} scale={1.1} color="#6e8b60" />
        <Sprig x={141} y={650} scale={.95} color="#91a374" flip />
        <Sprig x={38} y={650} scale={.78} color="#486e51" flip />
        <Sprig x={216} y={660} scale={.64} color="#7c9466" />
        <Sprig x={887} y={628} scale={1.15} color="#718b61" flip />
        <Sprig x={817} y={663} scale={.9} color="#9daa77" />
        <Sprig x={965} y={656} scale={1.28} color="#496f52" />
        <Sprig x={720} y={663} scale={.58} color="#748e65" flip />
        <g stroke="#b8b580" strokeWidth="2" fill="#e1c38d">
          <path d="M171 625q-8-21-4-43M180 630q-2-24 11-34M850 614q-6-21 4-44" fill="none" />
          <ellipse cx="167" cy="582" rx="5" ry="3" transform="rotate(-20 167 582)" /><ellipse cx="191" cy="596" rx="5" ry="3" /><ellipse cx="854" cy="570" rx="5" ry="3" />
        </g>
        <g transform="translate(108 560)">
          <path d="M0 17V0m18 22V10" stroke="#d8caa0" strokeWidth="5" strokeLinecap="round" />
          <path d="M-14 1Q0-22 14 1Z" fill="#c38c66" /><path d="M8 11q10-17 21 0Z" fill="#d6a178" />
          <path d="M-5-3h2m7-1h1m12 11h2" stroke="#f1d5a3" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <g className="world-fireflies" fill="#ffe2a0">
          {[[314, 508], [567, 523], [708, 453], [225, 345], [869, 481], [373, 575]].map(([x, y], i) => <circle key={x} className="world-firefly" cx={x} cy={y} r={i % 2 ? 2 : 2.7} style={{ '--world-delay': `${i * -.73}s` } as CSSProperties} />)}
        </g>
        <path d="M0 0h1000v660H0Z" filter={paint('paper')} opacity=".075" className="world-paper" />
        <path d="M0 0h1000v660H0Z" fill="none" stroke="#f0dfb7" strokeWidth="3" strokeOpacity=".3" />
      </svg>
    </div>
  );
}
