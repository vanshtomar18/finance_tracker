import { useState, useEffect, useCallback } from "react";
import React from "react";
import CustomPieChart from "../Charts/CustomPieChart";
const COLORS=["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];

const RecentIncomeWithChart=({data, totalIncome})=>{
        const [charData, setCharData] = useState([]);

        const prepareChartData = useCallback(() => {
            if (!data || data.length === 0) {
                setCharData([]);
                return;
            }

            const dataArr = data?.map((item)=>({
                name: item?.category,
                amount: item?.amount,
                value: item?.amount, // Add value key for chart compatibility
            }));

            setCharData(dataArr);
        }, [data]);

        useEffect(()=>{
            prepareChartData();
            return ()=>{};
        }, [prepareChartData]);
    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Last 60 Days Income</h5>
            </div>

            {charData && charData.length > 0 ? (
                <CustomPieChart
                    data={charData}
                    label="Total Income"
                    totalAmount={`₹${totalIncome || 0}`}
                    showTextAnchor
                    colors={COLORS}
                />
            ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                    <div className="text-center">
                        <p>No income data available</p>
                        <p className="text-sm">Add some income to see your last 60 days overview</p>
                    </div>
                </div>
            )}
        </div>
    )
};
export default RecentIncomeWithChart;