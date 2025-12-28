import React, { useState, useEffect } from 'react';
import { Users, Search, Edit2, Trash2, Plus, Phone, MapPin, DollarSign, Eye } from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showVehicles, setShowVehicles] = useState(null);
  const [customerVehicles, setCustomerVehicles] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/customers');
      const result = await response.json();
      if (result.success) {
        setCustomers(result.data);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchCustomerVehicles = async (customerId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/vehicles/by-customer/${customerId}`);
      const result = await response.json();
      if (result.success) {
        setCustomerVehicles(result.data);
        setShowVehicles(customerId);
      }
    } catch (error) {
      console.error('Error fetching customer vehicles:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCustomer 
        ? `http://localhost:3001/api/customers/${editingCustomer.MaKH}`
        : 'http://localhost:3001/api/customers';
      
      const method = editingCustomer ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address
        }),
      });

      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        setEditingCustomer(null);
        setFormData({ name: '', phone: '', address: '' });
        fetchCustomers();
        alert(editingCustomer ? 'Đã cập nhật khách hàng thành công!' : 'Đã thêm khách hàng thành công!');
      } else {
        alert('Có lỗi xảy ra: ' + result.message);
      }
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.TenKH,
      phone: customer.DienThoai || '',
      address: customer.DiaChi || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (customerId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này? Tất cả dữ liệu liên quan sẽ bị xóa.')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/customers/${customerId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        fetchCustomers();
        alert('Đã xóa khách hàng thành công!');
      } else {
        alert('Có lỗi xảy ra: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Không thể kết nối đến server');
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.TenKH?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.DienThoai?.includes(searchTerm) ||
    customer.MaKH?.toString().includes(searchTerm)
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Users className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold">Quản lý khách hàng</h1>
        </div>
        <button 
          onClick={() => {
            setEditingCustomer(null);
            setFormData({ name: '', phone: '', address: '' });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm khách hàng
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, số điện thoại hoặc mã khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Danh sách khách hàng ({filteredCustomers.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã KH
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiền nợ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    {searchTerm ? 'Không tìm thấy khách hàng nào' : 'Chưa có khách hàng nào'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.MaKH} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{customer.MaKH}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.TenKH}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        {customer.DienThoai || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        {customer.DiaChi || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                        <span className={customer.TienNo > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                          {formatCurrency(customer.TienNo || 0)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => fetchCustomerVehicles(customer.MaKH)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="Xem xe của khách hàng"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xe
                        </button>
                        <button
                          onClick={() => handleEdit(customer)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(customer.MaKH)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCustomer ? 'Sửa thông tin khách hàng' : 'Thêm khách hàng mới'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên khách hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Đang lưu...' : (editingCustomer ? 'Cập nhật' : 'Thêm mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Vehicles Modal */}
      {showVehicles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Danh sách xe của khách hàng #{showVehicles}
              </h2>
              <button
                onClick={() => setShowVehicles(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {customerVehicles.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Khách hàng chưa có xe nào</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Biển số</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Hãng xe</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ngày tiếp nhận</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customerVehicles.map((vehicle) => (
                      <tr key={vehicle.BienSo}>
                        <td className="px-4 py-2 text-sm font-medium">{vehicle.BienSo}</td>
                        <td className="px-4 py-2 text-sm">{vehicle.TenHieuXe}</td>
                        <td className="px-4 py-2 text-sm">
                          {new Date(vehicle.NgayTiepNhan).toLocaleDateString('vi-VN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;