import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import routers
import authRouter from './APIs/auth.js';
import soilRouter from './APIs/soil.js';
import weatherRouter from './APIs/weather.js';
import recommendationRouter from './APIs/recommendation.js';
import sensorRouter from './APIs/sensor.js';
import diseaseRouter from './APIs/disease.js';
import platformRouter from './APIs/platform.js';
import adminRouter from './APIs/admin.js';


const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 1. Helmet: Secure HTTP Headers
app.use(helmet());

// 2. CORS: Explicit allow-list, NO wildcard * origins
const allowedOrigins = [
  'http://localhost:5173', 'http://127.0.0.1:5173', 'http://[::1]:5173',
  'http://localhost:5174', 'http://127.0.0.1:5174', 'http://[::1]:5174',
  'http://localhost:5175', 'http://127.0.0.1:5175', 'http://[::1]:5175',
  'https://wheather-and-soil-based-crop-recome.vercel.app',
  'https://wheather-and-soil-based-crop-recome-rust.vercel.app'
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or local tools during dev)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Dynamic allowance for local network IPs and loopback devices on development ports 5173-5179
      const isLocalDev = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+):517[3-9]$/.test(origin);
      if (isLocalDev) {
        callback(null, true);
      } else {
        console.warn(`[CORS Rejected]: Origin "${origin}" is not in the allow-list.`);
        callback(new Error(`Rejected: CORS security policy violation. Origin not allowed: ${origin}`));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. Rate Limiting: Limit requests from single IP to mitigate brute force / DoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again after 15 minutes.' }
});
app.use(limiter);

// 4. Standard Body and Cookie Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 5. Database Connection (MongoDB Atlas)
const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crop-recommendation';
mongoose.connect(dbUri)
  .then(() => console.log('Successfully connected to MongoDB database.'))
  .catch(err => {
    console.error('Database connection critical error:');
    // TODO(security): Ensure raw connection strings/secrets are not leaked inside error logs
    console.error('Failed to establish database pipeline connection.');
  });

// 6. API Route Registrations
app.use('/api/auth', authRouter);
app.use('/api/soil', soilRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/recommendation', recommendationRouter);
app.use('/api/sensor', sensorRouter);
app.use('/api/disease', diseaseRouter);
app.use('/api/platform', platformRouter);
app.use('/api/admin', adminRouter);


// 7. Base API Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'AI-Powered Weather and Soil Intelligence System',
    version: '1.0.0'
  });
});

// 8. Secure Global Error Handler (Displays generic messages to user, hides stack traces)
app.use((err, req, res, next) => {
  console.error('[Error Details]:', err.message);
  
  const status = err.status || 500;
  res.status(status).json({
    error: 'An unexpected system error occurred. Please try again later.'
  });
});

// 9. Start Server (listen on all network interfaces to allow mobile/LAN device testing)
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`========================================`);
  console.log(` AGRO-INTELLIGENCE CORE SERVER RUNNING  `);
  console.log(` Port: ${PORT}                          `);
  console.log(` Host: http://0.0.0.0:${PORT}          `);
  console.log(` Environment: ${NODE_ENV}               `);
  console.log(`========================================`);
});

export default app;
