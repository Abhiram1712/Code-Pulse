import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Trash2, X } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import { useGoals, useCreateGoal, useDeleteGoal } from '../hooks/useQueries';
import * as Dialog from '@radix-ui/react-dialog';

const CreateGoalModal = ({ open, onOpenChange }) => {
  const createMutation = useCreateGoal();
  const [formData, setFormData] = useState({
    title: '',
    category: 'problems',
    targetValue: 3,
    targetUnit: 'problems',
    platform: 'all',
    type: 'daily'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      title: formData.title,
      category: formData.category,
      type: formData.type,
      target: {
        value: Number(formData.targetValue),
        unit: formData.targetUnit,
        platform: formData.platform,
        difficulty: 'all'
      }
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData({ ...formData, title: '' }); // reset
      }
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md p-6 glass-card z-50 shadow-2xl focus:outline-none">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" /> Create New Goal
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Goal Title</label>
              <input 
                type="text" 
                required
                placeholder="e.g., Solve 3 LeetCode problems" 
                className="input-cyber"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Platform</label>
                <select 
                  className="input-cyber appearance-none bg-dark-secondary"
                  value={formData.platform}
                  onChange={e => setFormData({...formData, platform: e.target.value})}
                >
                  <option value="all">Any Platform</option>
                  <option value="leetcode">LeetCode</option>
                  <option value="codeforces">Codeforces</option>
                  <option value="codechef">CodeChef</option>
                  <option value="interviewbit">InterviewBit</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Target Value</label>
                <input 
                  type="number" 
                  min="1" required
                  className="input-cyber"
                  value={formData.targetValue}
                  onChange={e => setFormData({...formData, targetValue: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-white/10 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button type="button" className="btn-ghost">Cancel</button>
              </Dialog.Close>
              <button 
                type="submit" 
                className="btn-neon"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? 'Creating...' : 'Create Goal'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const Goals = () => {
  const { data: goals, isLoading } = useGoals();
  const deleteMutation = useDeleteGoal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) return <div className="text-center py-20 text-slate-400">Loading goals...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-display font-bold text-white mb-1">Goals 🎯</h1>
          <p className="text-slate-400">Set daily targets and build your coding consistency.</p>
        </motion.div>
        <button onClick={() => setIsModalOpen(true)} className="btn-neon flex items-center gap-2 self-start md:self-auto">
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      {goals?.length === 0 ? (
        <Card className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No active goals</h3>
          <p className="text-slate-400 max-w-md mx-auto mb-6">Setting daily goals is the best way to maintain consistency. Start small!</p>
          <button onClick={() => setIsModalOpen(true)} className="btn-ghost">Create your first goal</button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals?.map((goal, i) => (
            <motion.div
              key={goal._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full relative group">
                <button 
                  onClick={() => deleteMutation.mutate(goal._id)}
                  className="absolute top-4 right-4 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="mb-4 pr-8">
                  <h3 className="font-bold text-slate-200 mb-1">{goal.title}</h3>
                  <p className="text-xs text-slate-500">
                    Target: {goal.target.value} {goal.target.unit} • {goal.target.platform}
                  </p>
                </div>

                <div className="mt-auto pt-4 border-t border-white/5">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-cyan-400 font-semibold">{goal.currentProgress}/{goal.target.value}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: goal.completedToday ? 'linear-gradient(90deg, #22c55e, #10b981)' : 'linear-gradient(90deg, #06b6d4, #3b82f6)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, goal.completionRate)}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-xs">
                    <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-medium">
                      🔥 {goal.streak} day streak
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <CreateGoalModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
};

export default Goals;
