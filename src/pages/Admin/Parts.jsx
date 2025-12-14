import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const Parts = () => {
    const [parts, setParts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Load parts data from localStorage on component mount
    useEffect(() => {
        const savedParts = JSON.parse(localStorage.getItem('parts'));
        
        // Add mock data if no parts exist
        if (!savedParts || savedParts.length === 0) {
            const mockParts = [
                {
                    id: 'PT-001',
                    partName: 'Lọc dầu nhớt',
                    unitPrice: 150000,
                    quantity: 15,
                    createdAt: new Date('2023-12-01T08:00:00').toISOString(),
                    updatedAt: new Date('2023-12-10T14:30:00').toISOString()
                },
                {
                    id: 'PT-002',
                    partName: 'Lốp xe 175/65R14',
                    unitPrice: 1200000,
                    quantity: 4,
                    createdAt: new Date('2023-12-02T09:15:00').toISOString(),
                    updatedAt: new Date('2023-12-12T10:20:00').toISOString()
                },
                {
                    id: 'PT-003',
                    partName: 'Má phanh trước',
                    unitPrice: 450000,
                    quantity: 8,
                    createdAt: new Date('2023-12-03T10:30:00').toISOString(),
                    updatedAt: new Date('2023-12-13T11:45:00').toISOString()
                },
                {
                    id: 'PT-004',
                    partName: 'Bộ lọc gió',
                    unitPrice: 250000,
                    quantity: 0,
                    createdAt: new Date('2023-12-05T13:20:00').toISOString(),
                    updatedAt: new Date('2023-12-15T16:30:00').toISOString()
                },
                {
                    id: 'PT-005',
                    partName: 'Bugi',
                    unitPrice: 180000,
                    quantity: 2,
                    createdAt: new Date('2023-12-07T14:10:00').toISOString(),
                    updatedAt: new Date('2023-12-14T15:25:00').toISOString()
                }
            ];
            localStorage.setItem('parts', JSON.stringify(mockParts));
            setParts(mockParts);
        } else {
            setParts(savedParts);
        }
    }, []);

    // Format currency to VND
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(value);
    };

    // Filter parts based on search term
    const filteredParts = parts.filter(part =>
        part.partName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.id?.toString().includes(searchTerm)
    );

    return (
        <div className="container mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Danh sách phụ tùng</h1>
                <p className="text-gray-600">Quản lý vật tư, linh kiện</p>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc mã phụ tùng..."
                    className="w-full md:w-1/3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã PT</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên phụ tùng</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cập nhật</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredParts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        Không có dữ liệu phụ tùng
                                    </td>
                                </tr>
                            ) : (
                                filteredParts.map((part) => (
                                    <tr key={part.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {part.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {part.partName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                                            {formatCurrency(part.unitPrice || 0)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                part.quantity <= 0 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : part.quantity < 5 
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-green-100 text-green-800'
                                            }`}>
                                                {part.quantity || 0} cái
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(new Date(part.updatedAt || part.createdAt || new Date()), 'dd/MM/yyyy HH:mm', { locale: vi })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Parts;
