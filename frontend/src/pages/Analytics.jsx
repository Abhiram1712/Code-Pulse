import { motion } from 'framer-motion';
import ProgressChart from '../components/analytics/ProgressChart';
import DifficultyChart from '../components/analytics/DifficultyChart';
import RatingChart from '../components/analytics/RatingChart';
import { useInsights } from '../hooks/useQueries';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import { Lightbulb, Calendar, Award, Zap } from 'lucide-react';

const InsightsPanel = () => {
  const { data: insights, isLoading } = useInsights();

  if (isLoading) return null;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle icon={Lightbulb}>Smart Insights</CardTitle>
      </CardHeader>
      
      {insights?.message ? (
        <div className="flex items-center justify-center h-48 text-slate-500 text-sm">
          {insights.message}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Most Productive Day</p>
              <p className="text-xs text-slate-400 mt-1">You solve the most problems on <span className="text-blue-400 font-medium">{insights?.mostProductiveDay}s</span>.</p>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Consistency Score</p>
              <p className="text-xs text-slate-400 mt-1">You coded <span className="text-emerald-400 font-medium">{insights?.activeDaysLast30} days</span> in the last 30 days ({insights?.consistencyScore}%).</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 mt-0.5">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Recent Pace</p>
              <p className="text-xs text-slate-400 mt-1">Averaging <span className="text-purple-400 font-medium">{insights?.avgProblemsPerDay} problems/day</span>. Best day was {insights?.bestDay?.totalSolved} problems!</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

const Analytics = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-display font-bold text-white mb-1">Analytics 📈</h1>
        <p className="text-slate-400">Deep dive into your performance metrics and coding patterns.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProgressChart />
        <DifficultyChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RatingChart />
        <InsightsPanel />
      </div>
    </div>
  );
};

export default Analytics;
