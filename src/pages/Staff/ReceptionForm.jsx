import React, { useState } from 'react';
import { FaFileInvoice, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ReceptionForm = () => {
    // useNavigate để điều hướng
    const navigate = useNavigate();

    // State để lưu trữ dữ liệu form
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        licensePlate: '',
        vehicleBrand: '',
        vehicleModel: '',
        receptionDate: new Date().toISOString().slice(0, 10),
        initialDescription: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Logic để xử lý form khi submit, ví dụ: gửi lên backend
        console.log('Form Submitted:', formData);

        // Sau khi gửi form, quay trở lại trang dashboard
        navigate('/staff/dashboard');
    };

    return (
        <div className="bg-gray-100 p-8 min-h-screen">
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
                            <label className="text-gray-700 font-medium mb-2">Mô tả tình trạng ban đầu</label>
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
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Tạo Phiếu
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReceptionForm;
