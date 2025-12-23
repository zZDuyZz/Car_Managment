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
    else if (path.includes('settings')) setActiveTab('settings');
  }, [location]);

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
            to="/admin/settings"
            label="Thay đổi quy định"
            active={isActive('/admin/settings')}
            onClick={() => setActiveTab('settings')}
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
      <div className="flex-1 md:ml-64 p-6">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Main Content */}
          <div>
            <Outlet />
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
