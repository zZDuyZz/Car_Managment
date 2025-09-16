import React, { useState } from 'react';
import {
    FaFileInvoice,
    FaArrowLeft,
    FaCheckCircle,
    FaInfoCircle,
    FaExclamationCircle
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Constants for vehicle brands
const vehicleBrands = [
    'Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Hyundai', 'Kia',
    'Mazda', 'Mitsubishi', 'Nissan', 'Suzuki', 'VinFast', 'Vinaxuki', 'Lexus',
    'Porsche', 'Bentley', 'Ferrari', 'Lamborghini', 'Rolls-Royce', 'Tesla'
];

// ✅ Validation function
const validateStep = (stepId, data) => {
    const errors = {};

    if (stepId === 'customer') {
        if (!data.customerName.trim()) {
            errors.customerName = 'Vui lòng nhập họ tên';
        }
        if (!data.customerPhone.trim()) {
            errors.customerPhone = 'Vui lòng nhập số điện thoại';
        } else if (!/^(\+?84|0)[1-9][0-9]{8}$/.test(data.customerPhone)) {
            errors.customerPhone = 'Số điện thoại không hợp lệ';
        }
        if (data.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customerEmail)) {
            errors.customerEmail = 'Email không hợp lệ';
        }
    }

    else if (stepId === 'vehicle') {
        if (!data.licensePlate.trim()) {
            errors.licensePlate = 'Vui lòng nhập biển số xe';
        }
        if (!data.vehicleBrand.trim()) {
            errors.vehicleBrand = 'Vui lòng chọn hãng xe';
        }
        if (!data.vehicleModel.trim()) {
            errors.vehicleModel = 'Vui lòng nhập dòng xe';
        }
        if (data.odometer && isNaN(Number(data.odometer))) {
            errors.odometer = 'Số km phải là số';
        }
    }

    else if (stepId === 'service') {
        if (!data.serviceType) {
            errors.serviceType = 'Vui lòng chọn loại dịch vụ';
        }
        if (!data.initialDescription.trim()) {
            errors.initialDescription = 'Vui lòng mô tả tình trạng ban đầu';
        }
    }

    return errors;
};

// ✅ Notification component (chỉ 1 lần)
const Notification = ({ type, message, onClose }) => (
    <div
        className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center justify-between min-w-64 ${
            type === 'success'
                ? 'bg-green-100 text-green-800'
                : type === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
        }`}
    >
        <div className="flex items-center">
            {type === 'success' ? (
                <FaCheckCircle className="mr-2 text-green-500" />
            ) : type === 'error' ? (
                <FaExclamationCircle className="mr-2 text-red-500" />
            ) : (
                <FaInfoCircle className="mr-2 text-blue-500" />
            )}
            <span>{message}</span>
        </div>
        <button
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700"
        >
            &times;
        </button>
    </div>
);

const ReceptionForm = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [showNotification, setShowNotification] = useState(false);
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data state
    const [formData, setFormData] = useState({
        // Customer info
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerAddress: '',

        // Vehicle info
        licensePlate: '',
        vehicleBrand: '',
        vehicleModel: '',
        vehicleYear: new Date().getFullYear(),
        odometer: '',

        // Service info
        serviceType: '',
        serviceDescription: '',
        initialDescription: '',

        // System
        receptionDate: new Date().toISOString().slice(0, 10),
        expectedCompletion: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Show notification
    const showNotificationMessage = (type, message) => {
        setNotification({ type, message });
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log('Form Submitted:', formData);
            showNotificationMessage('success', 'Đã tạo phiếu tiếp nhận thành công!');

            setTimeout(() => {
                navigate('/staff/dashboard');
            }, 1500);
        } catch (error) {
            console.error('Error submitting form:', error);
            showNotificationMessage('error', 'Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-100 p-8 min-h-screen">
            {showNotification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setShowNotification(false)}
                />
            )}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <FaFileInvoice className="mr-3 text-blue-500" /> Phiếu Tiếp nhận xe
                        </h1>
                        <button
                            onClick={() => navigate('/staff/dashboard')}
                            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-full font-semibold hover:bg-gray-400 transition flex items-center"
                        >
                            <FaArrowLeft className="mr-2" /> Quay lại
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Thông tin khách hàng */}
                        <h2 className="text-xl font-semibold text-gray-700">Thông tin khách hàng</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="text"
                                name="customerName"
                                placeholder="Họ và tên khách hàng"
                                value={formData.customerName}
                                onChange={handleChange}
                                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="tel"
                                name="customerPhone"
                                placeholder="Số điện thoại"
                                value={formData.customerPhone}
                                onChange={handleChange}
                                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Thông tin xe */}
                        <h2 className="text-xl font-semibold text-gray-700 pt-4">Thông tin xe</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <input
                                type="text"
                                name="licensePlate"
                                placeholder="Biển số xe"
                                value={formData.licensePlate}
                                onChange={handleChange}
                                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="text"
                                name="vehicleBrand"
                                placeholder="Hãng xe"
                                value={formData.vehicleBrand}
                                onChange={handleChange}
                                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <input
                                type="text"
                                name="vehicleModel"
                                placeholder="Đời xe"
                                value={formData.vehicleModel}
                                onChange={handleChange}
                                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Mô tả ban đầu */}
                        <div className="flex flex-col">
                            <label className="text-gray-700 font-medium mb-2">
                                Mô tả tình trạng ban đầu
                            </label>
                            <textarea
                                name="initialDescription"
                                placeholder="Ghi chú các vấn đề ban đầu của xe..."
                                rows="4"
                                value={formData.initialDescription}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Tạo Phiếu'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReceptionForm;
