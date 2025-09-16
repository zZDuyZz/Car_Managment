import React, { useState, useEffect } from 'react';
import { FaCar, FaTools, FaFileInvoiceDollar, FaCheckCircle, FaSearch, FaFilter, FaSync, FaTimesCircle, FaClock, FaClipboardList } from 'react-icons/fa';
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

// Component Modal Cập Nhật Tiến Độ
const UpdateProgressModal = ({ show, onClose, task, onUpdate }) => {
    if (!show || !task) return null;

    const progressSteps = [
        { label: 'Tiếp nhận xe', value: 'Chờ xử lý', icon: FaCheckCircle },
        { label: 'Kiểm tra & Báo giá', value: 'Đang làm', icon: FaCheckCircle },
        { label: 'Sửa chữa', value: 'Đang làm', icon: FaTools },
        { label: 'Kiểm tra cuối cùng', value: 'Đang làm', icon: FaClock },
        { label: 'Hoàn thành', value: 'Hoàn thành', icon: FaCheckCircle }
    ];

    const handleUpdateClick = (newProgress) => {
        onUpdate(newProgress);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative bg-white rounded-lg shadow-xl w-11/12 md:max-w-md mx-auto p-6 transition-all transform scale-100 opacity-100">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                >
                    <FaTimesCircle size={24} />
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Cập nhật tiến độ</h2>
                <hr className="mb-4" />

                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Cập nhật tiến độ cho xe **{task.car}** ({task.service})
                    </p>
                    <div className="mt-4">
                        <h3 className="text-md font-semibold mb-2">Chọn trạng thái hiện tại</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {progressSteps.map((step, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleUpdateClick(index)}
                                    className={`
                                        flex items-center p-3 rounded-lg text-left transition-colors
                                        ${task.progress === index
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                                    `}
                                >
                                    <span className="flex items-center">
                                      <step.icon className="mr-3" />
                                      <span>{step.label}</span>
                                    </span>
                                    {task.progress === index && (
                                        <span className="ml-auto text-sm font-medium">Đang chọn</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300"
                    >
                        Hủy
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

    // Trạng thái cho modal xem chi tiết
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    // Trạng thái cho modal cập nhật tiến độ
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [taskToUpdate, setTaskToUpdate] = useState(null);

    // Thêm trạng thái cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10;

    // Dữ liệu giả định cho nhân viên, bổ sung thêm progress
    const [staffData, setStaffData] = useState({
        pendingTasks: [],
        inProgressTasks: [],
        completedTasks: [],
    });

    // Simulate API call
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const dummyData = [
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
                    initialDescription: 'Xe có tiếng động lạ khi khởi động, cần kiểm tra.',
                    progress: 0 // Tiếp nhận xe
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
                    initialDescription: 'Phanh bị kêu, đạp phanh cảm thấy lỏng, cần thay má phanh.',
                    progress: 1 // Kiểm tra & Báo giá
                },
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
                    initialDescription: 'Bảo dưỡng định kỳ 40.000km.',
                    progress: 4 // Hoàn thành
                },
                {
                    id: 4,
                    car: '59B-001.01',
                    service: 'Kiểm tra và sửa chữa điện',
                    status: 'Chờ xử lý',
                    customer: 'Phạm Thị D',
                    phone: '0934567890',
                    date: '16/09/2025',
                    carBrand: 'Ford',
                    carModel: 'Ranger',
                    initialDescription: 'Hệ thống đèn pha bị chập chờn, cần kiểm tra lại toàn bộ dây điện.',
                    progress: 0
                },
                {
                    id: 5,
                    car: '43A-987.65',
                    service: 'Sơn lại thân xe',
                    status: 'Đang làm',
                    customer: 'Hoàng Văn E',
                    phone: '0945678901',
                    date: '15/09/2025',
                    carBrand: 'Mazda',
                    carModel: 'CX-5',
                    initialDescription: 'Xe bị va chạm nhẹ ở bên hông, cần sơn lại để phục hồi màu sơn gốc.',
                    progress: 2 // Sửa chữa
                },
                {
                    id: 6,
                    car: '60C-222.33',
                    service: 'Thay lốp và cân mâm bấm chì',
                    status: 'Hoàn thành',
                    customer: 'Nguyễn Thị F',
                    phone: '0956789012',
                    date: '13/09/2025',
                    completedDate: '14/09/2025',
                    carBrand: 'Kia',
                    carModel: 'Seltos',
                    initialDescription: 'Lốp xe bị mòn, cần thay lốp mới và cân chỉnh lại.',
                    progress: 4
                },
                {
                    id: 7,
                    car: '71G-456.78',
                    service: 'Vệ sinh nội thất',
                    status: 'Chờ xử lý',
                    customer: 'Lê Văn G',
                    phone: '0967890123',
                    date: '16/09/2025',
                    carBrand: 'VinFast',
                    carModel: 'Fadil',
                    initialDescription: 'Nội thất bị bám bụi nhiều, cần vệ sinh sạch sẽ.',
                    progress: 0
                },
                {
                    id: 8,
                    car: '37B-888.88',
                    service: 'Kiểm tra hệ thống điều hòa',
                    status: 'Đang làm',
                    customer: 'Bùi Thị H',
                    phone: '0978901234',
                    date: '15/09/2025',
                    carBrand: 'Mercedes-Benz',
                    carModel: 'C200',
                    initialDescription: 'Điều hòa không lạnh, cần kiểm tra gas và lốc lạnh.',
                    progress: 3 // Kiểm tra cuối cùng
                },
                {
                    id: 9,
                    car: '99A-123.45',
                    service: 'Thay bình ắc quy',
                    status: 'Hoàn thành',
                    customer: 'Đinh Văn I',
                    phone: '0989012345',
                    date: '12/09/2025',
                    completedDate: '13/09/2025',
                    carBrand: 'BMW',
                    carModel: 'X3',
                    initialDescription: 'Bình ắc quy bị yếu, không đề nổ được.',
                    progress: 4
                },
                {
                    id: 10,
                    car: '12L-345.67',
                    service: 'Sửa chữa đồng sơn',
                    status: 'Chờ xử lý',
                    customer: 'Trần Văn K',
                    phone: '0990123456',
                    date: '16/09/2025',
                    carBrand: 'Lexus',
                    carModel: 'RX350',
                    initialDescription: 'Xe bị trầy xước nhiều, cần làm lại đồng sơn.',
                    progress: 0
                },
                {
                    id: 11,
                    car: '86C-234.56',
                    service: 'Bảo dưỡng gầm',
                    status: 'Đang làm',
                    customer: 'Võ Thị L',
                    phone: '0900123456',
                    date: '15/09/2025',
                    carBrand: 'Toyota',
                    carModel: 'Fortuner',
                    initialDescription: 'Gầm xe có tiếng kêu lạ khi đi qua đường xấu.',
                    progress: 2
                },
                {
                    id: 12,
                    car: '29C-345.67',
                    service: 'Thay bugi và lọc gió',
                    status: 'Hoàn thành',
                    customer: 'Đặng Văn M',
                    phone: '0911234567',
                    date: '11/09/2025',
                    completedDate: '12/09/2025',
                    carBrand: 'Suzuki',
                    carModel: 'Swift',
                    initialDescription: 'Bugi và lọc gió lâu ngày chưa thay, xe chạy không bốc.',
                    progress: 4
                }
            ];

            setStaffData({
                pendingTasks: dummyData.filter(task => task.status === 'Chờ xử lý'),
                inProgressTasks: dummyData.filter(task => task.status === 'Đang làm'),
                completedTasks: dummyData.filter(task => task.status === 'Hoàn thành'),
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
        setCurrentPage(1); // Reset về trang đầu tiên khi làm mới
        // Simulate refresh
        setTimeout(() => setIsLoading(false), 1000);
    };

    // Xác định danh sách nhiệm vụ hiện tại dựa trên tab
    const getTasksByTab = () => {
        switch (activeTab) {
            case 'pending':
                return staffData.pendingTasks;
            case 'in-progress':
                return staffData.inProgressTasks;
            case 'completed':
                return staffData.completedTasks;
            default:
                return [];
        }
    };

    const currentTasks = getTasksByTab();
    const filteredTasks = currentTasks
        .filter(task =>
            task.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (task.customer && task.customer.toLowerCase().includes(searchTerm.toLowerCase()))
        );

    // Tính toán số lượng trang và dữ liệu cho trang hiện tại
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const tasksToShow = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    const handleCreateReceptionForm = () => {
        navigate('/staff/reception-form');
    };

    // Hàm mới để xử lý việc mở modal chi tiết
    const handleOpenModal = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    // Hàm mới để xử lý việc đóng modal chi tiết
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    // Hàm mở modal cập nhật tiến độ
    const handleOpenUpdateModal = (e, task) => {
        e.stopPropagation(); // Ngăn sự kiện click vào dòng
        setTaskToUpdate(task);
        setShowUpdateModal(true);
    };

    // Hàm xử lý việc cập nhật tiến độ
    const handleUpdateProgress = (newProgressIndex) => {
        const updatedTask = { ...taskToUpdate };
        const progressSteps = ['Chờ xử lý', 'Đang làm', 'Đang làm', 'Đang làm', 'Hoàn thành'];
        updatedTask.progress = newProgressIndex;
        updatedTask.status = progressSteps[newProgressIndex];

        setStaffData(prev => {
            const newPendingTasks = prev.pendingTasks.filter(t => t.id !== updatedTask.id);
            const newInProgressTasks = prev.inProgressTasks.filter(t => t.id !== updatedTask.id);
            const newCompletedTasks = prev.completedTasks.filter(t => t.id !== updatedTask.id);

            if (updatedTask.status === 'Chờ xử lý') {
                newPendingTasks.push(updatedTask);
            } else if (updatedTask.status === 'Đang làm') {
                newInProgressTasks.push(updatedTask);
            } else if (updatedTask.status === 'Hoàn thành') {
                newCompletedTasks.push(updatedTask);
                updatedTask.completedDate = new Date().toLocaleDateString('vi-VN');
            }

            return {
                pendingTasks: newPendingTasks,
                inProgressTasks: newInProgressTasks,
                completedTasks: newCompletedTasks
            };
        });

        showNotificationMessage('success', `Đã cập nhật trạng thái cho xe ${updatedTask.car}`);
        setShowUpdateModal(false);
        setTaskToUpdate(null);
    };

    // Hàm chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Hàm xử lý khi thay đổi tab
    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        setSearchTerm(''); // Xóa tìm kiếm khi đổi tab
        setCurrentPage(1); // Reset về trang 1 khi đổi tab
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

            {/* Modal xem chi tiết */}
            <Modal show={showModal} onClose={handleCloseModal} taskDetails={selectedTask} />

            {/* Modal cập nhật tiến độ */}
            <UpdateProgressModal
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                task={taskToUpdate}
                onUpdate={handleUpdateProgress}
            />

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
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                            }}
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
                        onClick={() => handleTabChange('pending')}
                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'pending'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        <div className="flex items-center justify-center">
                            <FaClipboardList className="mr-2" />
                            <span>Nhiệm vụ đang chờ</span>
                            {staffData.pendingTasks.length > 0 && (
                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                  {staffData.pendingTasks.length}
                                </span>
                            )}
                        </div>
                    </button>
                    <button
                        onClick={() => handleTabChange('in-progress')}
                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'in-progress'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        <div className="flex items-center justify-center">
                            <FaTools className="mr-2" />
                            <span>Nhiệm vụ đang làm</span>
                            {staffData.inProgressTasks.length > 0 && (
                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                  {staffData.inProgressTasks.length}
                                </span>
                            )}
                        </div>
                    </button>
                    <button
                        onClick={() => handleTabChange('completed')}
                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'completed'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        <div className="flex items-center justify-center">
                            <FaCheckCircle className="mr-2" />
                            <span>Đã hoàn thành</span>
                            {staffData.completedTasks.length > 0 && (
                                <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                  {staffData.completedTasks.length}
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
                            Array(tasksPerPage).fill(0).map((_, index) => <SkeletonRow key={index} />)
                        ) : tasksToShow.length > 0 ? (
                            // Actual data
                            tasksToShow.map((task) => (
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
                                        {activeTab !== 'completed' && (
                                            <button
                                                className="text-green-600 hover:text-green-900"
                                                onClick={(e) => handleOpenUpdateModal(e, task)}
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
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Trang trước
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Trang sau
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Hiển thị <span className="font-medium">{indexOfFirstTask + 1}</span> đến <span className="font-medium">{Math.min(indexOfLastTask, filteredTasks.length)}</span> trong tổng số <span className="font-medium">{filteredTasks.length}</span> kết quả
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Trang trước</span>
                                        {/* Heroicon name: solid/chevron-left */}
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            aria-current={currentPage === i + 1 ? 'page' : undefined}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                currentPage === i + 1
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Trang sau</span>
                                        {/* Heroicon name: solid/chevron-right */}
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