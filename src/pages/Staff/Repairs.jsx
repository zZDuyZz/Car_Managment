import { useState, useEffect } from 'react';
import { Search, FileText, Trash2, Eye } from 'lucide-react';

const Repairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch repairs from API
  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/repairs');
      const data = await response.json();
      
      if (data.success) {
        // Transform API data to match frontend format
        const transformedRepairs = data.data.map(repair => ({
          id: repair.MaPhieuSuaChua,
          licensePlate: repair.BienSo,
          customerName: repair.TenKH || 'Không xác định',
          customerPhone: repair.DienThoai || '',
          repairDate: repair.NgaySua,
          status: repair.VehicleStatus === 1 ? 'in-progress' : 'completed', // 1 = đang sửa, 0 = hoàn thành
          laborCost: repair.TienCong || 0,
          partsCost: repair.TienPhuTung || 0,
          totalCost: repair.TongTien || 0,
          customerId: repair.MaKH,
          vehicleStatus: repair.VehicleStatus
        }));
        setRepairs(transformedRepairs);
      } else {
        setError('Không thể tải danh sách phiếu sửa chữa');
      }
    } catch (err) {
      console.error('Fetch repairs error:', err);
      setError('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { class: 'bg-yellow-100 text-yellow-800', text: 'Chờ xử lý' },
      'in-progress': { class: 'bg-blue-100 text-blue-800', text: 'Đang sửa' },
      completed: { class: 'bg-green-100 text-green-800', text: 'Hoàn thành' }
    };
    const statusInfo = statusMap[status] || { class: 'bg-gray-100 text-gray-800', text: 'Không xác định' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
  };

  const handleView = async (repair) => {
    try {
      // Fetch repair details from API
      const response = await fetch(`http://localhost:3001/api/repairs/${repair.id}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedRepair({
          ...repair,
          details: data.data.details || []
        });
        setIsViewModalOpen(true);
      } else {
        alert('Không thể tải chi tiết phiếu sửa chữa');
      }
    } catch (err) {
      console.error('Fetch repair details error:', err);
      alert('Lỗi khi tải chi tiết phiếu sửa chữa');
    }
  };

  const handleExportInvoice = (repair) => {
    // Simple invoice export - in real app, you'd generate PDF
    const invoiceContent = `
PHIẾU SỬA CHỮA XE
==================
Mã phiếu: ${repair.id}
Biển số xe: ${repair.licensePlate}
Khách hàng: ${repair.customerName}
Điện thoại: ${repair.customerPhone}
Ngày sửa: ${formatDate(repair.repairDate)}
Tiền công: ${formatCurrency(repair.laborCost)}
Tiền phụ tùng: ${formatCurrency(repair.partsCost)}
Tổng tiền: ${formatCurrency(repair.totalCost)}
==================
    `;
    
    // Create and download text file
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hoa-don-${repair.licensePlate}-${repair.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async (repairId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu sửa chữa này?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/repairs/${repairId}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          setRepairs(repairs.filter(repair => repair.id !== repairId));
        } else {
          alert('Không thể xóa phiếu sửa chữa');
        }
      } catch (err) {
        console.error('Delete repair error:', err);
        alert('Lỗi khi xóa phiếu sửa chữa');
      }
    }
  };

  const filteredRepairs = repairs.filter(repair => 
    String(repair.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Danh sách phiếu sửa chữa</h1>
        <div className="text-sm text-gray-600">
          Tổng: {filteredRepairs.length} phiếu
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
            placeholder="Tìm kiếm theo mã phiếu, biển số xe, hoặc tên khách hàng..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã phiếu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biển số xe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sửa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredRepairs.length > 0 ? (
                filteredRepairs.map((repair) => (
                  <tr key={repair.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {repair.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {repair.licensePlate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>{repair.customerName}</div>
                      <div className="text-xs text-gray-500">{repair.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(repair.repairDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusBadge(repair.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(repair.totalCost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleView(repair)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        
                        {repair.status === 'in-progress' && (
                          <button
                            onClick={() => handleComplete(repair.id)}
                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 mr-3"
                            title="Hoàn thành"
                          >
                            Hoàn thành
                          </button>
                        )}
                        
                        {repair.status === 'completed' && (
                          <button
                            onClick={() => handleExportInvoice(repair)}
                            className="text-green-600 hover:text-green-900"
                            title="Xuất hóa đơn"
                          >
                            <FileText size={18} />
                          </button>
                        )}
                        
                        {repair.status === 'in-progress' && (
                          <button
                            onClick={() => handleDelete(repair.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa phiếu"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy phiếu sửa chữa nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedRepair && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Chi tiết phiếu sửa chữa - {selectedRepair.id}</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p><strong>Biển số xe:</strong> {selectedRepair.licensePlate}</p>
                  <p><strong>Khách hàng:</strong> {selectedRepair.customerName}</p>
                  <p><strong>Số điện thoại:</strong> {selectedRepair.customerPhone}</p>
                </div>
                <div>
                  <p><strong>Ngày sửa:</strong> {formatDate(selectedRepair.repairDate)}</p>
                  <p><strong>Trạng thái:</strong> {getStatusBadge(selectedRepair.status)}</p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden mb-4">
                <table className="min-w-full">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">STT</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Nội dung</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Vật tư/Phụ tùng</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Số lượng</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Đơn giá</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Tiền công</th>
                      <th className="px-4 py-2 text-left text-xs font-medium uppercase">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRepair.details && selectedRepair.details.length > 0 ? (
                      selectedRepair.details.map((detail, index) => (
                        <tr key={detail.MaPhieuSuaChua + '-' + index} className="border-b">
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2">{detail.TenTienCong || 'Dịch vụ'}</td>
                          <td className="px-4 py-2">{detail.TenVatTuPhuTung || 'Không có'}</td>
                          <td className="px-4 py-2">{detail.SoLuong || 1}</td>
                          <td className="px-4 py-2">{formatCurrency(detail.DonGiaPhuTung || 0)}</td>
                          <td className="px-4 py-2">{formatCurrency(0)}</td>
                          <td className="px-4 py-2 font-medium">{formatCurrency((detail.SoLuong || 1) * (detail.DonGiaPhuTung || 0))}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-4 py-2 text-center text-gray-500">
                          Không có chi tiết sửa chữa
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Tổng tiền:</span>
                <span className="text-blue-600">{formatCurrency(selectedRepair.totalCost)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal - Similar structure to create modal in Vehicles */}
      {isEditModalOpen && selectedRepair && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Chỉnh sửa phiếu sửa chữa - {selectedRepair.id}</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              {/* Edit form content similar to create form */}
              <div className="text-center py-8 text-gray-500">
                Form chỉnh sửa sẽ được implement ở đây
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repairs;