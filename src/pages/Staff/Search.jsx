import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const Search = () => {
  const [repairs, setRepairs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [repairServices, setRepairServices] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [filteredRepairs, setFilteredRepairs] = useState([]);
  const [selectedRepair, setSelectedRepair] = useState(null);

  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    customerId: '',
    licensePlate: '',
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      // TODO: Replace with real API calls when APIs are ready
      // const [repairsRes, customersRes, vehiclesRes, servicesRes, partsRes, invoicesRes] = await Promise.all([
      //   apiService.getRepairs(),
      //   apiService.getCustomers(),
      //   apiService.getVehicles(),
      //   apiService.getRepairServices(),
      //   apiService.getSpareParts(),
      //   apiService.getInvoices()
      // ]);
      
      // For now, start with empty arrays (no mock data)
      setRepairs([]);
      setCustomers([]);
      setVehicles([]);
      setRepairServices([]);
      setSpareParts([]);
      setInvoices([]);
      setFilteredRepairs([]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    let results = repairs;

    // Filter by date range
    if (filters.fromDate) {
      const fromDate = new Date(filters.fromDate);
      results = results.filter(r => new Date(r.createdAt) >= fromDate);
    }

    if (filters.toDate) {
      const toDate = new Date(filters.toDate);
      toDate.setHours(23, 59, 59, 999);
      results = results.filter(r => new Date(r.createdAt) <= toDate);
    }

    // Filter by customer
    if (filters.customerId) {
      results = results.filter(r => r.vehicleId.toString() === filters.customerId);
    }

    // Filter by license plate
    if (filters.licensePlate) {
      const vehicle = vehicles.find(v => v.licensePlate.toLowerCase().includes(filters.licensePlate.toLowerCase()));
      if (vehicle) {
        results = results.filter(r => r.vehicleId === vehicle.id);
      } else {
        results = [];
      }
    }

    setFilteredRepairs(results);
    setSelectedRepair(null);
  };

  const handleReset = () => {
    setFilters({
      fromDate: '',
      toDate: '',
      customerId: '',
      licensePlate: '',
    });
    setFilteredRepairs(repairs);
    setSelectedRepair(null);
  };

  const getRepairServices = (repairId) => {
    return repairServices.filter(rs => rs.repairId === repairId);
  };

  const getRepairSpareParts = (repairId) => {
    return spareParts.filter(sp => sp.repairId === repairId);
  };

  const getRepairInvoice = (repairId) => {
    return invoices.find(inv => inv.repairId === repairId);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      repairing: 'bg-blue-100 text-blue-800',
      done: 'bg-green-100 text-green-800',
    };
    const statusText = {
      pending: 'Chờ xử lý',
      repairing: 'Đang sửa',
      done: 'Hoàn thành',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[status] || 'bg-gray-100'}`}>
        {statusText[status]}
      </span>
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const getVehicleInfo = (vehicleId) => {
    return vehicles.find(v => v.id === vehicleId) || {};
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Tra cứu & Theo dõi</h1>

      {/* Search Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Điều kiện tìm kiếm</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Khách hàng</label>
            <select
              name="customerId"
              value={filters.customerId}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Tất cả</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Biển số</label>
            <input
              type="text"
              name="licensePlate"
              value={filters.licensePlate}
              onChange={handleFilterChange}
              placeholder="Nhập biển số..."
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Xóa bộ lọc
          </button>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Repair List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Kết quả ({filteredRepairs.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredRepairs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Chưa có dữ liệu để tra cứu. Tạo phiếu sửa chữa trước.
                </div>
              ) : (
                filteredRepairs.map(repair => {
                  const vehicle = getVehicleInfo(repair.vehicleId);
                  return (
                    <button
                      key={repair.id}
                      onClick={() => setSelectedRepair(repair)}
                      className={`w-full text-left p-3 rounded border-2 transition ${
                        selectedRepair?.id === repair.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-sm">{repair.id}</div>
                      <div className="text-xs text-gray-600">{vehicle.licensePlate}</div>
                      <div className="text-xs text-gray-600">{vehicle.owner}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {format(new Date(repair.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </div>
                      <div className="text-xs mt-1">
                        {getStatusBadge(repair.status)}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Repair Details */}
        <div className="lg:col-span-2">
          {selectedRepair ? (
            <div className="space-y-4">
              {/* Repair Info */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Thông tin phiếu sửa</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Mã phiếu</p>
                    <p className="font-semibold">{selectedRepair.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Trạng thái</p>
                    <p className="mt-1">{getStatusBadge(selectedRepair.status)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Biển số</p>
                    <p className="font-semibold">{getVehicleInfo(selectedRepair.vehicleId).licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chủ xe</p>
                    <p className="font-semibold">{getVehicleInfo(selectedRepair.vehicleId).owner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày tiếp nhận</p>
                    <p className="font-semibold">{format(new Date(selectedRepair.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tình trạng xe</p>
                    <p className="font-semibold text-sm">{selectedRepair.initialCondition}</p>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Dịch vụ</h2>
                {getRepairServices(selectedRepair.id).length === 0 ? (
                  <p className="text-gray-500 text-sm">Không có dịch vụ</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Dịch vụ</th>
                          <th className="px-4 py-2 text-center font-medium text-gray-700">SL</th>
                          <th className="px-4 py-2 text-right font-medium text-gray-700">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {getRepairServices(selectedRepair.id).map(service => (
                          <tr key={service.id}>
                            <td className="px-4 py-2">{service.serviceName}</td>
                            <td className="px-4 py-2 text-center">{service.quantity}</td>
                            <td className="px-4 py-2 text-right">{formatCurrency(service.totalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Spare Parts */}
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Phụ tùng</h2>
                {getRepairSpareParts(selectedRepair.id).length === 0 ? (
                  <p className="text-gray-500 text-sm">Không có phụ tùng</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left font-medium text-gray-700">Phụ tùng</th>
                          <th className="px-4 py-2 text-center font-medium text-gray-700">SL</th>
                          <th className="px-4 py-2 text-right font-medium text-gray-700">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {getRepairSpareParts(selectedRepair.id).map(part => (
                          <tr key={part.id}>
                            <td className="px-4 py-2">{part.sparePartName}</td>
                            <td className="px-4 py-2 text-center">{part.quantity}</td>
                            <td className="px-4 py-2 text-right">{formatCurrency(part.totalPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Invoice */}
              {getRepairInvoice(selectedRepair.id) && (
                <div className="bg-white rounded-lg shadow p-4">
                  <h2 className="text-lg font-semibold mb-4">Hóa đơn</h2>
                  {(() => {
                    const invoice = getRepairInvoice(selectedRepair.id);
                    return (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Mã hóa đơn</p>
                          <p className="font-semibold">{invoice.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Ngày lập</p>
                          <p className="font-semibold">{format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600">Tổng tiền</p>
                          <p className="text-2xl font-bold text-blue-600">{formatCurrency(invoice.totalAmount)}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Chọn một phiếu sửa để xem chi tiết
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
