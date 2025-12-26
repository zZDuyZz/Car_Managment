import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server working!' });
});

// CREATE REPAIR - Endpoint chính
app.post('/api/create-repair', async (req, res) => {
  console.log('🔥 CREATE REPAIR:', req.body);
  
  try {
    const { executeQuery } = await import('./utils/database.js');
    const { vehicleId, notes, repairDetails } = req.body;
    
    if (!vehicleId) {
      return res.status(400).json({ success: false, message: 'Mã xe là bắt buộc' });
    }
    
    // Check if vehicle exists
    const vehicle = await executeQuery('SELECT MaXe FROM XE WHERE MaXe = ?', [vehicleId]);
    if (vehicle.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Xe với ID ${vehicleId} không tồn tại trong hệ thống` 
      });
    }
    
    // Get first account ID (fallback if no user logged in)
    const accounts = await executeQuery('SELECT MaTaiKhoan FROM TAIKHOAN LIMIT 1');
    const accountId = accounts.length > 0 ? accounts[0].MaTaiKhoan : null;
    
    if (!accountId) {
      return res.status(500).json({ 
        success: false, 
        message: 'Không tìm thấy tài khoản trong hệ thống' 
      });
    }
    
    // Insert repair order
    const result = await executeQuery(
      'INSERT INTO PHIEUSUA (MaXe, NgayVao, TongTien, TrangThai, GhiChu, MaTaiKhoan) VALUES (?, datetime("now"), 0, "DANG_SUA", ?, ?)',
      [vehicleId, notes || '', accountId]
    );
    
    const repairId = result.lastID;
    
    // Insert repair details
    if (repairDetails && repairDetails.length > 0) {
      for (const detail of repairDetails) {
        if (detail.description && detail.description.trim() !== ' - ') {
          await executeQuery(
            'INSERT INTO CHITIETPHIEUSUA (MaPhieuSua, NoiDungSua, ChiPhiSua) VALUES (?, ?, ?)',
            [repairId, detail.description, detail.cost || 0]
          );
        }
      }
    }
    
    // Calculate total
    const totalResult = await executeQuery(
      'SELECT SUM(ChiPhiSua) as total FROM CHITIETPHIEUSUA WHERE MaPhieuSua = ?',
      [repairId]
    );
    const totalAmount = totalResult[0]?.total || 0;
    
    // Update total
    await executeQuery(
      'UPDATE PHIEUSUA SET TongTien = ? WHERE MaPhieuSua = ?',
      [totalAmount, repairId]
    );
    
    res.json({
      success: true,
      data: { 
        id: repairId, 
        vehicleId, 
        totalAmount,
        status: 'DANG_SUA', 
        notes 
      },
      message: 'Tạo phiếu sửa chữa thành công'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Import và thêm các routes khác
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customers.js';
import vehicleRoutes from './routes/vehicles.js';
import accountRoutes from './routes/accounts.js';

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/accounts', accountRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
});