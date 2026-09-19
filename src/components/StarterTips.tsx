import React from 'react';
import { StarterTip } from '../types';
import { FileCode, Layers, Terminal } from 'lucide-react';

const starterTips: StarterTip[] = [
  {
    id: 'tip-entry',
    title: 'Component Structure',
    description: 'Edit components in /src/components or create new ones to build your UI.',
    codeSnippet: 'src/components/*.tsx',
  },
  {
    id: 'tip-styling',
    title: 'Tailwind CSS Styling',
    description: 'Use utility classes directly or customize tokens in index.css.',
    codeSnippet: '@import "tailwindcss";',
  },
  {
    id: 'tip-scripts',
    title: 'Instant Fast Refresh',
    description: 'Vite compiles changes instantaneously with zero configuration.',
    codeSnippet: 'npm run build',
  },
];

export const StarterTips: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'tip-entry':
        return <FileCode className="w-4 h-4 text-stone-700" />;
      case 'tip-styling':
        return <Layers className="w-4 h-4 text-stone-700" />;
      default:
        return <Terminal className="w-4 h-4 text-stone-700" />;
    }
  };

  return (
    <div id="starter-tips-container" className="w-full space-y-3 pt-2">
      <div className="flex items-center justify-between px-1">
        <h2 id="starter-tips-header" className="text-xs font-semibold uppercase tracking-wider text-stone-600">
          Starter Architecture
        </h2>
        <span className="text-xs text-stone-600 font-mono-code">ready for development</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {starterTips.map((tip) => (
          <div
            key={tip.id}
            id={tip.id}
            className="p-4 bg-white border border-stone-200/90 rounded-xl flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-md bg-stone-100">{getIcon(tip.id)}</div>
                <h3 className="text-sm font-semibold text-stone-900">{tip.title}</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">{tip.description}</p>
            </div>
            {tip.codeSnippet && (
              <div className="pt-1">
                <code className="inline-block w-full px-2.5 py-1 text-[11px] font-mono-code text-stone-700 bg-stone-100/90 rounded border border-stone-200/60 truncate">
                  {tip.codeSnippet}
                </code>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
