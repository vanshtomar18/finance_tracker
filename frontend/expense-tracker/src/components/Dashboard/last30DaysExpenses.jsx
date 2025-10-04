import React, { useEffect,useState } from "react";
import {prepareExpenseBarChartData} from "../../utils/helper";
import CustomBarChart from "../Charts/CustomBarChart";

const Last30DaysExpenses=({data})=>{
    const [charData, setCharData] = useState([]);
    
    console.log("Last30DaysExpenses data:", data); // Debug log
    
    useEffect(()=>{
        const result = prepareExpenseBarChartData(data);
        setCharData(result);

        return ()=>{};

    },[data]);

    return (
        <div className="card col-span-1">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Last 30 Days Expenses</h5>
            </div>

            {charData && charData.length > 0 ? (
                <CustomBarChart data={charData} />
            ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                    No expense data available for the last 30 days
                </div>
            )}
        </div>
    )
};
export default Last30DaysExpenses;