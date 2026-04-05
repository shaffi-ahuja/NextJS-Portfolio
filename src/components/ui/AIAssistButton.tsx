'use client';
import { useState } from 'react';

interface Props {
  label?: string;
  onResult: (text: string) => void;
  buildRequest: () => object;
  disabled?: boolean;
}

export default function AIAssistButton({ label = 'AI Assist', onResult, buildRequest, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleClick = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildRequest()),
      });
      const data = await res.json();
      if (!res.ok || !data.result) {
        setError(data.error ?? 'AI assist failed. Try again.');
        return;
      }
      onResult(data.result);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 mt-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || loading}
        aria-label={label}
        className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border
          border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400
          hover:border-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200
          transition-all duration-150 w-fit
          ${(disabled || loading) ? 'opacity-40 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <>
            <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Generating...
          </>
        ) : (
          <>
            {/* Sparkle icon */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-purple-500">
              <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684Z" />
            </svg>
            {label}
          </>
        )}
      </button>
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
