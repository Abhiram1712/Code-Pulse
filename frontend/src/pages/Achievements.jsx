import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Zap, Star } from 'lucide-react';
import { useAchievements } from '../hooks/useQueries';
import api from '../lib/api';

const ALL_ACHIEVEMENTS = [
  { id: 'first_problem',  title: 'First Blood',      description: 'Solve your first problem',         icon: '🎯', xp: 10,   color: '#10b981' },
  { id: 'streak_7',       title: '7-Day Warrior',     description: 'Maintain a 7-day streak',          icon: '🔥', xp: 50,   color: '#f97316' },
  { id: 'streak_30',      title: 'Monthly Grinder',   description: 'Maintain a 30-day streak',         icon: '⚡', xp: 200,  color: '#f59e0b' },
  { id: 'streak_100',     title: 'Century Streak',    description: 'Maintain a 100-day streak',        icon: '👑', xp: 1000, color: '#e879f9' },
  { id: 'problems_10',    title: 'Getting Started',   description: 'Solve 10 problems',                icon: '🚀', xp: 25,   color: '#3b82f6' },
  { id: 'problems_50',    title: 'Enthusiast',        description: 'Solve 50 problems',                icon: '⭐', xp: 100,  color: '#00d4ff' },
  { id: 'problems_100',   title: 'Century Club',      description: 'Solve 100 problems',               icon: '💯', xp: 250,  color: '#7c3aed' },
  { id: 'problems_500',   title: 'Problem Master',    description: 'Solve 500 problems',               icon: '🏆', xp: 1000, color: '#f59e0b' },
  { id: 'contest_1',      title: 'Arena Debut',       description: 'Join your first contest',          icon: '🥊', xp: 30,   color: '#ef4444' },
  { id: 'contest_10',     title: 'Contest Grinder',   description: 'Participate in 10 contests',       icon: '🎮', xp: 150,  color: '#f97316' },
  { id: 'multi_platform', title: 'Platform Hopper',   description: 'Connect all 4 platforms',          icon: '🌐', xp: 75,   color: '#10b981' },
  { id: 'hard_problem',   title: 'Hard Mode',         description: 'Solve 10 hard problems',           icon: '💪', xp: 100,  color: '#ef4444' },
  { id: 'rating_1500',    title: 'Rising Star',       description: 'Reach 1500 CF rating',             icon: '⭐', xp: 200,  color: '#00d4ff' },
];

const AchCard = ({ def, isUnlocked, earnedData, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.88, y: 16 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay: index * 0.04, type: 'spring', stiffness: 260, damping: 20 }}
    whileHover={isUnlocked ? { y: -4, scale: 1.03 } : {}}
    className={`ach-card ${isUnlocked ? 'unlocked' : 'locked'} relative`}
    style={isUnlocked ? { borderColor: `${def.color}25` } : {}}
  >
    {/* Glow when unlocked */}
    {isUnlocked && (
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top, ${def.color}08, transparent 70%)` }} />
    )}

    {/* XP badge */}
    {isUnlocked && (
      <div className="absolute top-2.5 right-2.5 badge badge-amber text-[9px] px-1.5 py-0.5">
        +{def.xp}
      </div>
    )}

    <div className="relative text-4xl mb-2">
      {def.icon}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full"
          style={{ background: 'rgba(0,8,20,0.6)', backdropFilter: 'blur(2px)' }}>
          <Lock size={14} style={{ color: 'var(--text-3)' }} />
        </div>
      )}
    </div>

    <h3 className="text-xs font-bold leading-tight" style={{ color: isUnlocked ? 'var(--text)' : 'var(--text-3)', fontFamily: 'var(--font-display)' }}>
      {def.title}
    </h3>
    <p className="text-[10px] mt-0.5 leading-snug text-center" style={{ color: 'var(--text-3)' }}>
      {def.description}
    </p>

    {isUnlocked && (
      <div className="mt-1 w-1.5 h-1.5 rounded-full animate-pulse-glow"
        style={{ background: def.color, boxShadow: `0 0 6px ${def.color}` }} />
    )}
  </motion.div>
);

const Achievements = () => {
  const { data: userAchievements, isLoading } = useAchievements();

  useEffect(() => {
    if (userAchievements?.some(a => a.isNew)) {
      api.patch('/achievements/mark-seen').catch(console.error);
    }
  }, [userAchievements]);

  if (isLoading) return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="panel h-24 skeleton" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(10)].map((_, i) => <div key={i} className="panel h-40 skeleton" />)}
      </div>
    </div>
  );

  const earnedIds = new Set(userAchievements?.map(a => a.achievementId) || []);
  const earnedCount = earnedIds.size;
  const totalXP = userAchievements?.reduce((s, a) => s + (a.xpAwarded || 0), 0) || 0;
  const pct = Math.round((earnedCount / ALL_ACHIEVEMENTS.length) * 100);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel relative overflow-hidden px-6 py-5"
      >
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, #f59e0b, #e879f9, #7c3aed)' }} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <Trophy size={18} className="text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                Achievements
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-2)' }}>Unlock badges by reaching milestones</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge badge-amber"><Star size={10} /> {earnedCount}/{ALL_ACHIEVEMENTS.length}</span>
            <span className="badge badge-violet"><Zap size={10} /> {totalXP} XP</span>
          </div>
        </div>
      </motion.div>

      {/* Summary bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="panel px-6 py-4"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Completion Progress</span>
          <span className="text-sm font-bold font-mono" style={{ color: '#e879f9' }}>{pct}%</span>
        </div>
        <div className="progress-track">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #f59e0b, #e879f9, #7c3aed)' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {[
            { label: 'Unlocked', value: earnedCount, color: '#00d4ff' },
            { label: 'Remaining', value: ALL_ACHIEVEMENTS.length - earnedCount, color: 'var(--text-3)' },
            { label: 'XP Earned', value: `${totalXP} XP`, color: '#f59e0b' },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold font-mono" style={{ color, fontFamily: 'var(--font-display)' }}>{value}</p>
              <p className="text-xs section-label mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievement grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {ALL_ACHIEVEMENTS.map((def, i) => (
          <AchCard
            key={def.id}
            def={def}
            isUnlocked={earnedIds.has(def.id)}
            earnedData={userAchievements?.find(a => a.achievementId === def.id)}
            index={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
