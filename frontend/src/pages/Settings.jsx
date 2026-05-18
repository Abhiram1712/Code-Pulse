import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Link as LinkIcon, Save, CheckCircle, XCircle, RefreshCw, Settings2 } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useConnectPlatform, useSyncPlatform } from '../hooks/useQueries';
import toast from 'react-hot-toast';
import api from '../lib/api';

const PLATFORMS = [
  { id: 'leetcode',     name: 'LeetCode',     color: '#ffa116', emoji: '🟨' },
  { id: 'codeforces',   name: 'Codeforces',   color: '#3b82f6', emoji: '🔵' },
  { id: 'codechef',     name: 'CodeChef',     color: '#cd7f32', emoji: '🟤' },
  { id: 'interviewbit', name: 'InterviewBit', color: '#22c55e', emoji: '🟢' },
];

const Settings = () => {
  const { user, updateUser } = useAuth();
  const connectMutation = useConnectPlatform();
  const syncMutation = useSyncPlatform();
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState({
    username: user?.username || '',
    theme: user?.theme || 'cyberpunk',
  });

  const [platforms, setPlatforms] = useState({
    leetcode:     user?.platforms?.leetcode?.username || '',
    codeforces:   user?.platforms?.codeforces?.username || '',
    codechef:     user?.platforms?.codechef?.username || '',
    interviewbit: user?.platforms?.interviewbit?.username || '',
  });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.put('/users/profile', profile);
      updateUser(res.data.data);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnect = (platform) => {
    const username = platforms[platform];
    if (!username.trim()) { toast.error('Please enter a username'); return; }
    connectMutation.mutate({ platform, username }, {
      onSuccess: () => {
        updateUser({ platforms: { ...user.platforms, [platform]: { username, connected: true } } });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel relative overflow-hidden px-6 py-5"
      >
        <div className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, #8892b0, #00d4ff, #7c3aed)' }} />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(136,146,176,0.1)', border: '1px solid rgba(136,146,176,0.2)' }}>
            <Settings2 size={18} style={{ color: '#8892b0' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
              Settings
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-2)' }}>Manage profile and platform connections</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile card */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle icon={User} iconBg="rgba(0,212,255,0.1)">
              <span style={{ color: 'var(--text)' }}>Profile</span>
            </CardTitle>
          </CardHeader>

          {/* User avatar display */}
          <div className="flex items-center gap-4 mb-6 p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                boxShadow: '0 0 20px rgba(0,212,255,0.3)'
              }}>
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                {user?.username}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{user?.email}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="badge badge-cyan text-[10px]">Lv.{user?.level}</span>
                <span className="badge badge-amber text-[10px]">{user?.xp} XP</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block section-label mb-2">Username</label>
              <input
                type="text" disabled
                className="input-field opacity-50 cursor-not-allowed"
                value={profile.username}
              />
              <p className="text-[10px] mt-1.5 font-mono" style={{ color: 'var(--text-3)' }}>Username cannot be changed.</p>
            </div>
            <div>
              <label className="block section-label mb-2">Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'cyberpunk', label: 'Cyberpunk', color: '#00d4ff' },
                  { value: 'amoled',    label: 'AMOLED',    color: '#ffffff' },
                  { value: 'matrix',    label: 'Matrix',    color: '#10b981' },
                  { value: 'minimal',   label: 'Minimal',   color: '#8892b0' },
                ].map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setProfile({ ...profile, theme: t.value })}
                    className="py-2 px-3 rounded-lg text-sm font-medium text-left flex items-center gap-2 transition-all"
                    style={profile.theme === t.value ? {
                      background: `${t.color}12`,
                      border: `1px solid ${t.color}30`,
                      color: t.color
                    } : {
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      color: 'var(--text-2)'
                    }}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button type="submit" disabled={isSaving} className="btn-primary w-full">
                <Save size={14} /> {isSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Card>

        {/* Platforms card */}
        <Card>
          <CardHeader>
            <CardTitle icon={LinkIcon} iconBg="rgba(124,58,237,0.12)">
              <span style={{ color: 'var(--text)' }}>Connected Accounts</span>
            </CardTitle>
            <span className="section-label">
              {Object.values(user?.platforms || {}).filter(p => p.connected).length}/4
            </span>
          </CardHeader>

          <div className="space-y-3">
            {PLATFORMS.map(p => {
              const isConnected = user?.platforms?.[p.id]?.connected;
              const isConnecting = connectMutation.isPending && connectMutation.variables?.platform === p.id;
              const isSyncing = syncMutation.isPending && syncMutation.variables === p.id;

              return (
                <motion.div
                  key={p.id}
                  className="rounded-xl p-4 transition-all"
                  style={{
                    background: isConnected ? `${p.color}06` : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isConnected ? p.color + '20' : 'rgba(255,255,255,0.06)'}`
                  }}
                  whileHover={{ borderColor: `${p.color}30` }}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{p.emoji}</span>
                      <span className="text-sm font-semibold" style={{ color: p.color, fontFamily: 'var(--font-display)' }}>
                        {p.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isConnected ? (
                        <>
                          <button
                            onClick={() => syncMutation.mutate(p.id)}
                            disabled={isSyncing}
                            className="w-6 h-6 rounded-md flex items-center justify-center transition-all"
                            style={{ background: `${p.color}12`, color: p.color }}
                            title="Sync now"
                          >
                            <RefreshCw size={11} className={isSyncing ? 'animate-spin' : ''} />
                          </button>
                          <span className="badge badge-emerald text-[10px]">
                            <CheckCircle size={9} /> Connected
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold py-0.5 px-2 rounded-full font-mono"
                          style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          Not connected
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Username / Handle"
                      className="input-field py-2 text-[13px] flex-1"
                      value={platforms[p.id]}
                      onChange={e => setPlatforms({ ...platforms, [p.id]: e.target.value })}
                      onKeyDown={e => e.key === 'Enter' && handleConnect(p.id)}
                      style={{ borderColor: isConnected ? `${p.color}20` : undefined }}
                    />
                    <button
                      onClick={() => handleConnect(p.id)}
                      disabled={isConnecting}
                      className="btn-ghost py-2 text-xs flex-shrink-0 w-20"
                      style={isConnected ? { borderColor: `${p.color}25`, color: p.color } : {}}
                    >
                      {isConnecting ? '…' : isConnected ? 'Update' : 'Connect'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
