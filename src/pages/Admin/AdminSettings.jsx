import { useEffect, useState } from "react";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        maxCars: 30,
        maxBrands: 10,
        maxParts: 200,
        maxLabors: 100,
    });

    // TODO: fetch settings from backend
    useEffect(() => {
        // fetch('/api/settings').then(res => res.json()).then(setSettings)
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: Number(value) });
    };

    const handleSave = () => {
        // TODO: POST settings to backend
        // fetch('/api/settings', { method: 'POST', body: JSON.stringify(settings) })
        alert("Đã lưu cài đặt");
    };

    const settingsConfig = [
        {
            label: "Số xe sửa/ngày",
            name: "maxCars"
        },
        {
            label: "Số hiệu xe",
            name: "maxBrands"
        },
        {
            label: "Loại phụ tùng",
            name: "maxParts"
        },
        {
            label: "Loại tiền công",
            name: "maxLabors"
        }
    ];

    return (
        <div className="p-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {settingsConfig.map((item) => (
                        <div key={item.name} className="border rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 mb-3">{item.label}</h3>
                            <input
                                type="number"
                                min="1"
                                name={item.name}
                                value={settings[item.name]}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button 
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
}
