import { useEffect, useState } from "react";
import { Settings, Save, RotateCcw } from "lucide-react";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        maxCars: 30,
        maxBrands: 10,
        maxParts: 200,
        maxLabors: 100,
    });
    const [loading, setLoading] = useState(false);
    const [originalSettings, setOriginalSettings] = useState({});

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/settings');
            const result = await response.json();
            if (result.success) {
                setSettings(result.data);
                setOriginalSettings(result.data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            // Use default values if API fails
            setOriginalSettings(settings);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: Number(value) });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            const result = await response.json();
            if (result.success) {
                setOriginalSettings(settings);
                alert("Đã lưu cài đặt thành công!");
            } else {
                alert("Có lỗi xảy ra: " + result.message);
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert("Không thể kết nối đến server");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        if (confirm("Bạn có chắc chắn muốn khôi phục về cài đặt ban đầu?")) {
            setSettings(originalSettings);
        }
    };

    const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

    const settingsGroups = [
        {
            title: "Quy định tiếp nhận xe",
            description: "Cấu hình các thông số tiếp nhận và xử lý xe",
            icon: "🚗",
            items: [
                {
                    label: "Số lượng xe tối đa/ngày",
                    name: "maxCars",
                    description: "Số lượng xe tối đa có thể tiếp nhận trong một ngày",
                    min: 1,
                    max: 100
                },
                {
                    label: "Số hãng xe quản lý",
                    name: "maxBrands",
                    description: "Tổng số hãng xe mà garage hỗ trợ sửa chữa",
                    min: 1,
                    max: 50
                }
            ]
        },
        {
            title: "Quản lý vật tư",
            description: "Cấu hình thông số quản lý vật tư và dịch vụ",
            icon: "📦",
            items: [
                {
                    label: "Số loại phụ tùng",
                    name: "maxParts",
                    description: "Tổng số loại phụ tùng được quản lý trong kho",
                    min: 1,
                    max: 1000
                },
                {
                    label: "Số loại dịch vụ",
                    name: "maxLabors",
                    description: "Tổng số loại dịch vụ sửa chữa được cung cấp",
                    min: 1,
                    max: 500
                }
            ]
        }
    ];

    return (
        <div className="p-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Settings className="w-8 h-8 text-blue-600 mr-3" />
                        <h1 className="text-2xl font-bold text-gray-800">Cấu hình hệ thống</h1>
                    </div>
                    <p className="text-gray-600">Quản lý các thiết lập và giới hạn của hệ thống garage</p>
                    
                    {hasChanges && (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-yellow-800 text-sm">
                                ⚠️ Bạn có thay đổi chưa được lưu. Nhấn "Lưu thay đổi" để áp dụng.
                            </p>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    {settingsGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-3">{group.icon}</span>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">{group.title}</h2>
                                        <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {group.items.map((item) => (
                                        <div key={item.name} className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                {item.label}
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min={item.min}
                                                    max={item.max}
                                                    name={item.name}
                                                    value={settings[item.name]}
                                                    onChange={handleChange}
                                                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                                                />
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <span className="text-gray-400 text-sm">
                                                        {item.min}-{item.max}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {item.description}
                                            </p>
                                            
                                            {/* Progress bar showing current value */}
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                    style={{ 
                                                        width: `${Math.min((settings[item.name] / item.max) * 100, 100)}%` 
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                        <div className="flex justify-between items-center">
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={!hasChanges}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Khôi phục
                            </button>
                            
                            <button
                                type="submit"
                                disabled={loading || !hasChanges}
                                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Lưu thay đổi
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}