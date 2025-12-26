import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const API_BASE_URL = 'http://localhost:3001/api';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    role: 'staff',
    status: 'active',
  });
  const [passwordError, setPasswordError] = useState('');

  // Fetch accounts from API
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/accounts`);
      const result = await response.json();
      
      if (result.success) {
        setAccounts(result.data);
      } else {
        console.error('Failed to fetch accounts:', result.error);
        alert('Không thể tải danh sách tài khoản');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      alert('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      if (value.length < 6) {
        setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      } else {
        setPasswordError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password || !formData.fullName) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (formData.password.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      
      if (editingId) {
        // Update existing account
        const response = await fetch(`${API_BASE_URL}/accounts/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            fullName: formData.fullName,
            role: formData.role,
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          alert('Cập nhật tài khoản thành công!');
          await fetchAccounts(); // Refresh list
          handleCloseModal();
        } else {
          alert(result.error || 'Không thể cập nhật tài khoản');
        }
      } else {
        // Create new account
        const response = await fetch(`${API_BASE_URL}/accounts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            fullName: formData.fullName,
            role: formData.role,
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          alert('Tạo tài khoản thành công!');
          await fetchAccounts(); // Refresh list
          handleCloseModal();
        } else {
          alert(result.error || 'Không thể tạo tài khoản');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (account) => {
    setEditingId(account.id);
    setFormData({
      username: account.username,
      password: '', // Don't pre-fill password for security
      fullName: account.fullName,
      role: account.role,
      status: 'active', // API doesn't handle status yet
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
          method: 'DELETE',
        });

        const result = await response.json();
        
        if (result.success) {
          alert('Xóa tài khoản thành công!');
          await fetchAccounts(); // Refresh list
        } else {
          alert(result.error || 'Không thể xóa tài khoản');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Lỗi kết nối đến server');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      username: '',
      password: '',
      fullName: '',
      role: 'staff',
      status: 'active',
    });
    setPasswordError('');
  };

  const getRoleBadge = (role) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
      }`}>
        {role === 'admin' ? 'Admin' : 'Staff'}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {status === 'active' ? 'Hoạt động' : 'Khóa'}
      </span>
    );
  };

  const filteredAccounts = accounts.filter(account =>
    account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý tài khoản</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <span className="mr-2">+</span> Tạo tài khoản
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên đăng nhập hoặc họ tên..."
          className="w-full md:w-1/3 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAccounts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Không có tài khoản nào
                </td>
              </tr>
            ) : (
              filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getRoleBadge(account.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Hoạt động
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {account.createdAt ? format(new Date(account.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi }) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(account)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? 'Cập nhật tài khoản' : 'Tạo tài khoản mới'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Nhập tên đăng nhập..."
                    required
                    disabled={editingId ? true : false}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded ${passwordError ? 'border-red-500' : ''}`}
                    placeholder="Nhập mật khẩu..."
                    required
                  />
                  {passwordError && (
                    <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    placeholder="Nhập họ tên..."
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò <span className="text-red-500">*</span></label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái <span className="text-red-500">*</span></label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="active">Hoạt động</option>
                    <option value="locked">Khóa</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={!!passwordError}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {editingId ? 'Cập nhật' : 'Tạo tài khoản'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
