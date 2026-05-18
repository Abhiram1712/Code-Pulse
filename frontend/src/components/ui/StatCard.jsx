import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title, value, subtitle, icon: Icon, color = '#00d4ff',
  trend, trendValue, delay = 0, className, suffix = ''
}) => {
  const isPositive = trendValue >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className={cn('panel panel-hover p-5 cursor-default select-none', className)}
      style={{
        background: `linear-gradient(135deg, rgba(10,16,40,0.9) 0%, ${color}08 100%)`,
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-6 right-6 h-px" style={{
        background: `linear-gradient(90deg, transparent, ${color}60, transparent)`
      }} />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="section-label mb-3" style={{ color: `${color}99` }}>{title}</p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.15, duration: 0.4 }}
          >
            <p className="stat-value text-3xl mb-1" style={{ color }}>
              {value ?? '—'}{suffix}
            </p>
          </motion.div>
          {subtitle && <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>{subtitle}</p>}
          {trendValue !== undefined && (
            <div className={cn(
              'flex items-center gap-1 mt-2 text-xs font-semibold',
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            )}>
              {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              <span>{Math.abs(trendValue)}% this week</span>
            </div>
          )}
        </div>

        {Icon && (
          <div
            className="p-3 rounded-12 flex-shrink-0"
            style={{
              background: `${color}12`,
              border: `1px solid ${color}25`,
              borderRadius: '12px'
            }}
          >
            <Icon size={18} style={{ color }} />
          </div>
        )}
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none rounded-b-2xl"
        style={{ background: `radial-gradient(ellipse at bottom, ${color}06, transparent)` }}
      />
    </motion.div>
  );
};

export default StatCard;
