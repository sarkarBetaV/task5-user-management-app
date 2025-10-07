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

// FIX 2: Rate limiting with proxy fix
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
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Test routes (add these for debugging)
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

// ✅ ADD COMPREHENSIVE EMAIL TEST ROUTE HERE
app.get('/api/test-email-complete', async (req, res) => {
  try {
    console.log('🔍 === EMAIL DEBUG START ===');
    
    // Check environment variables
    console.log('📋 Environment Variables:');
    console.log('   ELASTIC_EMAIL_USER:', process.env.ELASTIC_EMAIL_USER || 'NOT SET');
    console.log('   ELASTIC_EMAIL_API_KEY:', process.env.ELASTIC_EMAIL_API_KEY ? 'SET (length: ' + process.env.ELASTIC_EMAIL_API_KEY.length + ')' : 'NOT SET');
    console.log('   CLIENT_URL:', process.env.CLIENT_URL || 'NOT SET');
    
    const { sendVerificationEmail } = await import('./utils/emailService.js');
    const testEmail = 'ship1on2sarkar@gmail.com';
    const testToken = 'test-' + Date.now();
    
    console.log('🔄 Testing email to:', testEmail);
    
    const result = await sendVerificationEmail(testEmail, testToken);
    
    console.log('📊 Email result:', result);
    console.log('🔚 === EMAIL DEBUG END ===');
    
    res.json({
      status: result ? 'success' : 'failed',
      message: result ? 'Email sent successfully' : 'Email failed',
      debug: {
        env_vars_set: {
          elastic_email_user: !!process.env.ELASTIC_EMAIL_USER,
          elastic_email_api_key: !!process.env.ELASTIC_EMAIL_API_KEY,
          client_url: !!process.env.CLIENT_URL
        },
        test_email: testEmail,
        api_key_length: process.env.ELASTIC_EMAIL_API_KEY ? process.env.ELASTIC_EMAIL_API_KEY.length : 0
      }
    });
    
  } catch (error) {
    console.error('💥 DEBUG ERROR:', error);
    res.status(500).json({
      status: 'error',
      message: 'Debug test failed',
      error: error.message,
      stack: error.stack
    });
  }
});

// Health check endpoints
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

// Main routes
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