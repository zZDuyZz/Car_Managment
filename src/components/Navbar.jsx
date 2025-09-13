// src/components/Navbar.jsx
import React from 'react';

// Nhận prop userName
const Navbar = ({ userName }) => {
    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">Chào mừng, {userName}!</h1>
            <div className="flex items-center">
                <button className="p-2 rounded-full hover:bg-gray-200">
                    🔔
                </button>
                <button className="ml-4 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                    Đăng xuất
                </button>
            </div>
        </header>
    );
};

export default Navbar;