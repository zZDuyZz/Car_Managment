import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Shield, Key, Lock, Unlock } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001/api';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

  // Fetch accounts from API
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      console.log('Fetching accounts...');
      const response = await fetch(`${API_BASE_URL}/accounts`);
      const result = await response.json();
      
      console.log('Fetch accounts response:', result);
      
      if (result.success) {
        // Only show admin and staff accounts, limit to 2 accounts
        const systemAccounts = result.data.filter(account => 
          account.role === 'admin' || account.role === 'staff'
        ).slice(0, 2);
        console.log('Setting accounts:', systemAccounts);
        setAccounts(systemAccounts);
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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'newPassword') {
      if (value.length < 6) {
        setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự');
      } else {
        setPasswordError('');
      }
    }
    
    if (name === 'confirmPassword') {
      if (value !== passwordData.newPassword) {
        setPasswordError('Xác nhận mật khẩu không khớp');
      } else {
        setPasswordError('');
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Xác nhận mật khẩu không khớp');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/accounts/${editingAccount.id}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Thay đổi mật khẩu thành công!');
        handleClosePasswordModal();
      } else {
        alert(result.error || 'Không thể thay đổi mật khẩu');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAccess = async (account) => {
    // Only allow toggling staff access, not admin
    if (account.role === 'admin') {
      alert('Không thể khóa tài khoản Admin');
      return;
    }

    const newStatus = account.status === 'active' ? 'locked' : 'active';
    const action = newStatus === 'locked' ? 'khóa' : 'mở khóa';
    
    if (window.confirm(`Bạn có chắc chắn muốn ${action} tài khoản ${account.username}?`)) {
      try {
        setLoading(true);
        console.log('Toggling account status:', { accountId: account.id, newStatus });
        
        const response = await fetch(`${API_BASE_URL}/accounts/${account.id}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        });

        const result = await response.json();
        console.log('Toggle response:', result);
        
        if (result.success) {
          alert(`${action.charAt(0).toUpperCase() + action.slice(1)} tài khoản thành công!`);
          console.log('Refreshing accounts list...');
          await fetchAccounts(); // Refresh list
          console.log('Accounts refreshed');
        } else {
          alert(result.error || `Không thể ${action} tài khoản`);
        }
      } catch (error) {
        console.error('Error toggling access:', error);
        alert('Lỗi kết nối đến server');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenPasswordModal = (account) => {
    setEditingAccount(account);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordError('');
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setEditingAccount(null);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordError('');
  };

  const getRoleBadge = (role) => {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
      }`}>
        {role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {status === 'active' ? 'Hoạt động' : 'Bị khóa'}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="text-blue-600" size={28} />
            Bảo mật hệ thống
          </h1>
          <p className="text-gray-600 mt-1">Quản lý bảo mật và truy cập tài khoản hệ thống</p>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-medium text-blue-800">Thông tin bảo mật</h3>
            <p className="text-blue-700 text-sm mt-1">
              Hệ thống chỉ có 2 tài khoản cố định: <strong>Admin</strong> và <strong>Staff</strong>. 
              Bạn có thể thay đổi mật khẩu và quản lý quyền truy cập của nhân viên.
            </p>
          </div>
        </div>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tài khoản</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Không có tài khoản nào
                </td>
              </tr>
            ) : (
              accounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{account.username}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getRoleBadge(account.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getStatusBadge(account.status || 'active')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleOpenPasswordModal(account)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Đổi mật khẩu
                      </button>
                      
                      {account.role === 'staff' && (
                        <button
                          onClick={() => handleToggleAccess(account)}
                          className={account.status === 'active' 
                            ? 'text-red-600 hover:text-red-800' 
                            : 'text-green-600 hover:text-green-800'
                          }
                        >
                          {account.status === 'active' ? 'Khóa' : 'Mở khóa'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        )}
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && editingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Key className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold">Thay đổi mật khẩu</h2>
              </div>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Tài khoản:</strong> {editingAccount.username} ({editingAccount.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'})
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Họ tên:</strong> {editingAccount.fullName}
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu hiện tại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu hiện tại..."
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${passwordError ? 'border-red-500' : ''}`}
                    placeholder="Nhập mật khẩu mới..."
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${passwordError ? 'border-red-500' : ''}`}
                    placeholder="Nhập lại mật khẩu mới..."
                    required
                  />
                  {passwordError && (
                    <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-yellow-800 text-xs">
                    <strong>Lưu ý:</strong> Mật khẩu mới phải có ít nhất 6 ký tự. Sau khi thay đổi, 
                    tài khoản sẽ cần đăng nhập lại với mật khẩu mới.
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClosePasswordModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={!!passwordError || loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Key size={16} />
                    {loading ? 'Đang xử lý...' : 'Thay đổi mật khẩu'}
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
