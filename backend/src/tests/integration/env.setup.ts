// Set minimal environment variables before tests run so config parsing succeeds
process.env.NODE_ENV = 'development';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/sanityflow-test';
process.env.JWT_SECRET = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'; // 32 chars
process.env.FRONTEND_APP_ORIGIN = 'http://localhost:3000';
process.env.BACKEND_APP_ORIGIN = 'http://localhost:5173';
process.env.GROQ_API_KEY = 'fake_groq_key';
process.env.EMAIL_API_KEY = 'fake_email_key';
process.env.OPENWEATHER_API_KEY = 'fake_openweather_key';
process.env.ALERT_EMAIL = 'alerts@example.com';
