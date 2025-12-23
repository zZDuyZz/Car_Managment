import jwt from 'jsonwebtoken';
import 'dotenv/config';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-change-this';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Generate JWT token
export const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'garage-api',
    audience: 'garage-app'
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'garage-api',
      audience: 'garage-app'
    });
  } catch (error) {
    throw new Error(`Invalid token: ${error.message}`);
  }
};

// Extract token from Authorization header
export const extractToken = (authHeader) => {
  if (!authHeader) {
    throw new Error('No authorization header provided');
  }
  
  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Invalid authorization header format');
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

export { JWT_SECRET, JWT_EXPIRES_IN };