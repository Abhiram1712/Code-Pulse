import DailyProgress from '../models/DailyProgress.model.js';
import PlatformStats from '../models/PlatformStats.model.js';
import ContestHistory from '../models/ContestHistory.model.js';
import User from '../models/User.model.js';
import Achievement from '../models/Achievement.model.js';

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60 * 1000));
    const today = localDate.toISOString().split('T')[0];

    const [todayProgress, allStats, user, recentAchievements] = await Promise.all([
      DailyProgress.findOne({ user: userId, dateString: today }),
      PlatformStats.find({ user: userId }),
      User.findById(userId),
      Achievement.find({ user: userId, isNew: true }).sort({ createdAt: -1 }).limit(5)
    ]);

    // Build summary
    const platformSummary = {};
    allStats.forEach(s => {
      const data = s[s.platform];
      platformSummary[s.platform] = {
        connected: true,
        lastSynced: s.lastSynced,
        syncStatus: s.syncStatus,
        ...data,
        // Keep the normalized fields for fallback if needed
        totalSolved: data?.totalSolved || 0,
        rating: data?.rating || data?.contestRating || null,
        rank: data?.rank || data?.ranking || null
      };
    });

    const totalSolvedAllTime = Object.values(platformSummary).reduce((sum, p) => sum + (p.totalSolved || 0), 0);

    res.json({
      success: true,
      data: {
        user: {
          username: user.username,
          avatar: user.avatar,
          level: user.level,
          xp: user.xp,
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          weeklyStreak: user.weeklyStreak,
          totalProblems: totalSolvedAllTime,
          theme: user.theme
        },
        todayProgress: todayProgress || {
          totalSolved: 0,
          totalSubmissions: 0,
          codingMinutes: 0,
          platforms: {}
        },
        platformSummary,
        newAchievements: recentAchievements
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
};

export const getHeatmapData = async (req, res) => {
  try {
    const userId = req.user._id;
    const days = parseInt(req.query.days) || 365;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const progressData = await DailyProgress.find({
      user: userId,
      date: { $gte: startDate }
    }).select('dateString totalSolved totalSubmissions codingMinutes productivityScore').sort({ date: 1 });

    const heatmap = progressData.map(d => ({
      date: d.dateString,
      count: d.totalSolved,
      submissions: d.totalSubmissions,
      minutes: d.codingMinutes,
      score: d.productivityScore
    }));

    res.json({ success: true, data: heatmap });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch heatmap data' });
  }
};

export const getProgressChart = async (req, res) => {
  try {
    const userId = req.user._id;
    const days = parseInt(req.query.days) || 30;
    const platform = req.query.platform || 'all';
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const progressData = await DailyProgress.find({
      user: userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    const chartData = progressData.map(d => ({
      date: d.dateString,
      total: d.totalSolved,
      leetcode: d.platforms?.leetcode?.solved || 0,
      codeforces: d.platforms?.codeforces?.solved || 0,
      codechef: d.platforms?.codechef?.solved || 0,
      interviewbit: d.platforms?.interviewbit?.solved || 0
    }));

    res.json({ success: true, data: chartData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch progress chart' });
  }
};

export const getDifficultyDistribution = async (req, res) => {
  try {
    const userId = req.user._id;
    const lcStats = await PlatformStats.findOne({ user: userId, platform: 'leetcode' });
    
    const lc = lcStats?.leetcode;
    const data = {
      easy: lc?.easySolved || 0,
      medium: lc?.mediumSolved || 0,
      hard: lc?.hardSolved || 0,
      totalEasy: lc?.totalEasy || 0,
      totalMedium: lc?.totalMedium || 0,
      totalHard: lc?.totalHard || 0
    };

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch difficulty distribution' });
  }
};

export const getContestHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const platform = req.query.platform;
    const limit = parseInt(req.query.limit) || 20;

    const allStats = await PlatformStats.find({
      user: userId,
      ...(platform ? { platform } : {})
    });

    const contests = [];
    allStats.forEach(s => {
      const history = s[s.platform]?.contestHistory || [];
      history.forEach(c => contests.push({ ...c, platform: s.platform }));
    });

    contests.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({ success: true, data: contests.slice(0, limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch contest history' });
  }
};

export const getRatingProgression = async (req, res) => {
  try {
    const userId = req.user._id;
    const cfStats = await PlatformStats.findOne({ user: userId, platform: 'codeforces' });
    const lcStats = await PlatformStats.findOne({ user: userId, platform: 'leetcode' });
    const ccStats = await PlatformStats.findOne({ user: userId, platform: 'codechef' });

    const data = {
      codeforces: {
        current: cfStats?.codeforces?.rating || 0,
        max: cfStats?.codeforces?.maxRating || 0,
        history: cfStats?.codeforces?.contestHistory || []
      },
      leetcode: {
        current: lcStats?.leetcode?.contestRating || 0,
        history: lcStats?.leetcode?.contestHistory || []
      },
      codechef: {
        current: ccStats?.codechef?.rating || 0,
        max: ccStats?.codechef?.highestRating || 0,
        stars: ccStats?.codechef?.stars || 0,
        history: ccStats?.codechef?.contestHistory || []
      }
    };

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch rating progression' });
  }
};

export const getSmartInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const progressData = await DailyProgress.find({
      user: userId,
      date: { $gte: thirtyDaysAgo },
      totalSolved: { $gt: 0 }
    });

    if (progressData.length === 0) {
      return res.json({ success: true, data: { message: 'Not enough data yet. Start solving problems!' } });
    }

    // Most productive day of week
    const dayCount = Array(7).fill(0);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    progressData.forEach(d => {
      const dayOfWeek = new Date(d.date).getDay();
      dayCount[dayOfWeek] += d.totalSolved;
    });
    const mostProductiveDay = dayNames[dayCount.indexOf(Math.max(...dayCount))];

    const totalSolved = progressData.reduce((sum, d) => sum + d.totalSolved, 0);
    const avgPerDay = (totalSolved / 30).toFixed(1);
    const activeDays = progressData.length;

    const insights = {
      mostProductiveDay,
      avgProblemsPerDay: parseFloat(avgPerDay),
      activeDaysLast30: activeDays,
      consistencyScore: Math.round((activeDays / 30) * 100),
      totalSolvedLast30: totalSolved,
      weeklyAverage: (totalSolved / 4).toFixed(1),
      bestDay: progressData.reduce((best, d) => d.totalSolved > (best?.totalSolved || 0) ? d : best, null)
    };

    res.json({ success: true, data: insights });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate insights' });
  }
};
