import express from 'express';
import { queries } from '../database.js';

const router = express.Router();

// Get all customers
router.get('/', (req, res) => {
  try {
    const { search } = req.query;
    let customers;
    
    if (search) {
      const searchTerm = `%${search}%`;
      customers = queries.searchCustomers.all(searchTerm, searchTerm, searchTerm);
    } else {
      customers = queries.getAllCustomers.all();
    }
    
    res.json({
      success: true,
      data: customers
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch customers' 
    });
  }
});

// Get customer by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const customer = queries.getCustomerById.get(id);
    
    if (!customer) {
      return res.status(404).json({ 
        error: 'Customer not found' 
      });
    }
    
    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch customer' 
    });
  }
});

// Create new customer
router.post('/', (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ 
        error: 'Name and phone are required' 
      });
    }

    const result = queries.createCustomer.run(name, phone, address || '');
    
    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: {
        id: result.lastInsertRowid,
        name,
        phone,
        address
      }
    });
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ 
      error: 'Failed to create customer' 
    });
  }
});

// Update customer
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ 
        error: 'Name and phone are required' 
      });
    }

    const result = queries.updateCustomer.run(name, phone, address || '', id);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Customer not found' 
      });
    }

    res.json({
      success: true,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ 
      error: 'Failed to update customer' 
    });
  }
});

// Delete customer
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = queries.deleteCustomer.run(id);
    
    if (result.changes === 0) {
      return res.status(404).json({ 
        error: 'Customer not found' 
      });
    }

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ 
      error: 'Failed to delete customer' 
    });
  }
});

export default router;