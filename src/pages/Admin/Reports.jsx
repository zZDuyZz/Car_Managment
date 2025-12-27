import React, { useState } from 'react';
import { BarChart3, FileText, Download, Calendar } from 'lucide-react';

const Reports = () => {
    const [formData, setFormData] = useState({
        month: '12',
        year: '2025',
        reportType: 'revenue' // revenue | inventory
    });
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            // Tạo fromDate và toDate từ month/year
            const fromDate = `${formData.year}-${formData.month.padStart(2, '0')}-01`;
            const lastDay = new Date(formData.year, formData.month, 0).getDate();
            const toDate = `${formData.year}-${formData.month.padStart(2, '0')}-${lastDay}`;
            
            const response = await fetch(`http://localhost:3001/api/reports/${formData.reportType}?fromDate=${fromDate}&toDate=${toDate}`);
            const result = await response.json();
            
            if (result.success) {
                setReportData(result.data);
            } else {
                setError(result.message || 'Có lỗi xảy ra khi tạo báo cáo');
            }
        } catch (error) {
            console.error('Error generating report:', error);
            setError('Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!reportData || reportData.length === 0) {
            alert('Không có dữ liệu để xuất');
            return;
        }

        const csvContent = generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${formData.reportType}_report_${formData.month}_${formData.year}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const generateCSV = () => {
        if (formData.reportType === 'revenue') {
            const headers = ['Tháng', 'Số xe sửa', 'Tiền công', 'Tiền phụ tùng', 'Tổng doanh thu'];
            const rows = reportData.map(row => [
                row.Month,
                row.CarsRepaired,
                row.TotalLaborCost.toLocaleString('vi-VN'),
                row.TotalPartsCost.toLocaleString('vi-VN'),
                row.TotalRevenue.toLocaleString('vi-VN')
            ]);
            return [headers, ...rows].map(row => row.join(',')).join('\n');
        } else {
            const headers = ['Phụ tùng', 'Tồn đầu', 'Nhập trong kỳ', 'Xuất trong kỳ', 'Tồn cuối'];
            const rows = reportData.map(row => [
                row.TenVatTuPhuTung,
                row.BeginningBalance,
                row.TotalImported || 0,
                row.TotalUsed || 0,
                row.CurrentStock
            ]);
            return [headers, ...rows].map(row => row.join(',')).join('\n');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const renderRevenueReport = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Tháng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Số xe sửa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Tiền công
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Tiền phụ tùng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Tổng doanh thu
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {reportData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {row.Month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {row.CarsRepaired}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(row.TotalLaborCost)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatCurrency(row.TotalPartsCost)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                {formatCurrency(row.TotalRevenue)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderInventoryReport = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Phụ tùng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Tồn đầu kỳ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Nhập trong kỳ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Xuất trong kỳ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Tồn cuối kỳ
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {reportData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {row.TenVatTuPhuTung}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {row.BeginningBalance}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                {row.TotalImported || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                {row.TotalUsed || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {row.CurrentStock}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="p-4">
            <div className="flex items-center mb-6">
                <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold">Báo cáo thống kê</h1>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* From Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Calendar className="w-4 h-4 inline mr-1" />
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
                        </div>

                        {/* To Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <Calendar className="w-4 h-4 inline mr-1" />
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
                        </div>

                        {/* Report Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <FileText className="w-4 h-4 inline mr-1" />
                                Loại báo cáo <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="reportType"
                                value={formData.reportType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="revenue">Báo cáo doanh thu</option>
                                <option value="inventory">Báo cáo tồn kho</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleExport}
                            disabled={!reportData || reportData.length === 0}
                            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Xuất CSV
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Đang tạo...
                                </>
                            ) : (
                                <>
                                    <BarChart3 className="w-4 h-4 mr-2" />
                                    Xem báo cáo
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}

                {/* Report Results */}
                {reportData && (
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">
                                {formData.reportType === 'revenue' ? 'Báo cáo doanh thu' : 'Báo cáo tồn kho'}
                            </h2>
                            <span className="text-sm text-gray-500">
                                Từ {formData.fromDate} đến {formData.toDate}
                            </span>
                        </div>
                        
                        {reportData.length === 0 ? (
                            <div className="bg-gray-50 rounded-lg p-8 text-center">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">Không có dữ liệu trong khoảng thời gian này</p>
                            </div>
                        ) : (
                            <div className="bg-white border rounded-lg">
                                {formData.reportType === 'revenue' ? renderRevenueReport() : renderInventoryReport()}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;