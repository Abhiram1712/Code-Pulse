import { motion } from 'framer-motion';
import { Target, Plus } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../ui/Card';

const GoalProgressBar = ({ goal }) => {
  const { title, target, currentProgress, completionRate, completedToday } = goal;
  const platformEmoji = { leetcode: '🟨', codeforces: '🔵', codechef: '🟤', interviewbit: '🟢', all: '⚡' };
  const pEmoji = platformEmoji[target.platform] || '⚡';

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{pEmoji}</span>
          <span className="text-sm font-medium text-slate-200">{title}</span>
          {completedToday && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full"
            >
              ✓ Done
            </motion.span>
          )}
        </div>
        <span className="text-xs font-mono text-slate-400">
          {currentProgress}/{target.value} {target.unit}
        </span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: completedToday
              ? 'linear-gradient(90deg, #22c55e, #10b981)'
              : 'linear-gradient(90deg, #06b6d4, #3b82f6)'
          }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, completionRate)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-slate-600">{completionRate}%</span>
        {goal.streak > 0 && <span className="text-xs text-orange-400">🔥 {goal.streak} day streak</span>}
      </div>
    </div>
  );
};

const DailyGoals = ({ goals = [], onAddGoal }) => {
  const completedCount = goals.filter(g => g.completedToday).length;
  const allComplete = goals.length > 0 && completedCount === goals.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle icon={Target}>Daily Goals</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {completedCount}/{goals.length} done
          </span>
          <button
            onClick={onAddGoal}
            className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </CardHeader>

      {allComplete && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center"
        >
          <p className="text-emerald-400 font-semibold text-sm">🎉 All goals completed today!</p>
        </motion.div>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500 text-sm mb-3">No goals set yet</p>
          <button onClick={onAddGoal} className="btn-ghost text-sm">
            + Set your first goal
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {goals.map((goal, i) => (
            <motion.div
              key={goal._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <GoalProgressBar goal={goal} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Overall progress ring */}
      {goals.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-4">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90">
              <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <motion.circle
                cx="28" cy="28" r="22"
                fill="none"
                stroke={allComplete ? '#22c55e' : '#06b6d4'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 22}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 22 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 22 * (1 - completedCount / goals.length) }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-200">
              {Math.round((completedCount / goals.length) * 100)}%
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">Today's Progress</p>
            <p className="text-xs text-slate-500">{completedCount} of {goals.length} goals completed</p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DailyGoals;
