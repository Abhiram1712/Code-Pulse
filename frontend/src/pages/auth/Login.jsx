import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, ArrowRight, Eye, EyeOff, Zap, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--void)' }}>

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20"
          style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-15"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute top-1/2 left-0 w-72 h-72 rounded-full blur-[100px] opacity-10"
          style={{ background: 'radial-gradient(circle, #e879f9, transparent)' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Card */}
        <div className="panel p-8 relative overflow-hidden"
          style={{ border: '1px solid rgba(0,212,255,0.15)', boxShadow: '0 0 60px rgba(0,212,255,0.08), 0 32px 64px rgba(0,0,0,0.6)' }}>

          {/* Animated top border */}
          <div className="absolute top-0 left-0 right-0 h-px animate-gradient"
            style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, #7c3aed, #e879f9, #00d4ff, transparent)', backgroundSize: '200% 100%' }} />

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff20, #7c3aed20)',
                  border: '1px solid rgba(0,212,255,0.25)',
                }}>
                <Code2 size={28} style={{ color: '#00d4ff' }} />
              </div>
              {/* Pulse ring */}
              <div className="absolute inset-0 rounded-2xl animate-pulse-glow opacity-40"
                style={{ boxShadow: '0 0 0 3px rgba(0,212,255,0.25)' }} />
              {/* Live dot */}
              <div className="absolute -top-1 -right-1 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                <Activity size={8} className="text-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-mono" style={{ fontSize: '8px' }}>LIVE</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold grad-text mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              CodePulse
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>Welcome back, coder 👋</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block section-label mb-2">Email</label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="input-field"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block section-label mb-2">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="input-field pr-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-3)' }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <motion.button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-3 mt-2 text-sm"
              style={{ background: 'linear-gradient(135deg, #0091a8, #00d4ff, #7c3aed)' }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight size={15} />
                </span>
              )}
            </motion.button>
          </form>

          {/* Stats strip */}
          <div className="mt-6 pt-5 grid grid-cols-3 gap-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { label: 'Users', value: '1K+', color: '#00d4ff' },
              { label: 'Problems', value: '∞', color: '#7c3aed' },
              { label: 'Streaks', value: '🔥', color: '#f97316' },
            ].map(({ label, value, color }) => (
              <div key={label} className="text-center">
                <p className="text-base font-bold font-mono" style={{ color }}>{value}</p>
                <p className="text-[10px] section-label mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm mt-5" style={{ color: 'var(--text-3)' }}>
            New here?{' '}
            <Link to="/auth/register" className="font-semibold transition-colors hover:text-cyan-300"
              style={{ color: '#00d4ff' }}>
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
