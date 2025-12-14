import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const mockVehicles = [
  { id: 1, licensePlate: '51A-12345', owner: 'Nguyễn Văn A' },
  { id: 2, licensePlate: '51B-67890', owner: 'Trần Thị B' },
  { id: 3, licensePlate: '51C-11111', owner: 'Lê Văn C' },
];

const mockStaff = [
  { id: 1, name: 'Nhân viên 1' },
  { id: 2, name: 'Nhân viên 2' },
  { id: 3, name: 'Nhân viên 3' },
];

const Repairs = () => {
  const [repairs, setRepairs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    vehicleId: '',
    staffId: '',
    initialCondition: '',
    status: 'pending',
  });

  useEffect(() => {
    const savedRepairs = JSON.parse(localStorage.getItem('repairs')) || [];
    setRepairs(savedRepairs);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.vehicleId || !formData.staffId || !formData.initialCondition) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    let updatedRepairs;

    if (editingId) {
      // Update existing repair
      updatedRepairs = repairs.map(repair => 
        repair.id === editingId 
          ? {
              ...repair,
              vehicleId: formData.vehicleId,
              staffId: formData.staffId,
              initialCondition: formData.initialCondition,
              status: formData.status,
              updatedAt: new Date().toISOString(),
            }
          : repair
      );
    } else {
      // Create new repair
      const newRepair = {
        id: `R-${Date.now()}`,
        vehicleId: formData.vehicleId,
        staffId: formData.staffId,
        initialCondition: formData.initialCondition,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedRepairs = [...repairs, newRepair];
    }

    setRepairs(updatedRepairs);
    localStorage.setItem('repairs', JSON.stringify(updatedRepairs));
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      vehicleId: '',
      staffId: '',
      initialCondition: '',
      status: 'pending',
    });
  };

  const handleEdit = (repair) => {
    setEditingId(repair.id);
    setFormData({
      vehicleId: repair.vehicleId,
      staffId: repair.staffId,
      initialCondition: repair.initialCondition,
      status: repair.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phiếu sửa chữa này?')) {
      const updatedRepairs = repairs.filter(repair => repair.id !== id);
      setRepairs(updatedRepairs);
      localStorage.setItem('repairs', JSON.stringify(updatedRepairs));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      vehicleId: '',
      staffId: '',
      initialCondition: '',
      status: 'pending',
    });
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

  const filteredRepairs = repairs.filter(repair => {
    const vehicle = mockVehicles.find(v => v.id.toString() === repair.vehicleId);
    return vehicle?.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
           vehicle?.owner.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý sửa chữa</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <span className="mr-2">+</span> Tạo phiếu sửa chữa
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm biển số hoặc chủ xe..."
          className="w-full md:w-1/3 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredRepairs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Chưa có phiếu sửa chữa nào
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã phiếu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhân viên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tiếp nhận</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRepairs.map((repair) => {
                const vehicle = mockVehicles.find(v => v.id.toString() === repair.vehicleId) || {};
                const staff = mockStaff.find(s => s.id.toString() === repair.staffId) || {};
                
                return (
                  <tr key={repair.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{repair.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{vehicle.licensePlate}</div>
                      <div className="text-gray-400 text-xs">{vehicle.owner}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staff.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(repair.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStatusBadge(repair.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleEdit(repair)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(repair.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingId ? 'Cập nhật phiếu sửa chữa' : 'Tạo phiếu sửa chữa mới'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Xe <span className="text-red-500">*</span></label>
                    <select
                      name="vehicleId"
                      value={formData.vehicleId}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Chọn xe</option>
                      {mockVehicles.map(vehicle => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.licensePlate} - {vehicle.owner}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nhân viên phụ trách <span className="text-red-500">*</span></label>
                    <select
                      name="staffId"
                      value={formData.staffId}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="">Chọn nhân viên</option>
                      {mockStaff.map(staff => (
                        <option key={staff.id} value={staff.id}>{staff.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tình trạng xe <span className="text-red-500">*</span></label>
                    <textarea
                      name="initialCondition"
                      value={formData.initialCondition}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full p-2 border rounded"
                      placeholder="Mô tả tình trạng xe khi tiếp nhận..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái <span className="text-red-500">*</span></label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="repairing">Đang sửa</option>
                      <option value="done">Hoàn thành</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingId ? 'Cập nhật' : 'Lưu phiếu'}
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

export default Repairs;
