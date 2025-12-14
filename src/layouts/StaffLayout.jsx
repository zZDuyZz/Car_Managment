import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const StaffLayout = ({ onLogout }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => location.pathname.includes(path);

  // Simple SVG icons as components
  const DashboardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );

  const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const CarIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M8 7l4-4m0 0l4 4m-4-4v16m-3 0h6m-9 0v-1a3 3 0 013-3h12a3 3 0 013 3v1m-3-4a3 3 0 100-6 3 3 0 000 6z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    </svg>
  );

  const WrenchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );

  const ToolsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2m-6 0V3m0 0a2 2 0 012-2h2a2 2 0 012 2m-6 0h6m0 0v2m0-2v-2m0 0h-2.5M9.5 5h5" />
    </svg>
  );

  const LogoutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
      >
        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
                  md:translate-x-0 transition-transform duration-300 ease-in-out 
                  w-64 bg-white shadow-lg z-40`}
      >
        <div className="h-16 flex items-center justify-center bg-blue-600">
          <h1 className="text-white text-xl font-bold">GARAGE</h1>
        </div>
        <nav className="mt-4">
          <NavItem 
            to="/" 
            icon={<DashboardIcon />} 
            label="Tổng quan" 
            active={isActive('/dashboard')}
          />
          <NavItem 
            to="/customers" 
            icon={<UsersIcon />} 
            label="Khách hàng" 
            active={isActive('/customers')}
          />
          <NavItem 
            to="/vehicles" 
            icon={<CarIcon />} 
            label="Xe" 
            active={isActive('/vehicles')}
          />
          <NavItem 
            to="/repairs" 
            icon={<WrenchIcon />} 
            label="Sửa chữa" 
            active={isActive('/repairs')}
          />
          <NavItem 
            to="/repair-services" 
            icon={<ToolsIcon />} 
            label="Dịch vụ sửa" 
            active={isActive('/repair-services')}
          />
          <button
            onClick={onLogout}
            className="w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100"
          >
            <span className="text-gray-500 mr-3"><LogoutIcon /></span>
            <span>Đăng xuất</span>
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-6 py-3 ${active ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
    >
      <span className={`mr-3 ${active ? 'text-blue-500' : 'text-gray-500'}`}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
};

export default StaffLayout;
