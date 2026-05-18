import axios from 'axios';
import { logger } from '../../config/logger.js';

const CF_BASE = 'https://codeforces.com/api';

export const fetchCodeforcesStats = async (username) => {
  try {
    // Make requests sequentially to avoid Codeforces rate limit (429 Too Many Requests)
    const userInfoRes = await axios.get(`${CF_BASE}/user.info?handles=${username}`)
      .then(res => ({ status: 'fulfilled', value: res }))
      .catch(err => ({ status: 'rejected', reason: err }));
      
    const submissionsRes = await axios.get(`${CF_BASE}/user.status?handle=${username}&from=1&count=100`)
      .then(res => ({ status: 'fulfilled', value: res }))
      .catch(err => ({ status: 'rejected', reason: err }));
      
    const ratingsRes = await axios.get(`${CF_BASE}/user.rating?handle=${username}`)
      .then(res => ({ status: 'fulfilled', value: res }))
      .catch(err => ({ status: 'rejected', reason: err }));

    if (userInfoRes.status === 'rejected' || userInfoRes.value.data?.status !== 'OK') {
      throw new Error(`Codeforces user '${username}' not found`);
    }

    const userInfo = userInfoRes.value.data.result[0];
    const submissions = submissionsRes.status === 'fulfilled'
      ? submissionsRes.value.data?.result || [] : [];
    const ratingHistory = ratingsRes.status === 'fulfilled'
      ? ratingsRes.value.data?.result || [] : [];

    // Calculate solved problems (unique AC)
    const solvedProblems = new Set();
    const tagCount = {};
    const ratingDist = {};

    submissions.forEach(sub => {
      if (sub.verdict === 'OK') {
        const problemKey = `${sub.problem.contestId}-${sub.problem.index}`;
        solvedProblems.add(problemKey);

        // Tag distribution
        sub.problem.tags?.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });

        // Rating distribution
        const rating = sub.problem.rating;
        if (rating) {
          const bucket = `${Math.floor(rating / 100) * 100}`;
          ratingDist[bucket] = (ratingDist[bucket] || 0) + 1;
        }
      }
    });

    const recentSubmissions = submissions.slice(0, 20).map(sub => ({
      id: sub.id,
      problemName: sub.problem.name,
      problemRating: sub.problem.rating,
      verdict: sub.verdict,
      language: sub.programmingLanguage,
      timestamp: new Date(sub.creationTimeSeconds * 1000)
    }));

    const contestHistory = ratingHistory.slice(-20).map(r => ({
      contestId: r.contestId,
      contestName: r.contestName,
      rank: r.rank,
      oldRating: r.oldRating,
      newRating: r.newRating,
      ratingChange: r.newRating - r.oldRating,
      date: new Date(r.ratingUpdateTimeSeconds * 1000)
    }));

    return {
      username,
      rating: userInfo.rating || 0,
      maxRating: userInfo.maxRating || 0,
      rank: userInfo.rank || 'unrated',
      maxRank: userInfo.maxRank || 'unrated',
      contribution: userInfo.contribution || 0,
      friendOfCount: userInfo.friendOfCount || 0,
      totalSolved: solvedProblems.size,
      contestsParticipated: ratingHistory.length,
      contestHistory,
      recentSubmissions,
      problemRatingDistribution: ratingDist,
      tagDistribution: tagCount
    };
  } catch (error) {
    logger.error(`Codeforces sync error for ${username}:`, error.message);
    throw error;
  }
};
