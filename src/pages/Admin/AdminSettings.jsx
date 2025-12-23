import { useEffect, useState } from "react";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        maxCars: 30,
        maxBrands: 10,
        maxParts: 200,
        maxLabors: 100,
    });

    useEffect(() => {
        // fetch('/api/settings').then(res => res.json()).then(setSettings)
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: Number(value) });
    };

    const handleSave = (e) => {
        e.preventDefault();
        // TODO: POST settings to backend
        alert("Đã lưu cài đặt");
    };

    const settingsGroups = [
        {
            title: "Quy định tiếp nhận xe",
            description: "Cấu hình các thông số tiếp nhận và xử lý xe",
            items: [
                {
                    label: "Số lượng xe tối đa/ngày",
                    name: "maxCars",
                    description: "Số lượng xe tối đa có thể tiếp nhận trong một ngày"
                },
                {
                    label: "Số hãng xe quản lý",
                    name: "maxBrands",
                    description: "Tổng số hãng xe mà garage hỗ trợ sửa chữa"
                }
            ]
        },
        {
            title: "Quản lý vật tư",
            description: "Cấu hình thông số quản lý vật tư và dịch vụ",
            items: [
                {
                    label: "Số loại phụ tùng",
                    name: "maxParts",
                    description: "Tổng số loại phụ tùng được quản lý trong kho"
                },
                {
                    label: "Số loại dịch vụ",
                    name: "maxLabors",
                    description: "Tổng số loại dịch vụ sửa chữa được cung cấp"
                }
            ]
        }
    ];

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">Cấu hình hệ thống</h1>
                    <p className="text-gray-600 mt-1">Quản lý các thiết lập và giới hạn của hệ thống</p>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    {settingsGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                                <h2 className="text-lg font-semibold text-gray-800">{group.title}</h2>
                                <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {group.items.map((item) => (
                                        <div key={item.name} className="space-y-1">
                                            <label className="block text-sm font-medium text-gray-700">
                                                {item.label}
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                name={item.name}
                                                value={settings[item.name]}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}