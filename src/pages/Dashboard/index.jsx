// src/pages/Dashboard/index.jsx
import React, { useState, useEffect } from 'react';
import StatCard from './components/StatCard';
import BrandChart from './components/BrandChart';
import DataTable from './components/DataTable';
import { FaCar, FaMoneyBillWave } from 'react-icons/fa';

// Dữ liệu giả định
const mockData = {
    totalCars: 250,
    monthlyRevenue: 250000000,
    revenueChange: 12,
    carBrands: [
        { name: 'Toyota', value: 25 },
        { name: 'Honda', value: 20 },
        { name: 'Ford', value: 15 },
        { name: 'Khác', value: 40 },
    ],
    topDebtors: [
        { name: 'Nguyễn Văn A', debt: '15.000.000' },
        { name: 'Trần Thị B', debt: '12.500.000' },
        { name: 'Lê Văn C', debt: '10.000.000' },
        { name: 'Phạm Văn C', debt: '8.000.000' },
        { name: 'Võ Thị E', debt: '7.500.000' },
    ],
    lowStockItems: [
        { name: 'Dầu nhớt', stock: 3, unit: 'lít' },
        { name: 'Lọc gió', stock: 2, unit: 'cái' },
        { name: 'Má phanh', stock: 4, unit: 'cặp' },
    ],
};

const DashboardPage = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            setData(mockData);
        }, 1000);
    }, []);

    if (!data) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <p className="text-xl text-gray-700">Đang tải dữ liệu...</p>
            </div>
        );
    }

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Tổng quan</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Tổng số xe tiếp nhận"
                    value={data.totalCars}
                    unit="xe"
                    icon="car"
                />
                <StatCard
                    title="Doanh thu tháng này"
                    value={data.monthlyRevenue.toLocaleString('vi-VN')}
                    unit="VNĐ"
                    icon="money"
                    change={data.revenueChange}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Tỷ lệ các hãng xe</h2>
                    <BrandChart data={data.carBrands} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Top khách hàng nợ nhiều nhất</h2>
                    <DataTable
                        columns={['Khách hàng', 'Số nợ']}
                        data={data.topDebtors.map(item => [item.name, item.debt])}
                    />
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Cảnh báo tồn kho</h2>
                    <DataTable
                        columns={['Vật tư', 'Số lượng']}
                        data={data.lowStockItems.map(item => [item.name, `${item.stock} ${item.unit}`])}
                    />
                </div>
            </div>
        </>
    );
};

export default DashboardPage;