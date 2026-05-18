import { cn } from '../../lib/utils';

const SkeletonBlock = ({ className }) => (
  <div className={cn('skeleton', className)} />
);

export const SkeletonCard = ({ className }) => (
  <div className={cn('panel p-5', className)}>
    <SkeletonBlock className="h-3 w-20 mb-4 rounded-lg" />
    <SkeletonBlock className="h-8 w-16 mb-2 rounded-lg" />
    <SkeletonBlock className="h-2 w-28 rounded-lg" />
  </div>
);

export const SkeletonChart = ({ className }) => (
  <div className={cn('panel p-5', className)}>
    <SkeletonBlock className="h-4 w-32 mb-5 rounded-lg" />
    <SkeletonBlock className="h-52 w-full rounded-xl" />
  </div>
);

export const SkeletonList = ({ count = 3, className }) => (
  <div className={cn('space-y-3', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <SkeletonBlock className="h-10 w-10 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <SkeletonBlock className="h-3 w-3/4 rounded-lg" />
          <SkeletonBlock className="h-2 w-1/2 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonDashboard = () => (
  <div className="space-y-6 max-w-7xl mx-auto">
    <div className="panel h-24 skeleton" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <div className="space-y-6">
        <SkeletonChart />
        <SkeletonChart />
      </div>
    </div>
  </div>
);

export default SkeletonBlock;
