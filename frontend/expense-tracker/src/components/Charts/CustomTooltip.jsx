import React from "react";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        const value = data.value || data.payload?.amount || data.payload?.value || 0;
        const name = data.name || data.payload?.name || data.payload?.category || 'Unknown';
        
        return (
            <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                <p className="text-xs font-semibold text-purple-800 mb-1">{name}</p>
                <p className="text-sm text-gray-600">
                    Amount: <span className="text-sm font-medium text-gray-900">₹{value?.toLocaleString()}</span>
                </p>
                {data.payload?.percentage && (
                    <p className="text-xs text-gray-500">
                        {data.payload.percentage}% of total
                    </p>
                )}
            </div>
        );
    }
    return null;
};

export default CustomTooltip;