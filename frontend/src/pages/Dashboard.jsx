import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard, useHeatmap, useGoals } from '../hooks/useQueries';
import { SkeletonDashboard } from '../components/ui/Skeleton';
import StatCard from '../components/ui/StatCard';
import StreakTracker from '../components/dashboard/StreakTracker';
import DailyGoals from '../components/dashboard/DailyGoals';
import PlatformCards from '../components/dashboard/PlatformCards';
import ContributionHeatmap from '../components/dashboard/ContributionHeatmap';
import { getGreeting } from '../lib/utils';
import { Target, CheckCircle, Clock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();
  const { data: heatmapData } = useHeatmap(365);
  const { data: goalsData } = useGoals();

  if (isLoading) return <SkeletonDashboard />;

  const { todayProgress, platformSummary } = data;

  const totalSolvedToday = todayProgress?.totalSolved || 0;
  const codingMinutes = todayProgress?.codingMinutes || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <motion.h1 
            className="text-3xl font-display font-bold text-white mb-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {getGreeting()}, <span className="text-cyan-400">{user?.username}</span> 👋
          </motion.h1>
          <motion.p 
            className="text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Here's your coding activity for today.
          </motion.p>
        </div>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          title="Solved Today" 
          value={totalSolvedToday} 
          icon={CheckCircle} 
          color="#22c55e" 
          delay={0}
        />
        <StatCard 
          title="Total XP" 
          value={user?.xp} 
          icon={Zap} 
          color="#f59e0b"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <ContributionHeatmap data={heatmapData || []} />
          <PlatformCards platformStats={Object.values(platformSummary || {}).map((s, i) => ({ ...s, platform: Object.keys(platformSummary)[i] }))} userPlatforms={user?.platforms} />
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          <StreakTracker 
            currentStreak={user?.currentStreak} 
            longestStreak={user?.longestStreak} 
            weeklyStreak={user?.weeklyStreak}
            level={user?.level}
            xp={user?.xp}
          />
          <DailyGoals 
            goals={goalsData || []} 
            onAddGoal={() => {
              // Usually you'd open a modal here. For now just redirecting or showing toast.
              toast('Navigate to goals page to add new goals!', { icon: '🎯' });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
