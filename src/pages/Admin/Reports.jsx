import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, Download, Calendar } from 'lucide-react';

// Hàm định dạng ngày thành YYYY-MM-DD
const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};

// Lấy ngày đầu tháng
const getFirstDayOfMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

// Lấy ngày hiện tại
const getToday = () => {
  return new Date();
};

const Reports = () => {
    const [formData, setFormData] = useState({
        startDate: formatDate(getFirstDayOfMonth()),
        endDate: formatDate(getToday()),
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
            const response = await fetch(
                `http://localhost:3001/api/reports/${formData.reportType}?fromDate=${formData.startDate}&toDate=${formData.endDate}`
            );
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
            const headers = ['Ngày', 'Số xe sửa', 'Tiền công', 'Tiền phụ tùng', 'Tổng doanh thu'];
            const rows = reportData.map(row => [
                row.Date || row.Month, // Giữ lại row.Month cho tương thích ngược
                row.CarsRepaired,
                row.TotalLaborCost?.toLocaleString('vi-VN') || '0',
                row.TotalPartsCost?.toLocaleString('vi-VN') || '0',
                row.TotalRevenue?.toLocaleString('vi-VN') || '0'
            ]);
            return [headers, ...rows].map(row => row.join(',')).join('\n');
        } else {
            const headers = ['Phụ tùng', 'Tồn đầu', 'Nhập trong kỳ', 'Xuất trong kỳ', 'Tồn cuối'];
            const rows = reportData.map(row => [
                row.TenVatTuPhuTung,
                row.BeginningBalance || 0,
                row.TotalImported || 0,
                row.TotalUsed || 0,
                row.CurrentStock || 0
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {row.Month}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {row.CarsRepaired} xe
                                </span>
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
                <tfoot className="bg-gray-50">
                    <tr>
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                            Tổng cộng
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-blue-600">
                            {reportData.reduce((sum, row) => sum + row.CarsRepaired, 0)} xe
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-gray-900">
                            {formatCurrency(reportData.reduce((sum, row) => sum + row.TotalLaborCost, 0))}
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-gray-900">
                            {formatCurrency(reportData.reduce((sum, row) => sum + row.TotalPartsCost, 0))}
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-green-600">
                            {formatCurrency(reportData.reduce((sum, row) => sum + row.TotalRevenue, 0))}
                        </td>
                    </tr>
                </tfoot>
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {row.TenVatTuPhuTung}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {row.BeginningBalance}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                +{row.TotalImported || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                -{row.TotalUsed || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                {row.CurrentStock}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className="bg-gray-50">
                    <tr>
                        <td className="px-6 py-3 text-sm font-medium text-gray-900">
                            Tổng cộng
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-gray-900">
                            {reportData.reduce((sum, row) => sum + row.BeginningBalance, 0)}
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-green-600">
                            +{reportData.reduce((sum, row) => sum + (row.TotalImported || 0), 0)}
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-red-600">
                            -{reportData.reduce((sum, row) => sum + (row.TotalUsed || 0), 0)}
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-blue-600">
                            {reportData.reduce((sum, row) => sum + row.CurrentStock, 0)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );

    const formatDateDisplay = (dateString) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 flex items-center">
                <BarChart3 className="mr-2" />
                Báo cáo {formData.reportType === 'revenue' ? 'Doanh thu' : 'Tồn kho'}
            </h1>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-4 mb-4">
                            <label className="inline-flex items-center bg-gray-100 px-3 py-2 rounded-md">
                                <input
                                    type="radio"
                                    name="reportType"
                                    value="revenue"
                                    checked={formData.reportType === 'revenue'}
                                    onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <span className="ml-2 font-medium">Báo cáo doanh thu</span>
                            </label>
                            <label className="inline-flex items-center bg-gray-100 px-3 py-2 rounded-md">
                                <input
                                    type="radio"
                                    name="reportType"
                                    value="inventory"
                                    checked={formData.reportType === 'inventory'}
                                    onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <span className="ml-2 font-medium">Báo cáo tồn kho</span>
                            </label>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-md">
                            <h3 className="font-medium text-blue-800 mb-2">Khoảng thời gian báo cáo</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        max={formData.endDate}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        min={formData.startDate}
                                        max={formatDate(new Date())}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        {loading ? 'Đang tải...' : 'Xem báo cáo'}
                                    </button>
                                </div>
                            </div>
                            {formData.startDate && formData.endDate && (
                                <div className="mt-2 text-sm text-gray-600">
                                    Đang xem dữ liệu từ <span className="font-medium">{formatDateDisplay(formData.startDate)}</span> đến <span className="font-medium">{formatDateDisplay(formData.endDate)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </form>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md flex items-start">
                        <svg className="h-5 w-5 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p className="font-medium">Lỗi khi tải báo cáo</p>
                            <p className="text-sm">{error}</p>
                        </div>
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
                                Từ {formData.startDate} đến {formData.endDate}
                            </span>
                        </div>

                        {reportData.length === 0 ? (
                            <div className="mt-6 text-center py-12 bg-gray-50 rounded-md border-2 border-dashed border-gray-200">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-900">Không có dữ liệu</h3>
                                <p className="mt-1 text-sm text-gray-500">Không tìm thấy dữ liệu báo cáo trong khoảng thời gian đã chọn.</p>
                                <div className="mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // Set date range to last 30 days
                                            const endDate = new Date();
                                            const startDate = new Date();
                                            startDate.setDate(startDate.getDate() - 30);

                                            setFormData((prev) => ({
                                                ...prev,
                                                startDate: formatDate(startDate),
                                                endDate: formatDate(endDate)
                                            }));
                                        }}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Xem 30 ngày gần nhất
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Summary Cards */}
                                {formData.reportType === 'revenue' && (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <div className="text-blue-600 text-sm font-medium">Tổng xe sửa</div>
                                            <div className="text-2xl font-bold text-blue-900">
                                                {reportData.reduce((sum, row) => sum + row.CarsRepaired, 0)}
                                            </div>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="text-green-600 text-sm font-medium">Tổng tiền công</div>
                                            <div className="text-2xl font-bold text-green-900">
                                                {formatCurrency(reportData.reduce((sum, row) => sum + row.TotalLaborCost, 0))}
                                            </div>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <div className="text-purple-600 text-sm font-medium">Tổng phụ tùng</div>
                                            <div className="text-2xl font-bold text-purple-900">
                                                {formatCurrency(reportData.reduce((sum, row) => sum + row.TotalPartsCost, 0))}
                                            </div>
                                        </div>
                                        <div className="bg-orange-50 p-4 rounded-lg">
                                            <div className="text-orange-600 text-sm font-medium">Tổng doanh thu</div>
                                            <div className="text-2xl font-bold text-orange-900">
                                                {formatCurrency(reportData.reduce((sum, row) => sum + row.TotalRevenue, 0))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Report Table */}
                                <div className="bg-white border rounded-lg">
                                    {formData.reportType === 'revenue' ? renderRevenueReport() : renderInventoryReport()}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;