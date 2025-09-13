// src/pages/ServiceReceptionPage.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { FaUser, FaCar, FaPhone, FaMapMarkerAlt, FaRegCalendarAlt } from 'react-icons/fa';

// Dữ liệu giả định cho "Hiệu xe"
const carBrands = ['Toyota', 'Honda', 'Suzuki', 'Ford', 'BMW', 'Mercedes', 'Audi', 'VinFast', 'Khác'];

const ServiceReceptionPage = () => {
    const [formData, setFormData] = useState({
        ownerName: '',
        licensePlate: '',
        carBrand: '',
        address: '',
        phone: '',
        receptionDate: new Date().toISOString().substring(0, 10), // Ngày hiện tại
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Xử lý dữ liệu form tại đây (gửi lên API, lưu vào database)
        console.log('Thông tin xe đã được tiếp nhận:', formData);
        alert('Tiếp nhận xe thành công!');
        // Reset form
        setFormData({
            ownerName: '',
            licensePlate: '',
            carBrand: '',
            address: '',
            phone: '',
            receptionDate: new Date().toISOString().substring(0, 10),
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-6 md:p-8 flex-1">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Tiếp Nhận Bảo Trì Xe</h1>

                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Input: Tên chủ xe */}
                            <div className="flex items-center space-x-4">
                                <FaUser className="text-gray-500" size={20} />
                                <div className="flex-1">
                                    <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">Tên chủ xe</label>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        id="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Input: Biển số */}
                            <div className="flex items-center space-x-4">
                                <FaCar className="text-gray-500" size={20} />
                                <div className="flex-1">
                                    <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">Biển số</label>
                                    <input
                                        type="text"
                                        name="licensePlate"
                                        id="licensePlate"
                                        value={formData.licensePlate}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Select: Hiệu xe */}
                            <div className="flex items-center space-x-4">
                                <FaCar className="text-gray-500" size={20} />
                                <div className="flex-1">
                                    <label htmlFor="carBrand" className="block text-sm font-medium text-gray-700">Hiệu xe</label>
                                    <select
                                        name="carBrand"
                                        id="carBrand"
                                        value={formData.carBrand}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">-- Chọn hiệu xe --</option>
                                        {carBrands.map((brand, index) => (
                                            <option key={index} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Input: Địa chỉ */}
                            <div className="flex items-center space-x-4">
                                <FaMapMarkerAlt className="text-gray-500" size={20} />
                                <div className="flex-1">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Input: Điện thoại */}
                            <div className="flex items-center space-x-4">
                                <FaPhone className="text-gray-500" size={20} />
                                <div className="flex-1">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Điện thoại</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Input: Ngày tiếp nhận */}
                            <div className="flex items-center space-x-4">
                                <FaRegCalendarAlt className="text-gray-500" size={20} />
                                <div className="flex-1">
                                    <label htmlFor="receptionDate" className="block text-sm font-medium text-gray-700">Ngày tiếp nhận</label>
                                    <input
                                        type="date"
                                        name="receptionDate"
                                        id="receptionDate"
                                        value={formData.receptionDate}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="text-center">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Tiếp Nhận Xe
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ServiceReceptionPage;