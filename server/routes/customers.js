import express from 'express';
import { executeQuery } from '../utils/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// GET /api/customers - Get all customers
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    
    let query = 'SELECT * FROM KHACHHANG';
    let params = [];
    
    if (search) {
      query += ' WHERE TenKhachHang LIKE ? OR SoDienThoai LIKE ? OR DiaChi LIKE ?';
      const searchTerm = `%${search}%`;
      params = [searchTerm, searchTerm, searchTerm];
    }
    
    query += ' ORDER BY NgayTao DESC';
    
    const customers = await executeQuery(query, params);
    
    res.json({
      success: true,
      data: customers.map(customer => ({
        id: customer.MaKhachHang,
        name: customer.TenKhachHang,
        phone: customer.SoDienThoai,
        address: customer.DiaChi,
        createdAt: customer.NgayTao
      })),
      message: 'Lấy danh sách khách hàng thành công'
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Lỗi khi lấy danh sách khách hàng'
    });
  }
});

// POST /api/customers - Create new customer
router.post('/', async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    // Validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Tên khách hàng và số điện thoại là bắt buộc'
      });
    }

    // Check if phone already exists
    const existingCustomer = await executeQuery(
      'SELECT * FROM KHACHHANG WHERE SoDienThoai = ?',
      [phone]
    );

    if (existingCustomer.length > 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Số điện thoại đã tồn tại'
      });
    }

    // Insert new customer
    const result = await executeQuery(
      'INSERT INTO KHACHHANG (TenKhachHang, SoDienThoai, DiaChi, NgayTao) VALUES (?, ?, ?, datetime("now"))',
      [name, phone, address || '']
    );

    // Get the created customer
    const newCustomer = await executeQuery(
      'SELECT * FROM KHACHHANG WHERE MaKhachHang = ?',
      [result.lastID]
    );

    res.status(201).json({
      success: true,
      data: {
        id: newCustomer[0].MaKhachHang,
        name: newCustomer[0].TenKhachHang,
        phone: newCustomer[0].SoDienThoai,
        address: newCustomer[0].DiaChi,
        createdAt: newCustomer[0].NgayTao
      },
      message: 'Tạo khách hàng thành công'
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Lỗi khi tạo khách hàng'
    });
  }
});

// PUT /api/customers/:id - Update customer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;

    // Validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Tên khách hàng và số điện thoại là bắt buộc'
      });
    }

    // Check if customer exists
    const existingCustomer = await executeQuery(
      'SELECT * FROM KHACHHANG WHERE MaKhachHang = ?',
      [id]
    );

    if (existingCustomer.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Không tìm thấy khách hàng'
      });
    }

    // Check if phone already exists (excluding current customer)
    const phoneCheck = await executeQuery(
      'SELECT * FROM KHACHHANG WHERE SoDienThoai = ? AND MaKhachHang != ?',
      [phone, id]
    );

    if (phoneCheck.length > 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Số điện thoại đã tồn tại'
      });
    }

    // Update customer
    await executeQuery(
      'UPDATE KHACHHANG SET TenKhachHang = ?, SoDienThoai = ?, DiaChi = ? WHERE MaKhachHang = ?',
      [name, phone, address || '', id]
    );

    // Get updated customer
    const updatedCustomer = await executeQuery(
      'SELECT * FROM KHACHHANG WHERE MaKhachHang = ?',
      [id]
    );

    res.json({
      success: true,
      data: {
        id: updatedCustomer[0].MaKhachHang,
        name: updatedCustomer[0].TenKhachHang,
        phone: updatedCustomer[0].SoDienThoai,
        address: updatedCustomer[0].DiaChi,
        createdAt: updatedCustomer[0].NgayTao
      },
      message: 'Cập nhật khách hàng thành công'
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Lỗi khi cập nhật khách hàng'
    });
  }
});

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if customer exists
    const existingCustomer = await executeQuery(
      'SELECT * FROM KHACHHANG WHERE MaKhachHang = ?',
      [id]
    );

    if (existingCustomer.length === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Không tìm thấy khách hàng'
      });
    }

    // Check if customer has vehicles
    const vehicles = await executeQuery(
      'SELECT * FROM XE WHERE MaKhachHang = ?',
      [id]
    );

    if (vehicles.length > 0) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Không thể xóa khách hàng đã có xe'
      });
    }

    // Delete customer
    await executeQuery('DELETE FROM KHACHHANG WHERE MaKhachHang = ?', [id]);

    res.json({
      success: true,
      data: null,
      message: 'Xóa khách hàng thành công'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Lỗi khi xóa khách hàng'
    });
  }
});

export default router;