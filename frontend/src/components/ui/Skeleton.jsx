import { cn } from '../../lib/utils';

const SkeletonBlock = ({ className }) => (
  <div className={cn('skeleton animate-pulse', className)} />
);

export const SkeletonCard = ({ className }) => (
  <div className={cn('glass-card p-5', className)}>
    <SkeletonBlock className="h-4 w-24 mb-4 rounded" />
    <SkeletonBlock className="h-8 w-16 mb-2 rounded" />
    <SkeletonBlock className="h-3 w-32 rounded" />
  </div>
);

export const SkeletonChart = ({ className }) => (
  <div className={cn('glass-card p-5', className)}>
    <SkeletonBlock className="h-4 w-32 mb-4 rounded" />
    <SkeletonBlock className="h-48 w-full rounded" />
  </div>
);

export const SkeletonList = ({ count = 3, className }) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <SkeletonBlock className="h-10 w-10 rounded-xl flex-shrink-0" />
        <div className="flex-1">
          <SkeletonBlock className="h-3 w-3/4 mb-2 rounded" />
          <SkeletonBlock className="h-2 w-1/2 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonDashboard = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <SkeletonChart className="lg:col-span-2" />
      <SkeletonCard />
    </div>
  </div>
);

export default SkeletonBlock;
