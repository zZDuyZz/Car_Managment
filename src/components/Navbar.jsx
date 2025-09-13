import React from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ userName, onLogout }) => {
    return (
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Trang chủ</h1>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <FaUserCircle className="text-gray-500" size={24} />
                    <span className="font-medium text-gray-700">{userName}</span>
                </div>
                {/* Nút đăng xuất mới */}
                <button
                    onClick={onLogout}
                    className="flex items-center p-2 rounded-md hover:bg-red-100 text-red-600 transition-colors"
                >
                    <FaSignOutAlt className="mr-2" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;