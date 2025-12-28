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
  const [limits, setLimits] = useState(null);
  const [formData, setFormData] = useState({
    licensePlate: '',
    brand: '',
    customerId: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    receivedDate: new Date().toISOString().split('T')[0],
    notes: ''
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
  
  // Fetch limits
  useEffect(() => {
    const fetchLimits = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/limits');
        const data = await response.json();
        if (data.success) {
          setLimits(data.data);
        }
      } catch (err) {
        console.error('Error fetching limits:', err);
      }
    };
    
    fetchLimits();
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
    const selectedCustomer = customers.find(c => c.MaKH === parseInt(customerId));
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customerId: selectedCustomer.MaKH,
        customerName: selectedCustomer.TenKH,
        customerPhone: selectedCustomer.DienThoai || '',
        customerAddress: selectedCustomer.DiaChi || ''
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.licensePlate || !formData.brand || !formData.customerId) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    // Check limits before submitting
    if (limits && !limits.vehicles.canAdd) {
      alert(`Đã đạt giới hạn ${limits.vehicles.limit} xe/ngày. Không thể tiếp nhận thêm xe hôm nay.`);
      return;
    }
    
    try {
      const requestData = {
        BienSo: formData.licensePlate,
        TenHieuXe: formData.brand,
        MaKH: parseInt(formData.customerId) // Convert to number
      };
      
      console.log('Sending data:', requestData); // Debug log
      
      const response = await fetch('http://localhost:3001/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      console.log('Response:', data); // Debug log
      
      if (data.success) {
        alert('Tiếp nhận xe thành công!');
        setIsModalOpen(false);
        fetchVehicles();
        // Refresh limits
        const limitsResponse = await fetch('http://localhost:3001/api/limits');
        const limitsData = await limitsResponse.json();
        if (limitsData.success) {
          setLimits(limitsData.data);
        }
        // Reset form
        setFormData({
          licensePlate: '',
          brand: '',
          customerId: '',
          customerName: '',
          customerPhone: '',
          customerAddress: '',
          receivedDate: new Date().toISOString().split('T')[0],
          notes: ''
        });
      } else {
        // Handle specific error messages from backend
        if (data.error === 'VEHICLE_LIMIT_EXCEEDED') {
          alert(data.message);
        } else if (data.error === 'BRAND_LIMIT_EXCEEDED') {
          alert(data.message);
        } else {
          alert('Có lỗi xảy ra khi tiếp nhận xe: ' + (data.error || data.message || ''));
        }
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
      customerPhone: '',
      customerAddress: '',
      receivedDate: new Date().toISOString().split('T')[0],
      notes: ''
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
          disabled={limits && !limits.vehicles.canAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title={limits && !limits.vehicles.canAdd ? `Đã đạt giới hạn ${limits.vehicles.limit} xe/ngày` : ''}
        >
          <PlusCircle size={20} />
          <span>Tiếp nhận xe</span>
        </button>
      </div>

      {/* Limits Display */}
      {limits && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📊 Quy định hệ thống</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-600 mb-1">Xe tiếp nhận hôm nay</div>
              <div className="flex items-baseline justify-between">
                <span className={`text-2xl font-bold ${limits.vehicles.canAdd ? 'text-green-600' : 'text-red-600'}`}>
                  {limits.vehicles.current}
                </span>
                <span className="text-sm text-gray-500">/ {limits.vehicles.limit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all ${limits.vehicles.canAdd ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min((limits.vehicles.current / limits.vehicles.limit) * 100, 100)}%` }}
                ></div>
              </div>
              {!limits.vehicles.canAdd && (
                <div className="text-xs text-red-600 mt-2 font-medium">⚠️ Đã đạt giới hạn</div>
              )}
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-600 mb-1">Số hãng xe</div>
              <div className="flex items-baseline justify-between">
                <span className={`text-2xl font-bold ${limits.brands.canAdd ? 'text-blue-600' : 'text-orange-600'}`}>
                  {limits.brands.current}
                </span>
                <span className="text-sm text-gray-500">/ {limits.brands.limit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all ${limits.brands.canAdd ? 'bg-blue-500' : 'bg-orange-500'}`}
                  style={{ width: `${Math.min((limits.brands.current / limits.brands.limit) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-600 mb-1">Loại phụ tùng</div>
              <div className="flex items-baseline justify-between">
                <span className={`text-2xl font-bold ${limits.parts.canAdd ? 'text-purple-600' : 'text-orange-600'}`}>
                  {limits.parts.current}
                </span>
                <span className="text-sm text-gray-500">/ {limits.parts.limit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all ${limits.parts.canAdd ? 'bg-purple-500' : 'bg-orange-500'}`}
                  style={{ width: `${Math.min((limits.parts.current / limits.parts.limit) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-600 mb-1">Loại dịch vụ</div>
              <div className="flex items-baseline justify-between">
                <span className={`text-2xl font-bold ${limits.services.canAdd ? 'text-indigo-600' : 'text-orange-600'}`}>
                  {limits.services.current}
                </span>
                <span className="text-sm text-gray-500">/ {limits.services.limit}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all ${limits.services.canAdd ? 'bg-indigo-500' : 'bg-orange-500'}`}
                  style={{ width: `${Math.min((limits.services.current / limits.services.limit) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

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
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Thông tin xe */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin xe</h3>
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
                        placeholder="VD: 51A-12345"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hiệu xe <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">-- Chọn hiệu xe --</option>
                        <option value="Toyota">Toyota</option>
                        <option value="Honda">Honda</option>
                        <option value="Suzuki">Suzuki</option>
                        <option value="Ford">Ford</option>
                        <option value="Kia">Kia</option>
                        <option value="Hyundai">Hyundai</option>
                        <option value="Mazda">Mazda</option>
                        <option value="Mitsubishi">Mitsubishi</option>
                        <option value="Isuzu">Isuzu</option>
                        <option value="Nissan">Nissan</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày tiếp nhận <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="receivedDate"
                        value={formData.receivedDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Thông tin khách hàng */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin khách hàng</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chọn khách hàng <span className="text-red-500">*</span>
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
                      <div className="bg-white p-4 rounded-md border border-blue-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Chi tiết khách hàng:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Tên khách hàng:</span>
                            <div className="font-medium text-gray-900">{formData.customerName}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Số điện thoại:</span>
                            <div className="font-medium text-gray-900">{formData.customerPhone || 'Chưa có'}</div>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-gray-600">Địa chỉ:</span>
                            <div className="font-medium text-gray-900">{formData.customerAddress || 'Chưa có'}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ghi chú về tình trạng xe, yêu cầu khách hàng..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                  >
                    Tiếp nhận xe
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
      { id: 1, description: '', serviceId: '', partId: '', quantity: 1, unitPrice: 0, laborCost: 0, totalPrice: 0, maxQuantity: 0 }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parts, setParts] = useState([]);
  const [services, setServices] = useState([]);

  // Fetch parts and services
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partsResponse, servicesResponse] = await Promise.all([
          fetch('http://localhost:3001/api/parts'),
          fetch('http://localhost:3001/api/services')
        ]);
        
        const partsData = await partsResponse.json();
        const servicesData = await servicesResponse.json();
        
        if (partsData.success) setParts(partsData.data);
        if (servicesData.success) setServices(servicesData.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, []);

  const addRow = () => {
    const newId = Math.max(...repairData.details.map(d => d.id)) + 1;
    setRepairData(prev => ({
      ...prev,
      details: [...prev.details, {
        id: newId,
        description: '',
        serviceId: '',
        partId: '',
        quantity: 1,
        unitPrice: 0,
        laborCost: 0,
        totalPrice: 0,
        maxQuantity: 0
      }]
    }));
  };

  const updateDetail = (id, field, value) => {
    setRepairData(prev => ({
      ...prev,
      details: prev.details.map(detail => {
        if (detail.id === id) {
          let updated = { ...detail, [field]: value };
          
          // Handle service selection
          if (field === 'serviceId') {
            const selectedService = services.find(s => s.MaTC === parseInt(value));
            if (selectedService) {
              updated.laborCost = selectedService.ChiPhi;
              updated.description = selectedService.TenTienCong;
            } else {
              updated.laborCost = 0;
              updated.description = '';
            }
          }
          
          // Handle part selection
          if (field === 'partId') {
            const selectedPart = parts.find(p => p.MaPhuTung === parseInt(value));
            if (selectedPart) {
              updated.unitPrice = selectedPart.DonGia;
              updated.maxQuantity = selectedPart.SoLuong;
              // Reset quantity if it exceeds available stock
              if (updated.quantity > selectedPart.SoLuong) {
                updated.quantity = Math.min(updated.quantity, selectedPart.SoLuong);
              }
            } else {
              updated.unitPrice = 0;
              updated.maxQuantity = 0;
            }
          }
          
          // Handle quantity validation
          if (field === 'quantity') {
            const cleanValue = value.toString().replace(/[^\d]/g, '');
            const numValue = parseInt(cleanValue) || 1;
            updated.quantity = Math.min(Math.max(numValue, 1), updated.maxQuantity || 999);
          }
          
          // Auto-calculate total price
          updated.totalPrice = (updated.quantity * updated.unitPrice) + updated.laborCost;
          
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

      console.log('Creating repair for vehicle:', vehicle.licensePlate, 'customer:', vehicle.customerId);

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
      console.log('Repair creation result:', repairResult);
      
      if (!repairResult.success) {
        throw new Error(repairResult.error || 'Không thể tạo phiếu sửa chữa');
      }

      const repairId = repairResult.data.id;
      console.log('Created repair with ID:', repairId);

      // Add repair details - only add rows that have meaningful data
      let detailsAdded = 0;
      for (const detail of repairData.details) {
        if (detail.serviceId || detail.partId) {
          console.log('Adding detail:', detail);
          
          const detailResponse = await fetch(`http://localhost:3001/api/repairs/${repairId}/details`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              serviceId: detail.serviceId || null,
              partId: detail.partId || null,
              quantity: detail.quantity,
              unitPrice: detail.unitPrice
            })
          });
          
          const detailResult = await detailResponse.json();
          console.log('Detail add result:', detailResult);
          
          if (detailResult.success) {
            detailsAdded++;
          }
        }
      }

      console.log(`Added ${detailsAdded} details`);

      // Update repair totals
      const totalCost = calculateTotal();
      const laborCost = repairData.details.reduce((sum, detail) => sum + detail.laborCost, 0);
      const partsCost = totalCost - laborCost;

      console.log('Updating totals:', { laborCost, partsCost, totalCost });

      const totalsResponse = await fetch(`http://localhost:3001/api/repairs/${repairId}/totals`, {
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

      const totalsResult = await totalsResponse.json();
      console.log('Totals update result:', totalsResult);

      alert('Tạo phiếu sửa chữa thành công!');
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
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Dịch vụ</th>
                    <th className="px-4 py-2 text-left text-xs font-medium uppercase">Phụ tùng</th>
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
                      <td className="px-4 py-2 border-b align-top">{index + 1}</td>
                      <td className="px-4 py-2 border-b align-top">
                        <select 
                          className="w-full px-2 py-1 border rounded" 
                          value={detail.serviceId}
                          onChange={(e) => updateDetail(detail.id, 'serviceId', e.target.value)}
                        >
                          <option value="">-- Chọn dịch vụ --</option>
                          {services.map(service => (
                            <option key={service.MaTC} value={service.MaTC}>
                              {service.TenTienCong} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.ChiPhi)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 border-b align-top">
                        <select 
                          className="w-full px-2 py-1 border rounded" 
                          value={detail.partId}
                          onChange={(e) => updateDetail(detail.id, 'partId', e.target.value)}
                        >
                          <option value="">-- Chọn phụ tùng --</option>
                          {parts.map(part => (
                            <option key={part.MaPhuTung} value={part.MaPhuTung} disabled={part.SoLuong === 0}>
                              {part.TenVatTuPhuTung} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(part.DonGia)} 
                              {part.SoLuong === 0 ? ' (Hết hàng)' : ` (Còn: ${part.SoLuong})`}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 border-b align-top">
                        <input 
                          type="text" 
                          className="w-full px-2 py-1 border rounded" 
                          placeholder="1" 
                          value={detail.quantity}
                          onChange={(e) => updateDetail(detail.id, 'quantity', e.target.value)}
                          max={detail.maxQuantity}
                        />
                        {detail.maxQuantity > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            Tối đa: {detail.maxQuantity}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 border-b align-top">
                        <input 
                          type="text" 
                          className="w-full px-2 py-1 border rounded bg-gray-50" 
                          value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.unitPrice)}
                          disabled 
                        />
                      </td>
                      <td className="px-4 py-2 border-b align-top">
                        <input 
                          type="text" 
                          className="w-full px-2 py-1 border rounded bg-gray-50" 
                          value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.laborCost)}
                          disabled 
                        />
                      </td>
                      <td className="px-4 py-2 border-b align-top">
                        <input 
                          type="text" 
                          className="w-full px-2 py-1 border rounded bg-gray-50" 
                          value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.totalPrice)}
                          disabled 
                        />
                      </td>
                      <td className="px-4 py-2 border-b align-top">
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