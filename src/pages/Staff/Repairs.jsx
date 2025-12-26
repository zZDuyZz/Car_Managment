import React, { useState, useEffect } from 'react';
import { Search, Edit2, FileText, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const Repairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);

  // Mock data - Replace with API call
  useEffect(() => {
    const mockRepairs = [
      {
        id: 'PSC001',
        licensePlate: '51A-12345',
        customerName: 'Nguyễn Văn A',
        customerPhone: '0912345678',
        repairDate: '2024-01-15',
        status: 'completed', // pending, in-progress, completed
        laborCost: 200000,
        partsCost: 150000,
        totalCost: 350000,
        details: [
          { id: 1, description: 'Thay dầu động cơ', partName: 'Dầu Castrol 5W-30', quantity: 1, unitPrice: 150000, laborCost: 50000, totalPrice: 200000 },
          { id: 2, description: 'Thay lọc dầu', partName: 'Lọc dầu Toyota', quantity: 1, unitPrice: 80000, laborCost: 70000, totalPrice: 150000 }
        ]
      },
      {
        id: 'PSC002',
        licensePlate: '51B-67890',
        customerName: 'Trần Thị B',
        customerPhone: '0987654321',
        repairDate: '2024-01-14',
        status: 'in-progress',
        laborCost: 300000,
        partsCost: 500000,
        totalCost: 800000,
        details: [
          { id: 1, description: 'Sửa phanh', partName: 'Má phanh Brembo', quantity: 4, unitPrice: 125000, laborCost: 300000, totalPrice: 800000 }
        ]
      }
    ];
    setRepairs(mockRepairs);
  }, []);

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

  const handleView = (repair) => {
    setSelectedRepair(repair);
    setIsViewModalOpen(true);
  };

  const handleEdit = (repair) => {
    setSelectedRepair(repair);
    setIsEditModalOpen(true);
  };

  const handleDelete = (repairId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu sửa chữa này?')) {
      setRepairs(repairs.filter(repair => repair.id !== repairId));
    }
  };

  const handleExportInvoice = (repair) => {
    // Logic to export invoice
    alert(`Xuất hóa đơn cho phiếu ${repair.id}`);
  };

  const filteredRepairs = repairs.filter(repair => 
    repair.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Danh sách phiếu sửa chữa</h1>
        <div className="text-sm text-gray-600">
          Tổng: {filteredRepairs.length} phiếu
        </div>
      </div>

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
              {filteredRepairs.length > 0 ? (
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
                      {format(new Date(repair.repairDate), 'dd/MM/yyyy', { locale: vi })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusBadge(repair.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(repair.totalCost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleView(repair)}
                        className="text-gray-600 hover:text-gray-900 mr-3"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(repair)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleExportInvoice(repair)}
                        className="text-green-600 hover:text-green-900 mr-3"
                        title="Xuất hóa đơn"
                      >
                        <FileText size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(repair.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
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
                  <p><strong>Ngày sửa:</strong> {format(new Date(selectedRepair.repairDate), 'dd/MM/yyyy', { locale: vi })}</p>
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
                    {selectedRepair.details.map((detail, index) => (
                      <tr key={detail.id} className="border-b">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2">{detail.description}</td>
                        <td className="px-4 py-2">{detail.partName}</td>
                        <td className="px-4 py-2">{detail.quantity}</td>
                        <td className="px-4 py-2">{formatCurrency(detail.unitPrice)}</td>
                        <td className="px-4 py-2">{formatCurrency(detail.laborCost)}</td>
                        <td className="px-4 py-2 font-medium">{formatCurrency(detail.totalPrice)}</td>
                      </tr>
                    ))}
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