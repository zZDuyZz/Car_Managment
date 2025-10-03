import React from 'react';

const InventoryPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Báo Cáo Tồn Kho Phụ Tùng</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm phụ tùng..."
                        className="w-full p-2 border rounded"
                    />
                </div>
                <p className="text-gray-600">Danh sách tồn kho phụ tùng sẽ được hiển thị tại đây.</p>
            </div>
        </div>
    );
};

export default InventoryPage;
