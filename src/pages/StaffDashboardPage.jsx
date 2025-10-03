import React, { useState, useEffect, useMemo } from 'react';
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
    FaChevronRight,
    FaPlusCircle // Thêm icon cho chức năng tạo mới
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Định nghĩa màu sắc và hằng số
const PRIMARY_COLOR = 'indigo'; // Tailwind: indigo-600
const PRIMARY_BG = 'indigo-50'; // Tailwind: indigo-50
const BORDER_COLOR = 'indigo-200'; // Tailwind: indigo-200

// --- Component SkeletonRow (Giữ nguyên) ---
const SkeletonRow = () => (
    <tr className="animate-pulse border-b border-gray-100">
        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded"></div></td>
        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded"></div></td>
        <td className="px-4 py-4">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-200 h-6 w-24"></div>
        </td>
        <td className="px-4 py-4"><div className="h-4 bg-gray-200 rounded"></div></td>
        <td className="px-4 py-4">
            <div className="h-8 bg-gray-200 rounded w-20"></div>
        </td>
    </tr>
);

// --- Component Notification (Điều chỉnh màu) ---
const Notification = ({ type, message, onClose }) => {
    const getNotificationStyles = () => {
        switch(type) {
            case 'success':
                return 'bg-green-100 text-green-800 border-l-4 border-green-500';
            case 'error':
                return 'bg-red-100 text-red-800 border-l-4 border-red-500';
            case 'info':
                // Sử dụng màu chủ đạo mới
                return `bg-${PRIMARY_BG} text-${PRIMARY_COLOR}-800 border-l-4 border-${PRIMARY_COLOR}-500`;
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
                return <FaInfoCircle className={`text-${PRIMARY_COLOR}-500 mr-3`} size={20} />;
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

// --- Component StatusBadge (Điều chỉnh màu sắc tông trầm hơn) ---
const StatusBadge = ({ status }) => {
    const getStatusStyles = () => {
        switch(status) {
            case 'Chờ xử lý':
                return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
            case 'Đang làm':
                // Thay thế bằng tông màu xanh chủ đạo
                return `bg-${PRIMARY_BG} text-${PRIMARY_COLOR}-700 border border-${BORDER_COLOR}`;
            case 'Hoàn thành':
                return 'bg-green-100 text-green-700 border border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border border-gray-200';
        }
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusStyles()}`}>
            {status}
        </span>
    );
};

// --- Component Modal Chi Tiết (Điều chỉnh màu và bố cục) ---
const Modal = ({ show, onClose, taskDetails }) => {
    if (!show || !taskDetails) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full z-50 flex justify-center items-center backdrop-blur-sm">
            <div className="relative bg-white rounded-xl shadow-2xl w-11/12 md:max-w-xl mx-auto p-6 transition-all transform scale-100 opacity-100 animate-fadeInUp border-t-8 border-indigo-600">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <FaTimesCircle size={24} />
                </button>

                <h2 className={`text-2xl font-extrabold text-${PRIMARY_COLOR}-700 mb-5 pb-3 border-b border-${BORDER_COLOR} flex items-center`}>
                    <FaInfoCircle className={`mr-3 text-${PRIMARY_COLOR}-500`} /> Chi Tiết Phiếu Tiếp Nhận
                </h2>

                <div className="space-y-5">
                    {/* Thẻ Thông tin khách hàng */}
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-indigo-100 hover:shadow-xl transition-shadow duration-300">
                        <h3 className={`text-lg font-semibold text-${PRIMARY_COLOR}-600 mb-3 flex items-center border-b pb-2 border-indigo-50`}>
                            <FaCar className={`mr-2 text-${PRIMARY_COLOR}-500`} /> Thông tin khách hàng
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-2 border-l-4 border-gray-200">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Họ và tên</p>
                                <p className="font-bold text-gray-900">{taskDetails.customer}</p>
                            </div>
                            <div className="p-2 border-l-4 border-gray-200">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Số điện thoại</p>
                                <p className="font-bold text-gray-900">{taskDetails.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Thẻ Thông tin xe */}
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-lg font-semibold text-green-600 mb-3 flex items-center border-b pb-2 border-green-50">
                            <FaTools className="mr-2 text-green-500" /> Thông tin xe
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="p-2 border-l-4 border-gray-200">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Biển số xe</p>
                                <p className="font-bold text-gray-900">{taskDetails.car}</p>
                            </div>
                            <div className="p-2 border-l-4 border-gray-200">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Hãng xe</p>
                                <p className="font-bold text-gray-900">{taskDetails.carBrand || 'Không có'}</p>
                            </div>
                            <div className="p-2 border-l-4 border-gray-200">
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Đời xe</p>
                                <p className="font-bold text-gray-900">{taskDetails.carModel || 'Không có'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Thẻ Mô tả tình trạng */}
                    <div className="bg-white p-4 rounded-xl shadow-lg border border-yellow-100 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-lg font-semibold text-yellow-600 mb-3 flex items-center border-b pb-2 border-yellow-50">
                            <FaClipboardList className="mr-2 text-yellow-500" /> Mô tả tình trạng ban đầu
                        </h3>
                        <div className="p-2 bg-yellow-50 rounded-lg">
                            <p className="font-medium text-gray-800 leading-relaxed italic">{taskDetails.initialDescription || 'Không có mô tả'}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-200`}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Component Modal Cập Nhật Tiến Độ (Điều chỉnh màu) ---
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
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full z-50 flex justify-center items-center backdrop-blur-sm">
            <div className="relative bg-white rounded-xl shadow-2xl w-11/12 md:max-w-md mx-auto p-6 transition-all transform scale-100 opacity-100 animate-fadeInUp border-t-8 border-indigo-600">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
                >
                    <FaTimesCircle size={24} />
                </button>
                <h2 className={`text-2xl font-extrabold text-${PRIMARY_COLOR}-700 mb-4 pb-2 border-b border-${BORDER_COLOR} flex items-center`}>
                    <FaSync className={`mr-3 text-${PRIMARY_COLOR}-500`} /> Cập nhật tiến độ
                </h2>

                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Cập nhật tiến độ cho xe <span className={`font-semibold text-${PRIMARY_COLOR}-600`}>{task.car}</span> (<span className="font-semibold text-green-600">{task.service}</span>)
                    </p>
                    <div className="mt-4">
                        <h3 className="text-md font-bold mb-3 text-gray-700">Chọn trạng thái hiện tại:</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {progressSteps.map((step, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleUpdateClick(index)}
                                    className={`
                                        flex items-center p-4 rounded-xl text-left transition-all duration-300 ease-in-out border
                                        ${task.progress === index
                                        ? `bg-gradient-to-r from-${PRIMARY_COLOR}-500 to-${PRIMARY_COLOR}-600 text-white shadow-lg transform scale-[1.02] border-${PRIMARY_COLOR}-700`
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md border-gray-200'}
                                    `}
                                >
                                    <span className="flex items-center font-semibold">
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
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors border border-gray-200"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Component Pagination (Điều chỉnh màu) ---
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
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-4 sm:px-6 rounded-b-xl shadow-lg">
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
                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-lg" aria-label="Pagination">
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
                                    className={`relative inline-flex items-center border border-gray-300 px-4 py-2 text-sm font-medium transition-colors
                                    ${currentPage === page
                                        ? `z-10 bg-${PRIMARY_BG} border-${PRIMARY_COLOR}-500 text-${PRIMARY_COLOR}-600 font-bold`
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

// --- Component Dashboard (Chính) ---
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
    const tasksPerPage = 10;

    const [staffData, setStaffData] = useState({
        pendingTasks: [],
        inProgressTasks: [],
        completedTasks: [],
    });

    // Dummy data fetching (Giữ nguyên logic này)
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
            case 'inProgress':
                return staffData.inProgressTasks;
            case 'completed':
                return staffData.completedTasks;
            default:
                return [];
        }
    };

    const handleViewDetails = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleOpenUpdateModal = (task) => {
        setTaskToUpdate(task);
        setShowUpdateModal(true);
    };

    const handleUpdateProgress = (newProgressIndex) => {
        // Cần thêm logic cập nhật trạng thái/tiến độ thực tế ở đây
        // Trong ví dụ này, ta chỉ giả lập cập nhật và thông báo
        if (taskToUpdate) {
            let newStatus;
            let newProgressLabel;
            if (newProgressIndex === 0) {
                newStatus = 'Chờ xử lý';
                newProgressLabel = 'Tiếp nhận xe';
            } else if (newProgressIndex >= 1 && newProgressIndex <= 3) {
                newStatus = 'Đang làm';
                newProgressLabel = ['Kiểm tra & Báo giá', 'Sửa chữa', 'Kiểm tra cuối cùng'][newProgressIndex - 1];
            } else {
                newStatus = 'Hoàn thành';
                newProgressLabel = 'Hoàn thành';
            }

            // Giả lập cập nhật dữ liệu (cần được thay bằng API call thực tế)
            setStaffData(prevData => {
                const updatedTask = {
                    ...taskToUpdate,
                    status: newStatus,
                    progress: newProgressIndex,
                    completedDate: newProgressIndex === 4 ? new Date().toLocaleDateString('vi-VN') : undefined,
                };

                const filterAndMap = (tasks) => tasks.filter(t => t.id !== taskToUpdate.id).map(t => ({...t}));

                let newPending = filterAndMap(prevData.pendingTasks);
                let newInProgress = filterAndMap(prevData.inProgressTasks);
                let newCompleted = filterAndMap(prevData.completedTasks);

                if (newStatus === 'Chờ xử lý') {
                    newPending.push(updatedTask);
                } else if (newStatus === 'Đang làm') {
                    newInProgress.push(updatedTask);
                } else if (newStatus === 'Hoàn thành') {
                    newCompleted.push(updatedTask);
                }

                // Sắp xếp lại
                newPending.sort((a, b) => b.id - a.id);
                newInProgress.sort((a, b) => b.id - a.id);
                newCompleted.sort((a, b) => b.id - a.id);

                return {
                    pendingTasks: newPending,
                    inProgressTasks: newInProgress,
                    completedTasks: newCompleted,
                };
            });

            showNotificationMessage('success', `Cập nhật tiến độ thành công: ${taskToUpdate.car} -> ${newProgressLabel}`);
            setShowUpdateModal(false);
            setTaskToUpdate(null);
        }
    };

    const filteredTasks = useMemo(() => {
        const tasks = getTasksByTab();
        if (!searchTerm) return tasks;
        return tasks.filter(task =>
            task.car.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.service.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [staffData, activeTab, searchTerm]);

    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
    const startIndex = (currentPage - 1) * tasksPerPage;
    const currentTasks = filteredTasks.slice(startIndex, startIndex + tasksPerPage);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const MetricCard = ({ title, count, icon: Icon, color, isActive, onClick }) => (
        <div
            onClick={onClick}
            className={`flex flex-col p-5 rounded-xl shadow-lg cursor-pointer transition-all duration-300
            ${isActive ? `bg-white border-2 border-${PRIMARY_COLOR}-500 transform scale-[1.03] shadow-2xl` : `bg-white hover:shadow-xl border border-gray-100 hover:border-gray-300`}
            `}
        >
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-500 uppercase">{title}</p>
                <Icon className={`text-2xl text-${color}-500`} />
            </div>
            <p className="text-4xl font-extrabold text-gray-800 mt-2">{count}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <h1 className={`text-3xl md:text-4xl font-extrabold text-${PRIMARY_COLOR}-800 mb-2 border-b-4 border-${PRIMARY_COLOR}-100 pb-2 flex items-center`}>
                <FaTools className={`mr-3 text-${PRIMARY_COLOR}-500`} /> Bảng Điều Khiển Nhân Viên
            </h1>
            <p className="text-gray-600 mb-6">Quản lý các phiếu tiếp nhận và theo dõi tiến độ công việc.</p>

            {/* Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <MetricCard
                    title="Chờ xử lý"
                    count={staffData.pendingTasks.length}
                    icon={FaHourglassHalf}
                    color="yellow"
                    isActive={activeTab === 'pending'}
                    onClick={() => { setActiveTab('pending'); setCurrentPage(1); }}
                />
                <MetricCard
                    title="Đang tiến hành"
                    count={staffData.inProgressTasks.length}
                    icon={FaThumbtack}
                    color={PRIMARY_COLOR} // Sử dụng màu chủ đạo
                    isActive={activeTab === 'inProgress'}
                    onClick={() => { setActiveTab('inProgress'); setCurrentPage(1); }}
                />
                <MetricCard
                    title="Đã hoàn thành"
                    count={staffData.completedTasks.length}
                    icon={FaRegSmileBeam}
                    color="green"
                    isActive={activeTab === 'completed'}
                    onClick={() => { setActiveTab('completed'); setCurrentPage(1); }}
                />
            </div>

            {/* Main Content Card */}
            <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
                {/* Header & Actions */}
                <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex space-x-3 w-full md:w-auto">
                        <button
                            onClick={handleRefresh}
                            className={`p-3 bg-white text-${PRIMARY_COLOR}-600 rounded-full shadow-md hover:bg-${PRIMARY_BG} transition-colors border border-${PRIMARY_COLOR}-300`}
                        >
                            <FaSync className={isLoading ? 'animate-spin' : ''} />
                        </button>
                        <button
                            onClick={() => navigate('/new-receipt')} // Thay đổi route nếu cần
                            className={`flex items-center px-4 py-2 bg-gradient-to-r from-${PRIMARY_COLOR}-500 to-${PRIMARY_COLOR}-600 text-white rounded-lg font-semibold shadow-lg hover:from-${PRIMARY_COLOR}-600 hover:to-${PRIMARY_COLOR}-700 transition-all`}
                        >
                            <FaPlusCircle className="mr-2" /> Tạo Phiếu Mới
                        </button>
                    </div>

                    <div className="relative w-full md:w-80">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm Biển số, Khách hàng..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-${PRIMARY_COLOR}-500 focus:border-${PRIMARY_COLOR}-500 transition-shadow"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className={`bg-${PRIMARY_BG} text-${PRIMARY_COLOR}-700`}>
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Mã số</th>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Biển số</th>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Dịch vụ</th>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Ngày tiếp nhận</th>
                            <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Trạng thái</th>
                            <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                        {isLoading ? (
                            Array.from({ length: tasksPerPage }).map((_, index) => <SkeletonRow key={index} />)
                        ) : currentTasks.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-4 py-10 text-center text-gray-500 italic">
                                    Không tìm thấy công việc nào phù hợp với trạng thái hoặc từ khóa tìm kiếm.
                                </td>
                            </tr>
                        ) : (
                            currentTasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">#{task.id}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-${PRIMARY_COLOR}-600 font-medium">{task.car}</td>
                                    <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{task.service}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{task.date}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <StatusBadge status={task.status} />
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => handleViewDetails(task)}
                                                title="Xem chi tiết"
                                                className={`p-2 rounded-full text-${PRIMARY_COLOR}-600 hover:bg-${PRIMARY_COLOR}-100 transition-colors`}
                                            >
                                                <FaEye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleOpenUpdateModal(task)}
                                                title="Cập nhật tiến độ"
                                                className={`p-2 rounded-full text-green-600 hover:bg-green-100 transition-colors`}
                                                disabled={task.status === 'Hoàn thành'}
                                            >
                                                <FaSync size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            {/* Modals and Notification */}
            <Modal show={showModal} onClose={() => setShowModal(false)} taskDetails={selectedTask} />
            <UpdateProgressModal
                show={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                task={taskToUpdate}
                onUpdate={handleUpdateProgress}
            />
            {showNotification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setShowNotification(false)}
                />
            )}
        </div>
    );
};

export default StaffDashboardPage;