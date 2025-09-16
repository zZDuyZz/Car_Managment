import React, { useState, useEffect } from 'react';
import {
    FaCar,
    FaTools,
    FaFileInvoiceDollar,
    FaCheckCircle,
    FaSearch,
    FaSync,
    FaTimesCircle,
    FaClock,
    FaClipboardList,
    FaExclamationTriangle,
    FaInfoCircle,
    FaThumbtack,
    FaHourglassHalf,
    FaRegSmileBeam,
    FaEye,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';
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
const Notification = ({ type, message, onClose }) => {
    const getNotificationStyles = () => {
        switch(type) {
            case 'success':
                return 'bg-green-100 text-green-800 border-l-4 border-green-500';
            case 'error':
                return 'bg-red-100 text-red-800 border-l-4 border-red-500';
            case 'info':
                return 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';
            default:
                return 'bg-gray-100 text-gray-800 border-l-4 border-gray-400';
        }
    };

    const getNotificationIcon = () => {
        switch(type) {
            case 'success':
                return <FaCheckCircle className="text-green-500 mr-3" size={20} />;
            case 'error':
                return <FaExclamationTriangle className="text-red-500 mr-3" size={20} />;
            case 'info':
                return <FaInfoCircle className="text-blue-500 mr-3" size={20} />;
            default:
                return null;
        }
    };

    return (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl z-50 flex items-center justify-between min-w-64 transform transition-transform duration-300 ease-out animate-slideIn ${getNotificationStyles()}`}>
            <div className="flex items-center">
                {getNotificationIcon()}
                <span>{message}</span>
            </div>
            <button
                onClick={onClose}
                className="ml-4 text-gray-500 hover:text-gray-700"
            >
                <FaTimesCircle size={18} />
            </button>
        </div>
    );
};

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
            <div className="relative bg-white rounded-lg shadow-xl w-11/12 md:max-w-xl mx-auto p-6 transition-all transform scale-100 opacity-100 animate-fadeInUp">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FaTimesCircle size={24} />
                </button>

                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b border-blue-200 flex items-center">
                    <FaInfoCircle className="mr-3 text-blue-500" /> Chi Tiết Phiếu Tiếp Nhận
                </h2>

                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center">
                            <FaCar className="mr-2 text-blue-500" /> Thông tin khách hàng
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-blue-100">
                                <p className="text-sm text-gray-500">Họ và tên khách hàng</p>
                                <p className="font-medium text-gray-900">{taskDetails.customer}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-blue-100">
                                <p className="text-sm text-gray-500">Số điện thoại</p>
                                <p className="font-medium text-gray-900">{taskDetails.phone}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-green-700 mb-2 flex items-center">
                            <FaTools className="mr-2 text-green-500" /> Thông tin xe
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-3 rounded-lg border border-green-100">
                                <p className="text-sm text-gray-500">Biển số xe</p>
                                <p className="font-medium text-gray-900">{taskDetails.car}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-green-100">
                                <p className="text-sm text-gray-500">Hãng xe</p>
                                <p className="font-medium text-gray-900">{taskDetails.carBrand || 'Không có'}</p>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-green-100">
                                <p className="text-sm text-gray-500">Đời xe</p>
                                <p className="font-medium text-gray-900">{taskDetails.carModel || 'Không có'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-yellow-700 mb-2 flex items-center">
                            <FaClipboardList className="mr-2 text-yellow-500" /> Mô tả tình trạng ban đầu
                        </h3>
                        <div className="bg-white p-3 rounded-lg border border-yellow-100">
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
        { label: 'Tiếp nhận xe', value: 'Chờ xử lý', icon: FaClipboardList },
        { label: 'Kiểm tra & Báo giá', value: 'Đang làm', icon: FaSearch },
        { label: 'Sửa chữa', value: 'Đang làm', icon: FaTools },
        { label: 'Kiểm tra cuối cùng', value: 'Đang làm', icon: FaClock },
        { label: 'Hoàn thành', value: 'Hoàn thành', icon: FaCheckCircle }
    ];

    const handleUpdateClick = (newProgress) => {
        onUpdate(newProgress);
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative bg-white rounded-lg shadow-xl w-11/12 md:max-w-md mx-auto p-6 transition-all transform scale-100 opacity-100 animate-fadeInUp">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FaTimesCircle size={24} />
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-purple-200 flex items-center">
                    <FaSync className="mr-3 text-purple-500" /> Cập nhật tiến độ
                </h2>
                <hr className="mb-4" />

                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Cập nhật tiến độ cho xe <span className="font-semibold text-blue-600">{task.car}</span> (<span className="font-semibold text-green-600">{task.service}</span>)
                    </p>
                    <div className="mt-4">
                        <h3 className="text-md font-semibold mb-3 text-gray-700">Chọn trạng thái hiện tại:</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {progressSteps.map((step, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleUpdateClick(index)}
                                    className={`
                                        flex items-center p-3 rounded-lg text-left transition-colors duration-200 ease-in-out
                                        ${task.progress === index
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'}
                                    `}
                                >
                                    <span className="flex items-center">
                                      <step.icon className="mr-3" />
                                      <span>{step.label}</span>
                                    </span>
                                    {task.progress === index && (
                                        <span className="ml-auto text-sm font-medium">
                                            <FaCheckCircle className="text-white" />
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- New Pagination Component ---
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
            const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

            if (startPage > 1) {
                pages.push(1);
                if (startPage > 2) {
                    pages.push('...');
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pages.push('...');
                }
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <FaChevronLeft className="mr-2 h-4 w-4" /> Trang trước
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Trang sau <FaChevronRight className="ml-2 h-4 w-4" />
                </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Hiển thị <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> đến <span className="font-medium">{Math.min(currentPage * 10, totalPages * 8)}</span> của <span className="font-medium">{totalPages * 10}</span> kết quả
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50
                            ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            <span className="sr-only">Trang trước</span>
                            <FaChevronLeft className="h-5 w-5" />
                        </button>
                        {pageNumbers.map((page, index) => (
                            page === '...' ? (
                                <span key={index} className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => onPageChange(page)}
                                    className={`relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium
                                    ${currentPage === page
                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </button>
                            )
                        ))}
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50
                            ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            <span className="sr-only">Trang sau</span>
                            <FaChevronRight className="h-5 w-5" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};
