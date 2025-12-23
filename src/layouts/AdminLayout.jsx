import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const AdminLayout = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('accounts');

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('accounts')) setActiveTab('accounts');
    else if (path.includes('reception')) setActiveTab('reception');
    else if (path.includes('reports')) setActiveTab('reports');
    else if (path.includes('import')) setActiveTab('import');
    else if (path.includes('regulations')) setActiveTab('regulations');
  }, [location]);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/admin/${newValue}`);
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
      >
        {isMenuOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                  md:translate-x-0 transition-transform duration-300 ease-in-out 
                  w-64 bg-white shadow-lg z-40 flex flex-col`}
      >
        <div className="h-16 flex items-center justify-center bg-blue-600">
          <h1 className="text-white text-xl font-bold">QUẢN TRỊ</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <NavItem
            to="/admin/accounts"
            label="Quản lý tài khoản"
            active={isActive('/admin/accounts')}
            onClick={() => setActiveTab('accounts')}
          />
          
          <NavItem
            to="/admin/reports"
            label="Lập báo cáo"
            active={isActive('/admin/reports')}
            onClick={() => setActiveTab('reports')}
          />
          
          <NavItem
            to="/admin/import"
            label="Nhập hàng"
            active={isActive('/admin/import')}
            onClick={() => setActiveTab('import')}
          />
          
          <NavItem
            to="/admin/regulations"
            label="Thay đổi quy định"
            active={isActive('/admin/regulations')}
            onClick={() => setActiveTab('regulations')}
          />
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onLogout}
            className="w-full text-left px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <div className="p-4">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-1" aria-label="Tabs">
              {activeTab === 'regulations' && (
                <>
                  <button
                    onClick={() => handleTabChange('repair-regulations')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                      isActive('repair-regulations')
                        ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Quy định sửa chữa
                  </button>
                  <button
                    onClick={() => handleTabChange('reception-regulations')}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                      isActive('reception-regulations')
                        ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Quy định tiếp nhận
                  </button>
                </>
              )}
              
              {['accounts', 'reports', 'import'].includes(activeTab) && (
                <div className="px-4 py-2 text-sm font-medium text-gray-700">
                  {activeTab === 'accounts' && 'Danh sách tài khoản'}
                  {activeTab === 'reports' && 'Báo cáo thống kê'}
                  {activeTab === 'import' && 'Nhập hàng'}
                </div>
              )}
            </nav>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            {/* Action Buttons - Moved to top right */}
            <div className="flex justify-end mb-6 space-x-4">
              {activeTab === 'import' && (
                <button
                  onClick={() => navigate('/admin/import/new')}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow transition-colors"
                >
                  + Nhập hàng mới
                </button>
              )}
            </div>
            
            {/* Main Content */}
            <div className="mt-4">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ to, label, active, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-6 py-3 ${active ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700 hover:bg-gray-100'}`}
    >
      {label}
    </Link>
  );
};

export default AdminLayout;
