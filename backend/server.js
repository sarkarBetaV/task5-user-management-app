import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import { sequelize } from './config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// FIX 1: Trust proxy for Render
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: [
    'https://user-management-frontend-amvt.onrender.com',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// ✅ FIX: Health checks and test routes FIRST (NO rate limiting)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API test endpoint works!',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/test-register', (req, res) => {
  res.json({ 
    message: 'Register test endpoint works!',
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

// ✅ FIX: Rate limiting ONLY for API routes (after health checks)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later.'
  },
  keyGenerator: (req, res) => {
    // Use Render's forwarded IP
    return req.headers['x-forwarded-for'] || req.ip;
  }
});

// Apply rate limiting only to API routes
app.use('/api', limiter);

// Main routes (with rate limiting)
app.use('/api', authRoutes);

// Handle preflight requests
app.options('*', cors());

// Handle unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found: ' + req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Error:', err.message);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      status: 'error',
      message: 'CORS policy violation'
    });
  }
  
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 Trust proxy: ${app.get('trust proxy')}`);
  
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Sync database
    await sequelize.sync({ alter: false });
    console.log('✅ Database synced');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
});

export default app;