import { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit2, X, Car, User, Trash2 } from 'lucide-react';
import apiService from '../../services/api.js';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState({
    customerId: '',
    licensePlate: '',
    ownerName: '',
    vehicleType: '',
    color: '',
    year: new Date().getFullYear()
  });
  const [repairFormData, setRepairFormData] = useState({
    notes: '',
    repairDetails: [
      { stt: 1, description: '', partName: '', quantity: '', unitPrice: '', laborCost: '', totalCost: '' }
    ]
  });

  useEffect(() => {
    loadVehicles();
    loadCustomers();
  }, []);

  // Debounce search - call API after user stops typing for 500ms
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadVehicles(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const loadVehicles = async (search = '') => {
    try {
      setLoading(true);
      const params = search ? { search } : {};
      const response = await apiService.getVehicles(params);
      if (response.success) {
        setVehicles(response.data);
      }
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomers = async () => {
    try {
      const response = await apiService.getCustomers();
      if (response.success) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
      setCustomers([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVehicle) {
        const response = await apiService.updateVehicle(editingVehicle.id, formData);
        if (response.success) {
          await loadVehicles();
          handleCloseModal();
          alert('Cập nhật xe thành công!');
        }
      } else {
        const response = await apiService.createVehicle(formData);
        if (response.success) {
          await loadVehicles();
          handleCloseModal();
          alert('Thêm xe thành công!');
        }
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert(error.message || 'Có lỗi xảy ra khi lưu xe');
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      customerId: vehicle.customerId || '',
      licensePlate: vehicle.licensePlate,
      ownerName: vehicle.ownerName,
      vehicleType: vehicle.vehicleType || '',
      color: vehicle.color || '',
      year: vehicle.year || new Date().getFullYear()
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (vehicle) => {
    if (confirm(`Bạn có chắc chắn muốn xóa xe "${vehicle.licensePlate}"?`)) {
      try {
        const response = await apiService.deleteVehicle(vehicle.id);
        if (response.success) {
          await loadVehicles();
          alert('Xóa xe thành công!');
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert(error.message || 'Có lỗi xảy ra khi xóa xe');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
    setFormData({
      customerId: '',
      licensePlate: '',
      ownerName: '',
      vehicleType: '',
      color: '',
      year: new Date().getFullYear()
    });
  };

  const handleOpenRepairModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsRepairModalOpen(true);
  };

  const handleCloseRepairModal = () => {
    setIsRepairModalOpen(false);
    setSelectedVehicle(null);
    setRepairFormData({
      notes: '',
      repairDetails: [
        { stt: 1, description: '', partName: '', quantity: '', unitPrice: '', laborCost: '', totalCost: '' }
      ]
    });
  };

  const handleRepairInputChange = (index, field, value) => {
    const updatedDetails = [...repairFormData.repairDetails];
    updatedDetails[index][field] = value;
    
    // Auto calculate total cost
    if (field === 'quantity' || field === 'unitPrice' || field === 'laborCost') {
      const quantity = parseFloat(updatedDetails[index].quantity) || 0;
      const unitPrice = parseFloat(updatedDetails[index].unitPrice) || 0;
      const laborCost = parseFloat(updatedDetails[index].laborCost) || 0;
      updatedDetails[index].totalCost = (quantity * unitPrice + laborCost).toFixed(0);
    }
    
    setRepairFormData({
      ...repairFormData,
      repairDetails: updatedDetails
    });
  };

  const addRepairRow = () => {
    const newRow = {
      stt: repairFormData.repairDetails.length + 1,
      description: '',
      partName: '',
      quantity: '',
      unitPrice: '',
      laborCost: '',
      totalCost: ''
    };
    setRepairFormData({
      ...repairFormData,
      repairDetails: [...repairFormData.repairDetails, newRow]
    });
  };

  const removeRepairRow = (index) => {
    if (repairFormData.repairDetails.length > 1) {
      const updatedDetails = repairFormData.repairDetails.filter((_, i) => i !== index);
      // Update STT numbers
      updatedDetails.forEach((detail, i) => {
        detail.stt = i + 1;
      });
      setRepairFormData({
        ...repairFormData,
        repairDetails: updatedDetails
      });
    }
  };

  const handleSubmitRepair = async (e) => {
    e.preventDefault();
    try {
      const repairData = {
        vehicleId: selectedVehicle.id,
        notes: repairFormData.notes,
        repairDetails: repairFormData.repairDetails.map(detail => ({
          description: `${detail.description} - ${detail.partName}`,
          cost: parseFloat(detail.totalCost) || 0
        })).filter(detail => detail.description.trim() !== ' - ')
      };

      const response = await apiService.createRepair(repairData);
      if (response.success) {
        alert('Tạo phiếu sửa chữa thành công!');
        handleCloseRepairModal();
      }
    } catch (error) {
      console.error('Error creating repair:', error);
      alert(error.message || 'Có lỗi xảy ra khi tạo phiếu sửa chữa');
    }
  };

  const getCustomerName = (customerId, customerName, customerPhone) => {
    if (customerName) {
      return customerPhone ? `${customerName} (${customerPhone})` : customerName;
    }
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.name} (${customer.phone})` : 'Không xác định';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Đang tải danh sách xe...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý xe</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} />
          <span>Thêm xe mới</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm xe..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên chủ xe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại xe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Màu sắc</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Năm SX</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {vehicle.licensePlate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vehicle.ownerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-500 mr-2" />
                        {getCustomerName(vehicle.customerId, vehicle.customerName, vehicle.customerPhone)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{vehicle.vehicleType || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{vehicle.color || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{vehicle.year || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle)}
                        className="text-red-600 hover:text-red-900 mr-4"
                        title="Xóa xe"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => handleOpenRepairModal(vehicle)}
                        className="text-green-600 hover:text-green-900"
                        title="Tạo phiếu sửa chữa"
                      >
                        <Car size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'Không tìm thấy xe nào.' : 'Chưa có xe nào. Nhấn "Thêm xe mới" để bắt đầu.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Vehicle Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold">
                {editingVehicle ? 'Cập nhật thông tin xe' : 'Thêm xe mới'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Khách hàng</label>
                  <select
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn khách hàng (tùy chọn)</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Biển số xe <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 51A-12345"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên chủ xe <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tên chủ xe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại xe</label>
                  <input
                    type="text"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Toyota Vios, Honda City, ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: Đen, Trắng, Xám, ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Năm sản xuất</label>
                  <input
                    type="number"
                    name="year"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingVehicle ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Repair Order Modal */}
      {isRepairModalOpen && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold">
                Phiếu Sửa Chữa - {selectedVehicle.licensePlate}
              </h2>
              <button onClick={handleCloseRepairModal} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmitRepair} className="p-6">
              {/* Vehicle Info Header */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Biển số xe:</span> {selectedVehicle.licensePlate}
                  </div>
                  <div>
                    <span className="font-medium">Ngày sửa chữa:</span> {new Date().toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>

              {/* Repair Details Table */}
              <div className="mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="border border-gray-300 px-2 py-2 text-sm">STT</th>
                        <th className="border border-gray-300 px-2 py-2 text-sm">Nội Dung</th>
                        <th className="border border-gray-300 px-2 py-2 text-sm">Vật Tư Phụ Tùng</th>
                        <th className="border border-gray-300 px-2 py-2 text-sm">Số Lượng</th>
                        <th className="border border-gray-300 px-2 py-2 text-sm">Đơn Giá</th>
                        <th className="border border-gray-300 px-2 py-2 text-sm">Tiền Công</th>
                        <th className="border border-gray-300 px-2 py-2 text-sm">Thành Tiền</th>
                        <th className="border border-gray-300 px-2 py-2 text-sm">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repairFormData.repairDetails.map((detail, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-2 py-2 text-center">
                            {detail.stt}
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              value={detail.description}
                              onChange={(e) => handleRepairInputChange(index, 'description', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Mô tả công việc"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              value={detail.partName}
                              onChange={(e) => handleRepairInputChange(index, 'partName', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Tên phụ tùng"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="number"
                              value={detail.quantity}
                              onChange={(e) => handleRepairInputChange(index, 'quantity', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="0"
                              min="0"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="number"
                              value={detail.unitPrice}
                              onChange={(e) => handleRepairInputChange(index, 'unitPrice', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="0"
                              min="0"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="number"
                              value={detail.laborCost}
                              onChange={(e) => handleRepairInputChange(index, 'laborCost', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="0"
                              min="0"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2 text-right font-medium">
                            {detail.totalCost ? parseInt(detail.totalCost).toLocaleString('vi-VN') : '0'}
                          </td>
                          <td className="border border-gray-300 px-2 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeRepairRow(index)}
                              className="text-red-600 hover:text-red-900 text-sm"
                              disabled={repairFormData.repairDetails.length === 1}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={addRepairRow}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Thêm dòng
                  </button>
                  
                  <div className="text-lg font-bold">
                    Tổng cộng: {repairFormData.repairDetails.reduce((sum, detail) => 
                      sum + (parseFloat(detail.totalCost) || 0), 0
                    ).toLocaleString('vi-VN')} đ
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <textarea
                  value={repairFormData.notes}
                  onChange={(e) => setRepairFormData({...repairFormData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ghi chú thêm về tình trạng xe hoặc yêu cầu đặc biệt..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseRepairModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Tạo phiếu sửa chữa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
