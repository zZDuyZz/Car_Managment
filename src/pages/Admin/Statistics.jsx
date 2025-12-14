import React, { useState } from 'react';
import { format, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [dateRange, setDateRange] = useState({
    startDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [reportType, setReportType] = useState('revenue');

  // Mock data for demonstration
  const mockRevenueData = {
    labels: Array.from({ length: 30 }, (_, i) => 
      format(subDays(new Date(), 29 - i), 'dd/MM')
    ),
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10000000) + 5000000),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const mockServiceData = {
    labels: ['Thay dầu', 'Sửa phanh', 'Bảo dưỡng', 'Thay lốp', 'Khác'],
    datasets: [
      {
        label: 'Số lượng',
        data: [65, 59, 80, 81, 56],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Thống kê doanh thu theo ngày',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN', { 
              style: 'currency', 
              currency: 'VND' 
            }).format(value).replace('₫', '') + '₫';
          }
        }
      }
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReportTypeChange = (type) => {
    setReportType(type);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Thống kê & Báo cáo</h1>
        <p className="text-gray-600">Tổng hợp dữ liệu quản lý</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại báo cáo</label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleReportTypeChange('revenue')}
                className={`px-4 py-2 rounded ${
                  reportType === 'revenue' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Doanh thu
              </button>
              <button
                onClick={() => handleReportTypeChange('services')}
                className={`px-4 py-2 rounded ${
                  reportType === 'services' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Dịch vụ
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {reportType === 'revenue' && (
            <div className="h-80">
              <Line data={mockRevenueData} options={chartOptions} />
            </div>
          )}
          {reportType === 'services' && (
            <div className="h-80">
              <Pie 
                data={mockServiceData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    title: {
                      display: true,
                      text: 'Thống kê dịch vụ đã sử dụng',
                    },
                  }
                }} 
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tổng doanh thu</h3>
          <p className="text-3xl font-bold text-red-600">
            {new Intl.NumberFormat('vi-VN', { 
              style: 'currency', 
              currency: 'VND' 
            }).format(125000000)}
          </p>
          <p className="text-sm text-gray-500 mt-1">30 ngày gần nhất</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tổng đơn sửa chữa</h3>
          <p className="text-3xl font-bold text-blue-600">87</p>
          <p className="text-sm text-gray-500 mt-1">30 ngày gần nhất</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Khách hàng mới</h3>
          <p className="text-3xl font-bold text-green-600">24</p>
          <p className="text-sm text-gray-500 mt-1">30 ngày gần nhất</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
