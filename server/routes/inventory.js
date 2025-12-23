import express from 'express';
import { successResponse, errorResponse } from '../utils/response.js';

const router = express.Router();

// Placeholder routes - will be implemented later
router.get('/', (req, res) => {
  res.json(errorResponse('Inventory API not implemented yet'));
});

router.post('/', (req, res) => {
  res.json(errorResponse('Inventory creation not implemented yet'));
});

router.put('/:id', (req, res) => {
  res.json(errorResponse('Inventory update not implemented yet'));
});

export default router;