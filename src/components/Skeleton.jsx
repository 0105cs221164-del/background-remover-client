// Reusable shimmer skeleton blocks
const Skeleton = ({ className = "" }) => (
  <div className={"animate-pulse bg-white/8 rounded-lg " + className} />
);

export const HistorySkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="card p-0 overflow-hidden">
        <Skeleton className="h-40 rounded-none" />
        <div className="p-3 flex justify-between items-center">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    ))}
  </div>
);

export const DashboardSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-64 w-full rounded-2xl" />
  </div>
);

export default Skeleton;
