import {
  RadialBarChart, RadialBar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../ui/Card';
import { useDifficultyDistribution } from '../../hooks/useQueries';

const DIFF_COLORS = {
  Easy: '#22c55e',
  Medium: '#f59e0b',
  Hard: '#ef4444',
};

const DifficultyChart = () => {
  const { data, isLoading } = useDifficultyDistribution();

  const pieData = data ? [
    { name: 'Easy', value: data.easy || 0, total: data.totalEasy || 0, color: DIFF_COLORS.Easy },
    { name: 'Medium', value: data.medium || 0, total: data.totalMedium || 0, color: DIFF_COLORS.Medium },
    { name: 'Hard', value: data.hard || 0, total: data.totalHard || 0, color: DIFF_COLORS.Hard },
  ] : [];

  const total = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle icon={BarChart2}>Difficulty Split</CardTitle>
        <span className="text-xs text-slate-500">{total} total</span>
      </CardHeader>

      {isLoading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-white/5 animate-pulse" />
        </div>
      ) : (
        <>
          <div className="relative h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map(entry => (
                    <Cell key={entry.name} fill={entry.color} opacity={0.9} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{
                    background: 'rgba(4,15,36,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#f0f9ff',
                    fontSize: 12
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <motion.p
                className="text-2xl font-bold font-display text-slate-200"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                {total}
              </motion.p>
              <p className="text-xs text-slate-500">solved</p>
            </div>
          </div>

          <div className="space-y-2.5 mt-3">
            {pieData.map((item, i) => (
              <motion.div
                key={item.name}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-400 flex-1">{item.name}</span>
                <span className="text-sm font-semibold" style={{ color: item.color }}>{item.value}</span>
                <span className="text-xs text-slate-600">/{item.total}</span>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
};

export default DifficultyChart;
