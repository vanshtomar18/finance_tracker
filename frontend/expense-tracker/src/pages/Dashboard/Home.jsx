import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import InfoCard from "../../components/Cards/InfoCards";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io"; // Corrected the icon name
import { addThousandsSeparator } from "../../utils/helper";
import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview ";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "../../components/Dashboard/last30DaysExpenses";
import RecentIncomeWithChart from"../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";
import MonthlyYearlyOverview from "../../components/Dashboard/MonthlyYearlyOverview";
import CategoryExpenseBreakdown from "../../components/Dashboard/CategoryExpenseBreakdown";
import IncomeVsExpenseTrends from "../../components/Dashboard/IncomeVsExpenseTrends";

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock data for testing
  const mockDashboardData = {
    totalBalance: 1500,
    totalIncome: 2000,
    totalExpenses: 500,
    last30DaysExpenses: {
      total: 500,
      transactions: [
        {
          id: "1",
          category: "Food",
          icon: "🍔",
          amount: 25.50,
          date: new Date(),
        },
        {
          id: "2", 
          category: "Transport",
          icon: "🚗",
          amount: 15.00,
          date: new Date(),
        }
      ]
    },
    last60DaysIncome: {
      total: 2000,
      transactions: []
    },
    recentTransactions: []
  };

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    console.log("Starting to fetch dashboard data...");
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );
      console.log("API Response status:", response.status);
      if (response.data) {
        setDashboardData(response.data);
        console.log("Dashboard data:", response.data); // Debug log
        console.log("Last 30 days expenses:", response.data.last30DaysExpenses);
        console.log("Financial Overview data:", {
          totalBalance: response.data.totalBalance,
          totalIncome: response.data.totalIncome,
          totalExpenses: response.data.totalExpenses
        });
        console.log("Last 60 days income:", response.data.last60DaysIncome);
      }
    } catch (error) {
      console.error("API Error:", error);
      console.error("Error response:", error.response?.data);
      console.log("Something went wrong. Please try again", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_ANALYTICS}`
      );
      if (response.data) {
        setAnalyticsData(response.data);
        console.log("Analytics data:", response.data);
      }
    } catch (error) {
      console.error("Analytics API Error:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchAnalyticsData();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      {/* Debug button */}
      <div className="mb-4">
        <button 
          onClick={() => {
            console.log("Current dashboardData:", dashboardData);
            fetchDashboardData();
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Debug: Refresh Dashboard Data
        </button>
      </div>
      <div className="my-5 mx-auto">
        {loading && (
          <div className="text-center py-4">
            <p>Loading dashboard data...</p>
          </div>
        )}
        
        {/* Debug button */}
        <div className="mb-4">
          <button 
            onClick={() => {
              fetchDashboardData();
              fetchAnalyticsData();
            }} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Refresh Dashboard Data
          </button>
          <button 
            onClick={() => setDashboardData(mockDashboardData)} 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Use Mock Data
          </button>
          <span className="ml-4 text-sm text-gray-600">
            Dashboard Data Status: {dashboardData ? 'Loaded' : 'Not Loaded'} | 
            Analytics Data Status: {analyticsData ? 'Loaded' : 'Not Loaded'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
    />

    <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />

    <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandsSeparator(dashboardData?.totalExpenses || 0)}
            color="bg-red-500"
     />
    </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/expense")}
          />

          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpenses || 0} // Fixed: Use `totalExpenses` from backend
          /> 

           <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions|| []}
            onSeeMore={() => navigate("/expense")}
            />

            <Last30DaysExpenses
            data={dashboardData?.last30DaysExpenses?.transactions || []}
            /> 

            <RecentIncomeWithChart
            data={dashboardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
            totalIncome={dashboardData?.totalIncome || 0}
            />

            <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore={() => navigate("/income")}
            />
        </div>

        {/* Analytics Section */}
        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Financial Analytics</h2>
          
          {/* Monthly/Yearly Overview */}
          <MonthlyYearlyOverview 
            data={analyticsData?.allExpenses || []}
          />

          {/* Income vs Expense Trends */}
          <IncomeVsExpenseTrends 
            incomeData={analyticsData?.allIncome || []}
            expenseData={analyticsData?.allExpenses || []}
          />

          {/* Category Breakdown */}
          <CategoryExpenseBreakdown 
            data={analyticsData?.allExpenses || []}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};
export default Home;
