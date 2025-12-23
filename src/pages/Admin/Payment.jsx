import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

// Mock data
const mockInvoices = [
  {
    id: 'INV-001',
    repairId: 'R-123',
    customerName: 'Nguyễn Văn A',
    licensePlate: '51A-12345',
    totalAmount: 2500000,
    paidAmount: 2500000,
    status: 'paid',
    createdAt: '2023-05-15T10:30:00',
    paymentDate: '2023-05-15T14:30:00',
  },
  {
    id: 'INV-002',
    repairId: 'R-124',
    customerName: 'Trần Thị B',
    licensePlate: '51B-67890',
    totalAmount: 1800000,
    paidAmount: 1000000,
    status: 'partial',
    createdAt: '2023-05-16T09:15:00',
    paymentDate: '2023-05-16T11:45:00',
  },
  {
    id: 'INV-003',
    repairId: 'R-125',
    customerName: 'Lê Văn C',
    licensePlate: '51C-11111',
    totalAmount: 3200000,
    paidAmount: 0,
    status: 'unpaid',
    createdAt: '2023-05-17T14:20:00',
    paymentDate: null,
  },
];

const Payment = () => {
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    paymentMethod: 'cash',
    note: '',
  });

  useEffect(() => {
    // In a real app, you would fetch this from your API
    setInvoices(mockInvoices);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayClick = (invoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      amount: invoice.totalAmount - (invoice.paidAmount || 0),
      paymentMethod: 'cash',
      note: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Vui lòng nhập số tiền thanh toán hợp lệ');
      return;
    }

    // In a real app, you would send this to your API
    const payment = {
      invoiceId: selectedInvoice.id,
      amount: parseFloat(formData.amount),
      paymentMethod: formData.paymentMethod,
      note: formData.note,
      paidAt: new Date().toISOString(),
    };

    console.log('Processing payment:', payment);
    
    // Update the invoice status
    const updatedInvoices = invoices.map(inv => {
      if (inv.id === selectedInvoice.id) {
        const newPaidAmount = (inv.paidAmount || 0) + payment.amount;
        return {
          ...inv,
          paidAmount: newPaidAmount,
          status: newPaidAmount >= inv.totalAmount ? 'paid' : 'partial',
          paymentDate: new Date().toISOString(),
        };
      }
      return inv;
    });

    setInvoices(updatedInvoices);
    setIsModalOpen(false);
    setSelectedInvoice(null);
    
    // Show success message
    alert(`Đã thanh toán thành công ${new Intl.NumberFormat('vi-VN').format(formData.amount)} VNĐ`);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-yellow-100 text-yellow-800',
      unpaid: 'bg-red-100 text-red-800',
    };
    const statusText = {
      paid: 'Đã thanh toán',
      partial: 'Thanh toán một phần',
      unpaid: 'Chưa thanh toán',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[status] || 'bg-gray-100'}`}>
        {statusText[status]}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
  };

  const filteredInvoices = invoices.filter(invoice => {
    return (
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto p-4">
      <div className="mb-2">
        <h1 className="text-2xl font-bold">Quản lý thanh toán</h1>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã hóa đơn, biển số hoặc tên khách hàng..."
          className="w-full md:w-1/2 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Không tìm thấy hóa đơn nào phù hợp
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã HĐ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày lập</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Đã thanh toán</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.customerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.licensePlate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(parseISO(invoice.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(invoice.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {formatCurrency(invoice.paidAmount || 0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {invoice.status !== 'paid' && (
                      <button
                        onClick={() => handlePayClick(invoice)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        Thanh toán
                      </button>
                    )}
                    <button className="text-blue-600 hover:text-blue-900">
                      Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Modal */}
      {isModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Thanh toán hóa đơn</h2>
              
              <div className="mb-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã hóa đơn:</span>
                  <span className="font-medium">{selectedInvoice.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Khách hàng:</span>
                  <span className="font-medium">{selectedInvoice.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Biển số xe:</span>
                  <span className="font-medium">{selectedInvoice.licensePlate}</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4 pt-2 border-t">
                  <span>Tổng tiền:</span>
                  <span className="text-blue-600">{formatCurrency(selectedInvoice.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Đã thanh toán:</span>
                  <span className="text-green-600">{formatCurrency(selectedInvoice.paidAmount || 0)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Còn lại:</span>
                  <span className="text-red-600">
                    {formatCurrency(selectedInvoice.totalAmount - (selectedInvoice.paidAmount || 0))}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmitPayment}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số tiền thanh toán <span className="text-red-500">*</span>
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₫</span>
                      </div>
                      <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        min="1"
                        max={selectedInvoice.totalAmount - (selectedInvoice.paidAmount || 0)}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm" id="price-currency">
                          VNĐ
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Số tiền tối đa: {formatCurrency(selectedInvoice.totalAmount - (selectedInvoice.paidAmount || 0))}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phương thức thanh toán
                    </label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="cash">Tiền mặt</option>
                      <option value="bank">Chuyển khoản</option>
                      <option value="card">Thẻ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleInputChange}
                      rows="2"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Nhập ghi chú (nếu có)"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedInvoice(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Xác nhận thanh toán
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

export default Payment;
