import { motion } from 'framer-motion';
import { Flame, Trophy, Calendar, Zap, TrendingUp } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../ui/Card';

const StreakTracker = ({ currentStreak = 0, longestStreak = 0, weeklyStreak = 0, level = 1, xp = 0 }) => {
  const milestones = [7, 30, 100, 365];
  const nextMilestone = milestones.find(m => m > currentStreak) || 365;
  const prevMilestone = milestones.filter(m => m <= currentStreak).pop() || 0;
  const progress = ((currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100;

  const flameSize = currentStreak === 0 ? 'text-4xl' : currentStreak < 10 ? 'text-5xl' : 'text-6xl';
  const motivations = [
    { min: 0, max: 0, msg: 'Start your streak today!', sub: 'Code for 1 day to begin 🔥' },
    { min: 1, max: 6, msg: `${7 - currentStreak} days to Warrior`, sub: 'Keep the momentum!' },
    { min: 7, max: 29, msg: `${30 - currentStreak} days to Grinder`, sub: "You're doing great!" },
    { min: 30, max: 99, msg: `${100 - currentStreak} days to Century`, sub: "Legendary consistency!" },
    { min: 100, max: Infinity, msg: 'Absolute legend!', sub: 'Keep conquering! 👑' },
  ];
  const motive = motivations.find(m => currentStreak >= m.min && currentStreak <= m.max) || motivations[0];

  const stats = [
    { label: 'Best', value: longestStreak, icon: Trophy, color: '#f59e0b' },
    { label: 'Weekly', value: weeklyStreak, icon: Calendar, color: '#7c3aed' },
    { label: 'Level', value: level, icon: Zap, color: '#00d4ff' },
  ];

  return (
    <Card className="relative overflow-hidden">
      {/* Fire glow ambient */}
      <div className="absolute -top-20 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15), transparent 70%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom, rgba(249,115,22,0.06), transparent)' }} />

      <CardHeader>
        <CardTitle icon={Flame} iconBg="rgba(249,115,22,0.15)" className="text-orange-400">
          <span style={{ color: 'var(--text)' }}>Streak Tracker</span>
        </CardTitle>
        <div className="badge badge-amber">
          <Zap size={10} /> {xp} XP
        </div>
      </CardHeader>

      {/* Central flame display */}
      <div className="flex flex-col items-center py-4 relative">
        <motion.div
          animate={{ scale: [1, 1.06, 1], rotate: [-1, 1, -1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className={`${flameSize} mb-1`}
          style={{ filter: 'drop-shadow(0 0 12px rgba(249,115,22,0.7))' }}
        >
          🔥
        </motion.div>

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="text-center"
        >
          <p className="text-5xl font-bold leading-none grad-text-fire"
            style={{ fontFamily: 'var(--font-display)' }}>
            {currentStreak}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>
            {currentStreak === 1 ? 'day streak' : 'days streak'}
          </p>
        </motion.div>

        {/* Motivational text */}
        <motion.div
          className="mt-3 text-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm font-semibold" style={{ color: '#f97316' }}>{motive.msg}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{motive.sub}</p>
        </motion.div>
      </div>

      {/* Milestone progress */}
      <div className="mb-4 px-1">
        <div className="flex justify-between text-[11px] mb-1.5" style={{ color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
          <span>{currentStreak}d</span>
          <span>→ {nextMilestone}d milestone</span>
        </div>
        <div className="progress-track">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #f97316, #ef4444)' }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, progress)}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          {milestones.map(m => (
            <div key={m} className="flex flex-col items-center gap-0.5">
              <div className="w-px h-2"
                style={{ background: currentStreak >= m ? '#f97316' : 'rgba(255,255,255,0.1)' }} />
              <span className="text-[9px] font-mono"
                style={{ color: currentStreak >= m ? '#f97316' : 'var(--text-3)' }}>
                {m}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <motion.div
            key={label}
            className="rounded-xl p-3 text-center"
            style={{ background: `${color}0e`, border: `1px solid ${color}1a` }}
            whileHover={{ scale: 1.04 }}
          >
            <Icon size={13} className="mx-auto mb-1.5" style={{ color }} />
            <p className="text-base font-bold font-mono" style={{ color }}>{value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>{label}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default StreakTracker;
