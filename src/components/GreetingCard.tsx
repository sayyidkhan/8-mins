import React, { useState } from 'react';
import { Sparkles, Check, Copy } from 'lucide-react';

interface GreetingCardProps {
  initialRecipient?: string;
}

export const GreetingCard: React.FC<GreetingCardProps> = ({ initialRecipient = 'World' }) => {
  const [recipient, setRecipient] = useState<string>(initialRecipient);
  const [copied, setCopied] = useState<boolean>(false);

  const greetingText = `Hello, ${recipient.trim() || 'World'}!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(greetingText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const quickOptions = ['World', 'Developer', 'Creator', 'Friend'];

  return (
    <section id="greeting-card-container" className="w-full text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 border border-stone-200/90 text-stone-700 text-xs font-medium tracking-wide">
        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        <span>React Starter Project</span>
      </div>

      <div className="space-y-3">
        <h1
          id="main-greeting-heading"
          className="font-display text-4xl sm:text-5xl md:text-6xl text-stone-900 tracking-tight leading-[1.15]"
        >
          {greetingText}
        </h1>
        <p
          id="greeting-subheading-text"
          className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto leading-relaxed"
        >
          Welcome to your fresh React application. Everything is set up with Vite, Tailwind CSS, TypeScript, and modern component architecture.
        </p>
      </div>

      {/* Recipient Customization */}
      <div id="greeting-customizer-panel" className="max-w-md mx-auto w-full pt-2">
        <div className="flex items-center gap-2 p-1.5 bg-white border border-stone-200 rounded-xl shadow-2xs">
          <input
            id="recipient-input-field"
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Type a custom name..."
            maxLength={32}
            className="flex-1 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 bg-transparent outline-none"
            aria-label="Customize greeting recipient"
          />
          <button
            type="button"
            id="copy-greeting-btn"
            onClick={handleCopy}
            className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200/80 active:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
            title="Copy greeting to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1 text-stone-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Quick presets */}
        <div id="quick-preset-chips" className="flex items-center justify-center gap-1.5 mt-2.5">
          <span className="text-xs text-stone-600 mr-1">Presets:</span>
          {quickOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              id={`preset-btn-${opt.toLowerCase()}`}
              onClick={() => setRecipient(opt)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                recipient.toLowerCase() === opt.toLowerCase()
                  ? 'bg-stone-900 text-stone-100 font-medium'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
