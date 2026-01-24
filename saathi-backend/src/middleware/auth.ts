import { Request, Response, NextFunction } from 'express';
import { firebaseAuth } from '@/config/firebase';
import { AuthenticationError, AuthorizationError } from '@/middleware/errorHandler';
import { logger, StructuredLogger } from '@/utils/logger';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        displayName?: string;
        phoneNumber?: string;
        emailVerified: boolean;
        disabled: boolean;
        customClaims?: Record<string, any>;
      };
      requestId?: string;
    }
  }
}

// Authentication middleware
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Authorization header with Bearer token required');
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new AuthenticationError('Token not provided');
    }

    // Verify Firebase ID token
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    
    // Get user record for additional information
    const userRecord = await firebaseAuth.getUser(decodedToken.uid);
    
    // Attach user information to request
    req.user = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      phoneNumber: userRecord.phoneNumber,
      emailVerified: userRecord.emailVerified,
      disabled: userRecord.disabled,
      customClaims: userRecord.customClaims
    };

    // Log authentication success
    StructuredLogger.logUserAction(req.user.uid, 'authentication_success', {
      endpoint: req.originalUrl,
      method: req.method
    });

    next();
  } catch (error: any) {
    if (error.code === 'auth/id-token-expired') {
      logger.warn('Expired token attempt', { 
        ip: req.ip, 
        endpoint: req.originalUrl,
        userAgent: req.get('User-Agent')
      });
      return next(new AuthenticationError('Token expired'));
    }
    
    if (error.code === 'auth/id-token-revoked') {
      logger.warn('Revoked token attempt', { 
        ip: req.ip, 
        endpoint: req.originalUrl,
        userAgent: req.get('User-Agent')
      });
      return next(new AuthenticationError('Token revoked'));
    }
    
    if (error.code?.startsWith('auth/')) {
      logger.warn('Firebase auth error', { 
        error: error.code,
        ip: req.ip, 
        endpoint: req.originalUrl,
        userAgent: req.get('User-Agent')
      });
      return next(new AuthenticationError('Invalid token'));
    }

    logger.error('Authentication middleware error:', error);
    next(new AuthenticationError('Authentication failed'));
  }
};

// Optional authentication middleware (doesn't throw if no token)
export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return next(); // Continue without authentication
    }

    // Verify Firebase ID token
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    const userRecord = await firebaseAuth.getUser(decodedToken.uid);
    
    // Attach user information to request
    req.user = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      phoneNumber: userRecord.phoneNumber,
      emailVerified: userRecord.emailVerified,
      disabled: userRecord.disabled,
      customClaims: userRecord.customClaims
    };

    next();
  } catch (error: any) {
    // Log the error but continue without authentication
    logger.warn('Optional auth failed:', { 
      error: error.code || error.message,
      ip: req.ip,
      endpoint: req.originalUrl
    });
    next();
  }
};

// Role-based authorization middleware
export const requireRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError());
    }

    const userRole = req.user.customClaims?.role;
    
    if (!userRole || userRole !== requiredRole) {
      StructuredLogger.logSecurity('unauthorized_role_access', req.user.uid, req.ip, {
        requiredRole,
        userRole,
        endpoint: req.originalUrl
      });
      return next(new AuthorizationError(`${requiredRole} role required`));
    }

    next();
  };
};

// Permission-based authorization middleware
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError());
    }

    const userPermissions = req.user.customClaims?.permissions || [];
    
    if (!userPermissions.includes(permission)) {
      StructuredLogger.logSecurity('unauthorized_permission_access', req.user.uid, req.ip, {
        requiredPermission: permission,
        userPermissions,
        endpoint: req.originalUrl
      });
      return next(new AuthorizationError(`${permission} permission required`));
    }

    next();
  };
};

// Admin authorization middleware
export const requireAdmin = requireRole('admin');

// Therapist authorization middleware
export const requireTherapist = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AuthenticationError());
  }

  const userRole = req.user.customClaims?.role;
  
  if (!userRole || !['admin', 'therapist'].includes(userRole)) {
    StructuredLogger.logSecurity('unauthorized_therapist_access', req.user.uid, req.ip, {
      userRole,
      endpoint: req.originalUrl
    });
    return next(new AuthorizationError('Therapist access required'));
  }

  next();
};

// Self-access authorization (user can only access their own data)
export const requireSelfAccess = (paramName: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AuthenticationError());
    }

    const requestedUserId = req.params[paramName] || req.body[paramName] || req.query[paramName];
    
    if (!requestedUserId) {
      return next(new AuthorizationError('User ID required'));
    }

    if (req.user.uid !== requestedUserId) {
      // Allow admin and therapist access
      const userRole = req.user.customClaims?.role;
      if (!userRole || !['admin', 'therapist'].includes(userRole)) {
        StructuredLogger.logSecurity('unauthorized_user_access', req.user.uid, req.ip, {
          requestedUserId,
          endpoint: req.originalUrl
        });
        return next(new AuthorizationError('Access denied'));
      }
    }

    next();
  };
};

// Email verification requirement
export const requireEmailVerification = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AuthenticationError());
  }

  if (!req.user.emailVerified) {
    return next(new AuthorizationError('Email verification required'));
  }

  next();
};

// Account status check
export const requireActiveAccount = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AuthenticationError());
  }

  if (req.user.disabled) {
    StructuredLogger.logSecurity('disabled_account_access', req.user.uid, req.ip, {
      endpoint: req.originalUrl
    });
    return next(new AuthorizationError('Account has been disabled'));
  }

  next();
};

// Request ID middleware
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.requestId = require('crypto').randomUUID();
  res.setHeader('X-Request-ID', req.requestId || '');
  next();
};

// API key authentication middleware (for external integrations)
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    return next(new AuthenticationError('API key required'));
  }

  if (apiKey !== process.env.API_KEY) {
    StructuredLogger.logSecurity('invalid_api_key', undefined, req.ip, {
      endpoint: req.originalUrl,
      providedKey: apiKey.substring(0, 8) + '...'
    });
    return next(new AuthenticationError('Invalid API key'));
  }

  next();
};

export default {
  authMiddleware,
  optionalAuthMiddleware,
  requireRole,
  requirePermission,
  requireAdmin,
  requireTherapist,
  requireSelfAccess,
  requireEmailVerification,
  requireActiveAccount,
  requestIdMiddleware,
  apiKeyAuth
};