import React from 'react';
import { FaCar, FaTools, FaFileInvoiceDollar, FaCheckCircle } from 'react-icons/fa';

const StaffDashboardPage = () => {
    // Dữ liệu giả định cho nhân viên
    const staffData = {
        pendingTasks: [
            { id: 1, car: '51G-123.45', service: 'Thay dầu động cơ', status: 'Chờ xử lý' },
            { id: 2, car: '29A-678.90', service: 'Sửa hệ thống phanh', status: 'Đang làm' },
        ],
        recentCompleted: [
            { id: 3, car: '30K-111.22', service: 'Bảo dưỡng định kỳ', status: 'Hoàn thành' },
        ],
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Tổng quan công việc</h1>

            {/* Phần các nhiệm vụ đang chờ */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                    <FaTools className="text-blue-500 mr-3" />
                    Nhiệm vụ đang chờ
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biển số</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {staffData.pendingTasks.map((task) => (
                            <tr key={task.id}>
                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{task.car}</td>
                                <td className="py-3 px-4 text-sm text-gray-800">{task.service}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-sm">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'Chờ xử lý' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {task.status}
                                        </span>
                                </td>
                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">
                                    <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">Xem chi tiết</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Phần các công việc đã hoàn thành gần đây */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                    <FaCheckCircle className="text-green-500 mr-3" />
                    Đã hoàn thành gần đây
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biển số</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {staffData.recentCompleted.map((task) => (
                            <tr key={task.id}>
                                <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">{task.car}</td>
                                <td className="py-3 px-4 text-sm text-gray-800">{task.service}</td>
                                <td className="py-3 px-4 whitespace-nowrap text-sm">
                                        <span className="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                            {task.status}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default StaffDashboardPage;