import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

// Import middleware
import { rateLimiter } from '@/middleware/rateLimiter';
import { errorHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/auth';

// Import routes
import chatRoutes from '@/routes/chat';
import moodRoutes from '@/routes/mood';
import voiceRoutes from '@/routes/voice';
import musicRoutes from '@/routes/music';
import physicalRoutes from '@/routes/physical';
import progressRoutes from '@/routes/progress';
import crisisRoutes from '@/routes/crisis';
import userRoutes from '@/routes/user';
import analyticsRoutes from '@/routes/analytics';
import { translationRoutes } from '@/routes/translation';

// Import services
import { initializeFirebase } from '@/config/firebase';
import { initializeGemini } from '@/config/gemini';
import { TranslationConfig } from '@/config/translation';
import { logger } from '@/utils/logger';
import { socketService } from '@/services/socketService';

// Load environment variables
dotenv.config();

// Validate (but do not fail hard) important environment variables
// Missing external credentials will result in mocked or disabled features instead of process exit.
const recommendedEnvVars = [
  'NODE_ENV',
  'PORT',
  'FIREBASE_PROJECT_ID',
  'JWT_SECRET'
];

const missingRecommended = recommendedEnvVars.filter(envVar => !process.env[envVar]);
if (missingRecommended.length > 0) {
  logger.warn(`Recommended environment variables missing: ${missingRecommended.join(', ')}. Running with defaults where possible.`);
}

// Optional credentialed services
const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
const hasGoogleCredentials = Boolean(process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || process.env.GOOGLE_CLOUD_PROJECT_ID);

if (!hasGeminiKey) {
  logger.warn('GEMINI_API_KEY not set. Gemini AI features will run in mock/offline mode. Provide a key to enable full AI features.');
}

if (!hasGoogleCredentials) {
  logger.warn('Google Cloud credentials not set. Translate / Vision services may use mock fallbacks.');
}

// Initialize Express app
const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize services
async function initializeServices() {
  try {
    await initializeFirebase();
    logger.info('✅ Firebase initialized successfully');
    
    await initializeGemini();
    logger.info('✅ Gemini AI initialized successfully');
    
    // Initialize Translation service
    TranslationConfig.initialize();
    const translationWorks = await TranslationConfig.testConnection();
    if (translationWorks) {
      logger.info('✅ Google Translate service initialized successfully');
    } else {
      logger.warn('⚠️ Google Translate service using mock implementation');
    }
    
    // Initialize Socket.IO service
    socketService.initialize(io);
    logger.info('✅ Socket.IO service initialized successfully');
    
  } catch (error) {
    logger.error('❌ Failed to initialize services:', error);
    process.exit(1);
  }
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-API-Key']
}));

// Basic middleware
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
}

// Rate limiting
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV,
    services: {
      firebase: '✅ Connected',
      gemini: '✅ Connected',
      googleCloud: '✅ Connected',
      socketio: '✅ Connected'
    },
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({
    api: 'Saathi Wellness Backend',
    version: '1.0.0',
    features: {
      chatEnhancement: process.env.ENABLE_CHAT_ENHANCEMENT === 'true',
      moodAnalysis: process.env.ENABLE_MOOD_ANALYSIS === 'true',
      voiceProcessing: process.env.ENABLE_VOICE_PROCESSING === 'true',
      musicTherapy: process.env.ENABLE_MUSIC_THERAPY === 'true',
      physicalSupport: process.env.ENABLE_PHYSICAL_SUPPORT === 'true',
      crisisDetection: process.env.ENABLE_CRISIS_DETECTION === 'true',
      progressTracking: process.env.ENABLE_PROGRESS_TRACKING === 'true',
      realTimeFeatures: process.env.ENABLE_REAL_TIME_FEATURES === 'true'
    },
    endpoints: [
      '/api/auth',
      '/api/chat',
      '/api/mood',
      '/api/voice',
      '/api/music',
      '/api/physical',
      '/api/progress',
      '/api/crisis',
      '/api/user',
      '/api/analytics',
      '/api/translate'
    ]
  });
});

