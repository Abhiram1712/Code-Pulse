import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard, useHeatmap, useGoals } from '../hooks/useQueries';
import StatCard from '../components/ui/StatCard';
import StreakTracker from '../components/dashboard/StreakTracker';
import DailyGoals from '../components/dashboard/DailyGoals';
import PlatformCards from '../components/dashboard/PlatformCards';
import ContributionHeatmap from '../components/dashboard/ContributionHeatmap';
import { getGreeting } from '../lib/utils';
import { CheckCircle, Zap, Flame, Code2 } from 'lucide-react';

const SkeletonCard = ({ h = 'h-28' }) => (
  <div className={`panel ${h} skeleton`} />
);

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();
  const { data: heatmapData } = useHeatmap(365);
  const { data: goalsData } = useGoals();

  if (isLoading) return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="h-24 skeleton rounded-2xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SkeletonCard h="h-48" />
          <SkeletonCard h="h-64" />
        </div>
        <div className="space-y-6">
          <SkeletonCard h="h-72" />
          <SkeletonCard h="h-64" />
        </div>
      </div>
    </div>
  );

  const { todayProgress, platformSummary } = data;
  const totalSolvedToday = todayProgress?.totalSolved || 0;
  const platformsArr = Object.entries(platformSummary || {}).map(([platform, s]) => ({ ...s, platform }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative panel overflow-hidden px-6 py-5"
      >
        {/* Animated gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 animate-gradient"
          style={{ background: 'linear-gradient(90deg, #00d4ff, #7c3aed, #e879f9, #00d4ff)', backgroundSize: '200% 100%' }} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <motion.p
              className="section-label mb-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
            >
              {getGreeting()}
            </motion.p>
            <motion.h1
              className="text-2xl font-bold"
              style={{ fontFamily: 'var(--font-display)' }}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Welcome back, <span className="grad-text">{user?.username}</span> 👋
            </motion.h1>
            <motion.p
              className="text-sm mt-1"
              style={{ color: 'var(--text-2)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Here's your coding activity for today.
            </motion.p>
          </div>

          {/* Quick XP badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl flex-shrink-0"
            style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 14px rgba(0,212,255,0.4)' }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Zap size={11} className="text-amber-400" />
                <span className="text-xs font-bold text-amber-400 font-mono">Lv.{user?.level}</span>
              </div>
              <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>{user?.xp} total XP</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Solved Today"  value={totalSolvedToday}    icon={CheckCircle} color="#10b981" delay={0}   />
        <StatCard title="Current Streak" value={user?.currentStreak} icon={Flame}       color="#f97316" delay={0.07} suffix="d" />
        <StatCard title="Total XP"       value={user?.xp}            icon={Zap}         color="#f59e0b" delay={0.14} />
        <StatCard title="Platforms"
          value={Object.values(user?.platforms || {}).filter(p => p.connected).length}
          icon={Code2}
          color="#7c3aed"
          delay={0.21}
          suffix="/4"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          <ContributionHeatmap data={heatmapData || []} />
          <PlatformCards
            platformStats={platformsArr}
            userPlatforms={user?.platforms || {}}
          />
        </div>

        {/* Right 1/3 */}
        <div className="space-y-6">
          <StreakTracker
            currentStreak={user?.currentStreak}
            longestStreak={user?.longestStreak}
            weeklyStreak={user?.weeklyStreak}
            level={user?.level}
            xp={user?.xp}
          />
          <DailyGoals goals={goalsData || []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
