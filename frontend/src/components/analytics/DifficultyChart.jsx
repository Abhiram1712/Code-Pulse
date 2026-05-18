import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { BarChart2 } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../ui/Card';
import { useDifficultyDistribution } from '../../hooks/useQueries';

const DIFF = [
  { name: 'Easy',   key: 'easy',   totalKey: 'totalEasy',   color: '#10b981' },
  { name: 'Medium', key: 'medium', totalKey: 'totalMedium', color: '#f59e0b' },
  { name: 'Hard',   key: 'hard',   totalKey: 'totalHard',   color: '#f43f5e' },
];

const DifficultyChart = () => {
  const { data, isLoading } = useDifficultyDistribution();

  const pieData = data
    ? DIFF.map(d => ({ name: d.name, value: data[d.key] || 0, total: data[d.totalKey] || 0, color: d.color }))
    : [];

  const total = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle icon={BarChart2} iconBg="rgba(124,58,237,0.12)">
          <span style={{ color: 'var(--text)' }}>Difficulty Split</span>
        </CardTitle>
        <span className="section-label">{total} solved</span>
      </CardHeader>

      {isLoading ? (
        <div className="h-40 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full skeleton" />
        </div>
      ) : (
        <>
          <div className="relative h-40">
            <ResponsiveContainer width="99%" height="100%" minWidth={1} minHeight={1}>
              <PieChart>
                <defs>
                  {DIFF.map(d => (
                    <filter key={d.key} id={`glow-${d.key}`}>
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  ))}
                </defs>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={46} outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map(entry => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                      opacity={0.88}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
                  contentStyle={{
                    background: 'rgba(0,8,20,0.97)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: 'var(--text)',
                    fontSize: 12,
                    fontFamily: 'var(--font-body)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(20px)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <motion.p
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >
                {total}
              </motion.p>
              <p className="text-[11px] font-mono" style={{ color: 'var(--text-3)' }}>solved</p>
            </div>
          </div>

          <div className="space-y-2.5 mt-4">
            {pieData.map((item, i) => {
              const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: item.color, boxShadow: `0 0 5px ${item.color}` }} />
                      <span className="text-[13px]" style={{ color: 'var(--text-2)' }}>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-bold font-mono" style={{ color: item.color }}>{item.value}</span>
                      <span className="text-[11px]" style={{ color: 'var(--text-3)' }}>/{item.total}</span>
                    </div>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: item.color, boxShadow: `0 0 6px ${item.color}60` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 + i * 0.08 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
};

export default DifficultyChart;
