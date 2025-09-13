import React, { useState } from 'react';
import { FaCar, FaTools, FaHistory, FaCheckCircle, FaExclamationCircle, FaIdCard, FaBuilding, FaChevronDown } from 'react-icons/fa';

// Dữ liệu giả định cho khách hàng
const mockCustomerData = {
    name: 'Nguyễn Văn A',
    vehicle: {
        licensePlate: '51G-123.45',
        brand: 'Honda',
        model: 'City',
        status: 'Đang sửa chữa',
        receptionDate: '15/09/2025',
        estimatedCompletion: '17/09/2025',
        // Thêm dữ liệu tiến độ
        progress: [
            { name: 'Tiếp nhận xe', completed: true },
            { name: 'Kiểm tra & Báo giá', completed: true },
            { name: 'Sửa chữa', completed: false },
            { name: 'Kiểm tra cuối cùng', completed: false },
            { name: 'Hoàn thành', completed: false },
        ]
    },
    serviceHistory: [
        {
            date: '10/05/2025',
            description: 'Bảo dưỡng định kỳ 50,000 km',
            cost: '3.500.000 VNĐ',
            status: 'Hoàn thành',
            details: {
                parts: [{ name: 'Dầu động cơ', quantity: 4, unit: 'lít', price: '200.000' }],
                labor: '800.000 VNĐ',
                notes: 'Kiểm tra và thay dầu động cơ, lọc gió, và lọc dầu.'
            }
        },
        {
            date: '20/02/2025',
            description: 'Thay lốp xe và cân chỉnh thước lái',
            cost: '2.100.000 VNĐ',
            status: 'Hoàn thành',
            details: {
                parts: [{ name: 'Lốp xe', quantity: 2, unit: 'cái', price: '700.000' }],
                labor: '500.000 VNĐ',
                notes: 'Thay hai lốp trước và cân chỉnh độ chụm bánh xe.'
            }
        },
        {
            date: '15/12/2024',
            description: 'Sơn lại cản trước và xử lý vết xước',
            cost: '1.200.000 VNĐ',
            status: 'Hoàn thành',
            details: {
                parts: [],
                labor: '1.200.000 VNĐ',
                notes: 'Sơn lại và đánh bóng cản trước.'
            }
        },
    ],
};

const CustomerDashboardPage = () => {
    const { vehicle, serviceHistory } = mockCustomerData;
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Chào mừng, Khách hàng!</h1>

            {/* Phần thông tin xe */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                    <FaCar className="text-blue-500 mr-3" />
                    Thông tin xe
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-gray-200 p-4 rounded-lg flex items-center">
                        <span className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
                            <FaIdCard size={24} />
                        </span>
                        <div>
                            <p className="text-sm text-gray-500">Biển số</p>
                            <p className="font-bold text-lg mt-1">{vehicle.licensePlate}</p>
                        </div>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-lg flex items-center">
                        <span className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
                            <FaBuilding size={24} />
                        </span>
                        <div>
                            <p className="text-sm text-gray-500">Hãng xe</p>
                            <p className="font-bold text-lg mt-1">{vehicle.brand}</p>
                        </div>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-lg flex items-center">
                        <span className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4">
                            <FaCar size={24} />
                        </span>
                        <div>
                            <p className="text-sm text-gray-500">Đời xe</p>
                            <p className="font-bold text-lg mt-1">{vehicle.model}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phần trạng thái xe và tiến độ */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                    <FaTools className="text-blue-500 mr-3" />
                    Tiến độ sửa chữa
                </h2>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {vehicle.progress.map((step, index) => (
                            <div key={index} className={`flex items-center space-x-2 ${step.completed ? 'text-green-600' : 'text-gray-400'}`}>
                                <FaCheckCircle className={`${step.completed ? 'text-green-500' : 'text-gray-300'}`} />
                                <span className="text-sm font-medium">{step.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6">
                        <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                            Đặt lịch dịch vụ
                        </button>
                    </div>
                </div>
            </div>

            {/* Lịch sử sửa chữa */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                    <FaHistory className="text-blue-500 mr-3" />
                    Lịch sử sửa chữa
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi phí</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {serviceHistory.map((item, index) => (
                            <React.Fragment key={index}>
                                <tr className="hover:bg-gray-100 transition-colors">
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{item.date}</td>
                                    <td className="py-3 px-4 text-sm text-gray-800">{item.description}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{item.cost}</td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                {item.status}
                                            </span>
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">
                                        <button onClick={() => toggleRow(index)} className="text-blue-500 hover:text-blue-700">
                                            <FaChevronDown className={`transform transition-transform ${expandedRow === index ? 'rotate-180' : ''}`} />
                                        </button>
                                    </td>
                                </tr>
                                {expandedRow === index && (
                                    <tr className="bg-gray-50">
                                        <td colSpan="5" className="px-6 py-4">
                                            <div className="text-sm text-gray-700">
                                                <p className="font-bold mb-2">Thông tin xe:</p>
                                                <ul className="list-inside ml-4">
                                                    <li><strong>Biển số:</strong> {vehicle.licensePlate}</li>
                                                    <li><strong>Hãng xe:</strong> {vehicle.brand}</li>
                                                    <li><strong>Đời xe:</strong> {vehicle.model}</li>
                                                </ul>
                                                <p className="font-bold mt-4 mb-2">Chi tiết sửa chữa:</p>
                                                <p className="mb-1"><strong>Vật tư:</strong></p>
                                                <ul className="list-disc list-inside ml-4">
                                                    {item.details.parts.length > 0 ? (
                                                        item.details.parts.map((part, i) => (
                                                            <li key={i}>{part.name} - {part.quantity} {part.unit}</li>
                                                        ))
                                                    ) : (
                                                        <li>Không có vật tư nào được thay thế.</li>
                                                    )}
                                                </ul>
                                                <p className="mb-1 mt-2"><strong>Tiền công:</strong> {item.details.labor}</p>
                                                <p className="mb-1"><strong>Ghi chú:</strong> {item.details.notes}</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default CustomerDashboardPage;