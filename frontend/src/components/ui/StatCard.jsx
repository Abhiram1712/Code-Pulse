import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#06b6d4',
  trend,
  trendValue,
  delay = 0,
  className
}) => {
  const isPositive = trendValue > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn('glass-card p-5 cursor-default', className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: `${color}99` }}>
            {title}
          </p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.5 }}
          >
            <p className="text-3xl font-bold font-display mb-1" style={{ color }}>
              {value ?? '—'}
            </p>
          </motion.div>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          {trendValue !== undefined && (
            <div className={cn('flex items-center gap-1 mt-2 text-xs font-medium', isPositive ? 'text-emerald-400' : 'text-red-400')}>
              <span>{isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trendValue)}% from last week</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 rounded-xl ml-3" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
