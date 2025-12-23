import React, { useState, useEffect } from 'react';

const RepairRegulations = () => {
  const [regulations, setRegulations] = useState({
    processingTimes: {
      receiveCar: '1 giây/xe',
      createRepairForm: '1 giây/phiếu',
      searchCar: 'Ngay tức thì',
      createPaymentForm: '1 giây/phiếu',
      monthlyReport: '5 giây/báo cáo'
    },
    maxCarsPerDay: 15,
    maxRepairOrders: 50
  });

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load regulations from localStorage on component mount
  useEffect(() => {
    const savedRegulations = JSON.parse(localStorage.getItem('repairRegulations')) || {
      processingTimes: {
        receiveCar: '1 giây/xe',
        createRepairForm: '1 giây/phiếu',
        searchCar: 'Ngay tức thì',
        createPaymentForm: '1 giây/phiếu',
        monthlyReport: '5 giây/báo cáo'
      },
      maxCarsPerDay: 15,
      maxRepairOrders: 50
    };
    setRegulations(savedRegulations);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegulations(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage
    localStorage.setItem('repairRegulations', JSON.stringify(regulations));
    setSuccessMessage('Đã cập nhật quy định sửa chữa thành công!');
    setIsEditing(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Quy định sửa chữa</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tốc độ xử lý</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nghiệp vụ
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tốc độ xử lý
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Tiếp nhận xe
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {regulations.processingTimes.receiveCar}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Lập phiếu sửa chữa
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {regulations.processingTimes.createRepairForm}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Tra cứu xe
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {regulations.processingTimes.searchCar}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Lập phiếu thu tiền
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {regulations.processingTimes.createPaymentForm}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Lập báo cáo tháng
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {regulations.processingTimes.monthlyReport}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số xe sửa tối đa trong ngày <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="maxCarsPerDay"
                value={regulations.maxCarsPerDay}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="15"
                min="1"
                required
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số phiếu sửa tối đa <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="maxRepairOrders"
                value={regulations.maxRepairOrders}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="50"
                min="1"
                required
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  // Reset form
                  const savedRegulations = JSON.parse(localStorage.getItem('repairRegulations')) || {
                    processingTimes: {
                      receiveCar: '1 giây/xe',
                      createRepairForm: '1 giây/phiếu',
                      searchCar: 'Ngay tức thì',
                      createPaymentForm: '1 giây/phiếu',
                      monthlyReport: '5 giây/báo cáo'
                    },
                    maxCarsPerDay: 15,
                    maxRepairOrders: 50
                  };
                  setRegulations(savedRegulations);
                }}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepairRegulations;
