const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl bg-surface/60 border border-surface overflow-hidden">
    <div className="aspect-[4/5] bg-surface" />
    <div className="p-4 space-y-3">
      <div className="h-4 w-1/2 bg-background rounded" />
      <div className="h-3 w-2/3 bg-background rounded" />
      <div className="h-8 w-full bg-background rounded" />
    </div>
  </div>
);

const SkeletonGrid = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, idx) => (
      <SkeletonCard key={idx} />
    ))}
  </div>
);

export default SkeletonGrid;

