import React from "react";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, Area, AreaChart} from "recharts";

const CustomLineChart = ({ data, type = "area", showLegend = false, series = [], height = "100%" }) => {

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-200 max-w-xs">
                    <p className="text-sm font-semibold text-gray-800 mb-2 truncate">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between gap-2 text-sm text-gray-600 mb-1">
                            <div className="flex items-center gap-1 min-w-0">
                                <span style={{ color: entry.color }} className="text-xs">●</span> 
                                <span className="truncate">{entry.name}:</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                ₹{entry.value?.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    const CustomLegend = (props) => {
        const { payload } = props;
        return (
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 px-2">
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-gray-700 font-medium">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    };

    // For multi-series line charts
    if (type === "line" && series.length > 0) {
        return (
            <div className="bg-white w-full h-full">
                <ResponsiveContainer width="100%" height={height}>
                    <LineChart 
                        data={data}
                        margin={{ top: 10, right: 10, left: 10, bottom: showLegend ? 50 : 10 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0"/>
                        <XAxis 
                            dataKey="month" 
                            tick={{ fontSize: 11, fill: "#555" }} 
                            stroke="#e0e0e0"
                            height={40}
                        />
                        <YAxis 
                            tick={{ fontSize: 11, fill: "#555" }} 
                            stroke="#e0e0e0"
                            tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                            width={60}
                        />
                        <Tooltip 
                            content={<CustomTooltip/>}
                            cursor={{ strokeDasharray: '3 3' }}
                            wrapperStyle={{ outline: 'none' }}
                        />
                        {showLegend && <Legend content={<CustomLegend />} />}
                        
                        {series.map((serie) => (
                            <Line 
                                key={serie.dataKey}
                                type="monotone" 
                                dataKey={serie.dataKey} 
                                stroke={serie.color} 
                                strokeWidth={2}
                                dot={{ r: 3, fill: serie.color }}
                                name={serie.name}
                                connectNulls={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    }

    // Default area chart for single series
    return (
        <div className="bg-white w-full h-full">
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart 
                    data={data}
                    margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                >
                    <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#875cf5" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#875cf5" stopOpacity={0.0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid stroke="none"/>
                    <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 11, fill: "#555" }} 
                        stroke="none"
                        height={40}
                    />
                    <YAxis 
                        tick={{ fontSize: 11, fill: "#555" }} 
                        stroke="none"
                        width={60}
                        tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                        content={<CustomTooltip/>}
                        cursor={{ strokeDasharray: '3 3' }}
                        wrapperStyle={{ outline: 'none' }}
                    />

                    <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#875cf5" 
                        fill="url(#incomeGradient)" 
                        strokeWidth={2} 
                        dot={{ r: 3, fill: "#ab8df" }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
export default CustomLineChart;