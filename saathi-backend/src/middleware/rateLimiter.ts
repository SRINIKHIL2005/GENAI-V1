import rateLimit from 'express-rate-limit';
import { logger } from '@/utils/logger';

// General API rate limiter
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'You have made too many requests. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      endpoint: req.originalUrl,
      userAgent: req.get('User-Agent')
    });
    
    res.status(429).json({
      error: 'Too many requests',
      message: 'You have made too many requests. Please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Strict rate limiter for sensitive endpoints
export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded for sensitive operations. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Strict rate limit exceeded', {
      ip: req.ip,
      endpoint: req.originalUrl,
      userAgent: req.get('User-Agent')
    });
    
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded for sensitive operations. Please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Authentication rate limiter
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Too many login attempts. Please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      endpoint: req.originalUrl,
      userAgent: req.get('User-Agent')
    });
    
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Too many login attempts. Please try again later.',
      retryAfter: '15 minutes'
    });
  }
});

// Chat rate limiter (more generous for chat interactions)
export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each user to 30 messages per minute
  message: {
    error: 'Chat rate limit exceeded',
    message: 'You are sending messages too quickly. Please slow down.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID instead of IP for authenticated users
    return (req as any).user?.uid || req.ip || 'unknown';
  },
  handler: (req, res) => {
    logger.warn('Chat rate limit exceeded', {
      userId: req.user?.uid,
      ip: req.ip,
      endpoint: req.originalUrl
    });
    
    res.status(429).json({
      error: 'Chat rate limit exceeded',
      message: 'You are sending messages too quickly. Please slow down.',
      retryAfter: '1 minute'
    });
  }
});

// Voice processing rate limiter
export const voiceRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each user to 10 voice requests per minute
  message: {
    error: 'Voice processing rate limit exceeded',
    message: 'You are processing voice messages too frequently. Please wait a moment.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (req as any).user?.uid || req.ip || 'unknown';
  },
  handler: (req, res) => {
    logger.warn('Voice rate limit exceeded', {
      userId: req.user?.uid,
      ip: req.ip,
      endpoint: req.originalUrl
    });
    
    res.status(429).json({
      error: 'Voice processing rate limit exceeded',
      message: 'You are processing voice messages too frequently. Please wait a moment.',
      retryAfter: '1 minute'
    });
  }
});

// File upload rate limiter
export const uploadRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Limit each user to 20 uploads per 5 minutes
  message: {
    error: 'Upload rate limit exceeded',
    message: 'You are uploading files too frequently. Please wait before uploading again.',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (req as any).user?.uid || req.ip || 'unknown';
  },
  handler: (req, res) => {
    logger.warn('Upload rate limit exceeded', {
      userId: req.user?.uid,
      ip: req.ip,
      endpoint: req.originalUrl
    });
    
    res.status(429).json({
      error: 'Upload rate limit exceeded',
      message: 'You are uploading files too frequently. Please wait before uploading again.',
      retryAfter: '5 minutes'
    });
  }
});

// Crisis detection rate limiter (less restrictive for emergency situations)
export const crisisRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // More generous limit for crisis situations
  message: {
    error: 'Crisis detection rate limit exceeded',
    message: 'Please contact emergency services if you are in immediate danger.',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (req as any).user?.uid || req.ip || 'unknown';
  },
  handler: (req, res) => {
    logger.warn('Crisis rate limit exceeded', {
      userId: req.user?.uid,
      ip: req.ip,
      endpoint: req.originalUrl
    });
    
    res.status(429).json({
      error: 'Crisis detection rate limit exceeded',
      message: 'Please contact emergency services if you are in immediate danger.',
      retryAfter: '5 minutes',
      emergencyContacts: {
        suicide: '988',
        crisis: '1-800-273-8255',
        emergency: '911'
      }
    });
  }
});

export default {
  rateLimiter,
  strictRateLimiter,
  authRateLimiter,
  chatRateLimiter,
  voiceRateLimiter,
  uploadRateLimiter,
  crisisRateLimiter
};