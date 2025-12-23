import React, { useState, useEffect } from 'react';

const ReceptionRegulations = () => {
    // State lưu trữ dữ liệu quy định
    const [regulations, setRegulations] = useState({
        processingTimes: {
            receiveCar: 1,
            createRepairForm: 1,
            searchCar: 0,
            createPaymentForm: 1,
            monthlyReport: 5
        },
        minCarPrice: 100000000,
        maxCarPrice: 10000000000,
        maxCarsPerCustomer: 5,
        minCustomerAge: 18,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // Load dữ liệu từ localStorage khi component được mount
    useEffect(() => {
        const savedRegulations = JSON.parse(localStorage.getItem('receptionRegulations'));
        if (savedRegulations) {
            setRegulations(savedRegulations);
        } else {
            // Dữ liệu mặc định
            const defaultRegulations = {
                processingTimes: {
                    receiveCar: 1,
                    createRepairForm: 1,
                    searchCar: 0,
                    createPaymentForm: 1,
                    monthlyReport: 5
                },
                minCarPrice: 100000000,
                maxCarPrice: 10000000000,
                maxCarsPerCustomer: 5,
                minCustomerAge: 18,
            };
            setRegulations(defaultRegulations);
            localStorage.setItem('receptionRegulations', JSON.stringify(defaultRegulations));
        }
    }, []);

    // Hàm xử lý khi thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Xử lý riêng cho các trường trong processingTimes
        if (name.startsWith('processingTimes.')) {
            const timeKey = name.split('.')[1];
            setRegulations(prev => ({
                ...prev,
                processingTimes: {
                    ...prev.processingTimes,
                    [timeKey]: parseFloat(value) >= 0 ? parseFloat(value) : 0 // Đảm bảo không âm
                }
            }));
        } else {
            // Xử lý các trường thông thường
            setRegulations(prev => ({
                ...prev,
                [name]: name.includes('Price') ? (parseFloat(value) || 0) : (parseInt(value) || 0)
            }));
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            localStorage.setItem('receptionRegulations', JSON.stringify(regulations));
            setSuccessMessage('Đã cập nhật quy định thành công!');
            setIsEditing(false);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error('Lỗi khi lưu quy định:', error);
            setSuccessMessage('Có lỗi xảy ra khi lưu quy định');
        }
    };

    // Hàm hủy bỏ chỉnh sửa - load lại dữ liệu từ localStorage
    const handleCancel = () => {
        setIsEditing(false);
        const savedRegulations = JSON.parse(localStorage.getItem('receptionRegulations'));
        if (savedRegulations) setRegulations(savedRegulations);
    };

    return (
        <div className="space-y-6 p-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Quy định tiếp nhận</h1>
                {!isEditing ? (
                    <button
                        onClick={handleEditClick}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition duration-150"
                    >
                        Chỉnh sửa
                    </button>
                ) : (
                    <div className="space-x-2">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-150"
                        >
                            Hủy
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow transition duration-150"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                )}
            </div>

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative animate-fade-in" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Tốc độ xử lý</h2>

                    {/* Bảng tốc độ xử lý */}
                    <div className="overflow-x-auto mb-8">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                                    Nghiệp vụ
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">
                                    Thời gian quy định
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">

                            {/* 1. Tiếp nhận xe */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tiếp nhận xe</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative rounded-md shadow-sm w-48">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="number"
                                                    name="processingTimes.receiveCar"
                                                    value={regulations.processingTimes.receiveCar}
                                                    onChange={handleInputChange}
                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-16 sm:text-sm border-gray-300 rounded-md py-2 border"
                                                    min="0" step="0.5"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">giây/xe</span>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="px-3 py-1.5 bg-gray-100 rounded text-gray-800">
                          {regulations.processingTimes.receiveCar} giây/xe
                        </span>
                                        )}
                                    </div>
                                </td>
                            </tr>

                            {/* 2. Lập phiếu sửa chữa */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lập phiếu sửa chữa</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative rounded-md shadow-sm w-48">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="number"
                                                    name="processingTimes.createRepairForm"
                                                    value={regulations.processingTimes.createRepairForm}
                                                    onChange={handleInputChange}
                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-20 sm:text-sm border-gray-300 rounded-md py-2 border"
                                                    min="0" step="0.5"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">giây/phiếu</span>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="px-3 py-1.5 bg-gray-100 rounded text-gray-800">
                          {regulations.processingTimes.createRepairForm} giây/phiếu
                        </span>
                                        )}
                                    </div>
                                </td>
                            </tr>

                            {/* 3. Tra cứu xe (Đã cập nhật logic edit) */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tra cứu xe</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative rounded-md shadow-sm w-48">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="number"
                                                    name="processingTimes.searchCar"
                                                    value={regulations.processingTimes.searchCar}
                                                    onChange={handleInputChange}
                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-16 sm:text-sm border-gray-300 rounded-md py-2 border"
                                                    min="0" step="0.1"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">giây/lần</span>
                                                </div>
                                            </>
                                        ) : (
                                            <span className={`px-3 py-1.5 rounded ${regulations.processingTimes.searchCar === 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {regulations.processingTimes.searchCar === 0 ? 'Ngay tức thì' : `${regulations.processingTimes.searchCar} giây/lần`}
                        </span>
                                        )}
                                    </div>
                                </td>
                            </tr>

                            {/* 4. Lập phiếu thu tiền */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lập phiếu thu tiền</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative rounded-md shadow-sm w-48">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="number"
                                                    name="processingTimes.createPaymentForm"
                                                    value={regulations.processingTimes.createPaymentForm}
                                                    onChange={handleInputChange}
                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-20 sm:text-sm border-gray-300 rounded-md py-2 border"
                                                    min="0" step="0.5"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">giây/phiếu</span>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="px-3 py-1.5 bg-gray-100 rounded text-gray-800">
                          {regulations.processingTimes.createPaymentForm} giây/phiếu
                        </span>
                                        )}
                                    </div>
                                </td>
                            </tr>

                            {/* 5. Lập báo cáo tháng */}
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lập báo cáo tháng</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative rounded-md shadow-sm w-48">
                                        {isEditing ? (
                                            <>
                                                <input
                                                    type="number"
                                                    name="processingTimes.monthlyReport"
                                                    value={regulations.processingTimes.monthlyReport}
                                                    onChange={handleInputChange}
                                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-24 sm:text-sm border-gray-300 rounded-md py-2 border"
                                                    min="0" step="1"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">giây/báo cáo</span>
                                                </div>
                                            </>
                                        ) : (
                                            <span className="px-3 py-1.5 bg-gray-100 rounded text-gray-800">
                          {regulations.processingTimes.monthlyReport} giây/báo cáo
                        </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Form các quy định khác (Giá, Tuổi...) */}
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2 pt-4">Quy định chung</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giá xe tối thiểu <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="number"
                                    name="minCarPrice"
                                    value={regulations.minCarPrice}
                                    onChange={handleInputChange}
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                                    disabled={!isEditing}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">VND</span>
                                </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Hiện tại: {formatCurrency(regulations.minCarPrice)}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giá xe tối đa <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="number"
                                    name="maxCarPrice"
                                    value={regulations.maxCarPrice}
                                    onChange={handleInputChange}
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                                    disabled={!isEditing}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">VND</span>
                                </div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Hiện tại: {formatCurrency(regulations.maxCarPrice)}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số xe tối đa/khách hàng <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="maxCarsPerCustomer"
                                value={regulations.maxCarsPerCustomer}
                                onChange={handleInputChange}
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-3 sm:text-sm border-gray-300 rounded-md py-2 border"
                                disabled={!isEditing}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tuổi tối thiểu <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <input
                                    type="number"
                                    name="minCustomerAge"
                                    value={regulations.minCustomerAge}
                                    onChange={handleInputChange}
                                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md py-2 border"
                                    disabled={!isEditing}
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">tuổi</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer buttons khi đang edit */}
                    {isEditing && (
                        <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReceptionRegulations;