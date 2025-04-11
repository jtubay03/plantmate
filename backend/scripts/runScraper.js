// backend/scripts/runScraper.js
const plantScraper = require('../jobs/plantScraper');

/**
 * Script to manually run the plant scraper
 */
async function runScraper() {
  console.log('🔄 Manual scraper execution started');
  
  try {
    const result = await plantScraper.scrapePlants();
    console.log('✅ Manual scraper execution completed successfully:', result);
    process.exit(0);
  } catch (error) {
    console.error('❌ Manual scraper execution failed:', error);
    process.exit(1);
  }
}

// Execute the scraper when this script is run directly
if (require.main === module) {
  runScraper();
}

module.exports = runScraper;