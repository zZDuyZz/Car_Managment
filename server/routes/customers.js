import express from 'express';
import { successResponse, errorResponse } from '../utils/response.js';

const router = express.Router();

// Placeholder routes - will be implemented later
router.get('/', (req, res) => {
  res.json(errorResponse('Customers API not implemented yet'));
});

router.post('/', (req, res) => {
  res.json(errorResponse('Customer creation not implemented yet'));
});

router.put('/:id', (req, res) => {
  res.json(errorResponse('Customer update not implemented yet'));
});

router.delete('/:id', (req, res) => {
  res.json(errorResponse('Customer deletion not implemented yet'));
});

export default router;