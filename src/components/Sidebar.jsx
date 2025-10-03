// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
    FaTachometerAlt, 
    FaCar, 
    FaTools, 
    FaSearch, 
    FaFileInvoiceDollar, 
    FaChartLine, 
    FaCog,
    FaChevronDown,
    FaChevronRight
} from 'react-icons/fa';

const Sidebar = () => {
    const [reportOpen, setReportOpen] = useState(false);
    
    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: FaTachometerAlt },
        { name: 'Tiếp nhận xe', path: '/reception', icon: FaCar },
        { name: 'Phiếu sửa chữa', path: '/repair-orders', icon: FaTools },
        { name: 'Tra cứu xe', path: '/vehicle-search', icon: FaSearch },
        { name: 'Phiếu thu tiền', path: '/payment-forms', icon: FaFileInvoiceDollar },
        { 
            name: 'Báo cáo', 
            icon: FaChartLine, 
            subItems: [
                { name: 'Doanh thu tháng', path: '/reports/revenue' },
                { name: 'Báo cáo tồn phụ tùng', path: '/reports/inventory' }
            ]
        },
        { name: 'Quy định', path: '/regulations', icon: FaCog },
    ];
    
    const toggleReportMenu = () => {
        setReportOpen(!reportOpen);
    };

    return (
        <aside className="w-64 bg-gray-800 text-white flex flex-col min-h-screen">
            <div className="p-6 text-center border-b border-gray-700">
                <h1 className="text-2xl font-bold">Gara Ô Tô</h1>
            </div>
            <nav className="flex-1 p-4 overflow-y-auto">
                <ul>
                    {menuItems.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.subItems ? (
                                <>
                                    <li 
                                        className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors duration-200"
                                        onClick={toggleReportMenu}
                                    >
                                        <item.icon className="mr-3" />
                                        <span className="text-sm font-medium flex-1">{item.name}</span>
                                        {reportOpen ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                                    </li>
                                    {reportOpen && (
                                        <div className="ml-8 my-1">
                                            {item.subItems.map((subItem, subIndex) => (
                                                <NavLink
                                                    key={subIndex}
                                                    to={subItem.path}
                                                    className={({ isActive }) => 
                                                        `block p-2 pl-6 rounded-lg text-sm mb-1 transition-colors duration-200 ${
                                                            isActive ? 'bg-blue-600' : 'hover:bg-gray-700'
                                                        }`
                                                    }
                                                >
                                                    {subItem.name}
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <li className="mb-1">
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
                            )}
                        </React.Fragment>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;