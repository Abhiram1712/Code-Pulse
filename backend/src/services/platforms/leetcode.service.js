import axios from 'axios';
import { logger } from '../../config/logger.js';

const LEETCODE_GRAPHQL = 'https://leetcode.com/graphql';

const PROFILE_QUERY = `
  query getUserProfile($username: String!) {
    allQuestionsCount { difficulty count }
    matchedUser(username: $username) {
      username
      profile {
        ranking
        userAvatar
        realName
        aboutMe
        reputation
      }
      submitStats {
        acSubmissionNum { difficulty count submissions }
        totalSubmissionNum { difficulty count submissions }
      }
      badges { id displayName icon creationDate }
      activeBadge { displayName icon }
    }
  }
`;

const RECENT_SUBMISSIONS_QUERY = `
  query recentSubmissions($username: String!, $limit: Int) {
    recentSubmissionList(username: $username, limit: $limit) {
      id title titleSlug timestamp statusDisplay lang runtime memory
    }
  }
`;

const CONTEST_QUERY = `
  query userContestRanking($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount rating globalRanking totalParticipants topPercentage
    }
    userContestRankingHistory(username: $username) {
      attended rating ranking contest { title startTime }
    }
  }
`;

export const fetchLeetCodeStats = async (username) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Referer': 'https://leetcode.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    const [profileRes, recentRes, contestRes] = await Promise.allSettled([
      axios.post(LEETCODE_GRAPHQL, { query: PROFILE_QUERY, variables: { username } }, { headers }),
      axios.post(LEETCODE_GRAPHQL, { query: RECENT_SUBMISSIONS_QUERY, variables: { username, limit: 20 } }, { headers }),
      axios.post(LEETCODE_GRAPHQL, { query: CONTEST_QUERY, variables: { username } }, { headers })
    ]);

    const profile = profileRes.status === 'fulfilled' ? profileRes.value.data?.data : null;
    const recent = recentRes.status === 'fulfilled' ? recentRes.value.data?.data : null;
    const contest = contestRes.status === 'fulfilled' ? contestRes.value.data?.data : null;

    if (!profile?.matchedUser) {
      throw new Error(`LeetCode user '${username}' not found`);
    }

    const user = profile.matchedUser;
    const submitStats = user.submitStats?.acSubmissionNum || [];

    const getCount = (diff) => submitStats.find(s => s.difficulty === diff)?.count || 0;
    const getTotalCount = (diff) => profile.allQuestionsCount?.find(q => q.difficulty === diff)?.count || 0;

    const recentSubmissions = (recent?.recentSubmissionList || []).map(s => ({
      title: s.title,
      titleSlug: s.titleSlug,
      timestamp: new Date(parseInt(s.timestamp) * 1000),
      statusDisplay: s.statusDisplay,
      lang: s.lang
    }));

    const contestData = contest?.userContestRanking;
    const contestHistory = (contest?.userContestRankingHistory || [])
      .filter(c => c.attended)
      .map(c => ({
        contestName: c.contest?.title,
        rank: c.ranking,
        rating: c.rating,
        date: new Date(c.contest?.startTime * 1000)
      }));

    return {
      username,
      totalSolved: getCount('All'),
      easySolved: getCount('Easy'),
      mediumSolved: getCount('Medium'),
      hardSolved: getCount('Hard'),
      totalEasy: getTotalCount('Easy'),
      totalMedium: getTotalCount('Medium'),
      totalHard: getTotalCount('Hard'),
      acceptanceRate: null,
      ranking: user.profile?.ranking,
      reputation: user.profile?.reputation,
      streak: user.streak?.streakCount || 0,
      contestRating: contestData?.rating,
      contestRanking: contestData?.globalRanking,
      contestsParticipated: contestData?.attendedContestsCount || 0,
      recentSubmissions,
      contestHistory
    };
  } catch (error) {
    logger.error(`LeetCode sync error for ${username}:`, error.message);
    throw error;
  }
};
