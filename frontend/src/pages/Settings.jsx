import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Link as LinkIcon, Save } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useConnectPlatform } from '../hooks/useQueries';
import toast from 'react-hot-toast';
import api from '../lib/api';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const connectMutation = useConnectPlatform();
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState({
    username: user?.username || '',
    theme: user?.theme || 'cyberpunk',
  });

  const [platforms, setPlatforms] = useState({
    leetcode: user?.platforms?.leetcode?.username || '',
    codeforces: user?.platforms?.codeforces?.username || '',
    codechef: user?.platforms?.codechef?.username || '',
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
    if (!username) {
      toast.error('Please enter a username');
      return;
    }
    connectMutation.mutate({ platform, username }, {
      onSuccess: () => {
        // Also update local user context so UI reflects connection
        updateUser({
          platforms: {
            ...user.platforms,
            [platform]: { username, connected: true }
          }
        });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-white mb-1">Settings ⚙️</h1>
        <p className="text-slate-400">Manage your profile and platform integrations.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle icon={User}>Profile Settings</CardTitle>
          </CardHeader>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
              <input 
                type="text" 
                className="input-cyber" 
                value={profile.username}
                onChange={e => setProfile({...profile, username: e.target.value})}
                disabled // Changing username might break things without proper backend support
              />
              <p className="text-[10px] text-slate-500 mt-1">Username cannot be changed currently.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Theme</label>
              <select 
                className="input-cyber appearance-none bg-dark-secondary"
                value={profile.theme}
                onChange={e => setProfile({...profile, theme: e.target.value})}
              >
                <option value="cyberpunk">Cyberpunk (Default)</option>
                <option value="amoled">AMOLED Dark</option>
                <option value="matrix">Matrix</option>
                <option value="minimal">Minimal Dark</option>
              </select>
            </div>
            <div className="pt-4 border-t border-white/5">
              <button type="submit" disabled={isSaving} className="btn-neon w-full flex justify-center items-center gap-2">
                <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Card>

        {/* Platform Connections */}
        <Card>
          <CardHeader>
            <CardTitle icon={LinkIcon}>Connected Accounts</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {[
              { id: 'leetcode', name: 'LeetCode', color: '#ffa116' },
              { id: 'codeforces', name: 'Codeforces', color: '#3b82f6' },
              { id: 'codechef', name: 'CodeChef', color: '#cd7f32' },
              { id: 'interviewbit', name: 'InterviewBit', color: '#22c55e' }
            ].map(p => {
              const isConnected = user?.platforms?.[p.id]?.connected;
              const isSyncing = connectMutation.isPending && connectMutation.variables?.platform === p.id;
              
              return (
                <div key={p.id} className="p-4 rounded-xl bg-white/5 border border-white/10 transition-all hover:border-white/20">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm" style={{ color: p.color }}>{p.name}</span>
                    {isConnected ? (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full uppercase tracking-wider">Connected</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider">Not Connected</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Username/Handle" 
                      className="input-cyber py-2 text-xs flex-1"
                      value={platforms[p.id]}
                      onChange={e => setPlatforms({...platforms, [p.id]: e.target.value})}
                    />
                    <button 
                      onClick={() => handleConnect(p.id)}
                      disabled={isSyncing}
                      className="btn-ghost py-2 text-xs w-20"
                    >
                      {isSyncing ? '...' : (isConnected ? 'Update' : 'Connect')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
