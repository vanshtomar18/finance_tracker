import React from "react";
const COLORS = ["#875cf5", "#FA2C37", "#FF6900"];
import CustomPieChart from "../Charts/CustomPieChart";

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const balanceData = [
    { name: "Total Expenses", amount: totalExpense || 0, value: totalExpense || 0 },
    { name: "Total Balance", amount: totalBalance || 0, value: totalBalance || 0 },
    { name: "Total Income", amount: totalIncome || 0, value: totalIncome || 0 },
  ].filter((item) => item.amount > 0); // Filter out entries with amount 0
  
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Financial Overview</h5>
      </div>

      {balanceData.length > 0 ? (
        <CustomPieChart
          data={balanceData}
          label="Total Balance"
          totalAmount={`₹${totalBalance || 0}`}
          colors={COLORS}
          showTextAnchor
        />
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p>No financial data available</p>
            <p className="text-sm">Add some income or expenses to see your overview</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default FinanceOverview;
