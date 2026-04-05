"use client";
import { useEffect, useState } from "react";

export default function ViewsToast({ slug }: { slug: string }) {
  const [views, setViews] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    fetch(`/api/portfolio/views?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.views === "number") {
          setViews(d.views);

          // Show after slight delay (for smooth UX)
          setTimeout(() => setVisible(true), 800);
        }
      })
      .catch(() => {});
  }, [slug]);

  if (!mounted || views === null) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`This portfolio has been viewed ${views} times`}
      className={`fixed bottom-6 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full
        bg-white/90 backdrop-blur dark:bg-zinc-900/80
        border border-zinc-200 dark:border-zinc-700
        shadow-md text-sm text-zinc-700 dark:text-zinc-300
        transition-all duration-500 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      {/*  Live Dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
      </span>

      {/* Views */}
      <span>
        <span className="font-semibold">{views.toLocaleString()}</span>{" "}
        {views === 1 ? "view" : "views"}
      </span>
    </div>
  );
}
