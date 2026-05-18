import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink, CheckCircle, XCircle, Clock, Zap } from 'lucide-react';
import Card, { CardHeader, CardTitle } from '../ui/Card';
import { getPlatformColor, formatRelativeTime } from '../../lib/utils';
import { useSyncPlatform } from '../../hooks/useQueries';

const PLATFORM_META = {
  leetcode:    { name: 'LeetCode',    short: 'LC', url: 'https://leetcode.com',    emoji: '🟨' },
  codeforces:  { name: 'Codeforces',  short: 'CF', url: 'https://codeforces.com',  emoji: '🔵' },
  codechef:    { name: 'CodeChef',    short: 'CC', url: 'https://codechef.com',    emoji: '🟤' },
  interviewbit:{ name: 'InterviewBit',short: 'IB', url: 'https://interviewbit.com',emoji: '🟢' },
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
      className="panel panel-hover relative overflow-hidden p-4"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Top color line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${colors.primary}80, ${colors.primary}, ${colors.primary}40)` }} />

      {/* Background glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl"
        style={{ background: `radial-gradient(ellipse at top left, ${colors.primary}0a, transparent 70%)` }} />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
            style={{ background: `${colors.primary}15`, border: `1px solid ${colors.primary}25` }}>
            <span className="text-base">{meta.emoji}</span>
          </div>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: colors.primary, fontFamily: 'var(--font-display)' }}>
              {meta.name}
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>
              {userPlatform?.username ? `@${userPlatform.username}` : 'Not connected'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isConnected && (
            <motion.button
              onClick={() => syncMutation.mutate(platform)}
              disabled={isSyncing}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
              style={{ background: `${colors.primary}12`, color: colors.primary }}
              title="Sync now"
            >
              <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
            </motion.button>
          )}
          <a href={meta.url} target="_blank" rel="noopener noreferrer"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-white/5"
            style={{ color: 'var(--text-3)' }}>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {isConnected && stats ? (
        <>
          {/* Main stat */}
          <div className="mb-3">
            <div className="flex items-end gap-1.5">
              <motion.p
                className="text-3xl font-bold"
                style={{ color: colors.primary, fontFamily: 'var(--font-display)', lineHeight: 1 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {stats?.totalSolved ?? '—'}
              </motion.p>
              <span className="text-xs pb-1" style={{ color: 'var(--text-3)' }}>solved</span>
            </div>
          </div>

          {/* Platform-specific data */}
          {platform === 'leetcode' && (
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {[
                { label: 'Easy', value: stats.easySolved, color: '#10b981' },
                { label: 'Med', value: stats.mediumSolved, color: '#f59e0b' },
                { label: 'Hard', value: stats.hardSolved, color: '#f43f5e' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-lg py-1.5 text-center"
                  style={{ background: `${color}0e`, border: `1px solid ${color}1a` }}>
                  <p className="text-sm font-bold font-mono" style={{ color }}>{value ?? 0}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-3)' }}>{label}</p>
                </div>
              ))}
            </div>
          )}

          {(platform === 'codeforces' || platform === 'codechef') && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                style={{ background: `${colors.primary}12`, border: `1px solid ${colors.primary}20` }}>
                <Zap size={10} style={{ color: colors.primary }} />
                <span className="text-sm font-bold font-mono" style={{ color: colors.primary }}>
                  {stats?.rating ?? '—'}
                </span>
                {platform === 'codeforces' && stats?.rank && (
                  <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>• {stats.rank}</span>
                )}
                {platform === 'codechef' && stats?.stars > 0 && (
                  <span className="text-[10px] text-amber-400">• {'★'.repeat(Math.min(stats.stars, 7))}</span>
                )}
              </div>
            </div>
          )}

          {/* Sync status */}
          <div className="flex items-center gap-1.5 pt-2.5"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {syncStatus === 'success' ? (
              <CheckCircle size={11} className="text-emerald-500" />
            ) : syncStatus === 'failed' ? (
              <XCircle size={11} className="text-rose-500" />
            ) : (
              <Clock size={11} style={{ color: 'var(--text-3)' }} />
            )}
            <span className="text-[10px] font-mono" style={{ color: 'var(--text-3)' }}>
              {stats.lastSynced ? formatRelativeTime(stats.lastSynced) : 'Never synced'}
            </span>
          </div>
        </>
      ) : (
        <div className="py-5 text-center">
          <p className="text-xs mb-3" style={{ color: 'var(--text-3)' }}>Not connected</p>
          <a href="/settings" className="btn-cyber text-xs py-1.5 px-3" style={{ fontSize: '11px' }}>
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
  const connectedCount = Object.values(userPlatforms).filter(p => p.connected).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle icon={null}>
          <span className="grad-text" style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 600 }}>
            Platform Overview
          </span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full -ml-0.5 first:ml-0"
                style={{
                  background: i < connectedCount ? '#10b981' : 'rgba(255,255,255,0.1)',
                  boxShadow: i < connectedCount ? '0 0 4px #10b981' : 'none'
                }} />
            ))}
          </div>
          <span className="section-label">{connectedCount}/4</span>
        </div>
      </CardHeader>
      <div className="grid grid-cols-2 gap-3">
        {Object.keys(PLATFORM_META).map(platform => (
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
