import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const mockServices = [
  { id: 1, name: 'Thay dầu', unitPrice: 150000 },
  { id: 2, name: 'Thay lốp', unitPrice: 500000 },
  { id: 3, name: 'Sửa phanh', unitPrice: 300000 },
  { id: 4, name: 'Sửa động cơ', unitPrice: 1000000 },
  { id: 5, name: 'Sửa hộp số', unitPrice: 800000 },
  { id: 6, name: 'Sửa điều hòa', unitPrice: 400000 },
];

const mockRepairs = [
  { id: 'R-1702000000000', vehicleId: 1, licensePlate: '51A-12345', owner: 'Nguyễn Văn A', status: 'pending', createdAt: '2024-12-10T08:30:00' },
  { id: 'R-1702000000001', vehicleId: 2, licensePlate: '51B-67890', owner: 'Trần Thị B', status: 'repairing', createdAt: '2024-12-11T10:15:00' },
];

const RepairServices = () => {
  const [repairServices, setRepairServices] = useState([]);
  const [selectedRepair, setSelectedRepair] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    serviceId: '',
    quantity: 1,
  });

  useEffect(() => {
    const savedServices = JSON.parse(localStorage.getItem('repairServices')) || [];
    setRepairServices(savedServices);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedRepair || !formData.serviceId || !formData.quantity) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const selectedService = mockServices.find(s => s.id.toString() === formData.serviceId);
    
    // Check if service already exists for this repair
    const serviceExists = repairServices.some(
      rs => rs.repairId === selectedRepair && rs.serviceId === formData.serviceId
    );

    if (serviceExists) {
      alert('Dịch vụ này đã được thêm vào phiếu sửa');
      return;
    }

    const newRepairService = {
      id: `RS-${Date.now()}`,
      repairId: selectedRepair,
      serviceId: formData.serviceId,
      serviceName: selectedService.name,
      quantity: parseInt(formData.quantity),
      unitPrice: selectedService.unitPrice,
      totalPrice: selectedService.unitPrice * parseInt(formData.quantity),
      createdAt: new Date().toISOString(),
    };

    const updatedServices = [...repairServices, newRepairService];
    setRepairServices(updatedServices);
    localStorage.setItem('repairServices', JSON.stringify(updatedServices));
    setIsModalOpen(false);
    setFormData({
      serviceId: '',
      quantity: 1,
    });
  };

  const handleDeleteService = (id) => {
    const updatedServices = repairServices.filter(rs => rs.id !== id);
    setRepairServices(updatedServices);
    localStorage.setItem('repairServices', JSON.stringify(updatedServices));
  };

  const filteredRepairs = mockRepairs.filter(repair => {
    return repair.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
           repair.owner.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedRepairData = mockRepairs.find(r => r.id === selectedRepair);
  const repairServicesList = repairServices.filter(rs => rs.repairId === selectedRepair);
  const totalAmount = repairServicesList.reduce((sum, rs) => sum + rs.totalPrice, 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Chọn dịch vụ sửa chữa</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Repair Selection */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Chọn phiếu sửa</h2>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tìm kiếm biển số hoặc chủ xe..."
                className="w-full p-2 border rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredRepairs.map(repair => (
                <button
                  key={repair.id}
                  onClick={() => setSelectedRepair(repair.id)}
                  className={`w-full text-left p-3 rounded border-2 transition ${
                    selectedRepair === repair.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm">{repair.id}</div>
                  <div className="text-xs text-gray-600">{repair.licensePlate}</div>
                  <div className="text-xs text-gray-600">{repair.owner}</div>
                  <div className="text-xs text-gray-500 mt-1">{format(new Date(repair.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</div>
                  <div className="text-xs mt-1">
                    <span className={`px-2 py-1 rounded ${
                      repair.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      repair.status === 'repairing' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {repair.status === 'pending' ? 'Chờ xử lý' : repair.status === 'repairing' ? 'Đang sửa' : 'Hoàn thành'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Service List and Form */}
        <div className="md:col-span-2">
          {selectedRepair ? (
            <>
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Dịch vụ cho phiếu {selectedRepair}</h2>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                  >
                    <span className="mr-2">+</span> Thêm dịch vụ
                  </button>
                </div>

                {repairServicesList.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Chưa có dịch vụ nào được thêm
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Dịch vụ</th>
                            <th className="px-4 py-2 text-center font-medium text-gray-700">Số lượng</th>
                            <th className="px-4 py-2 text-right font-medium text-gray-700">Đơn giá</th>
                            <th className="px-4 py-2 text-right font-medium text-gray-700">Thành tiền</th>
                            <th className="px-4 py-2 text-center font-medium text-gray-700">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {repairServicesList.map(service => (
                            <tr key={service.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2">{service.serviceName}</td>
                              <td className="px-4 py-2 text-center">{service.quantity}</td>
                              <td className="px-4 py-2 text-right">{formatCurrency(service.unitPrice)}</td>
                              <td className="px-4 py-2 text-right font-semibold">{formatCurrency(service.totalPrice)}</td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  onClick={() => handleDeleteService(service.id)}
                                  className="text-red-600 hover:text-red-900 text-sm"
                                >
                                  Xóa
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 pt-4 border-t text-right">
                      <div className="text-lg font-bold">
                        Tổng cộng: {formatCurrency(totalAmount)}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Vui lòng chọn một phiếu sửa để xem hoặc thêm dịch vụ
            </div>
          )}
        </div>
      </div>

      {/* Add Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Thêm dịch vụ</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dịch vụ <span className="text-red-500">*</span></label>
                  <select
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Chọn dịch vụ</option>
                    {mockServices.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} - {formatCurrency(service.unitPrice)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    min="1"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Thêm dịch vụ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepairServices;
