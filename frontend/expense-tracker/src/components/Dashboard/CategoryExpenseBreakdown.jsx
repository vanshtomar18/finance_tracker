import React, { useState, useEffect, useCallback } from "react";
import { LuTrendingUp } from "react-icons/lu";
import { FaChartPie } from "react-icons/fa";
import { addThousandsSeparator } from "../../utils/helper";
import { groupByCategory, standardizeTransactionData } from "../../utils/dataFormatter";
import CustomPieChart from "../Charts/CustomPieChart";

const CategoryExpenseBreakdown = ({ data = [] }) => {
  const [chartData, setChartData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [topCategories, setTopCategories] = useState([]);

  const processCategoryData = useCallback(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      setTotalAmount(0);
      setTopCategories([]);
      return;
    }

    // Standardize data format
    const standardizedData = standardizeTransactionData(data);
    
    // Group by category using utility function
    const { categories, total } = groupByCategory(standardizedData);

    setChartData(categories);
    setTotalAmount(total);
    setTopCategories(categories.slice(0, 5)); // Top 5 categories
  }, [data]);

  useEffect(() => {
    processCategoryData();
  }, [processCategoryData]);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FaChartPie className="text-primary text-xl" />
          <h5 className="text-lg font-semibold">Category Breakdown</h5>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Expenses</p>
          <p className="text-xl font-bold text-gray-800">
            ₹{addThousandsSeparator(totalAmount)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="flex flex-col items-center">
          <div className="w-full h-64">
            {chartData && chartData.length > 0 ? (
              <CustomPieChart data={chartData} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <FaChartPie className="mx-auto text-4xl mb-2 opacity-50" />
                  <p>No expense data available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-3">
          <h6 className="font-semibold text-gray-800 mb-4">Top Categories</h6>
          {topCategories.map((category, index) => {
            const percentage = totalAmount > 0 ? ((category.amount / totalAmount) * 100) : 0;
            const color = chartData[index]?.fill || "#8B5CF6";
            
            return (
              <div key={category.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: color }}
                  ></div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <div>
                      <p className="font-medium text-gray-800">{category.category}</p>
                      <p className="text-xs text-gray-500">{category.count} transactions</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    ₹{addThousandsSeparator(category.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            );
          })}
          
          {topCategories.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <FaChartPie className="mx-auto text-4xl mb-2 opacity-50" />
              <p>No categories found</p>
              <p className="text-sm">Add some expenses to see category breakdown</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      {chartData.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{chartData.length}</p>
              <p className="text-sm text-gray-600">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {topCategories[0]?.category || "N/A"}
              </p>
              <p className="text-sm text-gray-600">Top Category</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                ₹{addThousandsSeparator(topCategories[0]?.amount || 0)}
              </p>
              <p className="text-sm text-gray-600">Highest Spending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(totalAmount / (topCategories.reduce((sum, cat) => sum + cat.count, 0) || 1))}
              </p>
              <p className="text-sm text-gray-600">Avg per Transaction</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryExpenseBreakdown;