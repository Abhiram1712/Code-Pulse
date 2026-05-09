import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { logger } from '../../config/logger.js';

puppeteer.use(StealthPlugin());

export const fetchInterviewBitStats = async (username) => {
  let browser;
  try {
    // InterviewBit API is broken (returns 500), so we use Puppeteer to scrape the public profile
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Set realistic viewport
    await page.setViewport({ width: 1280, height: 800 });
    
    await page.goto(`https://www.interviewbit.com/profile/${username}`, { 
      waitUntil: 'networkidle2', 
      timeout: 30000 
    });
    
    const data = await page.evaluate(() => {
      const allText = document.body.innerText;
      const lines = allText.split('\n').map(l => l.trim()).filter(l => l);
      
      let rank = 0;
      let score = 0;
      let solved = 0;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i] === 'Global Rank') {
          rank = parseInt(lines[i+1].replace(/,/g, '')) || parseInt(lines[i-1].replace(/,/g, '')) || 0;
        }
        if (lines[i] === 'TOTAL SCORE') {
          score = parseInt(lines[i+1].replace(/,/g, '')) || parseInt(lines[i-1].replace(/,/g, '')) || 0;
        }
        if (lines[i] === 'Problems Solved') {
          solved = parseInt(lines[i+1].replace(/,/g, '')) || parseInt(lines[i-1].replace(/,/g, '')) || 0;
        }
      }
      
      return { rank, score, solved };
    });

    if (data.solved === 0 && data.rank === 0 && data.score === 0) {
      throw new Error(`InterviewBit user '${username}' not found or profile is empty`);
    }

    return {
      username,
      totalSolved: data.solved,
      rank: data.rank,
      score: data.score,
      tracks: [], // Tracks are harder to scrape reliably, keeping empty for now
      recentActivity: []
    };
  } catch (error) {
    logger.error(`InterviewBit sync error for ${username}:`, error.message);
    // Return minimal data on error so we don't break the entire sync
    return {
      username,
      totalSolved: 0,
      rank: 0,
      score: 0,
      tracks: [],
      recentActivity: [],
      note: 'Could not fetch data - API may be unavailable or blocked'
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
