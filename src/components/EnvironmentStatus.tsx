import React from 'react';
import { StackTechnology } from '../types';
import { CheckCircle2 } from 'lucide-react';

const technologies: StackTechnology[] = [
  { name: 'React', version: 'v19.0', category: 'core', status: 'active' },
  { name: 'Vite', version: 'v8.3', category: 'tooling', status: 'active' },
  { name: 'Tailwind CSS', version: 'v4.3', category: 'style', status: 'active' },
  { name: 'TypeScript', version: 'v7.0', category: 'tooling', status: 'active' },
];

export const EnvironmentStatus: React.FC = () => {
  return (
    <div id="environment-status-container" className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
      {technologies.map((tech) => (
        <span
          key={tech.name}
          id={`tech-badge-${tech.name.toLowerCase().replace(/\s+/g, '-')}`}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-stone-700 bg-stone-100 border border-stone-200/80 rounded-full whitespace-nowrap select-none"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{tech.name}</span>
          <span className="text-stone-400 font-mono-code text-[11px]">{tech.version}</span>
        </span>
      ))}
    </div>
  );
};
