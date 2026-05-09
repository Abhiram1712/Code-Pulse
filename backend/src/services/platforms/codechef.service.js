import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';
import { logger } from '../../config/logger.js';

puppeteer.use(StealthPlugin());

const CC_BASE = 'https://www.codechef.com';

export const fetchCodeChefStats = async (username) => {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Block unnecessary resources to speed up
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(`${CC_BASE}/users/${username}`, {
      waitUntil: 'networkidle2',
      timeout: 25000,
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    // Extract basic details
    const starsText = $('.rating').first().text() || '1★';
    const stars = parseInt(starsText) || 1;

    const ratingText = $('.rating-container a.rating').first().text();
    const ratingMatch = ratingText ? ratingText.match(/(\d+)/) : null;
    const rating = ratingMatch ? parseInt(ratingMatch[1]) : 0;

    const solvedText = $('h3:contains("Total Problems Solved")').text();
    const solvedMatch = solvedText ? solvedText.match(/\d+/) : null;
    const totalSolved = solvedMatch ? parseInt(solvedMatch[0]) : 0;

    const globalRankText = $('.global-rank').first().text() || '';
    const globalRank = parseInt(globalRankText) || 0;

    const countryRankText = $('.country-rank').first().text() || '';
    const countryRank = parseInt(countryRankText) || 0;

    // Extract rating graph data (contest history)
    let contestHistory = [];
    try {
      const match = html.match(/var all_rating = (\[.*?\]);/s);
      if (match) {
        const allRatings = JSON.parse(match[1]);
        contestHistory = allRatings.slice(-20).map(c => ({
          contestName: c.name,
          rating: parseInt(c.rating),
          rank: parseInt(c.rank),
          date: new Date(c.end_date)
        }));
      }
    } catch (e) {
      logger.warn(`Failed to parse CodeChef contest history for ${username}`);
    }

    return {
      username,
      rating,
      highestRating: rating, // Codechef DOM doesn't easily expose highest without graph API
      stars,
      globalRank,
      countryRank,
      totalSolved,
      totalAttempted: totalSolved, // Default fallback
      contestsParticipated: contestHistory.length > 0 ? html.match(/var all_rating = (\[.*?\]);/s) ? JSON.parse(html.match(/var all_rating = (\[.*?\]);/s)[1]).length : 0 : 0,
      contestHistory,
      syncStatus: 'success'
    };
  } catch (error) {
    logger.error(`CodeChef sync error for ${username}:`, error.message);
    throw error;
  } finally {
    if (browser) {
      await browser.close().catch(console.error);
    }
  }
};
