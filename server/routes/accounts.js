import express from 'express';
import { successResponse, errorResponse } from '../utils/response.js';

const router = express.Router();

// Placeholder routes - will be implemented in Task 4
router.get('/', (req, res) => {
  res.json(errorResponse('Accounts API not implemented yet'));
});

router.post('/', (req, res) => {
  res.json(errorResponse('Account creation not implemented yet'));
});

router.put('/:id', (req, res) => {
  res.json(errorResponse('Account update not implemented yet'));
});

router.delete('/:id', (req, res) => {
  res.json(errorResponse('Account deletion not implemented yet'));
});

export default router;