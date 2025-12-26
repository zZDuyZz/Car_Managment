import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit2, Wrench } from 'lucide-react';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Mock data - Replace with API call
  useEffect(() => {
    const mockVehicles = [
      { 
        id: 1, 
        licensePlate: '51A-12345', 
        brand: 'Toyota Camry', 
        owner: 'Nguyễn Văn A', 
        phone: '0912345678',
        status: 1, // 1: Chờ sửa, 2: Đang sửa, 3: Hoàn thành
        receivedDate: '2024-01-15'
      },
      { 
        id: 2, 
        licensePlate: '51B-67890', 
        brand: 'Honda Civic', 
        owner: 'Trần Thị B', 
        phone: '0987654321',
        status: 2,
        receivedDate: '2024-01-14'
      },
    ];
    setVehicles(mockVehicles);
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      1: { class: 'bg-yellow-100 text-yellow-800', text: 'Chờ sửa' },
      2: { class: 'bg-blue-100 text-blue-800', text: 'Đang sửa' },
      3: { class: 'bg-green-100 text-green-800', text: 'Hoàn thành' }
    };
    const statusInfo = statusMap[status] || { class: 'bg-gray-100 text-gray-800', text: 'Không xác định' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.class}`}>
        {statusInfo.text}
      </span>
    );
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVehicles.length > 0 ? (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusBadge(vehicle.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleCreateRepair(vehicle)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Tạo phiếu sửa chữa"
                      >
                        <Wrench size={18} />
                      </button>
                      <button
                        className="text-gray-600 hover:text-gray-900"
                        title="Chỉnh sửa thông tin xe"
                      >
                        <Edit2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy xe nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Repair Modal */}
      {isRepairModalOpen && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                Tạo phiếu sửa chữa - {selectedVehicle.licensePlate}
              </h2>
              <div className="text-sm text-gray-600 mb-4">
                Chủ xe: {selectedVehicle.owner} | Hiệu xe: {selectedVehicle.brand}
              </div>
              
              {/* Repair Form will be implemented here */}
              <div className="border rounded-lg p-4 mb-4">
                <h3 className="font-medium mb-2">Thông tin phiếu sửa chữa</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Biển số xe</label>
                    <input
                      type="text"
                      value={selectedVehicle.licensePlate}
                      disabled
                      className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sửa chữa</label>
                    <input
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
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
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 border-b">1</td>
                        <td className="px-4 py-2 border-b">
                          <input type="text" className="w-full px-2 py-1 border rounded" placeholder="Mô tả công việc..." />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input type="text" className="w-full px-2 py-1 border rounded" placeholder="Tên phụ tùng..." />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input type="number" className="w-full px-2 py-1 border rounded" placeholder="1" />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input type="number" className="w-full px-2 py-1 border rounded" placeholder="0" />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input type="number" className="w-full px-2 py-1 border rounded" placeholder="0" />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input type="number" className="w-full px-2 py-1 border rounded" placeholder="0" disabled />
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border-b">2</td>
                        <td className="px-4 py-2 border-b">
                          <input type="text" className="w-full px-2 py-1 border rounded" placeholder="Mô tả công việc..." />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input type="text" className="w-full px-2 py-1 border rounded" placeholder="Tên phụ tùng..." />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input type="number" className="w-full px-2 py-1 border rounded" placeholder="1" />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input type="number" className="w-full px-2 py-1 border rounded" placeholder="0" />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input type="number" className="w-full px-2 py-1 border rounded" placeholder="0" />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input type="number" className="w-full px-2 py-1 border rounded" placeholder="0" disabled />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">
                    + Thêm dòng
                  </button>
                  <div className="text-lg font-bold">
                    Tổng tiền: <span className="text-blue-600">0 VND</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsRepairModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lưu phiếu sửa chữa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;