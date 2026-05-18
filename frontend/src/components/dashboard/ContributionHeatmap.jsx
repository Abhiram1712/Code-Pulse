import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitCommit } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../ui/Card';
import { format, startOfWeek, addDays, subDays } from 'date-fns';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const getHeatColor = (count, max) => {
  if (!count || count === 0) return 'rgba(255,255,255,0.04)';
  const t = Math.min(count / Math.max(max, 1), 1);
  if (t < 0.2) return 'rgba(0,212,255,0.18)';
  if (t < 0.4) return 'rgba(0,212,255,0.35)';
  if (t < 0.65) return 'rgba(0,212,255,0.55)';
  if (t < 0.85) return 'rgba(124,58,237,0.75)';
  return 'rgba(232,121,249,0.95)';
};

const ContributionHeatmap = ({ data = [] }) => {
  const [tooltip, setTooltip] = useState(null);

  const dataMap = useMemo(() => {
    const m = {};
    data.forEach(d => { m[d.date] = d; });
    return m;
  }, [data]);

  const weeks = useMemo(() => {
    const today = new Date();
    const start = subDays(today, 364);
    const weekStart = startOfWeek(start, { weekStartsOn: 0 });
    const arr = [];
    let cur = weekStart;
    while (cur <= today) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const day = addDays(cur, d);
        const ds = format(day, 'yyyy-MM-dd');
        const info = dataMap[ds];
        week.push({ date: day, ds, count: info?.count || 0, submissions: info?.submissions || 0, future: day > today });
      }
      arr.push(week);
      cur = addDays(cur, 7);
    }
    return arr;
  }, [dataMap]);

  const monthLabels = useMemo(() => {
    const labels = [];
    weeks.forEach((week, wi) => {
      if (week[0].date.getDate() <= 7) {
        labels.push({ month: MONTHS[week[0].date.getMonth()], wi });
      }
    });
    return labels;
  }, [weeks]);

  const totalContributions = data.reduce((s, d) => s + d.count, 0);
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle icon={GitCommit} iconBg="rgba(0,212,255,0.1)">
          <span style={{ color: 'var(--text)' }}>Contribution Graph</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: '#00d4ff' }}>{totalContributions}</span>
          <span className="text-xs" style={{ color: 'var(--text-3)' }}>problems / year</span>
        </div>
      </CardHeader>

      <div className="overflow-x-auto scrollbar-none">
        <div className="relative pb-1" style={{ minWidth: weeks.length * 13 + 30 }}>
          {/* Month labels */}
          <div className="relative h-5 pl-8 mb-1">
            {monthLabels.map(({ month, wi }) => (
              <span
                key={`${month}-${wi}`}
                className="absolute text-[10px] font-mono"
                style={{ left: wi * 13 + 32, color: 'var(--text-3)' }}
              >
                {month}
              </span>
            ))}
          </div>

          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1.5">
              {DAYS.map((d, i) => (
                <div key={i} className="h-[10px] flex items-center w-6">
                  <span style={{ fontSize: '8px', color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>{d}</span>
                </div>
              ))}
            </div>

            {/* Grid */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map(day => (
                  <div
                    key={day.ds}
                    className="heat-cell"
                    style={{
                      width: 10, height: 10,
                      background: day.future ? 'transparent' : getHeatColor(day.count, maxCount),
                      opacity: day.future ? 0 : 1,
                      boxShadow: !day.future && day.count > 0
                        ? `0 0 ${day.count > 5 ? 4 : 2}px ${getHeatColor(day.count, maxCount)}`
                        : 'none'
                    }}
                    onMouseEnter={e => {
                      if (!day.future) {
                        setTooltip({
                          x: e.clientX, y: e.clientY,
                          date: format(day.date, 'MMM d, yyyy'),
                          count: day.count, submissions: day.submissions
                        });
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-3">
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-3)' }}>None</span>
        {[0, 0.2, 0.45, 0.7, 1].map(t => (
          <div key={t} className="w-2.5 h-2.5 rounded-sm"
            style={{ background: getHeatColor(t * maxCount, maxCount) }} />
        ))}
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-3)' }}>Max</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 rounded-xl text-xs pointer-events-none"
          style={{
            left: tooltip.x + 12, top: tooltip.y - 55,
            background: 'rgba(0,8,20,0.97)',
            border: '1px solid rgba(0,212,255,0.25)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(20px)',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <p className="font-semibold mb-1" style={{ color: 'var(--text)', fontFamily: 'var(--font-body)' }}>{tooltip.date}</p>
          <p style={{ color: '#00d4ff' }}>{tooltip.count} solved</p>
          {tooltip.submissions > 0 && (
            <p style={{ color: 'var(--text-3)' }}>{tooltip.submissions} submissions</p>
          )}
        </div>
      )}
    </Card>
  );
};

export default ContributionHeatmap;
