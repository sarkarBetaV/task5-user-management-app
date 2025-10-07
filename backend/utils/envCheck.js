export const checkEnvVars = () => {
  if (process.env.NODE_ENV === 'production') {
    // Production requirements
    const required = ['DATABASE_URL', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:', missing);
      console.error('💡 Please set these in your Render environment variables');
      process.exit(1);
    }
  } else {
    // Development requirements
    const required = ['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASS'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:', missing);
      console.error('💡 Please check your .env file');
      process.exit(1);
    }
  }
  
  console.log('✅ All environment variables are set');
  console.log('📊 Environment:', process.env.NODE_ENV);
  console.log('🌐 Client URL:', process.env.CLIENT_URL);
  console.log('🗄️ Database:', process.env.DATABASE_URL ? 'Render PostgreSQL' : 'Local PostgreSQL');
  console.log('🔐 JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Missing');
  console.log('📧 Email:', process.env.EMAIL_USER ? 'Set' : 'Missing');
};