require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db.config');

// Import routes
const authRoutes = require('./src/api/routes/auth.routes');
const producerRoutes = require('./src/api/routes/producer.routes');
const certifierRoutes = require('./src/api/routes/certifier.routes');
const buyerRoutes = require('./src/api/routes/buyer.routes');


// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(cookieParser()); // To parse cookies
app.use(morgan('dev')); // Logger for development

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/producer', producerRoutes);
app.use('/api/certifier', certifierRoutes);
app.use('/api/buyer', buyerRoutes);


// Simple root route for health check
app.get('/', (req, res) => {
  res.send('Blockchain Green Hydrogen Credit System API is running...');
});

// Export the app object to be used by server.js
module.exports = app;