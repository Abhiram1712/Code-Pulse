import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, UserPlus, Eye, EyeOff, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: '6+ characters', ok: password.length >= 6 },
    { label: 'Letter', ok: /[a-zA-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ['#f43f5e', '#f59e0b', '#10b981'];
  const labels = ['Weak', 'Fair', 'Strong'];

  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{ background: i < score ? colors[score - 1] : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono" style={{ color: score > 0 ? colors[score - 1] : 'var(--text-3)' }}>
          {score > 0 ? labels[score - 1] : ''}
        </span>
        <div className="flex gap-2 ml-auto">
          {checks.map(({ label, ok }) => (
            <div key={label} className="flex items-center gap-1">
              {ok ? <CheckCircle2 size={9} className="text-emerald-400" /> : <Circle size={9} style={{ color: 'var(--text-3)' }} />}
              <span className="text-[9px] font-mono" style={{ color: ok ? 'var(--text-2)' : 'var(--text-3)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(username, email, password);
      toast.success('Account created! Welcome 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--void)' }}>

      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] opacity-15"
          style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full blur-[120px] opacity-15"
          style={{ background: 'radial-gradient(circle, #e879f9, transparent)' }} />
        <div className="absolute top-1/3 right-0 w-64 h-64 rounded-full blur-[100px] opacity-10"
          style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(124,58,237,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="panel p-8 relative overflow-hidden"
          style={{ border: '1px solid rgba(124,58,237,0.2)', boxShadow: '0 0 60px rgba(124,58,237,0.08), 0 32px 64px rgba(0,0,0,0.6)' }}>

          {/* Animated top border */}
          <div className="absolute top-0 left-0 right-0 h-px animate-gradient"
            style={{ background: 'linear-gradient(90deg, transparent, #7c3aed, #e879f9, #00d4ff, #7c3aed, transparent)', backgroundSize: '200% 100%' }} />

          {/* Logo */}
          <div className="text-center mb-7">
            <div className="relative inline-block mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed20, #e879f920)',
                  border: '1px solid rgba(124,58,237,0.3)',
                }}>
                <Code2 size={28} style={{ color: '#a78bfa' }} />
              </div>
              <div className="absolute inset-0 rounded-2xl animate-pulse-glow opacity-30"
                style={{ boxShadow: '0 0 0 3px rgba(124,58,237,0.3)' }} />
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              <span style={{ background: 'linear-gradient(135deg, #a78bfa, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Join CodePulse
              </span>
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>Track your coding journey 🚀</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block section-label mb-2">Username</label>
              <input
                id="reg-username"
                type="text"
                required
                minLength={3}
                autoComplete="username"
                placeholder="coder_xyz"
                className="input-field"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{ borderColor: username.length >= 3 ? 'rgba(124,58,237,0.3)' : undefined }}
              />
            </div>

            <div>
              <label className="block section-label mb-2">Email</label>
              <input
                id="reg-email"
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
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete="new-password"
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
              <PasswordStrength password={password} />
            </div>

            <motion.button
              id="reg-submit"
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-3 mt-2 text-sm"
              style={{ background: 'linear-gradient(135deg, #5b21b6, #7c3aed, #e879f9)' }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Create Account <UserPlus size={15} />
                </span>
              )}
            </motion.button>
          </form>

          {/* Perks */}
          <div className="mt-5 pt-4 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { icon: '📊', text: 'Track across LeetCode, CF, CodeChef & more' },
              { icon: '🏆', text: 'Earn XP and unlock achievements' },
              { icon: '🔥', text: 'Build streaks & daily goals' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2.5">
                <span className="text-sm">{icon}</span>
                <span className="text-xs" style={{ color: 'var(--text-3)' }}>{text}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-sm mt-5" style={{ color: 'var(--text-3)' }}>
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold transition-colors hover:text-violet-300"
              style={{ color: '#a78bfa' }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
