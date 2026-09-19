import React, { useState } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';

export const CounterWidget: React.FC = () => {
  const [count, setCount] = useState<number>(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => Math.max(0, prev - 1));
  const reset = () => setCount(0);

  return (
    <div
      id="counter-widget-section"
      className="w-full flex flex-col items-center justify-center p-6 bg-white border border-stone-200/80 rounded-2xl shadow-xs"
    >
      <div className="text-center mb-4">
        <p id="counter-helper-label" className="text-sm font-medium text-stone-500 mb-1">
          Interactive State Demo
        </p>
        <div
          id="counter-display-value"
          className="text-5xl font-semibold font-mono-code text-stone-900 tracking-tight"
        >
          {count}
        </div>
      </div>

      <div id="counter-controls-group" className="flex items-center gap-3">
        <button
          type="button"
          id="counter-decrement-btn"
          onClick={decrement}
          disabled={count === 0}
          aria-label="Decrement count"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-700 text-sm font-medium transition-colors hover:bg-stone-100 active:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4 mr-1.5" />
          <span>Decrease</span>
        </button>

        <button
          type="button"
          id="counter-reset-btn"
          onClick={reset}
          disabled={count === 0}
          aria-label="Reset count to zero"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-600 text-sm font-medium transition-colors hover:bg-stone-100 active:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4 mr-1.5" />
          <span>Reset</span>
        </button>

        <button
          type="button"
          id="counter-increment-btn"
          onClick={increment}
          aria-label="Increment count"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-stone-900 text-stone-50 text-sm font-medium transition-colors hover:bg-stone-800 active:bg-stone-950"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Increase</span>
        </button>
      </div>
    </div>
  );
};
