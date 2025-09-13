import React, { useState } from 'react';
import { FaPlus, FaCar, FaUser, FaClipboardList, FaFileInvoiceDollar, FaRegCalendarAlt } from 'react-icons/fa';

const ServiceReceptionPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        licensePlate: '',
        customerName: '',
        phoneNumber: '',
        serviceType: 'Bảo dưỡng định kỳ',
        notes: ''
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Thông tin tiếp nhận xe:', formData);
        alert('Tiếp nhận xe thành công!');
        // Reset form và đóng form
        setFormData({
            licensePlate: '',
            customerName: '',
            phoneNumber: '',
            serviceType: 'Bảo dưỡng định kỳ',
            notes: ''
        });
        setIsFormOpen(false);
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Tiếp nhận xe</h1>
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold flex items-center shadow-lg hover:bg-blue-700 transition"
                >
                    <FaPlus className="mr-2" />
                    Thêm xe mới
                </button>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Thông tin tiếp nhận</h2>
                            <button
                                onClick={() => setIsFormOpen(false)}
                                className="text-gray-500 hover:text-gray-800 text-2xl"
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1 flex items-center">
                                    <FaCar className="mr-2 text-blue-500" />
                                    Biển số xe:
                                </label>
                                <input
                                    type="text"
                                    name="licensePlate"
                                    value={formData.licensePlate}
                                    onChange={handleFormChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1 flex items-center">
                                    <FaUser className="mr-2 text-blue-500" />
                                    Tên khách hàng:
                                </label>
                                <input
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleFormChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1 flex items-center">
                                    <FaClipboardList className="mr-2 text-blue-500" />
                                    Loại dịch vụ:
                                </label>
                                <select
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleFormChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option>Bảo dưỡng định kỳ</option>
                                    <option>Sửa chữa chung</option>
                                    <option>Sửa chữa đồng sơn</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-1 flex items-center">
                                    <FaFileInvoiceDollar className="mr-2 text-blue-500" />
                                    Ghi chú ban đầu:
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleFormChange}
                                    rows="4"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-100 transition"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
                                >
                                    Lưu thông tin
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ServiceReceptionPage;