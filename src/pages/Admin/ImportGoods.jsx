import React, { useState, useEffect } from 'react';
import { Package, Plus, Calendar, Search, FileText, Trash2 } from 'lucide-react';

const ImportGoods = () => {
  const [imports, setImports] = useState([]);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    partId: '',
    quantity: '',
    note: ''
  });

  useEffect(() => {
    fetchImports();
    fetchParts();
  }, []);

  const fetchImports = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/imports');
      const result = await response.json();
      if (result.success) {
        setImports(result.data);
      }
    } catch (error) {
      console.error('Error fetching imports:', error);
    }
  };

  const fetchParts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/parts');
      const result = await response.json();
      if (result.success) {
        setParts(result.data);
      }
    } catch (error) {
      console.error('Error fetching parts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/imports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partId: parseInt(formData.partId),
          quantity: parseInt(formData.quantity),
          note: formData.note
        }),
      });

      const result = await response.json();
      if (result.success) {
        setShowModal(false);
        setFormData({ partId: '', quantity: '', note: '' });
        fetchImports();
        fetchParts(); // Refresh parts to update stock
        alert('Đã thêm phiếu nhập thành công!');
      } else {
        alert('Có lỗi xảy ra: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating import:', error);
      alert('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (importId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phiếu nhập này?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/imports/${importId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        fetchImports();
        fetchParts(); // Refresh parts to update stock
        alert('Đã xóa phiếu nhập thành công!');
      } else {
        alert('Có lỗi xảy ra: ' + result.message);
      }
    } catch (error) {
      console.error('Error deleting import:', error);
      alert('Không thể kết nối đến server');
    }
  };

  const filteredImports = imports.filter(imp =>
    imp.TenVatTuPhuTung?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    imp.GhiChu?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Package className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold">Quản lý nhập hàng</h1>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm phiếu nhập
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên phụ tùng hoặc ghi chú..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Import List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Danh sách phiếu nhập</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã phiếu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phụ tùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ghi chú
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredImports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    {searchTerm ? 'Không tìm thấy phiếu nhập nào' : 'Chưa có phiếu nhập nào'}
                  </td>
                </tr>
              ) : (
                filteredImports.map((imp) => (
                  <tr key={imp.MaPNVTPT} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{imp.MaPNVTPT}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {imp.TenVatTuPhuTung}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        +{imp.SoLuong}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {formatDate(imp.ThoiDiem)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {imp.GhiChu || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(imp.MaPNVTPT)}
                        className="text-red-600 hover:text-red-900 flex items-center"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Import Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Thêm phiếu nhập hàng</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phụ tùng <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.partId}
                  onChange={(e) => setFormData({...formData, partId: e.target.value})}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn phụ tùng</option>
                  {parts.map(part => (
                    <option key={part.MaPhuTung} value={part.MaPhuTung}>
                      {part.TenVatTuPhuTung} (Tồn: {part.SoLuong})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng nhập <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ghi chú về phiếu nhập..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Đang lưu...' : 'Lưu phiếu nhập'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportGoods;
