import { verifyToken, extractToken } from '../config/auth.js';
import { UnauthorizedError, ForbiddenError } from './errorHandler.js';

// Authentication middleware - verify JWT token
export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedError('No authorization token provided');
    }
    
    const token = extractToken(authHeader);
    const decoded = verifyToken(token);
    
    // Add user info to request
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
      fullName: decoded.fullName
    };
    
    next();
  } catch (error) {
    next(new UnauthorizedError(error.message));
  }
};

// Authorization middleware - check user role
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User not authenticated');
      }
      
      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError(`Access denied. Required roles: ${allowedRoles.join(', ')}`);
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

// Admin only middleware
export const adminOnly = authorize('ADMIN');

// Staff or Admin middleware
export const staffOrAdmin = authorize('STAFF', 'ADMIN');

// Optional authentication - don't fail if no token
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = extractToken(authHeader);
      const decoded = verifyToken(token);
      
      req.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
        fullName: decoded.fullName
      };
    }
    
    next();
  } catch (error) {
    // Don't fail, just continue without user
    next();
  }
};