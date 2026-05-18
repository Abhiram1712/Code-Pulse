import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, TrendingUp, Target, Trophy, Settings,
  Code2, LogOut, ChevronLeft, ChevronRight, Zap, RefreshCw, Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getLevelInfo } from '../../lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', color: '#00d4ff' },
  { to: '/analytics', icon: TrendingUp, label: 'Analytics', color: '#7c3aed' },
  { to: '/goals', icon: Target, label: 'Goals', color: '#10b981' },
  { to: '/achievements', icon: Trophy, label: 'Achievements', color: '#f59e0b' },
  { to: '/settings', icon: Settings, label: 'Settings', color: '#8892b0' },
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
      animate={{ width: collapsed ? 68 : 236 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex flex-col h-screen flex-shrink-0 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgba(0,8,20,0.98) 0%, rgba(2,12,27,0.98) 100%)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Ambient glow top */}
      <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, rgba(0,212,255,0.04) 0%, transparent 70%)' }} />

      {/* Vertical accent line */}
      <div className="absolute right-0 top-0 bottom-0 w-px"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,212,255,0.15), rgba(124,58,237,0.1), transparent)' }} />

      {/* Collapse toggle */}
      <motion.button
        onClick={() => setCollapsed(!collapsed)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute -right-3.5 top-[72px] z-20 w-7 h-7 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(0,8,20,0.98)',
          border: '1px solid rgba(0,212,255,0.25)',
          color: '#00d4ff',
          boxShadow: '0 0 12px rgba(0,212,255,0.2)'
        }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </motion.button>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-[60px] flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              boxShadow: '0 0 20px rgba(0,212,255,0.4)'
            }}>
            <Code2 size={15} className="text-white" />
          </div>
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-xl animate-pulse-glow opacity-50"
            style={{ boxShadow: '0 0 0 2px rgba(0,212,255,0.3)' }} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="font-display font-700 text-base grad-text tracking-tight whitespace-nowrap"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px' }}>
                CodePulse
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <Activity size={9} className="text-emerald-400 animate-pulse" />
                <span className="text-[9px] text-emerald-400 font-mono font-semibold tracking-wider">LIVE</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User profile */}
      {user && (
        <div className={`px-3 py-4 flex-shrink-0 ${collapsed ? 'flex justify-center' : ''}`}
          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          {collapsed ? (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 12px rgba(0,212,255,0.3)' }}>
              {user.username?.[0]?.toUpperCase()}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 12px rgba(0,212,255,0.3)' }}>
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 overflow-hidden">
                  <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: 'var(--font-display)' }}>
                    {user.username}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Zap size={10} className="text-amber-400" />
                    <span className="text-xs font-semibold" style={{ color: levelInfo.color, fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                      LV.{user.level} {levelInfo.title}
                    </span>
                  </div>
                </div>
              </div>
              {/* XP bar */}
              <div className="mt-3">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] text-muted font-mono">{user.xp} XP</span>
                  <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>
                    Lv.{(user.level || 1) + 1}
                  </span>
                </div>
                <div className="progress-track">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${levelInfo.color}, ${levelInfo.color}80)` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${levelInfo.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-none">
        {!collapsed && (
          <p className="section-label px-3 mb-3">Navigation</p>
        )}
        {NAV_ITEMS.map(({ to, icon: Icon, label, color }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <NavLink key={to} to={to} className="block">
              <motion.div
                whileHover={{ x: collapsed ? 0 : 2 }}
                whileTap={{ scale: 0.97 }}
                className={`nav-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
                style={isActive ? { color } : {}}
                title={collapsed ? label : undefined}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isActive ? `${color}18` : 'transparent',
                    color: isActive ? color : 'inherit'
                  }}
                >
                  <Icon size={15} />
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="text-[13px]"
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

      {/* Footer actions */}
      <div className="px-2 py-3 flex-shrink-0 space-y-0.5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <motion.button
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          whileTap={{ scale: 0.97 }}
          className={`nav-link w-full ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Sync All' : undefined}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-cyan-500/10">
            <RefreshCw size={13} className={`text-cyan-400 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[13px]"
              >
                {syncMutation.isPending ? 'Syncing…' : 'Sync All'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          onClick={logout}
          whileTap={{ scale: 0.97 }}
          className={`nav-link w-full text-red-500/50 hover:text-red-400 hover:bg-red-500/06 ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Logout' : undefined}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center">
            <LogOut size={13} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[13px]"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
