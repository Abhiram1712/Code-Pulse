import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, X, Calendar, Flame, CheckCircle2, Circle } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import { useGoals, useCreateGoal, useDeleteGoal } from '../hooks/useQueries';
import * as Dialog from '@radix-ui/react-dialog';

const CreateGoalModal = ({ open, onOpenChange }) => {
  const createMutation = useCreateGoal();
  const [formData, setFormData] = useState({
    title: '', category: 'problems', targetValue: 3, targetUnit: 'problems', platform: 'all', type: 'daily'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      title: formData.title,
      category: formData.category,
      type: formData.type,
      target: { value: Number(formData.targetValue), unit: formData.targetUnit, platform: formData.platform, difficulty: 'all' }
    }, { onSuccess: () => { onOpenChange(false); setFormData({ ...formData, title: '' }); } });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 backdrop-blur-md"
          style={{ background: 'rgba(0,8,20,0.7)' }}
          asChild>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
        </Dialog.Overlay>
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md focus:outline-none"
          asChild>
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="panel p-6"
            style={{ border: '1px solid rgba(0,212,255,0.2)', boxShadow: '0 0 60px rgba(0,212,255,0.1), 0 24px 64px rgba(0,0,0,0.7)' }}
          >
            {/* Top glow line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
              style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, #7c3aed, transparent)' }} />

            <div className="flex items-center justify-between mb-6">
              <Dialog.Title asChild>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}>
                    <Target size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                      New Goal
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--text-3)' }}>Set a daily target</p>
                  </div>
                </div>
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/08"
                  style={{ color: 'var(--text-3)' }}>
                  <X size={16} />
                </button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block section-label mb-2">Goal Title</label>
                <input
                  type="text" required
                  placeholder="e.g., Solve 3 LeetCode problems"
                  className="input-field"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block section-label mb-2">Platform</label>
                  <select className="input-field"
                    value={formData.platform}
                    onChange={e => setFormData({ ...formData, platform: e.target.value })}>
                    <option value="all">Any Platform</option>
                    <option value="leetcode">LeetCode</option>
                    <option value="codeforces">Codeforces</option>
                    <option value="codechef">CodeChef</option>
                    <option value="interviewbit">InterviewBit</option>
                  </select>
                </div>
                <div>
                  <label className="block section-label mb-2">Target</label>
                  <input
                    type="number" min="1" required
                    className="input-field"
                    value={formData.targetValue}
                    onChange={e => setFormData({ ...formData, targetValue: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block section-label mb-2">Frequency</label>
                <div className="grid grid-cols-2 gap-2">
                  {['daily', 'weekly'].map(t => (
                    <button
                      key={t} type="button"
                      onClick={() => setFormData({ ...formData, type: t })}
                      className="py-2.5 rounded-xl text-sm font-medium capitalize transition-all"
                      style={formData.type === t ? {
                        background: 'rgba(0,212,255,0.12)',
                        border: '1px solid rgba(0,212,255,0.3)',
                        color: '#00d4ff'
                      } : {
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        color: 'var(--text-2)'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <Dialog.Close asChild>
                  <button type="button" className="btn-ghost flex-1">Cancel</button>
                </Dialog.Close>
                <button type="submit" disabled={createMutation.isPending} className="btn-primary flex-1">
                  {createMutation.isPending ? 'Creating…' : 'Create Goal'}
                </button>
              </div>
            </form>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const GoalCard = ({ goal, onDelete, index }) => {
  const { title, target, currentProgress, completionRate, completedToday, streak } = goal;
  const platformColors = {
    leetcode: '#ffa116', codeforces: '#3b82f6', codechef: '#cd7f32', interviewbit: '#22c55e', all: '#00d4ff'
  };
  const color = platformColors[target.platform] || '#00d4ff';
  const pct = Math.min(100, completionRate || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07 }}
      className="panel panel-hover relative group overflow-hidden p-5"
    >
      {/* Color top bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(90deg, ${color}80, ${color}, ${color}40)` }} />

      {/* Delete button */}
      <button
        onClick={() => onDelete(goal._id)}
        className="absolute top-3.5 right-3.5 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
        style={{ color: '#f43f5e', background: 'rgba(244,63,94,0.1)' }}
      >
        <Trash2 size={13} />
      </button>

      <div className="pr-8 mb-4">
        <div className="flex items-center gap-2 mb-1">
          {completedToday
            ? <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
            : <Circle size={15} style={{ color: 'var(--text-3)' }} className="flex-shrink-0" />}
          <h3 className="font-semibold text-sm" style={{ color: 'var(--text)', fontFamily: 'var(--font-display)' }}>
            {title}
          </h3>
          {completedToday && <span className="badge badge-emerald text-[10px]">✓ Done</span>}
        </div>
        <p className="text-xs ml-5" style={{ color: 'var(--text-3)' }}>
          {target.value} {target.unit} · {target.platform === 'all' ? 'Any platform' : target.platform}
        </p>
      </div>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1.5">
          <span style={{ color: 'var(--text-3)' }}>Progress</span>
          <span className="font-mono font-semibold" style={{ color }}>{currentProgress}/{target.value}</span>
        </div>
        <div className="progress-track">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: completedToday
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : `linear-gradient(90deg, ${color}, ${color}80)`,
              boxShadow: `0 0 8px ${color}50`
            }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.07 }}
          />
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {streak > 0 && (
            <span className="badge badge-amber text-[10px]">
              <Flame size={9} /> {streak}d streak
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-3)' }}>{pct}% done</span>
      </div>
    </motion.div>
  );
};

const Goals = () => {
  const { data: goals, isLoading } = useGoals();
  const deleteMutation = useDeleteGoal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="panel h-24 skeleton" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="panel h-48 skeleton" />)}
      </div>
    </div>
  );

  const completedCount = goals?.filter(g => g.completedToday).length || 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel relative overflow-hidden px-6 py-5"
      >
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, #10b981, #00d4ff, #7c3aed)' }} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <Target size={18} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                Goals
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-2)' }}>
                {goals?.length ? `${completedCount}/${goals.length} completed today` : 'Set targets and stay consistent'}
              </p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="btn-primary self-start sm:self-auto"
          >
            <Plus size={15} /> New Goal
          </motion.button>
        </div>
      </motion.div>

      {/* Goals grid */}
      {!goals?.length ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="panel p-16 text-center"
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <Target size={28} className="text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
            No goals yet
          </h3>
          <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: 'var(--text-2)' }}>
            Daily goals are the most effective way to build consistency. Start small!
          </p>
          <button onClick={() => setIsModalOpen(true)} className="btn-cyber">
            Create your first goal
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal, i) => (
            <GoalCard
              key={goal._id}
              goal={goal}
              index={i}
              onDelete={id => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      <CreateGoalModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default Goals;
