import { motion } from 'framer-motion';
import ProgressChart from '../components/analytics/ProgressChart';
import DifficultyChart from '../components/analytics/DifficultyChart';
import RatingChart from '../components/analytics/RatingChart';
import { useInsights } from '../hooks/useQueries';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import { Lightbulb, Calendar, Award, Zap, TrendingUp, BarChart3, Activity } from 'lucide-react';

const InsightItem = ({ icon: Icon, title, desc, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="flex items-start gap-3 p-3.5 rounded-xl"
    style={{ background: `${color}08`, border: `1px solid ${color}15` }}
  >
    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ background: `${color}18`, color }}>
      <Icon size={14} />
    </div>
    <div>
      <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text)' }}>{title}</p>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{desc}</p>
    </div>
  </motion.div>
);

const InsightsPanel = () => {
  const { data: ins, isLoading } = useInsights();
  if (isLoading) return <div className="panel h-full skeleton" />;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle icon={Lightbulb} iconBg="rgba(245,158,11,0.12)">
          <span style={{ color: 'var(--text)' }}>AI Insights</span>
        </CardTitle>
        <span className="badge badge-amber text-[10px]">Smart</span>
      </CardHeader>

      {ins?.message ? (
        <div className="flex flex-col items-center justify-center h-48 gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            <Lightbulb size={20} className="text-amber-400" />
          </div>
          <p className="text-sm text-center" style={{ color: 'var(--text-2)' }}>{ins.message}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <InsightItem
            icon={Calendar}
            title="Peak Day"
            desc={`You crush problems on ${ins?.mostProductiveDay}s. Schedule your hardest sessions then.`}
            color="#3b82f6"
            delay={0.05}
          />
          <InsightItem
            icon={Zap}
            title="Consistency"
            desc={`${ins?.activeDaysLast30} active days last month — ${ins?.consistencyScore}% consistency score.`}
            color="#10b981"
            delay={0.1}
          />
          <InsightItem
            icon={Award}
            title="Pace"
            desc={`Averaging ${ins?.avgProblemsPerDay} problems/day. Best single day: ${ins?.bestDay?.totalSolved || 0} problems!`}
            color="#7c3aed"
            delay={0.15}
          />
          {ins?.totalSolvedLast30 > 0 && (
            <InsightItem
              icon={TrendingUp}
              title="30-Day Total"
              desc={`${ins?.totalSolvedLast30} problems solved, ~${ins?.weeklyAverage}/week average.`}
              color="#f43f5e"
              delay={0.2}
            />
          )}
        </div>
      )}
    </Card>
  );
};

const Analytics = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel relative overflow-hidden px-6 py-5"
      >
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #e879f9, #00d4ff)' }} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}>
            <BarChart3 size={18} style={{ color: '#a78bfa' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold grad-text" style={{ fontFamily: 'var(--font-display)' }}>
              Analytics
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>
              Deep dive into your performance metrics and patterns.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProgressChart />
        </div>
        <DifficultyChart />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RatingChart />
        </div>
        <InsightsPanel />
      </div>
    </div>
  );
};

export default Analytics;
