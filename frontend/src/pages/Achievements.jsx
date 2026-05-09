import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock } from 'lucide-react';
import { useAchievements } from '../hooks/useQueries';
import { cn } from '../lib/utils';
import api from '../lib/api';

const ALL_ACHIEVEMENTS = [
  { id: 'first_problem', title: 'First Blood', description: 'Solve your first problem', icon: '🎯', xp: 10 },
  { id: 'streak_7', title: '7-Day Warrior', description: 'Maintain a 7-day streak', icon: '🔥', xp: 50 },
  { id: 'streak_30', title: 'Monthly Grinder', description: 'Maintain a 30-day streak', icon: '⚡', xp: 200 },
  { id: 'streak_100', title: 'Century Streak', description: 'Maintain a 100-day streak', icon: '👑', xp: 1000 },
  { id: 'problems_10', title: 'Getting Started', description: 'Solve 10 problems', icon: '🚀', xp: 25 },
  { id: 'problems_50', title: 'Problem Enthusiast', description: 'Solve 50 problems', icon: '⭐', xp: 100 },
  { id: 'problems_100', title: '100 Problems Solved', description: 'Solve 100 problems', icon: '💯', xp: 250 },
  { id: 'problems_500', title: 'Problem Master', description: 'Solve 500 problems', icon: '🏆', xp: 1000 },
  { id: 'contest_1', title: 'First Contest', description: 'Participate in your first contest', icon: '🥊', xp: 30 },
  { id: 'contest_10', title: 'Contest Grinder', description: 'Participate in 10 contests', icon: '🎮', xp: 150 },
  { id: 'multi_platform', title: 'Platform Hopper', description: 'Connect all 4 platforms', icon: '🌐', xp: 75 },
  { id: 'hard_problem', title: 'Hard Mode', description: 'Solve 10 hard problems', icon: '💪', xp: 100 },
  { id: 'rating_1500', title: 'Rising Star', description: 'Reach 1500 Codeforces rating', icon: '⭐', xp: 200 },
];

const Achievements = () => {
  const { data: userAchievements, isLoading } = useAchievements();

  useEffect(() => {
    // Mark as seen when visiting the page
    if (userAchievements?.some(a => a.isNew)) {
      api.patch('/achievements/mark-seen').catch(console.error);
    }
  }, [userAchievements]);

  if (isLoading) return <div className="text-center py-20 text-slate-400">Loading achievements...</div>;

  const earnedIds = new Set(userAchievements?.map(a => a.achievementId) || []);
  const earnedCount = earnedIds.size;
  const totalXP = userAchievements?.reduce((sum, a) => sum + (a.xpAwarded || 0), 0) || 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-white mb-1">Achievements 🏆</h1>
        <p className="text-slate-400">Unlock badges and earn XP by reaching coding milestones.</p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold font-display text-cyan-400 mb-1">{earnedCount}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Unlocked</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold font-display text-slate-500 mb-1">{ALL_ACHIEVEMENTS.length - earnedCount}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Locked</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-bold font-display text-yellow-400 mb-1">{totalXP}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">XP Earned</p>
        </div>
        <div className="glass-card p-4 text-center flex flex-col justify-center items-center">
          <div className="w-full bg-white/5 h-2 rounded-full mb-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
              style={{ width: `${(earnedCount / ALL_ACHIEVEMENTS.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Completion</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {ALL_ACHIEVEMENTS.map((def, i) => {
          const isUnlocked = earnedIds.has(def.id);
          return (
            <motion.div
              key={def.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                'achievement-badge p-5 aspect-square justify-center',
                isUnlocked ? 'unlocked' : 'locked'
              )}
            >
              <div className="text-4xl mb-2 relative">
                {def.icon}
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full backdrop-blur-[1px]">
                    <Lock className="w-5 h-5 text-slate-300" />
                  </div>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-200 leading-tight">{def.title}</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">{def.description}</p>
              {isUnlocked && (
                <span className="absolute top-2 right-2 text-[10px] font-bold text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">
                  +{def.xp} XP
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
