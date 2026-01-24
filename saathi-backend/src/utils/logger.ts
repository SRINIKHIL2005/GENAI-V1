import winston from 'winston';
import path from 'path';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');

// Configure Winston logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'saathi-backend' },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),

    // Combined logs
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 5,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),

    // Console output for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],

  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ],

  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

// If in development mode, add more verbose logging
if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `${timestamp} [${level}]: ${message}`;
        
        if (stack) {
          log += `\n${stack}`;
        }
        
        if (Object.keys(meta).length > 0) {
          log += `\n${JSON.stringify(meta, null, 2)}`;
        }
        
        return log;
      })
    )
  }));
}

// Structured logger for different types of events
export class StructuredLogger {
  static logUserAction(userId: string, action: string, details?: any) {
    logger.info('User Action', {
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
      type: 'user_action'
    });
  }

  static logChatInteraction(userId: string, sessionId: string, messageType: 'user' | 'ai', details?: any) {
    logger.info('Chat Interaction', {
      userId,
      sessionId,
      messageType,
      details,
      timestamp: new Date().toISOString(),
      type: 'chat_interaction'
    });
  }

  static logMoodEntry(userId: string, moodData: any) {
    logger.info('Mood Entry', {
      userId,
      moodData: {
        mood: moodData.mood,
        intensity: moodData.intensity,
        triggers: moodData.triggers
      },
      timestamp: new Date().toISOString(),
      type: 'mood_entry'
    });
  }

  static logVoiceProcessing(userId: string, sessionId: string, processingDetails: any) {
    logger.info('Voice Processing', {
      userId,
      sessionId,
      processingDetails: {
        duration: processingDetails.duration,
        confidence: processingDetails.confidence,
        emotions: processingDetails.emotions
      },
      timestamp: new Date().toISOString(),
      type: 'voice_processing'
    });
  }

  static logCrisisEvent(userId: string, severity: string, details: any) {
    logger.warn('Crisis Event', {
      userId,
      severity,
      details,
      timestamp: new Date().toISOString(),
      type: 'crisis_event',
      priority: 'high'
    });
  }

  static logAPICall(endpoint: string, method: string, userId?: string, responseTime?: number, statusCode?: number) {
    logger.info('API Call', {
      endpoint,
      method,
      userId,
      responseTime,
      statusCode,
      timestamp: new Date().toISOString(),
      type: 'api_call'
    });
  }

  static logError(error: Error, context?: any) {
    logger.error('Application Error', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context,
      timestamp: new Date().toISOString(),
      type: 'application_error'
    });
  }

  static logSecurity(event: string, userId?: string, ipAddress?: string, details?: any) {
    logger.warn('Security Event', {
      event,
      userId,
      ipAddress,
      details,
      timestamp: new Date().toISOString(),
      type: 'security_event'
    });
  }

  static logPerformance(operation: string, duration: number, details?: any) {
    logger.info('Performance Metric', {
      operation,
      duration,
      details,
      timestamp: new Date().toISOString(),
      type: 'performance_metric'
    });
  }

  static logSystemHealth(component: string, status: 'healthy' | 'warning' | 'error', details?: any) {
    const level = status === 'error' ? 'error' : status === 'warning' ? 'warn' : 'info';
    logger.log(level, 'System Health', {
      component,
      status,
      details,
      timestamp: new Date().toISOString(),
      type: 'system_health'
    });
  }
}

// Performance timing utility
export class PerformanceLogger {
  private startTime: number;
  private operation: string;

  constructor(operation: string) {
    this.operation = operation;
    this.startTime = Date.now();
  }

  finish(details?: any) {
    const duration = Date.now() - this.startTime;
    StructuredLogger.logPerformance(this.operation, duration, details);
    return duration;
  }

  static time(operation: string) {
    return new PerformanceLogger(operation);
  }
}

// Middleware for request logging
export const loggerMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    StructuredLogger.logAPICall(
      req.originalUrl,
      req.method,
      req.user?.uid,
      duration,
      res.statusCode
    );
  });
  
  next();
};

export default logger;