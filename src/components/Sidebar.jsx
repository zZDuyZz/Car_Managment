import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaCar, FaUser, FaTools, FaHistory } from 'react-icons/fa';

// Menu dành cho Admin
const adminMenu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
    { name: 'Tiếp nhận xe', path: '/admin/reception', icon: FaCar },
    { name: 'Lịch sử sửa chữa', path: '/admin/history', icon: FaHistory },
];

// Menu dành cho Staff
const staffMenu = [
    { name: 'Dashboard', path: '/staff/dashboard', icon: FaTachometerAlt },
    { name: 'Tiếp nhận xe', path: '/staff/reception', icon: FaCar },
    { name: 'Lịch sử sửa chữa', path: '/staff/history', icon: FaHistory },
];

// Menu dành cho Khách hàng
const customerMenu = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: FaTachometerAlt },
];

const Sidebar = ({ role }) => {
    // Chọn menu tương ứng với vai trò
    let menuItems;
    if (role === 'admin') {
        menuItems = adminMenu;
    } else if (role === 'staff') {
        menuItems = staffMenu;
    } else {
        menuItems = customerMenu;
    }

    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col min-h-screen">
            <div className="p-6 text-center border-b border-gray-700">
                <h1 className="text-2xl font-bold">Quản lý Gara</h1>
            </div>
            <nav className="flex-1 p-4">
                <ul>
                    {menuItems.map((item, index) => (
                        <li key={index} className="mb-2">
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center p-3 rounded-lg transition-colors duration-200 ${
                                        isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
                                    }`
                                }
                            >
                                <item.icon className="mr-3" />
                                <span className="text-sm font-medium">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;