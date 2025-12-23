import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const SpareParts = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [availableParts, setAvailableParts] = useState([]);
  const [selectedRepair, setSelectedRepair] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    sparePartId: '',
    quantity: 1,
  });
  const [stockError, setStockError] = useState('');

  useEffect(() => {
    loadSpareParts();
    loadRepairs();
    loadAvailableParts();
  }, []);

  const loadSpareParts = async () => {
    try {
      // TODO: Replace with real API call when spare parts API is ready
      // const response = await apiService.getSpareParts();
      // if (response.success) {
      //   setSpareParts(response.data);
      // }
      
      // For now, start with empty array (no mock data)
      setSpareParts([]);
    } catch (error) {
      console.error('Error loading spare parts:', error);
      setSpareParts([]);
    }
  };

  const loadRepairs = async () => {
    try {
      // TODO: Replace with real API call when repairs API is ready
      // const response = await apiService.getRepairs();
      // if (response.success) {
      //   setRepairs(response.data);
      // }
      
      // For now, start with empty array (no mock data)
      setRepairs([]);
    } catch (error) {
      console.error('Error loading repairs:', error);
      setRepairs([]);
    }
  };

  const loadAvailableParts = async () => {
    try {
      // TODO: Replace with real API call when available parts API is ready
      // const response = await apiService.getAvailableParts();
      // if (response.success) {
      //   setAvailableParts(response.data);
      // }
      
      // For now, start with empty array (no mock data)
      setAvailableParts([]);
    } catch (error) {
      console.error('Error loading available parts:', error);
      setAvailableParts([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'quantity') {
      const selectedPart = availableParts.find(p => p.id.toString() === formData.sparePartId);
      const qty = parseInt(value);
      
      if (selectedPart && qty > selectedPart.stock) {
        setStockError(`Tồn kho chỉ còn ${selectedPart.stock} cái`);
      } else {
        setStockError('');
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedRepair || !formData.sparePartId || !formData.quantity) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const selectedPart = availableParts.find(p => p.id.toString() === formData.sparePartId);
    const qty = parseInt(formData.quantity);

    if (qty > selectedPart.stock) {
      alert(`Tồn kho chỉ còn ${selectedPart.stock} cái`);
      return;
    }

    // Check if spare part already exists for this repair
    const partExists = spareParts.some(
      sp => sp.repairId === selectedRepair && sp.sparePartId === formData.sparePartId
    );

    if (partExists) {
      alert('Phụ tùng này đã được thêm vào phiếu sửa');
      return;
    }

    const newSparePart = {
      id: `SP-${Date.now()}`,
      repairId: selectedRepair,
      sparePartId: formData.sparePartId,
      sparePartName: selectedPart.name,
      quantity: qty,
      unitPrice: selectedPart.unitPrice,
      totalPrice: selectedPart.unitPrice * qty,
      createdAt: new Date().toISOString(),
    };

    const updatedSpareParts = [...spareParts, newSparePart];
    setSpareParts(updatedSpareParts);
    localStorage.setItem('spareParts', JSON.stringify(updatedSpareParts));
    
    // Update stock
    const updatedStock = availableParts.map(p => 
      p.id.toString() === formData.sparePartId 
        ? { ...p, stock: p.stock - qty }
        : p
    );
    setAvailableParts(updatedStock);
    
    setIsModalOpen(false);
    setFormData({
      sparePartId: '',
      quantity: 1,
    });
    setStockError('');
  };

  const handleDeletePart = (id) => {
    const partToDelete = spareParts.find(sp => sp.id === id);
    
    if (window.confirm('Bạn có chắc chắn muốn xóa phụ tùng này?')) {
      const updatedSpareParts = spareParts.filter(sp => sp.id !== id);
      setSpareParts(updatedSpareParts);
      localStorage.setItem('spareParts', JSON.stringify(updatedSpareParts));
      
      // Restore stock
      const updatedStock = availableParts.map(p => 
        p.id.toString() === partToDelete.sparePartId 
          ? { ...p, stock: p.stock + partToDelete.quantity }
          : p
      );
      setAvailableParts(updatedStock);
    }
  };

  const filteredRepairs = repairs.filter(repair => {
    return repair.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
           repair.owner.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const selectedRepairData = repairs.find(r => r.id === selectedRepair);
  const repairPartsList = spareParts.filter(sp => sp.repairId === selectedRepair);
  const totalAmount = repairPartsList.reduce((sum, sp) => sum + sp.totalPrice, 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const getAvailableStock = (sparePartId) => {
    const part = availableParts.find(p => p.id.toString() === sparePartId);
    return part ? part.stock : 0;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Chọn phụ tùng thay thế</h1>

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
              {filteredRepairs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Chưa có phiếu sửa nào. Tạo phiếu sửa chữa trước.
                </div>
              ) : (
                filteredRepairs.map(repair => (
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
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Spare Parts List and Form */}
        <div className="md:col-span-2">
          {selectedRepair ? (
            <>
              <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Phụ tùng cho phiếu {selectedRepair}</h2>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                  >
                    <span className="mr-2">+</span> Thêm phụ tùng
                  </button>
                </div>

                {repairPartsList.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    Chưa có phụ tùng nào được thêm
                  </div>
                ) : (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium text-gray-700">Phụ tùng</th>
                            <th className="px-4 py-2 text-center font-medium text-gray-700">Số lượng</th>
                            <th className="px-4 py-2 text-right font-medium text-gray-700">Đơn giá</th>
                            <th className="px-4 py-2 text-right font-medium text-gray-700">Thành tiền</th>
                            <th className="px-4 py-2 text-center font-medium text-gray-700">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {repairPartsList.map(part => (
                            <tr key={part.id} className="hover:bg-gray-50">
                              <td className="px-4 py-2">{part.sparePartName}</td>
                              <td className="px-4 py-2 text-center">{part.quantity}</td>
                              <td className="px-4 py-2 text-right">{formatCurrency(part.unitPrice)}</td>
                              <td className="px-4 py-2 text-right font-semibold">{formatCurrency(part.totalPrice)}</td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  onClick={() => handleDeletePart(part.id)}
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
              Vui lòng chọn một phiếu sửa để xem hoặc thêm phụ tùng
            </div>
          )}
        </div>
      </div>

      {/* Add Spare Part Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Thêm phụ tùng</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phụ tùng <span className="text-red-500">*</span></label>
                  <select
                    name="sparePartId"
                    value={formData.sparePartId}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Chọn phụ tùng</option>
                    {availableParts.map(part => (
                      <option key={part.id} value={part.id}>
                        {part.name} - {formatCurrency(part.unitPrice)} (Tồn: {part.stock})
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
                    className={`w-full p-2 border rounded ${stockError ? 'border-red-500' : ''}`}
                    min="1"
                    max={formData.sparePartId ? getAvailableStock(formData.sparePartId) : 999}
                    required
                  />
                  {stockError && (
                    <p className="text-red-500 text-xs mt-1">{stockError}</p>
                  )}
                  {formData.sparePartId && (
                    <p className="text-gray-500 text-xs mt-1">
                      Tồn kho: {getAvailableStock(formData.sparePartId)}
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setFormData({ sparePartId: '', quantity: 1 });
                      setStockError('');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={!!stockError}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Thêm phụ tùng
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

export default SpareParts;
