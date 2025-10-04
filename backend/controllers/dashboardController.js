const Income= require('../models/Income');
const Expense= require('../models/Expense');

//get dashboard data
exports.getDashboardData = async (req,res)=>{
    try{
        const userId = req.user.id;

        //fetch income and expense data
        const totalIncomeValue = await Income.getTotalByUserId(userId);
        const totalExpenseValue = await Expense.getTotalByUserId(userId);
        const totalBalance = totalIncomeValue - totalExpenseValue;

        //Get income trancsaction in the last 60 days
        const last60DaysDate = new Date(Date.now()-60*24*60*60*1000);
        const last60DaysIncomeTransactions = await Income.findByUserId(userId, {
            startDate: last60DaysDate
        });

        //Get total income in the last 60 days
        const incomeLast60Days = await Income.getTotalByUserId(userId, {
            startDate: last60DaysDate
        });

        //get expense tracnsaction in the last 30 days
        const last30DaysDate = new Date(Date.now() - 30*24*60*60*1000);
        const last30DaysExpenseTransactions = await Expense.findByUserId(userId, {
            startDate: last30DaysDate
        });

        //get total expense in the last 30 days
        const expensesLast30Days = await Expense.getTotalByUserId(userId, {
            startDate: last30DaysDate
        });

        //Fetch last 5 transaction (income+expense)
        const lastIncomeTransactions = await Income.findByUserId(userId, { limit: 5 });
        const lastExpenseTransactions = await Expense.findByUserId(userId, { limit: 5 });
        
        const lastTransactions = [
            ...lastIncomeTransactions.map(txn => ({
                ...txn,
                type: "income",
            })),
            ...lastExpenseTransactions.map(txn => ({
                ...txn,
                type: "expense",
            }))
        ].sort((a,b) => new Date(b.date) - new Date(a.date)) //sort latest first
        .slice(0, 10); // Get top 10 recent transactions

        //Final response
        res.json({
            totalBalance,
            totalIncome: totalIncomeValue,
            totalExpenses: totalExpenseValue,
            last30DaysExpenses:{
                total: expensesLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome:{
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions: lastTransactions,
        });
    }catch(error){
        res.status(500).json({message:"Internal server error",error: error.message});
    }
};

//get comprehensive analytics data
exports.getAnalyticsData = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all income and expense transactions (for comprehensive analytics)
        const allIncomeTransactions = await Income.findByUserId(userId);
        const allExpenseTransactions = await Expense.findByUserId(userId);

        // Get last 12 months of data for detailed analysis
        const last12MonthsDate = new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000);
        
        const last12MonthsIncome = await Income.findByUserId(userId, {
            startDate: last12MonthsDate
        });

        const last12MonthsExpenses = await Expense.findByUserId(userId, {
            startDate: last12MonthsDate
        });

        // Category-wise expense breakdown
        const categoryBreakdown = await Expense.getByCategory(userId);

        // For monthly trends, we'll process the data in JavaScript since it's complex aggregation
        const monthlyTrends = {};
        
        // Process last 12 months expenses for trends
        last12MonthsExpenses.forEach(expense => {
            const date = new Date(expense.date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyTrends[key]) {
                monthlyTrends[key] = {
                    year: date.getFullYear(),
                    month: date.getMonth() + 1,
                    totalExpenses: 0,
                    transactionCount: 0
                };
            }
            
            monthlyTrends[key].totalExpenses += expense.amount;
            monthlyTrends[key].transactionCount += 1;
        });

        // Convert to array and sort
        const monthlyTrendsArray = Object.values(monthlyTrends)
            .sort((a, b) => {
                if (a.year !== b.year) return a.year - b.year;
                return a.month - b.month;
            });

        res.json({
            allIncome: allIncomeTransactions,
            allExpenses: allExpenseTransactions,
            last12MonthsIncome,
            last12MonthsExpenses,
            categoryBreakdown,
            monthlyTrends: monthlyTrendsArray
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
