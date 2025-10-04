import React, { useState, useEffect, useCallback } from "react";
import { LuTrendingUp, LuTrendingDown } from "react-icons/lu";
import { FaChartLine } from "react-icons/fa";
import { addThousandsSeparator } from "../../utils/helper";
import CustomLineChart from "../Charts/CustomLineChart";
import moment from "moment";

const IncomeVsExpenseTrends = ({ incomeData = [], expenseData = [] }) => {
  const [timeRange, setTimeRange] = useState("6months"); // 6months, 1year, all
  const [chartData, setChartData] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    savingsRate: 0,
    trend: "neutral"
  });

  const processData = useCallback(() => {
    const now = moment();
    let startDate;

    switch (timeRange) {
      case "6months":
        startDate = now.clone().subtract(6, 'months');
        break;
      case "1year":
        startDate = now.clone().subtract(1, 'year');
        break;
      default:
        startDate = moment('2020-01-01'); // All time
    }

    // Filter data by date range
    const filteredIncome = incomeData.filter(item => 
      moment(item.date).isAfter(startDate)
    );
    const filteredExpenses = expenseData.filter(item => 
      moment(item.date).isAfter(startDate)
    );

    // Group by month
    const monthlyData = {};
    
    // Process income data
    filteredIncome.forEach(item => {
      const month = moment(item.date).format("YYYY-MM");
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0, month };
      }
      monthlyData[month].income += parseFloat(item.amount) || 0;
    });

    // Process expense data
    filteredExpenses.forEach(item => {
      const month = moment(item.date).format("YYYY-MM");
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0, month };
      }
      monthlyData[month].expenses += parseFloat(item.amount) || 0;
    });

    // Convert to chart format and sort by date
    const processedData = Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(item => ({
        month: moment(item.month).format("MMM YY"),
        income: item.income,
        expenses: item.expenses,
        net: item.income - item.expenses,
        period: item.month
      }));

    setChartData(processedData);

    // Calculate analytics
    const totalIncome = filteredIncome.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const totalExpenses = filteredExpenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    // Determine trend (comparing last 3 months vs previous 3 months)
    const recentMonths = processedData.slice(-3);
    const previousMonths = processedData.slice(-6, -3);
    
    const recentAvgNet = recentMonths.reduce((sum, item) => sum + item.net, 0) / (recentMonths.length || 1);
    const previousAvgNet = previousMonths.reduce((sum, item) => sum + item.net, 0) / (previousMonths.length || 1);
    
    let trend = "neutral";
    if (recentAvgNet > previousAvgNet * 1.05) trend = "improving";
    else if (recentAvgNet < previousAvgNet * 0.95) trend = "declining";

    setAnalytics({
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      trend
    });
  }, [incomeData, expenseData, timeRange]);

  useEffect(() => {
    processData();
  }, [processData]);

  const getTrendIcon = () => {
    switch (analytics.trend) {
      case "improving":
        return <LuTrendingUp className="text-green-600" />;
      case "declining":
        return <LuTrendingDown className="text-red-600" />;
      default:
        return <FaChartLine className="text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (analytics.trend) {
      case "improving":
        return "text-green-600";
      case "declining":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h5 className="text-lg font-semibold">Income vs Expense Trends</h5>
        
        {/* Time Range Selector */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setTimeRange("6months")}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              timeRange === "6months"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            6M
          </button>
          <button
            onClick={() => setTimeRange("1year")}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              timeRange === "1year"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            1Y
          </button>
          <button
            onClick={() => setTimeRange("all")}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              timeRange === "all"
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg min-h-[80px]">
          <p className="text-xs sm:text-sm text-green-600 font-medium mb-2 leading-tight">
            Total Income
          </p>
          <p className="text-lg sm:text-xl font-bold text-green-800 leading-tight">
            ₹{addThousandsSeparator(analytics.totalIncome)}
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg min-h-[80px]">
          <p className="text-xs sm:text-sm text-red-600 font-medium mb-2 leading-tight">
            Total Expenses
          </p>
          <p className="text-lg sm:text-xl font-bold text-red-800 leading-tight">
            ₹{addThousandsSeparator(analytics.totalExpenses)}
          </p>
        </div>

        <div className={`bg-gradient-to-r p-4 rounded-lg min-h-[80px] ${
          analytics.netSavings >= 0 
            ? "from-blue-50 to-blue-100" 
            : "from-orange-50 to-orange-100"
        }`}>
          <p className={`text-xs sm:text-sm font-medium mb-2 leading-tight ${
            analytics.netSavings >= 0 ? "text-blue-600" : "text-orange-600"
          }`}>
            Net {analytics.netSavings >= 0 ? "Savings" : "Deficit"}
          </p>
          <p className={`text-lg sm:text-xl font-bold leading-tight ${
            analytics.netSavings >= 0 ? "text-blue-800" : "text-orange-800"
          }`}>
            ₹{addThousandsSeparator(Math.abs(analytics.netSavings))}
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg min-h-[80px]">
          <div className="flex items-center gap-1 mb-2">
            <div className="text-sm">{getTrendIcon()}</div>
            <p className="text-xs sm:text-sm text-purple-600 font-medium leading-tight">
              Savings Rate
            </p>
          </div>
          <p className="text-lg sm:text-xl font-bold text-purple-800 leading-tight">
            {analytics.savingsRate.toFixed(1)}%
          </p>
          <p className={`text-xs ${getTrendColor()} mt-1`}>
            {analytics.trend === "improving" && "Improving"}
            {analytics.trend === "declining" && "Declining"}
            {analytics.trend === "neutral" && "Stable"}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Income vs Expense Trends
        </h3>
        
        <div className="h-72 sm:h-80 mb-4">
          {chartData.length > 0 ? (
            <CustomLineChart 
              data={chartData}
              type="line"
              showLegend={false}
              series={[
                {
                  dataKey: 'income',
                  name: 'Income',
                  color: '#10b981'
                },
                {
                  dataKey: 'expenses',
                  name: 'Expenses',
                  color: '#ef4444'
                },
                {
                  dataKey: 'net',
                  name: 'Net Savings',
                  color: '#3b82f6'
                }
              ]}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <FaChartLine className="mx-auto text-4xl mb-2 opacity-50" />
                <p className="text-base sm:text-lg">No data available for the selected period</p>
                <p className="text-sm text-gray-400 mt-1">Add income and expense records to see trends</p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Legend with Better Spacing */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="font-medium">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="font-medium">Expenses</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="font-medium">Net Savings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeVsExpenseTrends;