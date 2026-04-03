// RSC-safe — pure CSS, no client JS needed
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-md ${className}`}
      aria-hidden="true"
    />
  );
}

export function WorkCardSkeleton() {
  return (
    <div className="flex flex-row gap-3 mb-8" aria-hidden="true">
      <div className="flex-shrink-0">
        <SkeletonBlock className="w-10 h-10 rounded-md" />
      </div>
      <div className="flex-1 space-y-2">
        <SkeletonBlock className="h-5 w-48" />
        <SkeletonBlock className="h-3 w-32" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-5/6" />
        <SkeletonBlock className="h-3 w-4/6" />
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="project-card-container" aria-hidden="true">
      <SkeletonBlock className="w-20 h-20 rounded-2xl mb-3" />
      <SkeletonBlock className="h-6 w-3/4 mb-3" />
      <SkeletonBlock className="h-3 w-full mb-1" />
      <SkeletonBlock className="h-3 w-full mb-1" />
      <SkeletonBlock className="h-3 w-2/3 mb-5" />
      <div className="flex gap-2">
        <SkeletonBlock className="w-8 h-8 rounded-full" />
        <SkeletonBlock className="w-8 h-8 rounded-full" />
        <SkeletonBlock className="w-8 h-8 rounded-full" />
      </div>
    </div>
  );
}

export function AboutGridSkeleton() {
  return (
    <div className="about-me-grid" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="card">
          <SkeletonBlock className="h-48 w-full mb-3 rounded-md" />
          <SkeletonBlock className="h-5 w-3/4 mb-2" />
          <SkeletonBlock className="h-3 w-full mb-1" />
          <SkeletonBlock className="h-3 w-5/6" />
        </div>
      ))}
    </div>
  );
}
