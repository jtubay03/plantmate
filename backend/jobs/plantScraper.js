// backend/jobs/plantScraper.js
const db = require('../models/db');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

const API_KEY = 'sk-19Jn6801a6ea766be9868';
const BASE_URL = 'https://perenual.com/api/v2';

/**
 * Main scraper function that collects plant data and inserts it into the database
 */
async function scrapePlants() {
  try {
    console.log('🌱 Starting plant data scraping process...');
    
    // Fetch just 5 plant IDs to avoid rate limiting
    console.log('🔍 Fetching plant IDs from API...');
    const plantIds = await fetchPlantIds(5);
    
    // Print plant IDs
    console.log('📋 Fetched plant IDs:');
    console.log(plantIds);
    
    // Fetch detailed data for each plant
    console.log('🔍 Fetching detailed plant data...');
    const plantsData = [];
    
    for (const id of plantIds) {
      try {
        // Add delay between requests to avoid rate limiting
        if (plantsData.length > 0) {
          console.log('⏱️ Waiting 1 second before next request...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const plantData = await fetchPlantData(id);
        plantsData.push(plantData);
        console.log(`✅ Fetched data for plant ID ${id}: ${plantData.common_name}`);
        
        // Save after each successful fetch to preserve data if we hit rate limits
        await saveCurrentData(plantsData);
        
      } catch (error) {
        console.error(`❌ Error fetching data for plant ID ${id}:`, error.message);
        
        // If we hit rate limit, save what we have so far and stop
        if (error.response && error.response.status === 429) {
          console.log('⚠️ Rate limit reached. Saving current data and stopping...');
          if (plantsData.length > 0) {
            await saveCurrentData(plantsData);
          }
          break;
        }
      }
    }
    
    const result = {
      totalScraped: plantsData.length,
      newPlants: plantsData.length,
      updatedPlants: 0,
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Plant scraping completed successfully!', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error during plant scraping:', error);
    throw error;
  }
}

/**
 * Save the current plant data to a file
 * @param {Array} plantsData - Array of plant data objects
 * @returns {Promise<string>} Path to the saved file
 */
async function saveCurrentData(plantsData) {
  // Create data directory if it doesn't exist
  const outputDir = path.join(__dirname, '..', 'data');
  await fs.mkdir(outputDir, { recursive: true });
  
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const outputFile = path.join(outputDir, `plants_data_${timestamp}.json`);
  
  await fs.writeFile(outputFile, JSON.stringify(plantsData, null, 2));
  console.log(`📄 Plant data saved to: ${outputFile}`);
  
  return outputFile;
}

/**
 * Fetch a specific number of plant IDs from the species list API
 * @param {number} count - Number of plant IDs to fetch
 * @returns {Promise<number[]>} Array of plant IDs
 */
async function fetchPlantIds(count) {
  const ids = [];
  let page = 1;
  
  try {
    while (ids.length < count) {
      const response = await axios.get(`${BASE_URL}/species-list`, {
        params: {
          key: API_KEY,
          page: page
        }
      });
      
      if (!response.data || !response.data.data || response.data.data.length === 0) {
        break; // No more plants to fetch
      }
      
      // Extract IDs from the response
      const pageIds = response.data.data.map(plant => plant.id);
      ids.push(...pageIds);
      
      // Move to next page
      page++;
      
      // If we have more than we need, trim the array
      if (ids.length > count) {
        return ids.slice(0, count);
      }
    }
    
    return ids;
  } catch (error) {
    console.error('Error fetching plant IDs:', error.message);
    throw error;
  }
}

/**
 * Fetch detailed data for a plant by ID
 * @param {number} id - Plant ID to fetch
 * @returns {Promise<Object>} Plant data
 */
async function fetchPlantData(id) {
  try {
    const response = await axios.get(`${BASE_URL}/species/details/${id}`, {
      params: {
        key: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    // Re-throw the error to be handled by the caller
    throw error;
  }
}

/**
 * Insert a new plant into the catalog
 * @param {Object} plantData - Plant information to insert
 */
async function insertPlantToCatalog(plantData) {
  // This would be implemented to insert actual plant data
  // For now just a placeholder
  console.log('Would insert plant:', plantData);
}

module.exports = {
  scrapePlants,
  insertPlantToCatalog,
  fetchPlantData
};