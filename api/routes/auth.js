import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { queries } from '../database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    // Get user from database
    const user = queries.getUserByUsername.get(username);

    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid username or password' 
      });
    }

    // For demo purposes, we'll check plain text password
    // In production, use bcrypt.compare(password, user.MatKhau)
    if (password !== user.MatKhau) {
      return res.status(401).json({ 
        error: 'Invalid username or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.MaTK, 
        username: user.TenDangNhap, 
        role: user.QuyenHan 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.MaTK,
        username: user.TenDangNhap,
        fullName: user.TenChuTaiKhoan,
        role: user.QuyenHan
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    res.json({
      success: true,
      user: decoded
    });

  } catch (error) {
    res.status(401).json({ 
      error: 'Invalid token' 
    });
  }
});

export default router;