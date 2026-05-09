import { NavLink } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, Target, Trophy, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/analytics', icon: TrendingUp, label: 'Stats' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/achievements', icon: Trophy, label: 'Awards' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const MobileNav = () => (
  <nav
    className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
    style={{
      background: 'rgba(2,8,24,0.95)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      backdropFilter: 'blur(20px)'
    }}
  >
    {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
      <NavLink key={to} to={to}>
        {({ isActive }) => (
          <motion.div
            className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200"
            style={isActive ? {
              background: 'rgba(6,182,212,0.1)',
              color: '#06b6d4'
            } : { color: '#475569' }}
            whileTap={{ scale: 0.9 }}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </motion.div>
        )}
      </NavLink>
    ))}
  </nav>
);

export default MobileNav;
