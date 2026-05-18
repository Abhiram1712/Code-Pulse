import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Code2, Terminal, Trophy } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../ui/Card';
import { useRatingProgression } from '../../hooks/useQueries';
import { format } from 'date-fns';
import { getRatingColor } from '../../lib/utils';

const PLATFORM_CONFIG = {
  codeforces: { name: 'Codeforces', icon: Terminal },
  leetcode: { name: 'LeetCode', icon: Code2 },
  codechef: { name: 'CodeChef', icon: Trophy }
};

const RatingChart = () => {
  const { data, isLoading } = useRatingProgression();
  const [activePlatform, setActivePlatform] = useState('codeforces');

  // Check which platforms actually have rating data
  const availablePlatforms = Object.keys(PLATFORM_CONFIG).filter(
    p => data?.[p]
  );

  // Default to first available if active is not connected
  if (data && !data[activePlatform] && availablePlatforms.length > 0) {
    setActivePlatform(availablePlatforms[0]);
  }

  const activeData = data?.[activePlatform];
  
  const rawHistory = activeData?.history || [];
  const history = rawHistory.map((c, i) => {
    const rating = Math.round(c.rating || c.newRating || 0);
    let change = c.ratingChange;
    
    // Compute change dynamically if not provided
    if (change === undefined) {
      if (i === 0) {
        change = rating > 0 ? rating : 0; // First contest baseline
      } else {
        const prevRating = Math.round(rawHistory[i - 1].rating || rawHistory[i - 1].newRating || 0);
        change = rating - prevRating;
      }
    }

    return {
      date: c.date ? format(new Date(c.date), 'MMM yy') : '',
      rating,
      change,
      contest: c.contestName || c.contest?.title || 'Contest',
      rank: c.rank || c.ranking
    };
  });

  const currentRating = Math.round(activeData?.current || 0);
  const ratingColor = getRatingColor(activePlatform, currentRating);

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    const isPositive = (payload.change || 0) >= 0;
    // For platforms where change isn't tracked, just use the primary color
    const dotColor = payload.change === undefined ? ratingColor : (isPositive ? '#22c55e' : '#ef4444');
    return (
      <circle
        cx={cx} cy={cy} r={3}
        fill={dotColor}
        stroke="rgba(4,15,36,0.8)"
        strokeWidth={1}
      />
    );
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CardTitle icon={TrendingUp}>Rating Progression</CardTitle>
          {activeData && (
            <div className="flex items-center gap-2">
              <span
                className="text-lg font-bold font-mono"
                style={{ color: ratingColor }}
              >
                {currentRating}
              </span>
              {activeData.rank && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: `${ratingColor}15`, color: ratingColor, border: `1px solid ${ratingColor}30` }}
                >
                  {activeData.rank}
                </span>
              )}
            </div>
          )}
        </div>

        {availablePlatforms.length > 0 && (
          <div className="flex bg-slate-800/50 p-1 rounded-xl border border-white/5">
            {availablePlatforms.map(platform => {
              const Icon = PLATFORM_CONFIG[platform].icon;
              return (
                <button
                  key={platform}
                  onClick={() => setActivePlatform(platform)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activePlatform === platform
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {PLATFORM_CONFIG[platform].name}
                </button>
              );
            })}
          </div>
        )}
      </CardHeader>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="text-slate-600 text-sm">Loading...</div>
        </div>
      ) : availablePlatforms.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center text-slate-600">
          <p className="text-sm">No connected platforms</p>
          <p className="text-xs mt-1">Connect your accounts to see rating graphs</p>
        </div>
      ) : history.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center text-slate-600">
          <p className="text-sm">No contest history for {PLATFORM_CONFIG[activePlatform].name}</p>
        </div>
      ) : (
        <div className="h-48 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePlatform}
              className="absolute inset-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ResponsiveContainer width="99%" height="100%" minWidth={1} minHeight={1}>
                <LineChart data={history} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={['auto', 'auto']} tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="px-3 py-2 rounded-xl text-xs"
                          style={{ background: 'rgba(4,15,36,0.95)', border: `1px solid ${ratingColor}30` }}>
                          <p className="text-slate-200 font-semibold truncate max-w-48 mb-1">{d.contest}</p>
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-slate-400">Rating</span>
                            <span style={{ color: ratingColor }} className="font-bold">{d.rating}</span>
                          </div>
                          {d.change !== undefined && d.change !== 0 && (
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-slate-400">Change</span>
                              <span className={d.change > 0 ? 'text-emerald-400' : 'text-red-400'}>
                                {d.change > 0 ? '+' : ''}{d.change}
                              </span>
                            </div>
                          )}
                          {d.rank && (
                            <div className="flex items-center justify-between gap-4 mt-0.5">
                              <span className="text-slate-400">Rank</span>
                              <span className="text-slate-200 font-medium">#{d.rank}</span>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke={ratingColor}
                    strokeWidth={2}
                    dot={<CustomDot />}
                    activeDot={{ r: 5, fill: ratingColor }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </Card>
  );
};

export default RatingChart;
