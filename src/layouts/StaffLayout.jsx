import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const StaffLayout = ({ onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('customers');

    // Set active tab based on current route
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('customers')) setActiveTab('customers');
        else if (path.includes('vehicles')) setActiveTab('vehicles');
        else if (path.includes('repairs')) setActiveTab('repairs');
        else if (path.includes('invoices')) setActiveTab('invoices');
    }, [location]);

    const handleTabChange = (newValue) => {
        setActiveTab(newValue);
        navigate(`/staff/${newValue}`);
    };

    const isActive = (path) => location.pathname.includes(path);

    const handleLogout = () => {
        onLogout();
        navigate('/login');
    };

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
                    <h1 className="text-white text-xl font-bold">GARAGE</h1>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <NavItem
                        to="/staff/customers"
                        label="Khách hàng & Xe"
                        active={isActive('/staff/customers') || isActive('/staff/vehicles')}
                        onClick={() => setActiveTab('customers')}
                    />

                    <NavItem
                        to="/staff/repairs"
                        label="Sửa chữa"
                        active={isActive('/staff/repairs') || isActive('/staff/services') || isActive('/staff/parts')}
                        onClick={() => setActiveTab('repairs')}
                    />

                    <NavItem
                        to="/staff/invoices"
                        label="Hóa đơn & Thanh toán"
                        active={isActive('/staff/invoices')}
                        onClick={() => setActiveTab('invoices')}
                    />
                </nav>

                {/* Logout */}
                <div className="border-t border-gray-200 p-4">
                    <button
                        onClick={handleLogout}
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
                            {activeTab === 'customers' || activeTab === 'vehicles' ? (
                                <>
                                    <button
                                        onClick={() => handleTabChange('customers')}
                                        className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                                            activeTab === 'customers'
                                                ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Danh sách khách hàng
                                    </button>
                                    <button
                                        onClick={() => handleTabChange('vehicles')}
                                        className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                                            activeTab === 'vehicles'
                                                ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Quản lý xe
                                    </button>
                                </>
                            ) : activeTab === 'repairs' || activeTab === 'services' || activeTab === 'parts' ? (
                                <>
                                    <button
                                        onClick={() => handleTabChange('repairs')}
                                        className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                                            activeTab === 'repairs'
                                                ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Phiếu sửa chữa
                                    </button>
                                    <button
                                        onClick={() => handleTabChange('services')}
                                        className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                                            activeTab === 'services'
                                                ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Dịch vụ
                                    </button>
                                    <button
                                        onClick={() => handleTabChange('parts')}
                                        className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                                            activeTab === 'parts'
                                                ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        Kho phụ tùng
                                    </button>
                                </>
                            ) : activeTab === 'invoices' ? (
                                <button
                                    className="px-4 py-2 text-sm font-medium rounded-t-lg bg-white text-blue-600 border-t border-l border-r border-gray-200"
                                >
                                    Hóa đơn
                                </button>
                            ) : null}
                        </nav>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <Outlet />

                        {/* Action Buttons - Only show for repairs tab */}
                        {activeTab === 'repairs' && (
                            <div className="fixed bottom-6 right-6">
                                <button
                                    onClick={() => navigate('/staff/repairs/new')}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded shadow"
                                >
                                    + Tạo phiếu sửa
                                </button>
                            </div>
                        )}
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

export default StaffLayout;