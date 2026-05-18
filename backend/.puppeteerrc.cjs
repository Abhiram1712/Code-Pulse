const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer so that it's stored inside the project
  // directory. This ensures Render includes the installed browser in the final runtime image.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
