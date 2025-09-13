import React from 'react';

const DataTable = ({ columns, data }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    {columns.map((col, index) => (
                        <th
                            key={index}
                            className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            {col}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-100 transition-colors">
                        {row.map((cell, cellIndex) => (
                            <td
                                key={cellIndex}
                                className="py-3 px-4 whitespace-nowrap text-sm text-gray-800"
                            >
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;