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
const notificationRoutes = require('./src/api/routes/notification.routes');
const blockchainRoutes = require('./src/api/routes/blockchain.routes');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// ---------- CORS CONFIG ----------
const allowedOrigins = [
  process.env.CLIENT_URL, // e.g. "https://hydrolink.vercel.app"
  'http://localhost:3000' // for local dev
].filter(Boolean); // remove undefined

console.log(process.env.CLIENT_URL);

app.use((req, res, next) => {
  res.header('Vary', 'Origin'); // prevent cache poisoning
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl/Postman) or from allowedOrigins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true, // allow cookies/Authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ---------- MIDDLEWARE ----------
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded
app.use(cookieParser()); // parse cookies
app.use(morgan('dev')); // logger

// ---------- ROUTES ----------
app.use('/api/auth', authRoutes);
app.use('/api/producer', producerRoutes);
app.use('/api/certifier', certifierRoutes);
app.use('/api/buyer', buyerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/blockchain', blockchainRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('Blockchain Green Hydrogen Credit System API is running...');
});

// Handle OPTIONS preflight globally
app.options('*', cors());

// ---------- EXPORT ----------
module.exports = app;