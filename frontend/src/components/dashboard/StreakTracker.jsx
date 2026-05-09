import { motion } from 'framer-motion';
import { Flame, Zap, Calendar, Trophy } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../ui/Card';
import { formatNumber } from '../../lib/utils';

const StreakTracker = ({ currentStreak = 0, longestStreak = 0, weeklyStreak = 0, level = 1, xp = 0 }) => {
  const streakMilestones = [7, 30, 100, 365];
  const nextMilestone = streakMilestones.find(m => m > currentStreak) || 365;
  const prevMilestone = streakMilestones.filter(m => m <= currentStreak).pop() || 0;
  const milestoneProgress = ((currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100;

  return (
    <Card className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500 opacity-5 rounded-full blur-3xl" />
      </div>

      <CardHeader>
        <CardTitle icon={Flame}>Streak Tracker</CardTitle>
        <span className="stat-badge">
          <Zap className="w-3 h-3" />
          {xp} XP
        </span>
      </CardHeader>

      {/* Main streak display */}
      <div className="flex items-center justify-center py-4">
        <motion.div
          className="text-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        >
          <div className="relative inline-block">
            <motion.span
              className="fire-icon text-6xl"
              animate={{ scale: [1, 1.1, 1], rotate: [-2, 2, -2] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              🔥
            </motion.span>
            {currentStreak >= 30 && (
              <motion.span
                className="absolute -top-1 -right-1 text-lg"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ⚡
              </motion.span>
            )}
          </div>
          <motion.div
            className="text-5xl font-bold font-display mt-2 gradient-text-fire"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {currentStreak}
          </motion.div>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            {currentStreak === 1 ? 'day streak' : 'days streak'}
          </p>
        </motion.div>
      </div>

      {/* Milestone progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>{currentStreak} days</span>
          <span>Next: {nextMilestone} days</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #f97316, #ef4444)' }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, milestoneProgress)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Longest', value: longestStreak, icon: Trophy, color: '#f59e0b' },
          { label: 'Weekly', value: weeklyStreak, icon: Calendar, color: '#3b82f6' },
          { label: 'Level', value: level, icon: Zap, color: '#a855f7' },
        ].map(({ label, value, icon: Icon, color }) => (
          <motion.div
            key={label}
            className="rounded-xl p-3 text-center"
            style={{ background: `${color}10`, border: `1px solid ${color}20` }}
            whileHover={{ scale: 1.03 }}
          >
            <Icon className="w-4 h-4 mx-auto mb-1.5" style={{ color }} />
            <p className="text-lg font-bold" style={{ color }}>{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Motivational message */}
      <motion.p
        className="text-xs text-center text-slate-500 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {currentStreak === 0
          ? "Start your streak today! 💪"
          : currentStreak < 7
          ? `${7 - currentStreak} more days to 7-Day Warrior! 🎯`
          : currentStreak < 30
          ? `${30 - currentStreak} more days to Monthly Grinder! ⚡`
          : "You're on fire! Keep it up! 🔥"}
      </motion.p>
    </Card>
  );
};

export default StreakTracker;
