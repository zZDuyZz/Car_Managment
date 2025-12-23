import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [repairs, setRepairs] = useState([]);
  const [repairServices, setRepairServices] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadInvoices();
    loadRepairs();
    loadRepairServices();
    loadSpareParts();
  }, []);

  const loadInvoices = async () => {
    try {
      // TODO: Replace with real API call when invoices API is ready
      // const response = await apiService.getInvoices();
      // if (response.success) {
      //   setInvoices(response.data);
      // }
      
      // For now, start with empty array (no mock data)
      setInvoices([]);
    } catch (error) {
      console.error('Error loading invoices:', error);
      setInvoices([]);
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

  const loadRepairServices = async () => {
    try {
      // TODO: Replace with real API call when repair services API is ready
      // const response = await apiService.getRepairServices();
      // if (response.success) {
      //   setRepairServices(response.data);
      // }
      
      // For now, start with empty array (no mock data)
      setRepairServices([]);
    } catch (error) {
      console.error('Error loading repair services:', error);
      setRepairServices([]);
    }
  };

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

  const getRepairServices = (repairId) => {
    return repairServices.filter(rs => rs.repairId === repairId);
  };

  const getRepairSpareParts = (repairId) => {
    return spareParts.filter(sp => sp.repairId === repairId);
  };

  const calculateTotal = (repairId) => {
    const services = getRepairServices(repairId);
    const parts = getRepairSpareParts(repairId);
    
    const serviceTotal = services.reduce((sum, s) => sum + s.totalPrice, 0);
    const partsTotal = parts.reduce((sum, p) => sum + p.totalPrice, 0);
    
    return serviceTotal + partsTotal;
  };

  const handleCreateInvoice = (repair) => {
    // Check if repair is done
    if (repair.status !== 'done') {
      alert('Chỉ có thể lập hóa đơn khi trạng thái là "Hoàn thành"');
      return;
    }

    // Check if invoice already exists
    const invoiceExists = invoices.some(inv => inv.repairId === repair.id);
    if (invoiceExists) {
      alert('Hóa đơn cho phiếu sửa này đã được lập');
      return;
    }

    // Check if repair has services or spare parts
    const services = getRepairServices(repair.id);
    const parts = getRepairSpareParts(repair.id);
    
    if (services.length === 0 && parts.length === 0) {
      alert('Phiếu sửa chưa có dịch vụ hoặc phụ tùng');
      return;
    }

    setSelectedRepair(repair);
    setIsModalOpen(true);
  };

  const handleSubmitInvoice = () => {
    if (!selectedRepair) return;

    const newInvoice = {
      id: `INV-${Date.now()}`,
      repairId: selectedRepair.id,
      vehicleId: selectedRepair.vehicleId,
      licensePlate: selectedRepair.licensePlate,
      owner: selectedRepair.owner,
      totalAmount: calculateTotal(selectedRepair.id),
      createdAt: new Date().toISOString(),
      status: 'completed',
    };

    const updatedInvoices = [...invoices, newInvoice];
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    
    setIsModalOpen(false);
    setSelectedRepair(null);
    alert('Hóa đơn đã được lập thành công!');
  };

  const handlePrintInvoice = (invoice) => {
    const services = getRepairServices(invoice.repairId);
    const parts = getRepairSpareParts(invoice.repairId);

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn ${invoice.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { margin: 0; }
            .info { margin-bottom: 20px; }
            .info-row { display: flex; justify-content: space-between; margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .total { text-align: right; font-weight: bold; font-size: 16px; margin-top: 20px; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>HÓA ĐƠN</h1>
            <p>${invoice.id}</p>
          </div>
          
          <div class="info">
            <div class="info-row">
              <span><strong>Biển số xe:</strong> ${invoice.licensePlate}</span>
              <span><strong>Chủ xe:</strong> ${invoice.owner}</span>
            </div>
            <div class="info-row">
              <span><strong>Phiếu sửa:</strong> ${invoice.repairId}</span>
              <span><strong>Ngày lập:</strong> ${format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</span>
            </div>
          </div>

          <h3>Chi tiết dịch vụ</h3>
          <table>
            <tr>
              <th>Dịch vụ</th>
              <th style="text-align: center;">Số lượng</th>
              <th style="text-align: right;">Đơn giá</th>
              <th style="text-align: right;">Thành tiền</th>
            </tr>
            ${services.map(s => `
              <tr>
                <td>${s.serviceName}</td>
                <td style="text-align: center;">${s.quantity}</td>
                <td style="text-align: right;">${s.unitPrice.toLocaleString('vi-VN')} đ</td>
                <td style="text-align: right;">${s.totalPrice.toLocaleString('vi-VN')} đ</td>
              </tr>
            `).join('')}
          </table>

          <h3>Chi tiết phụ tùng</h3>
          <table>
            <tr>
              <th>Phụ tùng</th>
              <th style="text-align: center;">Số lượng</th>
              <th style="text-align: right;">Đơn giá</th>
              <th style="text-align: right;">Thành tiền</th>
            </tr>
            ${parts.map(p => `
              <tr>
                <td>${p.sparePartName}</td>
                <td style="text-align: center;">${p.quantity}</td>
                <td style="text-align: right;">${p.unitPrice.toLocaleString('vi-VN')} đ</td>
                <td style="text-align: right;">${p.totalPrice.toLocaleString('vi-VN')} đ</td>
              </tr>
            `).join('')}
          </table>

          <div class="total">
            Tổng cộng: ${invoice.totalAmount.toLocaleString('vi-VN')} đ
          </div>

          <div class="footer">
            <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
            <p>Ngày in: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const filteredRepairs = repairs.filter(repair => {
    return repair.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
           repair.owner.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const completedRepairs = filteredRepairs.filter(r => r.status === 'done');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Hoàn tất sửa chữa & Lập hóa đơn</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Repair Selection */}
        <div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Phiếu sửa hoàn thành</h2>
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
              {completedRepairs.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Chưa có phiếu sửa hoàn thành. Tạo phiếu sửa chữa và hoàn thành trước.
                </div>
              ) : (
                completedRepairs.map(repair => {
                  const invoiceExists = invoices.some(inv => inv.repairId === repair.id);
                  return (
                    <div key={repair.id} className="p-3 border rounded hover:bg-gray-50">
                      <div className="font-semibold text-sm">{repair.id}</div>
                      <div className="text-xs text-gray-600">{repair.licensePlate}</div>
                      <div className="text-xs text-gray-600">{repair.owner}</div>
                      <div className="text-xs text-gray-500 mt-1">{format(new Date(repair.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</div>
                      <button
                        onClick={() => handleCreateInvoice(repair)}
                        disabled={invoiceExists}
                        className={`w-full mt-2 py-2 rounded text-sm font-medium ${
                          invoiceExists
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {invoiceExists ? 'Hóa đơn đã lập' : 'Lập hóa đơn'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Invoices List */}
        <div>
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Danh sách hóa đơn</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {invoices.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Chưa có hóa đơn nào
                </div>
              ) : (
                invoices.map(invoice => (
                  <div key={invoice.id} className="p-3 border rounded hover:bg-gray-50">
                    <div className="font-semibold text-sm">{invoice.id}</div>
                    <div className="text-xs text-gray-600">{invoice.licensePlate}</div>
                    <div className="text-xs text-gray-600">{invoice.owner}</div>
                    <div className="text-xs text-gray-500 mt-1">{format(new Date(invoice.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}</div>
                    <div className="text-sm font-bold text-blue-600 mt-2">{formatCurrency(invoice.totalAmount)}</div>
                    <button
                      onClick={() => handlePrintInvoice(invoice)}
                      className="w-full mt-2 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700"
                    >
                      In hóa đơn
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {isModalOpen && selectedRepair && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Xác nhận lập hóa đơn</h2>
              
              <div className="mb-4 p-4 bg-gray-50 rounded">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Mã phiếu sửa</p>
                    <p className="font-semibold">{selectedRepair.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Biển số xe</p>
                    <p className="font-semibold">{selectedRepair.licensePlate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chủ xe</p>
                    <p className="font-semibold">{selectedRepair.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày lập</p>
                    <p className="font-semibold">{format(new Date(), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Chi tiết dịch vụ</h3>
                <div className="bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
                  {getRepairServices(selectedRepair.id).length === 0 ? (
                    <p className="text-sm text-gray-500">Không có dịch vụ</p>
                  ) : (
                    getRepairServices(selectedRepair.id).map(s => (
                      <div key={s.id} className="flex justify-between text-sm py-1">
                        <span>{s.serviceName} x{s.quantity}</span>
                        <span>{formatCurrency(s.totalPrice)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold mb-2">Chi tiết phụ tùng</h3>
                <div className="bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
                  {getRepairSpareParts(selectedRepair.id).length === 0 ? (
                    <p className="text-sm text-gray-500">Không có phụ tùng</p>
                  ) : (
                    getRepairSpareParts(selectedRepair.id).map(p => (
                      <div key={p.id} className="flex justify-between text-sm py-1">
                        <span>{p.sparePartName} x{p.quantity}</span>
                        <span>{formatCurrency(p.totalPrice)}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mb-6 p-4 bg-blue-50 rounded border-2 border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-blue-600">{formatCurrency(calculateTotal(selectedRepair.id))}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedRepair(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitInvoice}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Lập hóa đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;
