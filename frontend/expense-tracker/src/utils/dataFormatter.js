import moment from 'moment';

/**
 * Standardize expense/income data format for analytics components
 */
export const standardizeTransactionData = (data) => {
  if (!Array.isArray(data)) return [];
  
  return data.map(item => ({
    _id: item._id,
    amount: parseFloat(item.amount) || 0,
    category: item.category || item.source || 'Other',
    description: item.description || '',
    date: item.date,
    icon: item.icon || '💰',
    type: item.type || 'expense',
    source: item.source || null,
    // Add formatted date fields for easy grouping
    dateFormatted: moment(item.date).format('YYYY-MM-DD'),
    monthYear: moment(item.date).format('YYYY-MM'),
    month: moment(item.date).format('MMM YY'),
    year: moment(item.date).format('YYYY')
  }));
};

/**
 * Group transactions by category for pie chart
 */
export const groupByCategory = (transactions) => {
  const categoryMap = {};
  let total = 0;

  transactions.forEach(transaction => {
    const category = transaction.category || 'Other';
    const amount = parseFloat(transaction.amount) || 0;
    
    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        name: category, // For chart compatibility
        amount: 0,
        value: 0, // For chart compatibility
        count: 0,
        icon: transaction.icon || '💰',
        transactions: []
      };
    }
    
    categoryMap[category].amount += amount;
    categoryMap[category].value += amount; // Duplicate for chart compatibility
    categoryMap[category].count += 1;
    categoryMap[category].transactions.push(transaction);
    total += amount;
  });

  // Convert to array and add percentage
  const categories = Object.values(categoryMap).map((category, index) => ({
    ...category,
    percentage: total > 0 ? ((category.amount / total) * 100).toFixed(1) : 0,
    fill: getColorForIndex(index)
  }));

  return {
    categories: categories.sort((a, b) => b.amount - a.amount),
    total
  };
};

/**
 * Group transactions by month for trend analysis
 */
export const groupByMonth = (transactions, months = 12) => {
  const monthMap = {};
  const startDate = moment().subtract(months, 'months').startOf('month');
  
  // Initialize all months with zero values
  for (let i = 0; i < months; i++) {
    const monthKey = moment(startDate).add(i, 'months').format('YYYY-MM');
    const monthLabel = moment(startDate).add(i, 'months').format('MMM YY');
    monthMap[monthKey] = {
      month: monthLabel,
      monthKey,
      amount: 0,
      value: 0, // For chart compatibility
      count: 0,
      transactions: []
    };
  }

  // Add actual transaction data
  transactions.forEach(transaction => {
    const monthKey = moment(transaction.date).format('YYYY-MM');
    if (monthMap[monthKey]) {
      const amount = parseFloat(transaction.amount) || 0;
      monthMap[monthKey].amount += amount;
      monthMap[monthKey].value += amount; // For chart compatibility
      monthMap[monthKey].count += 1;
      monthMap[monthKey].transactions.push(transaction);
    }
  });

  return Object.values(monthMap).sort((a, b) => a.monthKey.localeCompare(b.monthKey));
};

/**
 * Combine income and expense data for comparison charts
 */
export const combineIncomeExpenseData = (incomeData, expenseData, months = 12) => {
  const incomeByMonth = groupByMonth(incomeData, months);
  const expenseByMonth = groupByMonth(expenseData, months);
  
  // Create a map for easier lookup
  const expenseMap = {};
  expenseByMonth.forEach(expense => {
    expenseMap[expense.monthKey] = expense.amount;
  });

  return incomeByMonth.map(income => ({
    month: income.month,
    monthKey: income.monthKey,
    income: income.amount,
    expenses: expenseMap[income.monthKey] || 0,
    net: income.amount - (expenseMap[income.monthKey] || 0)
  }));
};

/**
 * Calculate statistics for a given period
 */
export const calculatePeriodStats = (data, currentPeriod, previousPeriod) => {
  const current = data.filter(item => 
    moment(item.date).format('YYYY-MM') === currentPeriod
  ).reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const previous = data.filter(item => 
    moment(item.date).format('YYYY-MM') === previousPeriod
  ).reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  const change = current - previous;
  const changePercent = previous > 0 ? ((change / previous) * 100) : 0;

  return {
    currentPeriod: current,
    previousPeriod: previous,
    change,
    changePercent,
    isIncreasing: change > 0,
    isDecreasing: change < 0
  };
};

/**
 * Get color for chart by index
 */
export const getColorForIndex = (index) => {
  const colors = [
    "#8B5CF6", "#EF4444", "#F59E0B", "#10B981", "#3B82F6", 
    "#F97316", "#EC4899", "#84CC16", "#6366F1", "#14B8A6",
    "#F43F5E", "#8B5CF6", "#06B6D4", "#84CC16", "#F59E0B"
  ];
  return colors[index % colors.length];
};

/**
 * Format currency consistently across the app
 */
export const formatCurrency = (amount, showSymbol = true) => {
  const numAmount = parseFloat(amount) || 0;
  const formatted = numAmount.toLocaleString('en-IN');
  return showSymbol ? `₹${formatted}` : formatted;
};

/**
 * Get recent transactions (last N transactions)
 */
export const getRecentTransactions = (incomeData, expenseData, limit = 10) => {
  const allTransactions = [
    ...incomeData.map(item => ({ ...item, type: 'income' })),
    ...expenseData.map(item => ({ ...item, type: 'expense' }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return allTransactions.slice(0, limit);
};