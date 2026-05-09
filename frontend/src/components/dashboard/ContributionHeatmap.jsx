import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitCommit } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../ui/Card';
import { generateHeatmapColor } from '../../lib/utils';
import { format, startOfWeek, addDays, subDays, isSameDay, parseISO } from 'date-fns';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

const ContributionHeatmap = ({ data = [] }) => {
  const [tooltip, setTooltip] = useState(null);

  // Build a map from dateString -> data
  const dataMap = useMemo(() => {
    const map = {};
    data.forEach(d => { map[d.date] = d; });
    return map;
  }, [data]);

  // Build 52 weeks grid
  const weeks = useMemo(() => {
    const today = new Date();
    const startDate = subDays(today, 364);
    const weekStart = startOfWeek(startDate, { weekStartsOn: 0 });

    const weeksArr = [];
    let current = weekStart;
    while (current <= today) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const day = addDays(current, d);
        const dateStr = format(day, 'yyyy-MM-dd');
        const info = dataMap[dateStr];
        week.push({
          date: day,
          dateStr,
          count: info?.count || 0,
          submissions: info?.submissions || 0,
          future: day > today
        });
      }
      weeksArr.push(week);
      current = addDays(current, 7);
    }
    return weeksArr;
  }, [dataMap]);

  // Month labels
  const monthLabels = useMemo(() => {
    const labels = [];
    weeks.forEach((week, wi) => {
      const firstDay = week[0];
      if (firstDay.date.getDate() <= 7) {
        labels.push({ month: MONTHS[firstDay.date.getMonth()], weekIndex: wi });
      }
    });
    return labels;
  }, [weeks]);

  const totalContributions = data.reduce((sum, d) => sum + d.count, 0);
  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle icon={GitCommit}>Contribution Graph</CardTitle>
        <span className="text-xs text-slate-500">
          <span className="text-cyan-400 font-semibold">{totalContributions}</span> problems in the last year
        </span>
      </CardHeader>

      <div className="overflow-x-auto scrollbar-hidden pb-2">
        <div className="relative" style={{ minWidth: weeks.length * 14 + 30 }}>
          {/* Month labels */}
          <div className="flex mb-2 pl-8">
            {monthLabels.map(({ month, weekIndex }) => (
              <div
                key={`${month}-${weekIndex}`}
                className="text-xs text-slate-600 absolute"
                style={{ left: weekIndex * 14 + 30 }}
              >
                {month}
              </div>
            ))}
          </div>

          <div className="flex gap-0.5 mt-4">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1.5">
              {DAYS.map((day, i) => (
                <div key={i} className="h-[11px] flex items-center text-[9px] text-slate-600 w-6">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((day) => (
                  <motion.div
                    key={day.dateStr}
                    className={`w-[11px] h-[11px] rounded-sm cursor-pointer transition-all duration-150`}
                    style={{
                      backgroundColor: day.future ? 'transparent' : generateHeatmapColor(day.count, maxCount),
                      opacity: day.future ? 0 : 1
                    }}
                    whileHover={!day.future ? { scale: 1.8, zIndex: 10 } : {}}
                    onMouseEnter={(e) => {
                      if (!day.future) {
                        setTooltip({
                          x: e.clientX,
                          y: e.clientY,
                          date: format(day.date, 'MMM d, yyyy'),
                          count: day.count,
                          submissions: day.submissions
                        });
                      }
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: day.future ? 0 : 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: (wi * 7 + day.date.getDay()) * 0.002 }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-3">
        <span className="text-xs text-slate-600">Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
          <div
            key={intensity}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: generateHeatmapColor(intensity * maxCount, maxCount) }}
          />
        ))}
        <span className="text-xs text-slate-600">More</span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-3 py-2 rounded-lg text-xs pointer-events-none"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 50,
            background: 'rgba(4, 15, 36, 0.95)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <p className="text-slate-200 font-semibold">{tooltip.date}</p>
          <p className="text-cyan-400">{tooltip.count} problems solved</p>
          {tooltip.submissions > 0 && <p className="text-slate-400">{tooltip.submissions} submissions</p>}
        </div>
      )}
    </Card>
  );
};

export default ContributionHeatmap;
