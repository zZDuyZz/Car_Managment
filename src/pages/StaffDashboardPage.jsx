import React, { useState, useEffect } from 'react';
import { FaCar, FaTools, FaFileInvoiceDollar, FaCheckCircle, FaSearch, FaFilter, FaSync, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Skeleton loading component
const SkeletonRow = () => (
    <tr className="animate-pulse">
        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded"></div></td>
        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded"></div></td>
        <td className="px-4 py-4">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-200 h-6 w-24"></div>
        </td>
        <td className="px-4 py-4">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
        </td>
    </tr>
);

// Notification component
const Notification = ({ type, message, onClose }) => (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center justify-between min-w-64 ${
        type === 'success' ? 'bg-green-100 text-green-800' :
            type === 'error' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
    }`}>
        <span>{message}</span>
        <button
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700"
        >
            &times;
        </button>
    </div>
);

// Status badge component
const StatusBadge = ({ status }) => {
    const getStatusStyles = () => {
        switch(status) {
            case 'Chờ xử lý':
                return 'bg-yellow-100 text-yellow-800';
            case 'Đang làm':
                return 'bg-blue-100 text-blue-800';
            case 'Hoàn thành':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles()}`}>
      {status}
    </span>
    );
};

// Modal component
const Modal = ({ show, onClose, taskDetails }) => {
    if (!show || !taskDetails) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative bg-white rounded-lg shadow-xl w-11/12 md:max-w-xl mx-auto p-6 transition-all transform scale-100 opacity-100">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <FaTimesCircle size={24} />
                </button>

                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Chi Tiết Phiếu Tiếp Nhận</h2>
                <hr className="mb-4" />

                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Thông tin khách hàng</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500">Họ và tên khách hàng</p>
                                <p className="font-medium text-gray-900">{taskDetails.customer}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500">Số điện thoại</p>
                                <p className="font-medium text-gray-900">{taskDetails.phone}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Thông tin xe</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500">Biển số xe</p>
                                <p className="font-medium text-gray-900">{taskDetails.car}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500">Hãng xe</p>
                                <p className="font-medium text-gray-900">{taskDetails.carBrand || 'Không có'}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-sm text-gray-500">Đời xe</p>
                                <p className="font-medium text-gray-900">{taskDetails.carModel || 'Không có'}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Mô tả tình trạng ban đầu</h3>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-gray-900 leading-relaxed">{taskDetails.initialDescription || 'Không có mô tả'}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};


const StaffDashboardPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [activeTab, setActiveTab] = useState('pending');

    // Trạng thái mới cho Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // Dữ liệu giả định cho nhân viên, bổ sung thêm carBrand, carModel, initialDescription
    const [staffData, setStaffData] = useState({
        pendingTasks: [],
        recentCompleted: [],
    });

    // Simulate API call
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            setStaffData({
                pendingTasks: [
                    {
                        id: 1,
                        car: '51G-123.45',
                        service: 'Thay dầu động cơ',
                        status: 'Chờ xử lý',
                        customer: 'Nguyễn Văn A',
                        phone: '0901234567',
                        date: '16/09/2025',
                        carBrand: 'Honda',
                        carModel: 'City 2023',
                        initialDescription: 'Xe có tiếng động lạ khi khởi động, cần kiểm tra.'
                    },
                    {
                        id: 2,
                        car: '29A-678.90',
                        service: 'Sửa hệ thống phanh',
                        status: 'Đang làm',
                        customer: 'Trần Thị B',
                        phone: '0912345678',
                        date: '15/09/2025',
                        carBrand: 'Toyota',
                        carModel: 'Vios 2020',
                        initialDescription: 'Phanh bị kêu, đạp phanh cảm thấy lỏng, cần thay má phanh.'
                    },
                ],
                recentCompleted: [
                    {
                        id: 3,
                        car: '30K-111.22',
                        service: 'Bảo dưỡng định kỳ',
                        status: 'Hoàn thành',
                        customer: 'Lê Văn C',
                        phone: '0923456789',
                        date: '14/09/2025',
                        completedDate: '15/09/2025',
                        carBrand: 'Hyundai',
                        carModel: 'Accent 2021',
                        initialDescription: 'Bảo dưỡng định kỳ 40.000km.'
                    },
                ],
            });
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const showNotificationMessage = (type, message) => {
        setNotification({ type, message });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const handleRefresh = () => {
        setIsLoading(true);
        // Simulate refresh
        setTimeout(() => setIsLoading(false), 1000);
    };

    const filteredTasks = staffData[activeTab === 'pending' ? 'pendingTasks' : 'recentCompleted']
        .filter(task =>
            task.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.customer && task.customer.toLowerCase().includes(searchTerm.toLowerCase()))
        );

    const handleCreateReceptionForm = () => {
        navigate('/staff/reception-form');
    };

    // Hàm mới để xử lý việc mở modal
    const handleOpenModal = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    // Hàm mới để xử lý việc đóng modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            {showNotification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setShowNotification(false)}
                />
            )}

            {/* Modal component */}
            <Modal show={showModal} onClose={handleCloseModal} taskDetails={selectedTask} />

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Tổng quan công việc</h1>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm kiếm biển số, dịch vụ..."
                            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleRefresh}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                        disabled={isLoading}
                    >
                        <FaSync className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Làm mới
                    </button>

                    <button
                        onClick={handleCreateReceptionForm}
                        className="flex items-center justify-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95"
                    >
                        <FaFileInvoiceDollar className="mr-2" />
                        <span className="hidden sm:inline">Tạo Phiếu Tiếp nhận</span>
                        <span className="sm:hidden">Tạo mới</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="flex -mb-px">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'pending'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        <div className="flex items-center justify-center">
                            <FaTools className="mr-2" />
                            <span>Nhiệm vụ đang chờ</span>
                            {staffData.pendingTasks.length > 0 && (
                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {staffData.pendingTasks.length}
                </span>
                            )}
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'completed'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        <div className="flex items-center justify-center">
                            <FaCheckCircle className="mr-2" />
                            <span>Đã hoàn thành</span>
                            {staffData.recentCompleted.length > 0 && (
                                <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {staffData.recentCompleted.length}
                </span>
                            )}
                        </div>
                    </button>
                </nav>
            </div>

            {/* Task Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                    Biển số
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dịch vụ</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            // Skeleton loading
                            Array(3).fill(0).map((_, index) => <SkeletonRow key={index} />)
                        ) : filteredTasks.length > 0 ? (
                            // Actual data
                            filteredTasks.map((task) => (
                                <tr
                                    key={task.id}
                                    className="transition-colors hover:bg-gray-50 cursor-pointer"
                                    onClick={() => handleOpenModal(task)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{task.car}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{task.service}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{task.customer}</div>
                                        <div className="text-sm text-gray-500">{task.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {task.completedDate ? (
                                            <>
                                                <div>Hoàn thành: {task.completedDate}</div>
                                                <div>Tiếp nhận: {task.date}</div>
                                            </>
                                        ) : (
                                            task.date
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={task.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenModal(task);
                                            }}
                                        >
                                            Xem
                                        </button>
                                        {activeTab === 'pending' && (
                                            <button
                                                className="text-green-600 hover:text-green-900"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    showNotificationMessage('success', `Đã cập nhật trạng thái cho ${task.car}`);
                                                }}
                                            >
                                                Cập nhật
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            // No results
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                    Không có dữ liệu phù hợp
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && filteredTasks.length > 0 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                Trước
                            </button>
                            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                                Tiếp
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredTasks.length}</span> trong tổng số{' '}
                                    <span className="font-medium">{filteredTasks.length}</span> kết quả
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Trước</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 bg-blue-50">
                                        1
                                    </button>
                                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                        <span className="sr-only">Tiếp</span>
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffDashboardPage;