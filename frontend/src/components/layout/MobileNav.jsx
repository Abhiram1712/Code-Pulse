import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Target, Trophy, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Home', color: '#00d4ff' },
  { to: '/analytics', icon: TrendingUp, label: 'Stats', color: '#7c3aed' },
  { to: '/goals', icon: Target, label: 'Goals', color: '#10b981' },
  { to: '/achievements', icon: Trophy, label: 'Awards', color: '#f59e0b' },
  { to: '/settings', icon: Settings, label: 'Settings', color: '#8892b0' },
];

const MobileNav = () => {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{
        background: 'rgba(0,8,20,0.97)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), rgba(124,58,237,0.3), transparent)' }} />

      {NAV_ITEMS.map(({ to, icon: Icon, label, color }) => {
        const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
        return (
          <NavLink key={to} to={to}>
            <motion.div
              className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl relative"
              style={isActive ? { color } : { color: 'var(--text-3)' }}
              whileTap={{ scale: 0.85 }}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-active-bg"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: `${color}12`, border: `1px solid ${color}20` }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="relative z-10">
                <Icon size={18} />
                {isActive && (
                  <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                )}
              </div>
              <span className="relative z-10 text-[9px] font-semibold tracking-wide"
                style={{ fontFamily: 'var(--font-mono)' }}>
                {label}
              </span>
            </motion.div>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNav;
