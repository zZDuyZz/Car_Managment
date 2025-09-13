import React, { useState } from 'react';
import { FaFileInvoice, FaWrench, FaMoneyBillWave, FaPlus, FaTrash, FaPlusCircle, FaArrowLeft } from 'react-icons/fa';

const initialForms = [
    {
        id: 1,
        licensePlate: '51G-123.45',
        customerName: 'Nguyễn Văn A',
        receptionDate: '2024-05-10',
        repairItems: [{ item: 'Thay dầu động cơ', quantity: 1, unitPrice: 500000 }],
        laborCost: 200000,
        totalCost: 700000,
    },
    {
        id: 2,
        licensePlate: '29A-678.90',
        customerName: 'Trần Thị B',
        receptionDate: '2024-05-09',
        repairItems: [{ item: 'Sửa lốp xe', quantity: 1, unitPrice: 150000 }, { item: 'Kiểm tra phanh', quantity: 1, unitPrice: 100000 }],
        laborCost: 50000,
        totalCost: 300000,
    },
];

const RepairForm = () => {
    const [formData, setFormData] = useState({
        licensePlate: '',
        customerName: '',
        receptionDate: new Date().toISOString().slice(0, 10),
        repairItems: [{ item: '', quantity: 1, unitPrice: 0 }],
        laborCost: 0,
        notes: '',
    });
    // Khởi tạo danh sách với dữ liệu giả định
    const [savedForms, setSavedForms] = useState(initialForms);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...formData.repairItems];
        newItems[index] = {
            ...newItems[index],
            [name]: name === 'quantity' || name === 'unitPrice' ? parseFloat(value) || 0 : value
        };
        setFormData({ ...formData, repairItems: newItems });
    };

    const handleAddItem = () => {
        setFormData({
            ...formData,
            repairItems: [...formData.repairItems, { item: '', quantity: 1, unitPrice: 0 }],
        });
    };

    const handleRemoveItem = (index) => {
        const newItems = formData.repairItems.filter((_, i) => i !== index);
        setFormData({ ...formData, repairItems: newItems });
    };

    const totalCost =
        formData.repairItems.reduce((total, item) => total + item.quantity * item.unitPrice, 0) +
        parseFloat(formData.laborCost || 0);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Thêm form mới vào danh sách các form đã lưu
        setSavedForms([...savedForms, { ...formData, id: Date.now(), totalCost }]);

        // Hiển thị thông báo thành công
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000); // Tự động ẩn sau 3 giây

        // Ẩn form và hiển thị danh sách
        setShowForm(false);

        // Reset form sau khi gửi
        setFormData({
            licensePlate: '',
            customerName: '',
            receptionDate: new Date().toISOString().slice(0, 10),
            repairItems: [{ item: '', quantity: 1, unitPrice: 0 }],
            laborCost: 0,
            notes: '',
        });
    };

    const handleCreateNewForm = () => {
        setShowForm(true);
    };

    return (
        <div className="bg-gray-100 p-8 min-h-screen">
            <div className="max-w-4xl mx-auto mb-8">
                {/* Button để hiển thị form */}
                {!showForm && (
                    <div className="text-center mb-8">
                        <button
                            onClick={handleCreateNewForm}
                            className="bg-blue-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg flex items-center justify-center mx-auto"
                        >
                            <FaPlusCircle className="mr-2" /> Tạo Phiếu Sửa chữa Mới
                        </button>
                    </div>
                )}

                {/* Form sửa chữa (hiển thị có điều kiện) */}
                {showForm && (
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                                <FaFileInvoice className="mr-3 text-blue-500" /> Phiếu Sửa chữa
                            </h1>
                            <button
                                onClick={() => setShowForm(false)}
                                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-full font-semibold hover:bg-gray-400 transition flex items-center"
                            >
                                <FaArrowLeft className="mr-2" /> Quay lại
                            </button>
                        </div>

                        {showSuccessMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                                <strong className="font-bold">Thành công!</strong>
                                <span className="block sm:inline ml-2">Phiếu sửa chữa đã được lưu.</span>
                                <span
                                    className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
                                    onClick={() => setShowSuccessMessage(false)}
                                >
                                    ✖
                                </span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Biển số xe:</label>
                                    <input
                                        type="text"
                                        name="licensePlate"
                                        value={formData.licensePlate}
                                        onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                                        className="p-3 border rounded-lg w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Tên khách hàng:</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                        className="p-3 border rounded-lg w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1">Ngày tiếp nhận:</label>
                                    <input
                                        type="date"
                                        name="receptionDate"
                                        value={formData.receptionDate}
                                        onChange={(e) => setFormData({ ...formData, receptionDate: e.target.value })}
                                        className="p-3 border rounded-lg w-full"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                                    <FaWrench className="mr-2" /> Danh sách vật tư & dịch vụ
                                </h2>
                                {formData.repairItems.map((item, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-lg items-end">
                                        <div className="flex-1">
                                            <label className="block text-gray-600 mb-1">Hạng mục</label>
                                            <input
                                                type="text"
                                                name="item"
                                                value={item.item}
                                                onChange={(e) => handleItemChange(index, e)}
                                                placeholder="Tên vật tư hoặc dịch vụ"
                                                className="p-2 border rounded-lg w-full"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-600 mb-1">Số lượng</label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, e)}
                                                className="p-2 border rounded-lg w-full md:w-24"
                                                min="1"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-600 mb-1">Đơn giá (VND)</label>
                                            <input
                                                type="number"
                                                name="unitPrice"
                                                value={item.unitPrice}
                                                onChange={(e) => handleItemChange(index, e)}
                                                className="p-2 border rounded-lg w-full md:w-32"
                                                min="0"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(index)}
                                            className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition h-10"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    className="w-full bg-green-500 text-white py-2 rounded-lg flex items-center justify-center hover:bg-green-600 transition mt-4"
                                >
                                    <FaPlus className="mr-2" /> Thêm hạng mục
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1 flex items-center">
                                        <FaMoneyBillWave className="mr-2" /> Chi phí nhân công (VND)
                                    </label>
                                    <input
                                        type="number"
                                        name="laborCost"
                                        value={formData.laborCost}
                                        onChange={(e) =>
                                            setFormData({ ...formData, laborCost: parseFloat(e.target.value) || 0 })
                                        }
                                        className="p-3 border rounded-lg w-full"
                                        min="0"
                                        required
                                    />
                                </div>
                                <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between">
                                    <span className="text-xl font-bold text-gray-800">Tổng chi phí:</span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {totalCost.toLocaleString()} VND
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-1">Ghi chú</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows="4"
                                    className="w-full p-3 border rounded-lg"
                                    placeholder="Thêm ghi chú về quá trình sửa chữa..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                            >
                                Lưu Phiếu Sửa chữa
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Phần hiển thị danh sách các phiếu đã lưu */}
            {savedForms.length > 0 && (
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh sách phiếu sửa chữa đã lưu</h2>
                    <div className="space-y-4">
                        {savedForms.map((form) => (
                            <div key={form.id} className="border p-4 rounded-lg shadow-sm">
                                <p><strong>Biển số xe:</strong> {form.licensePlate}</p>
                                <p><strong>Khách hàng:</strong> {form.customerName}</p>
                                <p><strong>Ngày tiếp nhận:</strong> {form.receptionDate}</p>
                                <h3 className="text-lg font-semibold mt-2">Chi tiết:</h3>
                                <ul className="list-disc list-inside ml-4">
                                    {form.repairItems.map((item, index) => (
                                        <li key={index}>{item.item} - {item.quantity} x {item.unitPrice.toLocaleString()} VND</li>
                                    ))}
                                </ul>
                                <p className="mt-2"><strong>Chi phí nhân công:</strong> {form.laborCost.toLocaleString()} VND</p>
                                <p className="mt-2 text-xl font-bold text-blue-600">Tổng chi phí: {form.totalCost.toLocaleString()} VND</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RepairForm;
