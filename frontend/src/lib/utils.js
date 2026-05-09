import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (num) => {
  if (!num && num !== 0) return '—';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const formatDate = (date) => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
};

export const formatRelativeTime = (date) => {
  if (!date) return '—';
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

export const getLevelInfo = (xp) => {
  const levels = [
    { level: 1, title: 'Initiate', minXp: 0, maxXp: 100, color: '#94a3b8' },
    { level: 2, title: 'Apprentice', minXp: 100, maxXp: 250, color: '#22c55e' },
    { level: 3, title: 'Developer', minXp: 250, maxXp: 500, color: '#3b82f6' },
    { level: 4, title: 'Engineer', minXp: 500, maxXp: 1000, color: '#06b6d4' },
    { level: 5, title: 'Specialist', minXp: 1000, maxXp: 2000, color: '#8b5cf6' },
    { level: 6, title: 'Expert', minXp: 2000, maxXp: 3500, color: '#a855f7' },
    { level: 7, title: 'Master', minXp: 3500, maxXp: 5500, color: '#f59e0b' },
    { level: 8, title: 'Grandmaster', minXp: 5500, maxXp: 8000, color: '#f97316' },
    { level: 9, title: 'Legend', minXp: 8000, maxXp: 11000, color: '#ef4444' },
    { level: 10, title: 'Mythic', minXp: 11000, maxXp: 15000, color: '#06b6d4' },
  ];
  const current = levels.findLast(l => xp >= l.minXp) || levels[0];
  const progress = current.maxXp ? ((xp - current.minXp) / (current.maxXp - current.minXp)) * 100 : 100;
  return { ...current, progress: Math.min(100, Math.max(0, progress)), xp };
};

export const getPlatformColor = (platform) => {
  const colors = {
    leetcode: { primary: '#ffa116', bg: 'rgba(255, 161, 22, 0.1)', border: 'rgba(255, 161, 22, 0.3)' },
    codeforces: { primary: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)' },
    codechef: { primary: '#cd7f32', bg: 'rgba(205, 127, 50, 0.1)', border: 'rgba(205, 127, 50, 0.3)' },
    interviewbit: { primary: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)' },
  };
  return colors[platform] || { primary: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.3)' };
};

export const getRatingColor = (platform, rating) => {
  if (platform === 'codeforces') {
    if (rating >= 2400) return '#ff0000';
    if (rating >= 2100) return '#ff8c00';
    if (rating >= 1900) return '#aa00aa';
    if (rating >= 1600) return '#0000ff';
    if (rating >= 1400) return '#03a89e';
    if (rating >= 1200) return '#008000';
    return '#808080';
  }
  if (platform === 'codechef') {
    if (rating >= 2500) return '#ff7f00';
    if (rating >= 2000) return '#d4af37';
    if (rating >= 1800) return '#9b59b6';
    if (rating >= 1600) return '#3498db';
    return '#2ecc71';
  }
  return '#06b6d4';
};

export const generateHeatmapColor = (count, max = 10) => {
  if (count === 0) return 'rgba(255, 255, 255, 0.04)';
  const intensity = Math.min(count / max, 1);
  if (intensity < 0.25) return 'rgba(6, 182, 212, 0.2)';
  if (intensity < 0.5) return 'rgba(6, 182, 212, 0.4)';
  if (intensity < 0.75) return 'rgba(6, 182, 212, 0.65)';
  return 'rgba(6, 182, 212, 0.9)';
};
