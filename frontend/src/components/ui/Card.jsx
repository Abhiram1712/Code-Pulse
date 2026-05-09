import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Card = ({ children, className, hover = true, glow = false, delay = 0, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
    className={cn('glass-card p-6', glow && 'shadow-neon-cyan', className)}
    {...props}
  >
    {children}
  </motion.div>
);

export const CardHeader = ({ children, className }) => (
  <div className={cn('flex items-center justify-between mb-4', className)}>{children}</div>
);

export const CardTitle = ({ children, className, icon: Icon }) => (
  <div className={cn('flex items-center gap-2.5', className)}>
    {Icon && <Icon className="w-4 h-4 text-cyan-400" />}
    <h3 className="font-semibold text-sm text-slate-200">{children}</h3>
  </div>
);

export default Card;
