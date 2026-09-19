import type { ObjectKind } from './story';

const shapes: Record<ObjectKind, string> = {
  door: 'M108 196V56q0-12 12-12h80q12 0 12 12v140Z',
  phone: 'M126 36h68q16 0 16 16v136q0 16-16 16h-68q-16 0-16-16V52q0-16 16-16Z',
  speech: 'M100 54h120q30 0 30 30v58q0 28-30 28h-70l-42 30 4-30h-12q-30 0-30-28V84q0-30 30-30Z',
  stop: 'M126 38h68l48 48v68l-48 48h-68l-48-48V86Z',
  headphones: 'M78 138v-22c0-102 164-102 164 0v64q0 12-12 12h-20v-62h16v-14c0-80-132-80-132 0v14h16v62H90q-12 0-12-12Z',
  signal: 'M82 100h50l100-46v120l-74-32 16 52h-32l-18-54H82q-10 0-10-10v-20q0-10 10-10Z',
  bridge: 'M62 188v-78q0-12 12-12h10v22q76-76 152 0V98h10q12 0 12 12v78h-26v-36q-72-60-144 0v36Z',
};

export const objectNames: Record<ObjectKind, string> = {
  door: 'Doorway', phone: 'Phone', speech: 'Speech bubble', stop: 'Stop sign',
  headphones: 'Headphones', signal: 'Megaphone', bridge: 'Bridge',
};

export default function ObjectGlyph({ shape, size = 48, className }: {
  shape: ObjectKind; size?: number; className?: string;
}) {
  return <svg width={size} height={size} viewBox="0 0 320 240" fill="none" className={className} aria-hidden="true" focusable="false">
    <path d={shapes[shape]} stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    {shape === 'phone' && <path d="M145 55h30M153 184h14" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />}
    {shape === 'door' && <circle cx="187" cy="124" r="6" fill="currentColor" />}
  </svg>;
}