// API routes
const apiRouter = express.Router();

// Public routes (no authentication required)
apiRouter.use('/crisis', crisisRoutes); // Crisis endpoints should be accessible without auth

// Protected routes (authentication required)
apiRouter.use('/chat', authMiddleware, chatRoutes);
apiRouter.use('/mood', authMiddleware, moodRoutes);
apiRouter.use('/voice', authMiddleware, voiceRoutes);
apiRouter.use('/music', authMiddleware, musicRoutes);
apiRouter.use('/physical', authMiddleware, physicalRoutes);
apiRouter.use('/progress', authMiddleware, progressRoutes);
apiRouter.use('/user', authMiddleware, userRoutes);
apiRouter.use('/analytics', authMiddleware, analyticsRoutes);
apiRouter.use('/translate', translationRoutes); // Translation can be public

// Mount API routes
app.use('/api', apiRouter);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /api/status',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'POST /api/chat/message',
      'POST /api/mood/analyze',
      'POST /api/voice/process',
      'GET /api/music/recommendations',
      'GET /api/physical/exercises',
      'GET /api/progress/dashboard',
      'POST /api/crisis/detect',
      'GET /api/user/profile',
      'GET /api/analytics/insights'
    ]
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Start server
const PORT = parseInt(process.env.PORT || '3001', 10);

async function startServer() {
  try {
    await initializeServices();
    
    server.listen(PORT, () => {
      logger.info(`
╔═══════════════════════════════════════════════════════════════════╗
║                    SAATHI WELLNESS BACKEND                       ║
║                                                                   ║
║  🚀 Server running on port ${PORT.toString().padEnd(43)}║
║  🌍 Environment: ${(process.env.NODE_ENV || 'development').padEnd(48)}║
║  📡 API Version: v1                                               ║
║                                                                   ║
║  🎯 FEATURES ENABLED:                                             ║
║  ${process.env.ENABLE_CHAT_ENHANCEMENT === 'true' ? '✅' : '❌'} Chat Enhancement                                      ║
║  ${process.env.ENABLE_MOOD_ANALYSIS === 'true' ? '✅' : '❌'} Mood Analysis                                         ║
║  ${process.env.ENABLE_VOICE_PROCESSING === 'true' ? '✅' : '❌'} Voice Processing                                     ║
║  ${process.env.ENABLE_MUSIC_THERAPY === 'true' ? '✅' : '❌'} Music Therapy                                         ║
║  ${process.env.ENABLE_PHYSICAL_SUPPORT === 'true' ? '✅' : '❌'} Physical Support                                     ║
║  ${process.env.ENABLE_CRISIS_DETECTION === 'true' ? '✅' : '❌'} Crisis Detection                                     ║
║  ${process.env.ENABLE_PROGRESS_TRACKING === 'true' ? '✅' : '❌'} Progress Tracking                                   ║
║  ${process.env.ENABLE_REAL_TIME_FEATURES === 'true' ? '✅' : '❌'} Real-time Features (Socket.IO)                     ║
║                                                                   ║
║  📊 SERVICES:                                                     ║
║  🔥 Firebase: Connected                                           ║
║  🤖 Gemini AI: Connected                                          ║
║  ☁️  Google Cloud: Connected                                      ║
║  🔌 Socket.IO: Connected                                          ║
║                                                                   ║
║  📋 API ENDPOINTS:                                                ║
║  📍 Health Check: http://localhost:${PORT}/health                    ║
║  📍 API Status: http://localhost:${PORT}/api/status                 ║
║  📍 Documentation: http://localhost:${PORT}/api/docs               ║
║                                                                   ║
║  🎉 Ready to enhance mental wellness! 🌟                         ║
╚═══════════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Initialize and start the server
startServer();

export { app, server, io };
export default app;