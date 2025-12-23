import React from 'react';

const ImportGoods = () => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nhập hàng</h1>
        <button 
          onClick={() => {}}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Thêm phiếu nhập
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Nội dung quản lý nhập hàng sẽ được hiển thị tại đây.</p>
      </div>
    </div>
  );
};

export default ImportGoods;
