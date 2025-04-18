
// backend/jobs/cronScheduler.js
const cron = require('node-cron');

const plantScraper = require('./plantScraper');

/**
 * Initialize and schedule all cron jobs
 */
function initCronJobs() {
  // Schedule the plant scraper to run once a week (Sunday at 3:00 AM)
  // Cron format: second(optional) minute hour day-of-month month day-of-week
  const plantScraperJob = cron.schedule('0 0 * * *', async () => {
    console.log('🕒 Running scheduled plant scraper job...');
    try {
      const result = await plantScraper.scrapePlants();
      console.log('📊 Scheduled scraper job completed:', result);
    } catch (error) {
      console.error('❌ Scheduled scraper job failed:', error);
    }
  }, {
    scheduled: true,
    timezone: "UTC" // Adjust timezone as needed
  });

  console.log('🔄 Plant scraper cron job scheduled (weekly on Sunday at 3:00 AM UTC)');
  
  // Return an object with all scheduled jobs for potential management
  return {
    plantScraperJob
  };
}

module.exports = {
  initCronJobs
};