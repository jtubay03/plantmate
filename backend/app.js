const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const { initCronJobs } = require('./jobs/cronScheduler');


// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize cron jobs
const cronJobs = initCronJobs();

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});