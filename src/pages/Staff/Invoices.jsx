import { useState, useEffect } from 'react';
import { Search, Eye, FileText, DollarSign, Plus, Trash2 } from 'lucide-react';

const Invoices = () => {
  const [repairs, setRepairs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch repairs and payments
      const [repairsResponse, paymentsResponse] = await Promise.all([
        fetch('http://localhost:3001/api/repairs'),
        fetch('http://localhost:3001/api/payments')
      ]);

      const repairsData = await repairsResponse.json();
      const paymentsData = await paymentsResponse.json();

      if (repairsData.success && paymentsData.success) {
        // Transform repairs data
        const transformedRepairs = repairsData.data.map(repair => ({
          id: repair.MaPhieuSuaChua,
          licensePlate: repair.BienSo,
          customerName: repair.TenKH || 'Không xác định',
          customerPhone: repair.DienThoai || '',
          customerId: repair.MaKH,
          repairDate: repair.NgaySua,
          laborCost: repair.TienCong || 0,
          partsCost: repair.TienPhuTung || 0,
          totalCost: repair.TongTien || 0
        }));

        // Transform payments data
        const transformedPayments = paymentsData.data.map(payment => ({
          id: payment.MaPhieuThuTien,
          customerId: payment.MaKH,
          customerName: payment.TenKH || 'Không xác định',
          customerPhone: payment.DienThoai || '',
          amount: payment.TienThu || 0,
          paymentDate: payment.NgayThuTien,
          note: payment.GhiChu || ''
        }));

        setRepairs(transformedRepairs);
        setPayments(transformedPayments);
      } else {
        setError('Không thể tải dữ liệu');
      }
    } catch (err) {
      console.error('Fetch data error:', err);
      setError('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = (repair) => {
    setSelectedRepair(repair);
    setPaymentAmount(repair.totalCost.toString());
    setPaymentNote(`Thanh toán phiếu sửa chữa ${repair.id}`);
    setIsPaymentModalOpen(true);
  };

  const handleSubmitPayment = async () => {
    if (!selectedRepair || !paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: selectedRepair.customerId,
          amount: parseFloat(paymentAmount),
          note: paymentNote
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Tạo phiếu thu tiền thành công!');
        setIsPaymentModalOpen(false);
        setSelectedRepair(null);
        setPaymentAmount('');
        setPaymentNote('');
        fetchData(); // Refresh data
      } else {
        alert('Không thể tạo phiếu thu tiền: ' + data.error);
      }
    } catch (err) {
      console.error('Create payment error:', err);
      alert('Lỗi khi tạo phiếu thu tiền');
    }
  };

  const handleDeletePayment = async (paymentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu thu tiền này?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/payments/${paymentId}`, {
          method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
          alert('Xóa phiếu thu tiền thành công!');
          fetchData(); // Refresh data
        } else {
          alert('Không thể xóa phiếu thu tiền');
        }
      } catch (err) {
        console.error('Delete payment error:', err);
        alert('Lỗi khi xóa phiếu thu tiền');
      }
    }
  };

  const handlePrintInvoice = (repair) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn sửa chữa ${repair.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #333; }
            .info { margin-bottom: 20px; }
            .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
            .total { text-align: right; font-weight: bold; font-size: 18px; margin-top: 20px; color: #2563eb; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>HÓA ĐƠN SỬA CHỮA</h1>
            <p>Mã phiếu: ${repair.id}</p>
          </div>
          
          <div class="section">
            <h3>Thông tin khách hàng</h3>
            <div class="info-row">
              <span><strong>Biển số xe:</strong> ${repair.licensePlate}</span>
              <span><strong>Khách hàng:</strong> ${repair.customerName}</span>
            </div>
            <div class="info-row">
              <span><strong>Số điện thoại:</strong> ${repair.customerPhone}</span>
              <span><strong>Ngày sửa:</strong> ${new Date(repair.repairDate).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>

          <div class="section">
            <h3>Chi tiết chi phí</h3>
            <div class="info-row">
              <span>Tiền công:</span>
              <span>${repair.laborCost.toLocaleString('vi-VN')} đ</span>
            </div>
            <div class="info-row">
              <span>Tiền phụ tùng:</span>
              <span>${repair.partsCost.toLocaleString('vi-VN')} đ</span>
            </div>
          </div>

          <div class="total">
            Tổng cộng: ${repair.totalCost.toLocaleString('vi-VN')} đ
          </div>

          <div class="footer">
            <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
            <p>Ngày in: ${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN')}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  const filteredRepairs = repairs.filter(repair => 
    repair.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = payments.filter(payment => 
    payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payment.customerPhone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Hóa đơn & Thanh toán</h1>
        <div className="text-sm text-gray-600">
          {filteredRepairs.length} phiếu sửa chữa | {filteredPayments.length} phiếu thu tiền
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo biển số xe, tên khách hàng..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Repair Invoices */}
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Hóa đơn sửa chữa</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredRepairs.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Không có hóa đơn sửa chữa nào
                  </div>
                ) : (
                  filteredRepairs.map(repair => (
                    <div key={repair.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-sm">Phiếu #{repair.id}</div>
                          <div className="text-xs text-gray-600">{repair.licensePlate} - {repair.customerName}</div>
                          <div className="text-xs text-gray-500">{repair.customerPhone}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-blue-600">{formatCurrency(repair.totalCost)}</div>
                          <div className="text-xs text-gray-500">{formatDate(repair.repairDate)}</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-3">
                        Tiền công: {formatCurrency(repair.laborCost)} | Phụ tùng: {formatCurrency(repair.partsCost)}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePrintInvoice(repair)}
                          className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700"
                        >
                          <FileText size={14} />
                          In hóa đơn
                        </button>
                        <button
                          onClick={() => handleCreatePayment(repair)}
                          className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                        >
                          <DollarSign size={14} />
                          Thu tiền
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Payment Records */}
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Phiếu thu tiền</h2>
            </div>
            <div className="p-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredPayments.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Chưa có phiếu thu tiền nào
                  </div>
                ) : (
                  filteredPayments.map(payment => (
                    <div key={payment.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold text-sm">Phiếu #{payment.id}</div>
                          <div className="text-xs text-gray-600">{payment.customerName}</div>
                          <div className="text-xs text-gray-500">{payment.customerPhone}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-green-600">{formatCurrency(payment.amount)}</div>
                          <div className="text-xs text-gray-500">{formatDate(payment.paymentDate)}</div>
                        </div>
                      </div>
                      
                      {payment.note && (
                        <div className="text-xs text-gray-600 mb-3">
                          Ghi chú: {payment.note}
                        </div>
                      )}

                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDeletePayment(payment.id)}
                          className="flex items-center gap-1 py-1 px-2 text-red-600 hover:text-red-800 text-xs"
                        >
                          <Trash2 size={12} />
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedRepair && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Tạo phiếu thu tiền</h2>
              
              <div className="mb-4 p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Khách hàng</div>
                <div className="font-semibold">{selectedRepair.customerName}</div>
                <div className="text-sm text-gray-600">{selectedRepair.licensePlate}</div>
                <div className="text-sm text-gray-600">Tổng tiền sửa chữa: {formatCurrency(selectedRepair.totalCost)}</div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền thu</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập số tiền..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Ghi chú..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsPaymentModalOpen(false);
                    setSelectedRepair(null);
                    setPaymentAmount('');
                    setPaymentNote('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitPayment}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Tạo phiếu thu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
