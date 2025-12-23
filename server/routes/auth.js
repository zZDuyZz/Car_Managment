import express from 'express';
import { successResponse, errorResponse } from '../utils/response.js';

const router = express.Router();

// Placeholder routes - will be implemented in Task 3
router.post('/login', (req, res) => {
  res.json(errorResponse('Authentication not implemented yet'));
});

router.post('/logout', (req, res) => {
  res.json(successResponse(null, 'Logout endpoint ready'));
});

export default router;