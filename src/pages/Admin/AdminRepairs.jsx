import React, { useState, useEffect } from 'react';
import { Wrench, Search, Trash2, Calendar, DollarSign, User, Car } from 'lucide-react';

const AdminRepairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/repairs');
      const result = await response.json();
      if (result.success) {
        setRepairs(result.data);
      }
    } catch (error) {
      console.error('Error fetching repairs:', error);
    }
  };

  const handleDeleteRepair = async (repairId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phiếu sửa chữa này? Hành động này không thể hoàn tác.')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/repairs/${repairId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        fetchRepairs();
        alert('Đã xóa phiếu sửa chữa thành công!');
      } else {
        alert('Có lỗi xảy ra: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting repair:', error);
      alert('Không thể kết nối đến server');
    }
  };

  const filteredRepairs = repairs.filter(repair =>
    repair.BienSo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.TenKH?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repair.MaPhieuSuaChua?.toString().includes(searchTerm)
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getPaymentStatus = (repair) => {
    const totalPaid = repair.TotalPaid || 0;
    const totalAmount = repair.TongTien || 0;
    
    if (totalPaid >= totalAmount) {
      return { status: 'Đã thanh toán', color: 'text-green-600 bg-green-100' };
    } else {
      return { status: 'Chưa thanh toán', color: 'text-red-600 bg-red-100' };
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Wrench className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold">Quản lý phiếu sửa chữa</h1>
        </div>
        <div className="text-sm text-gray-600">
          Tổng số phiếu: {filteredRepairs.length}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm theo biển số xe, tên khách hàng hoặc mã phiếu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Repairs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Danh sách phiếu sửa chữa</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã phiếu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Biển số xe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày sửa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRepairs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    {searchTerm ? 'Không tìm thấy phiếu sửa chữa nào' : 'Chưa có phiếu sửa chữa nào'}
                  </td>
                </tr>
              ) : (
                filteredRepairs.map((repair) => {
                  const paymentStatus = getPaymentStatus(repair);
                  return (
                    <tr key={repair.MaPhieuSuaChua} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{repair.MaPhieuSuaChua}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Car className="w-4 h-4 text-gray-400 mr-2" />
                          {repair.BienSo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div>
                            <div>{repair.TenKH}</div>
                            <div className="text-xs text-gray-500">{repair.DienThoai}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {formatDate(repair.NgaySua)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                          <div>
                            <div className="font-medium">{formatCurrency(repair.TongTien || 0)}</div>
                            <div className="text-xs text-gray-500">
                              Công: {formatCurrency(repair.TienCong || 0)} | 
                              PT: {formatCurrency(repair.TienPhuTung || 0)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatus.color}`}>
                          {paymentStatus.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDeleteRepair(repair.MaPhieuSuaChua)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                          title="Xóa phiếu"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRepairs;