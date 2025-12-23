import React, { useState } from 'react';

const Reports = () => {
    const [formData, setFormData] = useState({
        fromDate: '',
        toDate: '',
        reportType: 'revenue' // revenue | repairs | parts
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement report generation
        console.log('Generating report:', formData);
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Exporting report:', formData);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-6">Báo cáo thống kê</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* From Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Từ ngày <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="fromDate"
                                value={formData.fromDate}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="mt-1 text-sm text-gray-500">Thời điểm bắt đầu thống kê</p>
                        </div>

                        {/* To Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Đến ngày <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="toDate"
                                value={formData.toDate}
                                onChange={handleChange}
                                min={formData.fromDate}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="mt-1 text-sm text-gray-500">Thời điểm kết thúc thống kê</p>
                        </div>

                        {/* Report Type */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Loại báo cáo <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="reportType"
                                value={formData.reportType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="revenue">Doanh thu</option>
                                <option value="repairs">Lượt sửa chữa</option>
                                <option value="parts">Phụ tùng</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                        <button
                            type="button"
                            onClick={handleExport}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Xuất file
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Xem báo cáo
                        </button>
                    </div>
                </form>

                {/* Report Results Area */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">Kết quả báo cáo</h2>
                    <div className="bg-gray-50 rounded-lg p-4 min-h-[200px] flex items-center justify-center text-gray-500">
                        Kết quả báo cáo sẽ được hiển thị tại đây
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;