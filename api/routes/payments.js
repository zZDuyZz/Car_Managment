import express from 'express';
import { queries } from '../database.js';

const router = express.Router();

// Get all payments
router.get('/', (req, res) => {
  try {
    const payments = queries.getAllPayments.all();
    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch payments' 
    });
  }
});

// Get payment by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const payment = queries.getPaymentById.get(id);
    
    if (!payment) {
      return res.status(404).json({ 
        error: 'Payment not found' 
      });
    }
    
    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch payment' 
    });
  }
});

// Create new payment
router.post('/', (req, res) => {
  try {
    const { customerId, amount, note } = req.body;

    // Validation
    if (!customerId || !amount || amount <= 0) {
      return res.status(400).json({ 
        error: 'Customer ID and valid amount are required' 
      });
    }

    // Create payment
    const result = queries.createPayment.run(customerId, amount, note || '');
    
    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: {
        id: result.lastInsertRowid,
        customerId,
        amount,
        note
      }
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ 
      error: 'Failed to create payment' 
    });
  }
});

// Delete payment
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const result = queries.deletePayment.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Payment not found' 
      });
    }

    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ 
      error: 'Failed to delete payment' 
    });
  }
});

export default router;