// backend/scripts/testScraper.js
const plantScraper = require('../jobs/plantScraper');

/**
 * Script to manually test the plant scraper functions
 */
async function testScraper() {
  console.log('🧪 Starting manual test of plant scraper functions');
  
  try {
    // Test the main scraper function
    console.log('\n📋 Testing scrapePlants function:');
    const result = await plantScraper.scrapePlants();
    console.log('✅ scrapePlants completed with result:', result);
    
    // Alternatively, you could test individual functions
    /*
    console.log('\n📋 Testing fetchPlantIds function:');
    const ids = await plantScraper.fetchPlantIds(5); // Just fetch 5 for a quicker test
    console.log('✅ Fetched IDs:', ids);
    
    console.log('\n📋 Testing fetchPlantData function:');
    const plantData = await plantScraper.fetchPlantData(ids[0]);
    console.log('✅ Fetched data for plant:', plantData.common_name);
    */
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

// Execute the test when this script is run directly
if (require.main === module) {
  testScraper();
}

module.exports = testScraper;