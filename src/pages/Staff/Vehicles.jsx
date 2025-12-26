import { useState, useEffect } from 'react';
import { PlusCircle, Search, Wrench } from 'lucide-react';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    licensePlate: '',
    brand: '',
    customerId: '',
    customerName: '',
    customerPhone: ''
  });
  
  const [customers, setCustomers] = useState([]);
  
  // Fetch customers for dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/customers');
        const data = await response.json();
        if (data.success) {
          setCustomers(data.data);
        }
      } catch (err) {
        console.error('Error fetching customers:', err);
      }
    };
    
    fetchCustomers();
  }, []);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCustomerSelect = (e) => {
    const customerId = e.target.value;
    const selectedCustomer = customers.find(c => c.MaKH === customerId);
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customerId: selectedCustomer.MaKH,
        customerName: selectedCustomer.TenKH,
        customerPhone: selectedCustomer.DienThoai || ''
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BienSo: formData.licensePlate,
          TenHieuXe: formData.brand,
          MaKH: formData.customerId
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Tiếp nhận xe thành công!');
        setIsModalOpen(false);
        fetchVehicles();
        // Reset form
        setFormData({
          licensePlate: '',
          brand: '',
          customerId: '',
          customerName: '',
          customerPhone: ''
        });
      } else {
        alert('Có lỗi xảy ra khi tiếp nhận xe: ' + (data.message || ''));
      }
    } catch (err) {
      console.error('Error submitting vehicle:', err);
      alert('Lỗi kết nối đến server');
    }
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      licensePlate: '',
      brand: '',
      customerId: '',
      customerName: '',
      customerPhone: ''
    });
  };

  // Fetch vehicles from API
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/vehicles');
      const data = await response.json();
      
      if (data.success) {
        // Transform API data to match frontend format
        const transformedVehicles = data.data.map(vehicle => ({
          id: vehicle.BienSo,
          licensePlate: vehicle.BienSo,
          brand: vehicle.TenHieuXe || 'Không xác định',
          owner: vehicle.TenKH || 'Không xác định',
          phone: vehicle.DienThoai || '',
          receivedDate: vehicle.NgayTiepNhan,
          customerId: vehicle.MaKH
        }));
        setVehicles(transformedVehicles);
      } else {
        setError('Không thể tải danh sách xe');
      }
    } catch (err) {
      console.error('Fetch vehicles error:', err);
      setError('Lỗi kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRepair = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsRepairModalOpen(true);
  };

  const filteredVehicles = vehicles.filter(vehicle => 
    vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý xe</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} />
          <span>Tiếp nhận xe</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm xe theo biển số, chủ xe, hoặc hiệu xe..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Biển số</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hiệu xe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chủ xe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tiếp nhận</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vehicle.licensePlate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.brand}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {vehicle.owner}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(vehicle.receivedDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleCreateRepair(vehicle)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Tạo phiếu sửa chữa"
                      >
                        <Wrench size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy xe nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vehicle Reception Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Tiếp nhận xe mới</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biển số xe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="licensePlate"
                      value={formData.licensePlate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Nhập biển số xe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hiệu xe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      placeholder="Nhập hiệu xe"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khách hàng <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleCustomerSelect}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">-- Chọn khách hàng --</option>
                      {customers.map(customer => (
                        <option key={customer.MaKH} value={customer.MaKH}>
                          {customer.TenKH} - {customer.DienThoai || 'Chưa có SĐT'}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {formData.customerId && (
                    <div className="md:col-span-2 bg-gray-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Thông tin khách hàng:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>Tên: <span className="font-medium">{formData.customerName}</span></div>
                        <div>SĐT: <span className="font-medium">{formData.customerPhone || 'Chưa có'}</span></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Lưu thông tin
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Repair Modal */}
      {isRepairModalOpen && selectedVehicle && (
        <RepairModal 
          vehicle={selectedVehicle}
          onClose={() => setIsRepairModalOpen(false)}
          onSave={() => {
            setIsRepairModalOpen(false);
            // Optionally refresh vehicles list or show success message
          }}
        />
      )}
    </div>
  );
};

// Separate Repair Modal Component
const RepairModal = ({ vehicle, onClose, onSave }) => {
  const [repairData, setRepairData] = useState({
    repairDate: new Date().toISOString().split('T')[0],
    details: [
      { id: 1, description: '', partName: '', quantity: 1, unitPrice: 0, laborCost: 0, totalPrice: 0 }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addRow = () => {
    const newId = Math.max(...repairData.details.map(d => d.id)) + 1;
    setRepairData(prev => ({
      ...prev,
      details: [...prev.details, {
        id: newId,
        description: '',
        partName: '',
        quantity: 1,
        unitPrice: 0,
        laborCost: 0,
        totalPrice: 0
      }]
    }));
  };

  const updateDetail = (id, field, value) => {
    setRepairData(prev => ({
      ...prev,
      details: prev.details.map(detail => {
        if (detail.id === id) {
          const updated = { ...detail, [field]: value };
          // Auto-calculate total price
          if (field === 'quantity' || field === 'unitPrice' || field === 'laborCost') {
            updated.totalPrice = (updated.quantity * updated.unitPrice) + updated.laborCost;
          }
          return updated;
        }
        return detail;
      })
    }));
  };

  const removeRow = (id) => {
    if (repairData.details.length > 1) {
      setRepairData(prev => ({
        ...prev,
        details: prev.details.filter(detail => detail.id !== id)
      }));
    }
  };

  const calculateTotal = () => {
    return repairData.details.reduce((sum, detail) => sum + detail.totalPrice, 0);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create repair record
      const repairResponse = await fetch('http://localhost:3001/api/repairs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          licensePlate: vehicle.licensePlate,
          customerId: vehicle.customerId
        })
      });

      const repairResult = await repairResponse.json();
      
      if (!repairResult.success) {
        throw new Error(repairResult.error || 'Không thể tạo phiếu sửa chữa');
      }

      const repairId = repairResult.data.id;

      // Add repair details (simplified - in real app you'd need to handle services/parts properly)
      for (const detail of repairData.details) {
        if (detail.description.trim()) {
          // For now, we'll add as a service (MaTC = 1) - in a real app, you'd have dropdowns to select
          await fetch(`http://localhost:3001/api/repairs/${repairId}/details`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              serviceId: 1, // Default service ID - in real app, you'd select from dropdown
              quantity: detail.quantity,
              unitPrice: detail.unitPrice
            })
          });
        }
      }

      // Update repair totals
      const totalCost = calculateTotal();
      const laborCost = repairData.details.reduce((sum, detail) => sum + detail.laborCost, 0);
      const partsCost = totalCost - laborCost;

      await fetch(`http://localhost:3001/api/repairs/${repairId}/totals`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          laborCost,
          partsCost,
          totalCost
        })
      });

      onSave();
    } catch (err) {
      console.error('Save repair error:', err);
      setError(err.message || 'Lỗi khi lưu phiếu sửa chữa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            Tạo phiếu sửa chữa - {vehicle.licensePlate}
          </h2>
          <div className="text-sm text-gray-600 mb-4">
            Chủ xe: {vehicle.owner} | Hiệu xe: {vehicle.brand}
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="border rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-2">Thông tin phiếu sửa chữa</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biển số xe</label>
                <input
                  type="text"
                  value={vehicle.licensePlate}
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sửa chữa</label>
                <input
                  type="date"
                  value={repairData.repairDate}
                  onChange={(e) => setRepairData(prev => ({ ...prev, repairDate: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Service/Parts Table */}
            <div className="border rounded-lg overflow-hidden mb-4">
              <table className="min-w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">STT</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Nội dung</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Vật tư/Phụ tùng</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Số lượng</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Đơn giá</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Tiền công</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Thành tiền</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {repairData.details.map((detail, index) => (
                    <tr key={detail.id}>
                      <td className="px-4 py-2 border-b">{index + 1}</td>
                      <td className="px-4 py-2 border-b">
                        <input 
                          type="text" 
                          className="w-full px-2 py-1 border rounded" 
                          placeholder="Mô tả công việc..." 
                          value={detail.description}
                          onChange={(e) => updateDetail(detail.id, 'description', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2 border-b">
                        <input 
                          type="text" 
                          className="w-full px-2 py-1 border rounded" 
                          placeholder="Tên phụ tùng..." 
                          value={detail.partName}
                          onChange={(e) => updateDetail(detail.id, 'partName', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2 border-b">
                        <input 
                          type="number" 
                          className="w-full px-2 py-1 border rounded" 
                          placeholder="1" 
                          value={detail.quantity}
                          onChange={(e) => updateDetail(detail.id, 'quantity', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-4 py-2 border-b">
                        <input 
                          type="number" 
                          className="w-full px-2 py-1 border rounded" 
                          placeholder="0" 
                          value={detail.unitPrice}
                          onChange={(e) => updateDetail(detail.id, 'unitPrice', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-4 py-2 border-b">
                        <input 
                          type="number" 
                          className="w-full px-2 py-1 border rounded" 
                          placeholder="0" 
                          value={detail.laborCost}
                          onChange={(e) => updateDetail(detail.id, 'laborCost', parseInt(e.target.value) || 0)}
                        />
                      </td>
                      <td className="px-4 py-2 border-b">
                        <input 
                          type="number" 
                          className="w-full px-2 py-1 border rounded bg-gray-50" 
                          value={detail.totalPrice}
                          disabled 
                        />
                      </td>
                      <td className="px-4 py-2 border-b">
                        {repairData.details.length > 1 && (
                          <button
                            onClick={() => removeRow(detail.id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Xóa
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center">
              <button 
                onClick={addRow}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Thêm dòng
              </button>
              <div className="text-lg font-bold">
                Tổng tiền: <span className="text-blue-600">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(calculateTotal())}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu phiếu sửa chữa'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;