// --- End New Pagination Component ---

const StaffDashboardPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [activeTab, setActiveTab] = useState('pending');

    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [taskToUpdate, setTaskToUpdate] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10; // Changed to 10 per your request

    const [staffData, setStaffData] = useState({
        pendingTasks: [],
        inProgressTasks: [],
        completedTasks: [],
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));

            const dummyData = [
                // 15 pending tasks
                { id: 1, car: '51G-123.45', service: 'Thay dầu động cơ', status: 'Chờ xử lý', customer: 'Nguyễn Văn A', phone: '0901234567', date: '16/09/2025', carBrand: 'Honda', carModel: 'City 2023', initialDescription: 'Xe có tiếng động lạ khi khởi động.', progress: 0 },
                { id: 2, car: '29A-678.90', service: 'Sửa hệ thống phanh', status: 'Chờ xử lý', customer: 'Trần Thị B', phone: '0912345678', date: '16/09/2025', carBrand: 'Toyota', carModel: 'Vios 2020', initialDescription: 'Phanh bị kêu, đạp phanh cảm thấy lỏng.', progress: 0 },
                { id: 3, car: '30K-111.22', service: 'Bảo dưỡng định kỳ', status: 'Chờ xử lý', customer: 'Lê Văn C', phone: '0923456789', date: '16/09/2025', carBrand: 'Hyundai', carModel: 'Accent 2021', initialDescription: 'Bảo dưỡng định kỳ 40.000km.', progress: 0 },
                { id: 4, car: '59B-001.01', service: 'Kiểm tra và sửa chữa điện', status: 'Chờ xử lý', customer: 'Phạm Thị D', phone: '0934567890', date: '16/09/2025', carBrand: 'Ford', carModel: 'Ranger', initialDescription: 'Hệ thống đèn pha bị chập chờn.', progress: 0 },
                { id: 5, car: '43A-987.65', service: 'Sơn lại thân xe', status: 'Chờ xử lý', customer: 'Hoàng Văn E', phone: '0945678901', date: '16/09/2025', carBrand: 'Mazda', carModel: 'CX-5', initialDescription: 'Xe bị va chạm nhẹ ở bên hông.', progress: 0 },
                { id: 6, car: '60C-222.33', service: 'Thay lốp và cân mâm bấm chì', status: 'Chờ xử lý', customer: 'Nguyễn Thị F', phone: '0956789012', date: '16/09/2025', carBrand: 'Kia', carModel: 'Seltos', initialDescription: 'Lốp xe bị mòn, cần thay lốp mới.', progress: 0 },
                { id: 7, car: '71G-456.78', service: 'Vệ sinh nội thất', status: 'Chờ xử lý', customer: 'Lê Văn G', phone: '0967890123', date: '16/09/2025', carBrand: 'VinFast', carModel: 'Fadil', initialDescription: 'Nội thất bị bám bụi nhiều.', progress: 0 },
                { id: 8, car: '37B-888.88', service: 'Kiểm tra hệ thống điều hòa', status: 'Chờ xử lý', customer: 'Bùi Thị H', phone: '0978901234', date: '16/09/2025', carBrand: 'Mercedes-Benz', carModel: 'C200', initialDescription: 'Điều hòa không lạnh, cần kiểm tra gas.', progress: 0 },
                { id: 9, car: '99A-123.45', service: 'Thay bình ắc quy', status: 'Chờ xử lý', customer: 'Đinh Văn I', phone: '0989012345', date: '16/09/2025', carBrand: 'BMW', carModel: 'X3', initialDescription: 'Bình ắc quy bị yếu, không đề nổ được.', progress: 0 },
                { id: 10, car: '12L-345.67', service: 'Sửa chữa đồng sơn', status: 'Chờ xử lý', customer: 'Trần Văn K', phone: '0990123456', date: '16/09/2025', carBrand: 'Lexus', carModel: 'RX350', initialDescription: 'Xe bị trầy xước nhiều.', progress: 0 },
                { id: 11, car: '86C-234.56', service: 'Bảo dưỡng gầm', status: 'Chờ xử lý', customer: 'Võ Thị L', phone: '0900123456', date: '16/09/2025', carBrand: 'Toyota', carModel: 'Fortuner', initialDescription: 'Gầm xe có tiếng kêu lạ.', progress: 0 },
                { id: 12, car: '29C-345.67', service: 'Thay bugi và lọc gió', status: 'Chờ xử lý', customer: 'Đặng Văn M', phone: '0911234567', date: '16/09/2025', carBrand: 'Suzuki', carModel: 'Swift', initialDescription: 'Bugi và lọc gió lâu ngày chưa thay.', progress: 0 },
                { id: 13, car: '77G-555.55', service: 'Kiểm tra hệ thống phanh', status: 'Chờ xử lý', customer: 'Phan Văn N', phone: '0922334455', date: '16/09/2025', carBrand: 'Honda', carModel: 'CR-V', initialDescription: 'Phanh sau bị kêu khi đi đường ướt.', progress: 0 },
                { id: 14, car: '55E-789.01', service: 'Vệ sinh khoang máy', status: 'Chờ xử lý', customer: 'Hồ Thị O', phone: '0933445566', date: '16/09/2025', carBrand: 'Mitsubishi', carModel: 'Outlander', initialDescription: 'Khoang máy bị bám bụi bẩn, cần vệ sinh.', progress: 0 },
                { id: 15, car: '34D-123.45', service: 'Sơn dặm lại cản trước', status: 'Chờ xử lý', customer: 'Ngô Văn P', phone: '0944556677', date: '16/09/2025', carBrand: 'Hyundai', carModel: 'Tucson', initialDescription: 'Cản trước bị trầy nhẹ, cần sơn dặm.', progress: 0 },

                // 15 in progress tasks
                { id: 16, car: '51C-678.90', service: 'Sửa chữa hệ thống treo', status: 'Đang làm', customer: 'Nguyễn Văn Q', phone: '0955667788', date: '15/09/2025', carBrand: 'Ford', carModel: 'Everest', initialDescription: 'Hệ thống treo phát ra tiếng kêu.', progress: 1 },
                { id: 17, car: '29C-111.22', service: 'Thay kính chắn gió', status: 'Đang làm', customer: 'Phạm Thị R', phone: '0966778899', date: '15/09/2025', carBrand: 'Toyota', carModel: 'Camry', initialDescription: 'Kính chắn gió bị nứt.', progress: 1 },
                { id: 18, car: '30F-999.88', service: 'Bảo dưỡng phanh đĩa', status: 'Đang làm', customer: 'Lê Văn S', phone: '0977889900', date: '15/09/2025', carBrand: 'Honda', carModel: 'Civic', initialDescription: 'Đạp phanh có cảm giác nặng.', progress: 2 },
                { id: 19, car: '59G-765.43', service: 'Sửa chữa hệ thống lái', status: 'Đang làm', customer: 'Hoàng Văn T', phone: '0988990011', date: '15/09/2025', carBrand: 'Kia', carModel: 'Sorento', initialDescription: 'Vô lăng bị lệch, lái không thẳng.', progress: 2 },
                { id: 20, car: '43H-234.56', service: 'Thay nhớt hộp số', status: 'Đang làm', customer: 'Nguyễn Thị U', phone: '0999001122', date: '15/09/2025', carBrand: 'Mazda', carModel: 'Mazda 6', initialDescription: 'Chưa thay nhớt hộp số sau 80.000km.', progress: 1 },
                { id: 21, car: '60I-456.78', service: 'Kiểm tra hệ thống đèn', status: 'Đang làm', customer: 'Trần Văn V', phone: '0900112233', date: '15/09/2025', carBrand: 'VinFast', carModel: 'Lux A', initialDescription: 'Đèn hậu bên trái không sáng.', progress: 3 },
                { id: 22, car: '71J-876.54', service: 'Sửa chữa hệ thống làm mát', status: 'Đang làm', customer: 'Lê Thị W', phone: '0911223344', date: '15/09/2025', carBrand: 'Toyota', carModel: 'Corolla Cross', initialDescription: 'Xe báo nhiệt độ cao.', progress: 2 },
                { id: 23, car: '37K-987.65', service: 'Đại tu động cơ', status: 'Đang làm', customer: 'Bùi Văn X', phone: '0922334455', date: '15/09/2025', carBrand: 'Mercedes-Benz', carModel: 'E300', initialDescription: 'Động cơ có tiếng gõ lớn, hao nhớt.', progress: 3 },
                { id: 24, car: '99L-345.67', service: 'Sơn lại toàn bộ xe', status: 'Đang làm', customer: 'Đinh Thị Y', phone: '0933445566', date: '15/09/2025', carBrand: 'Audi', carModel: 'Q5', initialDescription: 'Màu sơn bị phai và có nhiều vết xước.', progress: 1 },
                { id: 25, car: '12M-789.01', service: 'Kiểm tra và thay thế lọc nhiên liệu', status: 'Đang làm', customer: 'Trần Văn Z', phone: '0944556677', date: '15/09/2025', carBrand: 'Hyundai', carModel: 'Santa Fe', initialDescription: 'Xe bị giật khi tăng tốc.', progress: 1 },
                { id: 26, car: '86N-567.89', service: 'Bảo dưỡng hộp số tự động', status: 'Đang làm', customer: 'Võ Thị A1', phone: '0955667788', date: '15/09/2025', carBrand: 'BMW', carModel: 'X5', initialDescription: 'Hộp số chuyển số không mượt.', progress: 2 },
                { id: 27, car: '29O-234.56', service: 'Sửa chữa hệ thống âm thanh', status: 'Đang làm', customer: 'Đặng Văn B1', phone: '0966778899', date: '15/09/2025', carBrand: 'Lexus', carModel: 'RX300', initialDescription: 'Loa bị rè, hệ thống âm thanh bị lỗi.', progress: 3 },
                { id: 28, car: '77P-890.12', service: 'Vệ sinh kim phun, buồng đốt', status: 'Đang làm', customer: 'Nguyễn Văn C1', phone: '0977889900', date: '15/09/2025', carBrand: 'Nissan', carModel: 'X-Trail', initialDescription: 'Xe yếu, tốn xăng.', progress: 1 },
                { id: 29, car: '55Q-345.67', service: 'Thay thế lọc gió động cơ', status: 'Đang làm', customer: 'Hồ Thị D1', phone: '0988990011', date: '15/09/2025', carBrand: 'Subaru', carModel: 'Forester', initialDescription: 'Lọc gió quá bẩn, ảnh hưởng hiệu suất.', progress: 1 },
                { id: 30, car: '34R-567.89', service: 'Căn chỉnh thước lái', status: 'Đang làm', customer: 'Ngô Văn E1', phone: '0999001122', date: '15/09/2025', carBrand: 'Ford', carModel: 'Ranger Raptor', initialDescription: 'Xe bị nhao lái sang một bên.', progress: 2 },

                // 15 completed tasks
                { id: 31, car: '51S-000.11', service: 'Thay bugi và lọc gió', status: 'Hoàn thành', customer: 'Phạm Văn F1', phone: '0901234567', date: '14/09/2025', completedDate: '15/09/2025', carBrand: 'Honda', carModel: 'City 2023', initialDescription: 'Bugi và lọc gió lâu ngày chưa thay.', progress: 4 },
                { id: 32, car: '29T-111.22', service: 'Bảo dưỡng định kỳ', status: 'Hoàn thành', customer: 'Trần Thị G1', phone: '0912345678', date: '14/09/2025', completedDate: '15/09/2025', carBrand: 'Toyota', carModel: 'Vios 2020', initialDescription: 'Bảo dưỡng định kỳ 40.000km.', progress: 4 },
                { id: 33, car: '30U-222.33', service: 'Sửa chữa hệ thống phanh', status: 'Hoàn thành', customer: 'Lê Văn H1', phone: '0923456789', date: '14/09/2025', completedDate: '15/09/2025', carBrand: 'Hyundai', carModel: 'Accent 2021', initialDescription: 'Phanh bị kêu, đạp phanh lỏng.', progress: 4 },
                { id: 34, car: '59V-333.44', service: 'Kiểm tra và sửa chữa điện', status: 'Hoàn thành', customer: 'Phạm Thị I1', phone: '0934567890', date: '14/09/2025', completedDate: '15/09/2025', carBrand: 'Ford', carModel: 'Ranger', initialDescription: 'Hệ thống đèn pha bị chập chờn.', progress: 4 },
                { id: 35, car: '43W-444.55', service: 'Sơn lại thân xe', status: 'Hoàn thành', customer: 'Hoàng Văn K1', phone: '0945678901', date: '14/09/2025', completedDate: '15/09/2025', carBrand: 'Mazda', carModel: 'CX-5', initialDescription: 'Xe bị va chạm nhẹ ở bên hông.', progress: 4 },
                { id: 36, car: '60X-555.66', service: 'Thay lốp và cân mâm bấm chì', status: 'Hoàn thành', customer: 'Nguyễn Thị L1', phone: '0956789012', date: '14/09/2025', completedDate: '15/09/2025', carBrand: 'Kia', carModel: 'Seltos', initialDescription: 'Lốp xe bị mòn, cần thay lốp mới.', progress: 4 },
                { id: 37, car: '71Y-666.77', service: 'Vệ sinh nội thất', status: 'Hoàn thành', customer: 'Lê Văn M1', phone: '0967890123', date: '14/09/2025', completedDate: '15/09/2025', carBrand: 'VinFast', carModel: 'Fadil', initialDescription: 'Nội thất bị bám bụi nhiều.', progress: 4 },
                { id: 38, car: '37Z-777.88', service: 'Kiểm tra hệ thống điều hòa', status: 'Hoàn thành', customer: 'Bùi Thị N1', phone: '0978901234', date: '14/09/2025', completedDate: '15/09/2025', carBrand: 'Mercedes-Benz', carModel: 'C200', initialDescription: 'Điều hòa không lạnh, cần kiểm tra gas.', progress: 4 },
                { id: 39, car: '99AA-888.99', service: 'Thay bình ắc quy', status: 'Hoàn thành', customer: 'Đinh Văn O1', phone: '0989012345', date: '13/09/2025', completedDate: '14/09/2025', carBrand: 'BMW', carModel: 'X3', initialDescription: 'Bình ắc quy bị yếu, không đề nổ được.', progress: 4 },
                { id: 40, car: '12BB-999.00', service: 'Sửa chữa đồng sơn', status: 'Hoàn thành', customer: 'Trần Văn P1', phone: '0990123456', date: '13/09/2025', completedDate: '14/09/2025', carBrand: 'Lexus', carModel: 'RX350', initialDescription: 'Xe bị trầy xước nhiều.', progress: 4 },
                { id: 41, car: '86CC-000.11', service: 'Bảo dưỡng gầm', status: 'Hoàn thành', customer: 'Võ Thị Q1', phone: '0900123456', date: '13/09/2025', completedDate: '14/09/2025', carBrand: 'Toyota', carModel: 'Fortuner', initialDescription: 'Gầm xe có tiếng kêu lạ.', progress: 4 },
                { id: 42, car: '29DD-111.22', service: 'Kiểm tra và thay thế lọc gió', status: 'Hoàn thành', customer: 'Đặng Văn R1', phone: '0911234567', date: '12/09/2025', completedDate: '13/09/2025', carBrand: 'Suzuki', carModel: 'Swift', initialDescription: 'Lọc gió quá bẩn.', progress: 4 },
                { id: 43, car: '77EE-222.33', service: 'Thay dầu hộp số', status: 'Hoàn thành', customer: 'Nguyễn Văn S1', phone: '0922334455', date: '12/09/2025', completedDate: '13/09/2025', carBrand: 'Honda', carModel: 'CR-V', initialDescription: 'Chưa thay dầu hộp số.', progress: 4 },
                { id: 44, car: '55FF-333.44', service: 'Vệ sinh nội thất và ngoại thất', status: 'Hoàn thành', customer: 'Hồ Thị T1', phone: '0933445566', date: '12/09/2025', completedDate: '13/09/2025', carBrand: 'Mitsubishi', carModel: 'Outlander', initialDescription: 'Cần làm sạch toàn bộ xe.', progress: 4 },
                { id: 45, car: '34GG-444.55', service: 'Sửa chữa hệ thống âm thanh', status: 'Hoàn thành', customer: 'Ngô Văn U1', phone: '0944556677', date: '12/09/2025', completedDate: '13/09/2025', carBrand: 'Hyundai', carModel: 'Tucson', initialDescription: 'Âm thanh bị rè, không rõ tiếng.', progress: 4 }
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
        setCurrentPage(1);
        setTimeout(() => setIsLoading(false), 1000);
        showNotificationMessage('info', 'Đang tải lại dữ liệu...');
    };

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

    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const tasksToShow = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

    const handleCreateReceptionForm = () => {
        navigate('/staff/reception-form');
    };

    const handleOpenModal = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    const handleOpenUpdateModal = (e, task) => {
        e.stopPropagation();
        setTaskToUpdate(task);
        setShowUpdateModal(true);
    };

    const handleUpdateProgress = (newProgressIndex) => {
        const updatedTask = { ...taskToUpdate };
        const progressSteps = ['Chờ xử lý', 'Đang làm', 'Đang làm', 'Đang làm', 'Hoàn thành'];
        updatedTask.progress = newProgressIndex;
        updatedTask.status = progressSteps[newProgressIndex];

        setStaffData(prev => {
            let newPendingTasks = prev.pendingTasks.filter(t => t.id !== updatedTask.id);
            let newInProgressTasks = prev.inProgressTasks.filter(t => t.id !== updatedTask.id);
            let newCompletedTasks = prev.completedTasks.filter(t => t.id !== updatedTask.id);

            if (updatedTask.status === 'Chờ xử lý') {
                newPendingTasks = [...newPendingTasks, updatedTask];
            } else if (updatedTask.status === 'Đang làm') {
                newInProgressTasks = [...newInProgressTasks, updatedTask];
            } else if (updatedTask.status === 'Hoàn thành') {
                updatedTask.completedDate = new Date().toLocaleDateString('vi-VN');
                newCompletedTasks = [...newCompletedTasks, updatedTask];
            }

            return {
                pendingTasks: newPendingTasks.sort((a, b) => a.id - b.id),
                inProgressTasks: newInProgressTasks.sort((a, b) => a.id - b.id),
                completedTasks: newCompletedTasks.sort((a, b) => a.id - b.id)
            };
        });

        showNotificationMessage('success', `Đã cập nhật trạng thái cho xe ${updatedTask.car} thành "${updatedTask.status}"`);
        setShowUpdateModal(false);
        setTaskToUpdate(null);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        setSearchTerm('');
        setCurrentPage(1);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="container mx-auto px-4 py-6 flex-grow">
                <style>
                    {`
                    @keyframes slideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-slideIn {
                        animation: slideIn 0.3s ease-out forwards;
                    }
                    .animate-fadeInUp {
                        animation: fadeInUp 0.3s ease-out forwards;
                    }
                    `}
                </style>

                {showNotification && (
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        onClose={() => setShowNotification(false)}
                    />
                )}

                <Modal show={showModal} onClose={handleCloseModal} taskDetails={selectedTask} />
                <UpdateProgressModal
                    show={showUpdateModal}
                    onClose={() => setShowUpdateModal(false)}
                    task={taskToUpdate}
                    onUpdate={handleUpdateProgress}
                />

                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0 flex items-center">
                        <FaCar className="mr-3 text-blue-600" />
                        Tổng quan công việc
                    </h1>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Tìm kiếm biển số, dịch vụ..."
                                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        <button
                            onClick={handleRefresh}
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors transform hover:scale-105 active:scale-95"
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

                <div className="mb-6 border-b border-gray-200">
                    <nav className="flex -mb-px overflow-x-auto">
                        <button
                            onClick={() => handleTabChange('pending')}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex-shrink-0 ${activeTab === 'pending'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            <div className="flex items-center justify-center">
                                <FaThumbtack className="mr-2" />
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
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex-shrink-0 ${activeTab === 'in-progress'
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            <div className="flex items-center justify-center">
                                <FaHourglassHalf className="mr-2" />
                                <span>Nhiệm vụ đang làm</span>
                                {staffData.inProgressTasks.length > 0 && (
                                    <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                    {staffData.inProgressTasks.length}
                                    </span>
                                )}
                            </div>
                        </button>
                        <button
                            onClick={() => handleTabChange('completed')}
                            className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex-shrink-0 ${activeTab === 'completed'
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

                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tiếp nhận</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                Array.from({ length: tasksPerPage }).map((_, index) => (
                                    <SkeletonRow key={index} />
                                ))
                            ) : tasksToShow.length > 0 ? (
                                tasksToShow.map((task) => (
                                    <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.car}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.service}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.customer}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <StatusBadge status={task.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(task)}
                                                className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-gray-200 transition-colors"
                                                title="Xem chi tiết"
                                            >
                                                <FaEye />
                                            </button>
                                            <button
                                                onClick={(e) => handleOpenUpdateModal(e, task)}
                                                className="text-purple-600 hover:text-purple-900 p-2 rounded-full hover:bg-gray-200 transition-colors"
                                                title="Cập nhật tiến độ"
                                            >
                                                <FaSync />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center">
                                            <FaRegSmileBeam className="h-12 w-12 text-gray-400 mb-4" />
                                            <p className="font-semibold text-lg">Không tìm thấy công việc nào.</p>
                                            <p className="mt-1 text-sm text-gray-500">Hãy thử tìm kiếm với từ khóa khác hoặc tạo một phiếu tiếp nhận mới.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination component */}
                    {filteredTasks.length > tasksPerPage && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>

        </div>
    );
};

export default StaffDashboardPage;