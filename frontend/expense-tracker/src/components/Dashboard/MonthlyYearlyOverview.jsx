import React, { useState, useEffect, useCallback } from "react";
import { LuCalendar, LuTrendingUp, LuTrendingDown } from "react-icons/lu";
import { addThousandsSeparator } from "../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart";
import moment from "moment";

const MonthlyYearlyOverview = ({ data = [] }) => {
  const [viewType, setViewType] = useState("monthly"); // monthly or yearly
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    currentPeriod: 0,
    previousPeriod: 0,
    change: 0,
    changePercentage: 0
  });

  const processData = useCallback(() => {
    if (!data || data.length === 0) return;

    let processedData = [];
    let currentTotal = 0;
    let previousTotal = 0;

    if (viewType === "monthly") {
      // Group data by month
      const monthlyData = {};
      data.forEach(item => {
        const month = moment(item.date).format("YYYY-MM");
        if (!monthlyData[month]) {
          monthlyData[month] = 0;
        }
        monthlyData[month] += item.amount;
      });

      // Convert to chart format
      processedData = Object.keys(monthlyData)
        .sort()
        .slice(-6) // Last 6 months
        .map(month => ({
          month: moment(month).format("MMM YYYY"),
          amount: monthlyData[month],
          period: month
        }));

      // Calculate current vs previous month
      const currentMonth = moment().format("YYYY-MM");
      const previousMonth = moment().subtract(1, 'month').format("YYYY-MM");
      currentTotal = monthlyData[currentMonth] || 0;
      previousTotal = monthlyData[previousMonth] || 0;

    } else {
      // Group data by year
      const yearlyData = {};
      data.forEach(item => {
        const year = moment(item.date).format("YYYY");
        if (!yearlyData[year]) {
          yearlyData[year] = 0;
        }
        yearlyData[year] += item.amount;
      });

      // Convert to chart format
      processedData = Object.keys(yearlyData)
        .sort()
        .slice(-5) // Last 5 years
        .map(year => ({
          month: year,
          amount: yearlyData[year],
          period: year
        }));

      // Calculate current vs previous year
      const currentYear = moment().format("YYYY");
      const previousYear = moment().subtract(1, 'year').format("YYYY");
      currentTotal = yearlyData[currentYear] || 0;
      previousTotal = yearlyData[previousYear] || 0;
    }

    setChartData(processedData);

    // Calculate change
    const change = currentTotal - previousTotal;
    const changePercentage = previousTotal > 0 ? ((change / previousTotal) * 100) : 0;

    setStats({
      currentPeriod: currentTotal,
      previousPeriod: previousTotal,
      change,
      changePercentage
    });
  }, [data, viewType]);

  useEffect(() => {
    processData();
  }, [data, viewType, processData]);

  const isPositiveChange = stats.change >= 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h5 className="text-lg font-semibold">Spending Overview</h5>
        
        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewType("monthly")}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              viewType === "monthly"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setViewType("yearly")}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              viewType === "yearly"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <LuCalendar className="text-blue-600" />
            <span className="text-sm text-blue-600 font-medium">
              Current {viewType === "monthly" ? "Month" : "Year"}
            </span>
          </div>
          <p className="text-2xl font-bold text-blue-800">
            ₹{addThousandsSeparator(stats.currentPeriod)}
          </p>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <LuCalendar className="text-gray-600" />
            <span className="text-sm text-gray-600 font-medium">
              Previous {viewType === "monthly" ? "Month" : "Year"}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            ₹{addThousandsSeparator(stats.previousPeriod)}
          </p>
        </div>

        <div className={`bg-gradient-to-r p-4 rounded-lg ${
          isPositiveChange 
            ? "from-red-50 to-red-100" 
            : "from-green-50 to-green-100"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {isPositiveChange ? (
              <LuTrendingUp className="text-red-600" />
            ) : (
              <LuTrendingDown className="text-green-600" />
            )}
            <span className={`text-sm font-medium ${
              isPositiveChange ? "text-red-600" : "text-green-600"
            }`}>
              Change
            </span>
          </div>
          <p className={`text-2xl font-bold ${
            isPositiveChange ? "text-red-800" : "text-green-800"
          }`}>
            {isPositiveChange ? "+" : ""}₹{addThousandsSeparator(Math.abs(stats.change))}
          </p>
          <p className={`text-xs ${
            isPositiveChange ? "text-red-600" : "text-green-600"
          }`}>
            {Math.abs(stats.changePercentage).toFixed(1)}% {isPositiveChange ? "increase" : "decrease"}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        {chartData.length > 0 ? (
          <CustomLineChart data={chartData} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available for the selected period
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyYearlyOverview;