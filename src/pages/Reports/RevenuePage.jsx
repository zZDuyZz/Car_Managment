import React from 'react';

const RevenuePage = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Báo Cáo Doanh Thu Tháng</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Chọn tháng:</label>
                    <input 
                        type="month" 
                        className="p-2 border rounded"
                    />
                </div>
                <p className="text-gray-600">Biểu đồ và báo cáo doanh thu sẽ được hiển thị tại đây.</p>
            </div>
        </div>
    );
};

export default RevenuePage;
