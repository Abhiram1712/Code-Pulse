import { motion } from 'framer-motion';
import { Target, Plus, CheckCircle2, Circle } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../ui/Card';
import { useNavigate } from 'react-router-dom';

const GoalProgressBar = ({ goal }) => {
  const { title, target, currentProgress, completionRate, completedToday } = goal;
  const platformColors = {
    leetcode: '#ffa116', codeforces: '#3b82f6', codechef: '#cd7f32', interviewbit: '#22c55e', all: '#00d4ff'
  };
  const color = platformColors[target.platform] || '#00d4ff';
  const pct = Math.min(100, completionRate || 0);

  return (
    <motion.div
      className="relative rounded-xl p-3.5"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
      whileHover={{ borderColor: `${color}25` }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          {completedToday ? (
            <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
          ) : (
            <Circle size={14} className="flex-shrink-0" style={{ color: 'var(--text-3)' }} />
          )}
          <span className="text-[13px] font-medium truncate" style={{ color: 'var(--text)' }}>{title}</span>
          {completedToday && (
            <span className="badge badge-emerald text-[10px] px-1.5 py-0.5 flex-shrink-0">Done</span>
          )}
        </div>
        <span className="text-[11px] font-mono flex-shrink-0 ml-2" style={{ color }}>
          {currentProgress}/{target.value}
        </span>
      </div>

      {/* Progress track */}
      <div className="progress-track h-1">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: completedToday
              ? 'linear-gradient(90deg, #10b981, #34d399)'
              : `linear-gradient(90deg, ${color}, ${color}80)`
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      {goal.streak > 0 && (
        <div className="mt-1.5 flex items-center gap-1">
          <span className="text-[10px] text-orange-400 font-mono">🔥 {goal.streak}d</span>
        </div>
      )}
    </motion.div>
  );
};

const DailyGoals = ({ goals = [], onAddGoal }) => {
  const completedCount = goals.filter(g => g.completedToday).length;
  const allComplete = goals.length > 0 && completedCount === goals.length;
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle icon={Target} iconBg="rgba(16,185,129,0.12)">
          <span style={{ color: 'var(--text)' }}>Daily Goals</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          {goals.length > 0 && (
            <span className="section-label">{completedCount}/{goals.length}</span>
          )}
          <motion.button
            onClick={() => navigate('/goals')}
            whileTap={{ scale: 0.9 }}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
          >
            <Plus size={13} />
          </motion.button>
        </div>
      </CardHeader>

      {allComplete && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 rounded-xl text-center"
          style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
        >
          <p className="text-sm font-semibold text-emerald-400">🎉 All goals completed!</p>
        </motion.div>
      )}

      {goals.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <Target size={20} style={{ color: '#00d4ff' }} />
          </div>
          <p className="text-sm mb-3" style={{ color: 'var(--text-3)' }}>No goals set yet</p>
          <button onClick={() => navigate('/goals')} className="btn-cyber text-xs">
            Set first goal
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {goals.slice(0, 4).map((goal, i) => (
            <motion.div
              key={goal._id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <GoalProgressBar goal={goal} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Ring */}
      {goals.length > 0 && (
        <div className="mt-4 pt-3 flex items-center gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="relative w-12 h-12 flex-shrink-0">
            <svg className="w-12 h-12 -rotate-90">
              <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3.5" />
              <motion.circle
                cx="24" cy="24" r="18"
                fill="none"
                stroke={allComplete ? '#10b981' : '#00d4ff'}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 18}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 18 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 18 * (1 - completedCount / goals.length) }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                style={{ filter: allComplete ? '0 0 6px #10b981' : '0 0 6px #00d4ff' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono"
              style={{ color: allComplete ? '#10b981' : '#00d4ff' }}>
              {Math.round((completedCount / goals.length) * 100)}%
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Today's Progress</p>
            <p className="text-xs" style={{ color: 'var(--text-3)' }}>
              {completedCount} of {goals.length} goals done
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DailyGoals;
