const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Retry connection with exponential backoff
const connectWithRetry = async (attempts = 5, delay = 5000) => {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const connection = await pool.getConnection();
      console.log('✅ MySQL connected successfully');
      connection.release();
      return;
    } catch (err) {
      console.error(`❌ Connection attempt ${attempt}/${attempts} failed:`, err.message);
      
      if (attempt === attempts) {
        console.error('🛑 Maximum retry attempts reached. Could not connect to MySQL.');
        return;
      }
      
      console.log(`⏳ Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      // Increase delay for next attempt (exponential backoff)
      delay = Math.min(delay * 1.5, 30000); // Cap at 30 seconds
    }
  }
};

// Start trying to connect
connectWithRetry();

module.exports = pool;