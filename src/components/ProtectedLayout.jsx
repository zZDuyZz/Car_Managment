import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const ProtectedLayout = ({ userName, userRole, onLogout }) => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar role={userRole} />
            <div className="flex-1 flex flex-col">
                <Navbar userName={userName} onLogout={onLogout} />
                <main className="p-6 md:p-8 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProtectedLayout;