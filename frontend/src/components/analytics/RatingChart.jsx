import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Code2, Terminal, Trophy } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../ui/Card';
import { useRatingProgression } from '../../hooks/useQueries';
import { format } from 'date-fns';
import { getRatingColor } from '../../lib/utils';

const PLATFORM_CONFIG = {
  codeforces: { name: 'Codeforces', icon: Terminal,  color: '#3b82f6' },
  leetcode:   { name: 'LeetCode',   icon: Code2,     color: '#ffa116' },
  codechef:   { name: 'CodeChef',   icon: Trophy,    color: '#cd7f32' },
};

const RatingChart = () => {
  const { data, isLoading } = useRatingProgression();
  const [activePlatform, setActivePlatform] = useState('codeforces');

  const availablePlatforms = Object.keys(PLATFORM_CONFIG).filter(p => data?.[p]);

  if (data && !data[activePlatform] && availablePlatforms.length > 0) {
    setActivePlatform(availablePlatforms[0]);
  }

  const activeData = data?.[activePlatform];
  const rawHistory  = activeData?.history || [];

  const history = rawHistory.map((c, i) => {
    const rating = Math.round(c.rating || c.newRating || 0);
    let change = c.ratingChange;
    if (change === undefined) {
      change = i === 0 ? (rating > 0 ? rating : 0)
        : rating - Math.round(rawHistory[i - 1].rating || rawHistory[i - 1].newRating || 0);
    }
    return {
      date:    c.date ? format(new Date(c.date), 'MMM yy') : '',
      rating,  change,
      contest: c.contestName || c.contest?.title || 'Contest',
      rank:    c.rank || c.ranking,
    };
  });

  const currentRating = Math.round(activeData?.current || 0);
  const ratingColor   = getRatingColor(activePlatform, currentRating);
  const platColor     = PLATFORM_CONFIG[activePlatform]?.color || ratingColor;

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <CardTitle icon={TrendingUp} iconBg="rgba(124,58,237,0.12)">
            <span style={{ color: 'var(--text)' }}>Rating Progression</span>
          </CardTitle>
          {activeData && (
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono" style={{ color: ratingColor }}>
                {currentRating}
              </span>
              {activeData.rank && (
                <span className="badge text-[10px] px-2 py-0.5"
                  style={{ background: `${ratingColor}15`, color: ratingColor, border: `1px solid ${ratingColor}25` }}>
                  {activeData.rank}
                </span>
              )}
            </div>
          )}
        </div>

        {availablePlatforms.length > 0 && (
          <div className="flex p-1 rounded-xl gap-0.5"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            {availablePlatforms.map(platform => {
              const { icon: Icon, color } = PLATFORM_CONFIG[platform];
              const isActive = activePlatform === platform;
              return (
                <button
                  key={platform}
                  onClick={() => setActivePlatform(platform)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                  style={isActive
                    ? { background: `${color}18`, color, border: `1px solid ${color}25` }
                    : { color: 'var(--text-3)', border: '1px solid transparent' }}
                >
                  <Icon size={12} />
                  {PLATFORM_CONFIG[platform].name}
                </button>
              );
            })}
          </div>
        )}
      </CardHeader>

      {isLoading ? (
        <div className="h-52 flex items-center justify-center">
          <div className="text-sm" style={{ color: 'var(--text-3)' }}>Loading…</div>
        </div>
      ) : availablePlatforms.length === 0 ? (
        <div className="h-52 flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <TrendingUp size={20} style={{ color: '#a78bfa' }} />
          </div>
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>No connected platforms</p>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>Connect accounts in Settings to see rating graphs</p>
        </div>
      ) : history.length === 0 ? (
        <div className="h-52 flex flex-col items-center justify-center gap-2">
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>No contest history for {PLATFORM_CONFIG[activePlatform].name}</p>
          <p className="text-xs" style={{ color: 'var(--text-3)' }}>Sync after participating in a contest.</p>
        </div>
      ) : (
        <div className="h-52 relative">
          {/* Gradient glow under line */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at bottom, ${platColor}06, transparent 70%)` }} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activePlatform}
              className="absolute inset-0"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ResponsiveContainer width="99%" height="100%" minWidth={1} minHeight={1}>
                <LineChart data={history} margin={{ top: 8, right: 12, bottom: 5, left: -10 }}>
                  <defs>
                    <linearGradient id={`line-grad-${activePlatform}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={platColor} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={platColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#4a5568', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fill: '#4a5568', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    axisLine={false} tickLine={false}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="px-3 py-2.5 rounded-xl text-xs"
                          style={{
                            background: 'rgba(0,8,20,0.97)',
                            border: `1px solid ${platColor}30`,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(20px)',
                            fontFamily: 'var(--font-body)'
                          }}>
                          <p className="font-semibold truncate max-w-[180px] mb-1.5" style={{ color: 'var(--text)' }}>{d.contest}</p>
                          <div className="flex items-center justify-between gap-4">
                            <span style={{ color: 'var(--text-2)' }}>Rating</span>
                            <span className="font-bold font-mono" style={{ color: platColor }}>{d.rating}</span>
                          </div>
                          {d.change !== undefined && d.change !== 0 && (
                            <div className="flex items-center justify-between gap-4 mt-1">
                              <span style={{ color: 'var(--text-2)' }}>Change</span>
                              <span className="font-mono font-bold" style={{ color: d.change > 0 ? '#10b981' : '#f43f5e' }}>
                                {d.change > 0 ? '+' : ''}{d.change}
                              </span>
                            </div>
                          )}
                          {d.rank && (
                            <div className="flex items-center justify-between gap-4 mt-1">
                              <span style={{ color: 'var(--text-2)' }}>Rank</span>
                              <span className="font-mono" style={{ color: 'var(--text)' }}>#{d.rank}</span>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rating"
                    stroke={platColor}
                    strokeWidth={2}
                    dot={(props) => {
                      const { cx, cy, payload } = props;
                      const isPos = (payload.change || 0) >= 0;
                      const dotColor = payload.change !== undefined ? (isPos ? '#10b981' : '#f43f5e') : platColor;
                      return (
                        <circle
                          key={`dot-${cx}-${cy}`}
                          cx={cx} cy={cy} r={3}
                          fill={dotColor}
                          stroke="rgba(0,8,20,0.8)"
                          strokeWidth={1.5}
                          style={{ filter: `drop-shadow(0 0 3px ${dotColor})` }}
                        />
                      );
                    }}
                    activeDot={{
                      r: 5, fill: platColor,
                      stroke: 'rgba(0,8,20,0.8)',
                      strokeWidth: 2,
                      style: { filter: `drop-shadow(0 0 6px ${platColor})` }
                    }}
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
