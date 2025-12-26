import { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, Printer, DollarSign, Filter, Plus, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../services/api';

const Repairs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: ''
  });
  
  // Force update state to trigger re-render
  const [refreshKey, setRefreshKey] = useState(0);
  const forceUpdate = () => setRefreshKey(prev => prev + 1);

  // Load repairs when component mounts and when filters/search term changes
  useEffect(() => {
    const timer = setTimeout(() => {
      loadRepairs();
    }, 300); // Add a small delay to avoid too many requests when typing
    
    return () => clearTimeout(timer);
  }, [filters, searchTerm, refreshKey]);


  const loadRepairs = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        status: filters.status !== 'all' ? filters.status : undefined,
        startDate: filters.startDate,
        endDate: filters.endDate
      };
      
      // Remove undefined params
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      
      console.log('Fetching repairs with params:', params);
      const response = await apiService.get('/repairs', params);
      console.log('Repairs API response:', response);
      
      if (response.success) {
        console.log('Setting repairs data:', response.data);
        setRepairs(response.data || []);
      } else {
        console.error('Failed to load repairs:', response.message);
        setRepairs([]);
      }
    } catch (error) {
      console.error('Error loading repairs:', error);
      setRepairs([]);
      alert('Có lỗi xảy ra khi tải danh sách phiếu sửa chữa');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRefresh = () => {
    loadRepairs();
    forceUpdate();
  };

  const handleViewDetails = (repairId) => {
    navigate(`/staff/repairs/${repairId}`);
  };

  const handlePrint = (repairId, e) => {
    e.stopPropagation();
    // Implement print functionality
    console.log('Printing repair:', repairId);
  };

  const handlePayment = (repairId, e) => {
    e.stopPropagation();
    // Implement payment functionality
    console.log('Processing payment for repair:', repairId);
  };

  const handleDelete = async (repairId, e) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu sửa chữa này?')) {
      try {
        const response = await apiService.delete(`/repairs/${repairId}`);
        if (response.success) {
          await loadRepairs();
          alert('Đã xóa phiếu sửa chữa thành công');
        }
      } catch (error) {
        console.error('Error deleting repair:', error);
        alert('Có lỗi xảy ra khi xóa phiếu sửa chữa');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      paid: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const statusText = {
      pending: 'Chờ xử lý',
      in_progress: 'Đang sửa',
      completed: 'Hoàn thành',
      paid: 'Đã thanh toán',
      cancelled: 'Đã hủy'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusText[status] || status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý sửa chữa và thanh toán</h2>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => {}}
        >
          <Plus className="w-5 h-5 mr-2" />
          Tạo phiếu sửa chữa
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center space-x-2 w-full">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tìm kiếm phiếu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleRefresh}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              title="Làm mới danh sách"
              disabled={loading}
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <select
            name="status"
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="in_progress">Đang sửa</option>
            <option value="completed">Hoàn thành</option>
            <option value="paid">Đã thanh toán</option>
            <option value="cancelled">Đã hủy</option>
          </select>

          <input
            type="date"
            name="startDate"
            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.startDate}
            onChange={handleFilterChange}
          />

          <input
            type="date"
            name="endDate"
            className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Repairs List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : repairs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Không có phiếu sửa chữa nào</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {repairs.map((repair) => (
              <li 
                key={repair.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewDetails(repair.id)}
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            Phiếu #{repair.repairCode}
                          </p>
                          {getStatusBadge(repair.status)}
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {repair.vehicle?.licensePlate} • {repair.customer?.name}
                        </p>
                      </div>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex space-x-2">
                      <button
                        className="p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={(e) => { e.stopPropagation(); handleViewDetails(repair.id); }}
                        title="Xem chi tiết"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        className="p-1.5 rounded-full text-gray-400 hover:text-green-600 hover:bg-green-50"
                        onClick={(e) => handlePrint(repair.id, e)}
                        title="In phiếu"
                      >
                        <Printer className="h-5 w-5" />
                      </button>
                      {repair.status === 'completed' && (
                        <button
                          className="p-1.5 rounded-full text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                          onClick={(e) => handlePayment(repair.id, e)}
                          title="Thanh toán"
                        >
                          <DollarSign className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => handleDelete(repair.id, e)}
                        title="Xóa"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {repair.notes || 'Không có ghi chú'}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Tổng cộng: <span className="font-medium">{formatCurrency(repair.totalAmount || 0)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>
                      Ngày tạo: {format(new Date(repair.createdAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Repairs;
