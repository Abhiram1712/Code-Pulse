import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink, CheckCircle, XCircle, Clock } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../ui/Card';
import { getPlatformColor, formatRelativeTime } from '../../lib/utils';
import { useSyncPlatform } from '../../hooks/useQueries';

const PLATFORM_META = {
  leetcode: { name: 'LeetCode', icon: '🟨', url: 'https://leetcode.com' },
  codeforces: { name: 'Codeforces', icon: '🔵', url: 'https://codeforces.com' },
  codechef: { name: 'CodeChef', icon: '🍳', url: 'https://codechef.com' },
  interviewbit: { name: 'InterviewBit', icon: '🟢', url: 'https://interviewbit.com' },
};

const PlatformCard = ({ platform, stats, userPlatform }) => {
  const meta = PLATFORM_META[platform];
  const colors = getPlatformColor(platform);
  const syncMutation = useSyncPlatform();
  const isSyncing = syncMutation.isPending && syncMutation.variables === platform;

  const isConnected = userPlatform?.connected;
  const syncStatus = stats?.syncStatus;

  return (
    <motion.div
      className="glass-card p-4 relative overflow-hidden group"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at top left, ${colors.primary}12, transparent 70%)` }}
      />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{meta.icon}</span>
          <div>
            <h4 className="font-semibold text-sm text-slate-200">{meta.name}</h4>
            <p className="text-xs text-slate-500">
              {userPlatform?.username ? `@${userPlatform.username}` : 'Not connected'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {isConnected && (
            <button
              onClick={() => syncMutation.mutate(platform)}
              disabled={isSyncing}
              className="p-1.5 rounded-lg transition-all duration-200 hover:bg-white/5"
              style={{ color: colors.primary }}
              title="Sync now"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          )}
          <a
            href={meta.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 transition-all duration-200"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {isConnected && stats ? (
        <>
          {/* Main stat */}
          <div className="mb-3">
            <motion.p
              className="text-3xl font-bold font-display"
              style={{ color: colors.primary }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {stats?.totalSolved ?? '—'}
            </motion.p>
            <p className="text-xs text-slate-500">problems solved</p>
          </div>

          {/* Platform-specific stats */}
          {platform === 'leetcode' && (
            <div className="flex gap-2 mb-3">
              {[
                { label: 'E', value: stats.easySolved, color: '#22c55e' },
                { label: 'M', value: stats.mediumSolved, color: '#f59e0b' },
                { label: 'H', value: stats.hardSolved, color: '#ef4444' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex-1 text-center rounded-lg py-1.5" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                  <p className="text-sm font-bold" style={{ color }}>{value ?? 0}</p>
                  <p className="text-xs text-slate-600">{label}</p>
                </div>
              ))}
            </div>
          )}

          {(platform === 'codeforces' || platform === 'codechef') && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-slate-500">Rating:</span>
              <span
                className="text-sm font-bold font-mono"
                style={{ color: colors.primary }}
              >
                {stats?.rating ?? '—'}
              </span>
              {platform === 'codeforces' && stats?.rank && (
                <span className="text-xs text-slate-500">({stats.rank})</span>
              )}
              {platform === 'codechef' && stats?.stars && (
                <span className="text-xs">{'⭐'.repeat(Math.min(stats.stars, 7))}</span>
              )}
            </div>
          )}

          {/* Sync status */}
          <div className="flex items-center gap-1.5 pt-2 border-t border-white/5">
            {syncStatus === 'success' ? (
              <CheckCircle className="w-3 h-3 text-emerald-500" />
            ) : syncStatus === 'failed' ? (
              <XCircle className="w-3 h-3 text-red-500" />
            ) : (
              <Clock className="w-3 h-3 text-slate-600" />
            )}
            <span className="text-xs text-slate-600">
              {stats.lastSynced ? `Synced ${formatRelativeTime(stats.lastSynced)}` : 'Never synced'}
            </span>
          </div>
        </>
      ) : (
        <div className="py-4 text-center">
          <p className="text-xs text-slate-600 mb-2">Not connected</p>
          <a href="/settings" className="btn-ghost text-xs py-1.5 px-3">
            Connect →
          </a>
        </div>
      )}
    </motion.div>
  );
};

const PlatformCards = ({ platformStats = [], userPlatforms = {} }) => {
  const statsMap = {};
  platformStats.forEach(s => { statsMap[s.platform] = s; });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Overview</CardTitle>
        <span className="section-label">{Object.values(userPlatforms).filter(p => p.connected).length}/4 connected</span>
      </CardHeader>

      <div className="grid grid-cols-2 gap-3">
        {Object.keys(PLATFORM_META).map((platform, i) => (
          <PlatformCard
            key={platform}
            platform={platform}
            stats={statsMap[platform]}
            userPlatform={userPlatforms[platform]}
          />
        ))}
      </div>
    </Card>
  );
};

export default PlatformCards;
