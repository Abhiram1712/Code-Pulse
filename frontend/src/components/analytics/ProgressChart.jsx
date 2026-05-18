import { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../ui/Card';
import { useProgressChart } from '../../hooks/useQueries';
import { SkeletonChart } from '../ui/Skeleton';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="px-3 py-2.5 rounded-xl text-xs"
      style={{ background: 'rgba(0,8,20,0.97)', border: '1px solid rgba(0,212,255,0.2)', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.7)', fontFamily: 'var(--font-body)' }}>
      <p className="font-semibold mb-1.5" style={{ color: 'var(--text)' }}>{label}</p>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color, boxShadow: `0 0 4px ${p.color}` }} />
          <span style={{ color: 'var(--text-2)' }}>{p.name}:</span>
          <span className="font-bold font-mono" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const PERIODS = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

const PLATFORM_COLORS = {
  leetcode: '#ffa116',
  codeforces: '#3b82f6',
  codechef: '#cd7f32',
  interviewbit: '#22c55e',
  total: '#00d4ff',
};

const ProgressChart = () => {
  const [period, setPeriod] = useState(30);
  const [chartType, setChartType] = useState('area');
  const { data, isLoading } = useProgressChart(period);

  if (isLoading) return <SkeletonChart className="lg:col-span-2" />;

  const chartData = (data || []).map(d => ({
    ...d,
    date: d.date?.slice(5) // MM-DD
  }));

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle icon={TrendingUp} iconBg="rgba(0,212,255,0.1)">
          <span style={{ color: 'var(--text)' }}>Problems Over Time</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            {PERIODS.map(p => (
              <button key={p.days} onClick={() => setPeriod(p.days)}
                className="px-3 py-1 text-[11px] font-mono font-medium transition-all"
                style={period === p.days
                  ? { background: 'rgba(0,212,255,0.12)', color: '#00d4ff' }
                  : { color: 'var(--text-3)' }}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
            {['area', 'bar'].map(t => (
              <button key={t} onClick={() => setChartType(t)}
                className="px-3 py-1 text-[11px] font-mono font-medium transition-all capitalize"
                style={chartType === t
                  ? { background: 'rgba(0,212,255,0.12)', color: '#00d4ff' }
                  : { color: 'var(--text-3)' }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <motion.div
        key={`${period}-${chartType}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="h-56"
      >
        <ResponsiveContainer width="99%" height="100%" minWidth={1} minHeight={1}>
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
              <defs>
                {Object.entries(PLATFORM_COLORS).map(([key, color]) => (
                  <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" stroke={PLATFORM_COLORS.total} fill={`url(#grad-total)`} strokeWidth={2} dot={false} name="Total" />
              <Area type="monotone" dataKey="leetcode" stroke={PLATFORM_COLORS.leetcode} fill={`url(#grad-leetcode)`} strokeWidth={1.5} dot={false} name="LeetCode" />
              <Area type="monotone" dataKey="codeforces" stroke={PLATFORM_COLORS.codeforces} fill={`url(#grad-codeforces)`} strokeWidth={1.5} dot={false} name="Codeforces" />
              <Area type="monotone" dataKey="codechef" stroke={PLATFORM_COLORS.codechef} fill={`url(#grad-codechef)`} strokeWidth={1.5} dot={false} name="CodeChef" />
              <Area type="monotone" dataKey="interviewbit" stroke={PLATFORM_COLORS.interviewbit} fill={`url(#grad-interviewbit)`} strokeWidth={1.5} dot={false} name="InterviewBit" />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: '#475569' }} />
              <Bar dataKey="leetcode" stackId="a" fill={PLATFORM_COLORS.leetcode} radius={[0,0,0,0]} name="LeetCode" />
              <Bar dataKey="codeforces" stackId="a" fill={PLATFORM_COLORS.codeforces} name="Codeforces" />
              <Bar dataKey="codechef" stackId="a" fill={PLATFORM_COLORS.codechef} name="CodeChef" />
              <Bar dataKey="interviewbit" stackId="a" fill={PLATFORM_COLORS.interviewbit} radius={[3,3,0,0]} name="InterviewBit" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </motion.div>
    </Card>
  );
};

export default ProgressChart;
