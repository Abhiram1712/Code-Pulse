import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import toast from 'react-hot-toast';

// Dashboard
export const useDashboard = () => useQuery({
  queryKey: ['dashboard'],
  queryFn: async () => (await api.get('/analytics/dashboard')).data.data,
  staleTime: 5 * 60 * 1000,
  retry: 2,
});

// Heatmap
export const useHeatmap = (days = 365) => useQuery({
  queryKey: ['heatmap', days],
  queryFn: async () => (await api.get(`/analytics/heatmap?days=${days}`)).data.data,
  staleTime: 10 * 60 * 1000,
});

// Progress chart
export const useProgressChart = (days = 30, platform = 'all') => useQuery({
  queryKey: ['progressChart', days, platform],
  queryFn: async () => (await api.get(`/analytics/progress?days=${days}&platform=${platform}`)).data.data,
  staleTime: 5 * 60 * 1000,
});

// Difficulty distribution
export const useDifficultyDistribution = () => useQuery({
  queryKey: ['difficulty'],
  queryFn: async () => (await api.get('/analytics/difficulty')).data.data,
  staleTime: 10 * 60 * 1000,
});

// Contest history
export const useContestHistory = (platform) => useQuery({
  queryKey: ['contests', platform],
  queryFn: async () => (await api.get(`/analytics/contests${platform ? `?platform=${platform}` : ''}`)).data.data,
  staleTime: 10 * 60 * 1000,
});

// Rating progression
export const useRatingProgression = () => useQuery({
  queryKey: ['ratings'],
  queryFn: async () => (await api.get('/analytics/ratings')).data.data,
  staleTime: 10 * 60 * 1000,
});

// Smart insights
export const useInsights = () => useQuery({
  queryKey: ['insights'],
  queryFn: async () => (await api.get('/analytics/insights')).data.data,
  staleTime: 30 * 60 * 1000,
});

// Platform stats
export const usePlatformStats = () => useQuery({
  queryKey: ['platformStats'],
  queryFn: async () => (await api.get('/platforms/stats')).data.data,
  staleTime: 5 * 60 * 1000,
});

// Goals
export const useGoals = () => useQuery({
  queryKey: ['goals'],
  queryFn: async () => (await api.get('/goals')).data.data,
  staleTime: 2 * 60 * 1000,
});

// Achievements
export const useAchievements = () => useQuery({
  queryKey: ['achievements'],
  queryFn: async () => (await api.get('/achievements')).data.data,
  staleTime: 5 * 60 * 1000,
});

// Today's progress
export const useTodayProgress = () => useQuery({
  queryKey: ['todayProgress'],
  queryFn: async () => (await api.get('/progress/today')).data.data,
  staleTime: 2 * 60 * 1000,
  refetchInterval: 10 * 60 * 1000,
});

// Mutations
export const useSyncPlatform = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (platform) => api.post(`/platforms/sync/${platform}`),
    onSuccess: (_, platform) => {
      toast.success(`${platform} synced successfully!`);
      queryClient.invalidateQueries({ queryKey: ['platformStats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['heatmap'] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Sync failed'),
  });
};

export const useConnectPlatform = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ platform, username }) => api.post('/platforms/connect', { platform, username }),
    onSuccess: () => {
      toast.success('Platform connected!');
      queryClient.invalidateQueries({ queryKey: ['platformStats'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Connection failed'),
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/goals', data),
    onSuccess: () => {
      toast.success('Goal created!');
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create goal'),
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/goals/${id}`),
    onSuccess: () => {
      toast.success('Goal deleted');
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
};
