import express from 'express';
import { successResponse, errorResponse } from '../utils/response.js';

const router = express.Router();

// Placeholder routes - will be implemented later
router.get('/', (req, res) => {
  res.json(errorResponse('Vehicles API not implemented yet'));
});

router.post('/', (req, res) => {
  res.json(errorResponse('Vehicle registration not implemented yet'));
});

router.put('/:bienso', (req, res) => {
  res.json(errorResponse('Vehicle update not implemented yet'));
});

export default router;