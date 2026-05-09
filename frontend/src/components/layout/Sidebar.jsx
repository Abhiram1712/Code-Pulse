import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, TrendingUp, Target, Trophy, Settings,
  Code2, LogOut, ChevronLeft, ChevronRight, Zap, Bell, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getLevelInfo } from '../../lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/achievements', icon: Trophy, label: 'Achievements' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const queryClient = useQueryClient();

  const levelInfo = getLevelInfo(user?.xp || 0);

  const syncMutation = useMutation({
    mutationFn: () => api.post('/platforms/sync'),
    onSuccess: () => {
      toast.success('All platforms synced!');
      queryClient.invalidateQueries();
    },
    onError: () => toast.error('Sync failed'),
  });

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-screen flex-shrink-0"
      style={{
        background: 'linear-gradient(180deg, rgba(2,8,24,0.95) 0%, rgba(4,15,36,0.95) 100%)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)'
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ background: '#040f24', border: '1px solid rgba(255,255,255,0.1)', color: '#06b6d4' }}
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.04]">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', boxShadow: '0 0 20px rgba(6,182,212,0.4)' }}>
          <Code2 className="w-4 h-4 text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="font-bold text-lg font-display gradient-text"
            >
              CodePulse
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* User info */}
      {user && (
        <div className={`px-3 py-4 border-b border-white/[0.04] ${collapsed ? 'flex justify-center' : ''}`}>
          {collapsed ? (
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #06b6d4, #a855f7)', boxShadow: '0 0 15px rgba(6,182,212,0.3)' }}
            >
              {user.username?.[0]?.toUpperCase()}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #a855f7)', boxShadow: '0 0 15px rgba(6,182,212,0.3)' }}
              >
                {user.username?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">{user.username}</p>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-yellow-400 font-medium">Lv.{user.level} {levelInfo.title}</span>
                </div>
              </div>
            </div>
          )}

          {/* XP bar */}
          {!collapsed && (
            <div className="mt-2.5">
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${levelInfo.color}, ${levelInfo.color}aa)` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${levelInfo.progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-slate-600 mt-1">{user.xp} XP · Level {user.level}</p>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-hidden">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <NavLink key={to} to={to}>
              <motion.div
                className={`nav-item ${isActive ? 'active' : ''}`}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-2 py-4 border-t border-white/[0.04] space-y-1">
        <button
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          className="nav-item w-full"
          title="Sync all platforms"
        >
          <RefreshCw className={`w-4 h-4 flex-shrink-0 ${syncMutation.isPending ? 'animate-spin text-cyan-400' : ''}`} />
          {!collapsed && <span className="text-sm">Sync All</span>}
        </button>
        <button
          onClick={logout}
          className="nav-item w-full text-red-400/70 hover:text-red-400 hover:bg-red-400/5"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
