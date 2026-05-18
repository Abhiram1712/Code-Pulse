import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const Card = ({ children, className, hover = true, delay = 0, glow, ...props }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
    className={cn('panel', hover && 'panel-hover', className)}
    {...props}
  >
    {children}
  </motion.div>
);

export const CardHeader = ({ children, className }) => (
  <div className={cn('card-header', className)}>{children}</div>
);

export const CardTitle = ({ children, className, icon: Icon, iconBg }) => (
  <div className={cn('card-title', className)}>
    {Icon && (
      <div className="card-title-icon" style={iconBg ? { background: iconBg } : {}}>
        <Icon size={15} />
      </div>
    )}
    <span>{children}</span>
  </div>
);

export default Card;
