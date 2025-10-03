import React from 'react';

const VehicleSearchPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Tra Cứu Xe</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                    <input 
                        type="text" 
                        placeholder="Nhập biển số xe hoặc thông tin khách hàng..."
                        className="w-full p-2 border rounded"
                    />
                </div>
                <p className="text-gray-600">Kết quả tìm kiếm sẽ được hiển thị tại đây.</p>
            </div>
        </div>
    );
};

export default VehicleSearchPage;
