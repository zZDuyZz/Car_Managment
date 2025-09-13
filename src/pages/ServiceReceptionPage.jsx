import React, { useState } from 'react';
import { FaPlus, FaCar, FaUser, FaClipboardList, FaFileInvoiceDollar, FaRegCalendarAlt } from 'react-icons/fa';

const ServiceReceptionPage = () => {
    // Chúng ta không cần state để mở form vì form sẽ được mở từ một trang khác.
    // const [isFormOpen, setIsFormOpen] = useState(false);
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
        //setIsFormOpen(false);
    };

    return (
        <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý tiếp nhận xe</h1>
            {/* Đoạn code của nút "Thêm xe mới" đã được xóa theo yêu cầu.
                Nút này bị thừa vì chúng ta đã có một liên kết trên Sidebar
                và một nút trên Dashboard để dẫn đến form tạo phiếu.
            */}

            {/* Đây là nơi hiển thị danh sách các xe đã tiếp nhận */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Danh sách xe đang chờ</h2>
                <div className="overflow-x-auto">
                    {/* Bảng dữ liệu sẽ được hiển thị ở đây */}
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biển số</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại dịch vụ</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tiếp nhận</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {/* Dữ liệu mẫu */}
                        <tr>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">51A-123.45</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">Nguyễn Văn A</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">Bảo dưỡng định kỳ</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-800">12/10/2023</td>
                            <td className="py-3 px-4 whitespace-nowrap text-sm">
                                <button className="text-blue-600 hover:text-blue-900">Xem chi tiết</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal form đã được di chuyển sang một component riêng biệt (ReceptionForm.jsx).
                Đoạn code dưới đây không còn cần thiết ở đây nữa.
            */}
            {/*
            {isFormOpen && (
                ...
            )}
            */}
        </>
    );
};

export default ServiceReceptionPage;
