// src/pages/Dashboard/components/StatCard.jsx
import React from 'react';
import { FaCar, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

const StatCard = ({ title, value, unit, icon, change }) => {
    const getIcon = (iconName) => {
        // Sử dụng icon từ react-icons
        switch (iconName) {
            case 'car':
                return <FaCar className="text-4xl text-blue-500" />;
            case 'money':
                return <FaMoneyBillWave className="text-4xl text-green-500" />;
            case 'chart':
                return <FaChartLine className="text-4xl text-purple-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between transition-transform transform hover:scale-105">
            <div className="flex flex-col">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                <p className="text-sm text-gray-400">{unit}</p>
                {change !== undefined && (
                    <div className="flex items-center mt-2">
            <span
                className={`text-sm font-semibold ${
                    change > 0 ? 'text-green-500' : 'text-red-500'
                }`}
            >
              {change > 0 ? `+${change}%` : `${change}%`}
            </span>
                        <span className="text-xs text-gray-500 ml-1">so với tháng trước</span>
                    </div>
                )}
            </div>
            {getIcon(icon)}
        </div>
    );
};

export default StatCard;