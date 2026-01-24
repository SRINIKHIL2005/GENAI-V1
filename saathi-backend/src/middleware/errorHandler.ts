import { Request, Response, NextFunction } from 'express';
import { logger, StructuredLogger } from '@/utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

// Custom error classes
export class ValidationError extends Error {
  statusCode = 400;
  isOperational = true;
  code = 'VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends Error {
  statusCode = 401;
  isOperational = true;
  code = 'AUTHENTICATION_ERROR';

  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  statusCode = 403;
  isOperational = true;
  code = 'AUTHORIZATION_ERROR';

  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  isOperational = true;
  code = 'NOT_FOUND_ERROR';

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  statusCode = 409;
  isOperational = true;
  code = 'CONFLICT_ERROR';

  constructor(message: string = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends Error {
  statusCode = 429;
  isOperational = true;
  code = 'RATE_LIMIT_ERROR';

  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ExternalServiceError extends Error {
  statusCode = 502;
  isOperational = true;
  code = 'EXTERNAL_SERVICE_ERROR';

  constructor(message: string = 'External service error') {
    super(message);
    this.name = 'ExternalServiceError';
  }
}

export class DatabaseError extends Error {
  statusCode = 500;
  isOperational = true;
  code = 'DATABASE_ERROR';

  constructor(message: string = 'Database operation failed') {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Global error handler middleware
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode = 500, message, code, isOperational = false } = error;

  // Log error details
  StructuredLogger.logError(error, {
    url: req.originalUrl,
    method: req.method,
    userId: (req as any).user?.uid,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    body: req.body,
    query: req.query,
    params: req.params
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
    code = 'VALIDATION_ERROR';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    code = 'INVALID_ID';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    code = 'INVALID_TOKEN';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    code = 'TOKEN_EXPIRED';
  } else if (error.name === 'MulterError') {
    statusCode = 400;
    message = 'File upload error';
    code = 'UPLOAD_ERROR';
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && !isOperational) {
    message = 'Something went wrong';
    code = 'INTERNAL_ERROR';
  }

  // Send error response
  const errorResponse: any = {
    error: {
      message,
      code,
      statusCode
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method
  };

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = error.stack;
  }

  // Add request ID if available
  if ((req as any).requestId) {
    errorResponse.requestId = (req as any).requestId;
  }

  // Special handling for crisis-related errors
  if (req.originalUrl.includes('/crisis')) {
    errorResponse.emergencyContacts = {
      suicide: '988',
      crisis: '1-800-273-8255',
      emergency: '911'
    };
    errorResponse.message = 'If you are in immediate danger, please contact emergency services';
  }

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

// Validation error helper
export const createValidationError = (field: string, message: string) => {
  return new ValidationError(`${field}: ${message}`);
};

// Database error helper
export const handleDatabaseError = (error: any) => {
  if (error.code === 11000) {
    // Duplicate key error
    const field = Object.keys(error.keyValue)[0];
    return new ConflictError(`${field} already exists`);
  }
  
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err: any) => err.message);
    return new ValidationError(messages.join(', '));
  }
  
  return new DatabaseError(error.message);
};

// External service error helper
export const handleExternalServiceError = (service: string, error: any) => {
  logger.error(`External service error - ${service}:`, error);
  
  if (error.response?.status === 429) {
    return new RateLimitError(`${service} rate limit exceeded`);
  }
  
  if (error.response?.status >= 400 && error.response?.status < 500) {
    return new ValidationError(`${service} request error: ${error.message}`);
  }
  
  return new ExternalServiceError(`${service} is currently unavailable`);
};

export default {
  errorHandler,
  asyncHandler,
  notFoundHandler,
  createValidationError,
  handleDatabaseError,
  handleExternalServiceError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ExternalServiceError,
  DatabaseError
};