import React from 'react';

const RegulationsPage = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Quy Định</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="space-y-4">
                    <div className="border-b pb-4">
                        <h2 className="text-lg font-semibold mb-2">1. Quy định về giá dịch vụ</h2>
                        <p className="text-gray-600">Nội dung quy định về giá dịch vụ sẽ được cập nhật tại đây.</p>
                    </div>
                    <div className="border-b pb-4">
                        <h2 className="text-lg font-semibold mb-2">2. Quy trình tiếp nhận xe</h2>
                        <p className="text-gray-600">Nội dung quy trình tiếp nhận xe sẽ được cập nhật tại đây.</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold mb-2">3. Chính sách bảo hành</h2>
                        <p className="text-gray-600">Nội dung chính sách bảo hành sẽ được cập nhật tại đây.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegulationsPage;
