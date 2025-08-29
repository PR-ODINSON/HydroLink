require('dotenv').config();

// Import the configured Express app
const app = require('./app');

// Define the port for the server
const PORT = process.env.PORT || 3001;

// Start the server and listen on the specified port
const server = app.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Optional: Handle unhandled promise rejections for better error handling
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});