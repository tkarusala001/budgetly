"use client"; 
import React, { useEffect, useState } from "react"; 
import { UserButton, useUser } from "@clerk/nextjs"; 
import CardInfo from "./_components/CardInfo"; 
import { db } from "@/utils/dbConfig"; 
import { desc, eq, getTableColumns, sql } from "drizzle-orm"; 
import { Budgets, Expenses, Incomes } from "@/utils/schema"; 
import BarChartDashboard from "./_components/BarChartDashboard"; 
import BudgetItem from "./budgets/_components/BudgetItem"; 
import ExpenseListTable from "./expenses/_components/ExpenseListTable"; 
import WeeklyBarChart from "./_components/WeeklyBarChart";
import MonthlyBarChart from "./_components/MonthlyBarChart";
import YearlyBarChart from "./_components/YearlyBarChart";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Download } from "lucide-react";

function Dashboard() {   
  const { user } = useUser();    // Get user data from Clerk
  const [budgetList, setBudgetList] = useState([]);   // State to hold list of budgets
  const [incomeList, setIncomeList] = useState([]);   // State to hold list of incomes
  const [expensesList, setExpensesList] = useState([]);   // State to hold list of expenses
  const [showBudgetChart, setShowBudgetChart] = useState(true); // State to toggle between budget and income charts
  const [chartPeriod, setChartPeriod] = useState('weekly'); // State for selecting chart period (weekly, monthly, yearly)

  // Effect to fetch budget list when user is available
  useEffect(() => {     
    user && getBudgetList();   // Call getBudgetList if user exists
  }, [user]);   

  /**    
   * Fetches the budget list for the user    
   */   
  const getBudgetList = async () => {     
    const result = await db       
      .select({         
        ...getTableColumns(Budgets),           // Select all columns of Budgets
        totalSpend: sql`sum(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number),  // Calculate total spend by summing expenses
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),   // Calculate total number of expenses
      })       
      .from(Budgets)       
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))  // Join with Expenses table
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress)) // Filter by user's email
      .groupBy(Budgets.id)       
      .orderBy(desc(Budgets.id));   // Order budgets by descending ID

    setBudgetList(result);     // Update state with fetched budget list
    getAllExpenses();     // Fetch all expenses for user
    getIncomeList();   // Fetch income stream list
  };    

  /**    
   * Fetches the list of income streams    
   */   
  const getIncomeList = async () => {     
    try {       
      const result = await db         
        .select({           
          ...getTableColumns(Incomes),           // Select all columns of Incomes
          totalAmount: sql`SUM(CAST(${Incomes.amount} AS NUMERIC))`.mapWith(Number),  // Sum of all income amounts
        })         
        .from(Incomes)         
        .groupBy(Incomes.id);   // Group by income ID to aggregate

      setIncomeList(result);     // Update state with income list
    } catch (error) {       
      console.error("Error fetching income list:", error);     // Log error if fetching fails
    }   
  };    

  /**    
   * Fetches all expenses for the user    
   */   
  const getAllExpenses = async () => {     
    const result = await db       
      .select({         
        id: Expenses.id,         
        name: Expenses.name,
        amount: Expenses.amount,         
        createdAt: Expenses.createdAt,       
      })       
      .from(Budgets)       
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))  // Right join to get all expenses
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))  // Filter by user's email
      .orderBy(desc(Expenses.id));  // Order expenses by descending ID
    
    setExpensesList(result);   // Update state with expenses list
  };    

  // Function to export all financial data to CSV
  const handleExportToCSV = () => {
    console.log("Export button clicked"); // Add this line
    try {
      // Helper function to convert data to CSV format
      const convertToCSV = (data, headers) => {
        const csvHeaders = headers.join(',');
        const csvRows = data.map(row => 
          headers.map(header => {
            const value = row[header];
            // Handle values that might contain commas or quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value || '';
          }).join(',')
        );
        return [csvHeaders, ...csvRows].join('\n');
      };

      // Prepare budget data
      const budgetHeaders = ['Budget Name', 'Icon', 'Amount', 'Total Spend', 'Total Items', 'Remaining'];
      const budgetData = budgetList.map(budget => ({
        'Budget Name': budget.name,
        'Icon': budget.icon,
        'Amount': budget.amount,
        'Total Spend': budget.totalSpend || 0,
        'Total Items': budget.totalItem || 0,
        'Remaining': budget.amount - (budget.totalSpend || 0),
      }));

      // Prepare expenses data
      const expenseHeaders = ['Expense Name', 'Amount', 'Created Date'];
      const expenseData = expensesList.map(expense => ({
        'Expense Name': expense.name,
        'Amount': expense.amount,
        'Created Date': expense.createdAt ? new Date(expense.createdAt).toLocaleDateString() : ''
      }));

      // Prepare income data
      const incomeHeaders = ['Income Name', 'Amount', 'Icon'];
      const incomeData = incomeList.map(income => ({
        'Income Name': income.name,
        'Amount': income.amount,
        'Icon': income.icon,
      }));

      // Create comprehensive CSV content
      let csvContent = '';
      
      // Add summary section
      csvContent += 'FINANCIAL SUMMARY\n';
      csvContent += `Export Date,${new Date().toLocaleDateString()}\n`;
      csvContent += `User,${user?.fullName || 'Unknown'}\n`;
      csvContent += `Total Budgets,${budgetList.length}\n`;
      csvContent += `Total Expenses,${expensesList.length}\n`;
      csvContent += `Total Income Streams,${incomeList.length}\n`;
      csvContent += '\n';

      // Add budgets section
      if (budgetData.length > 0) {
        csvContent += 'BUDGETS\n';
        csvContent += convertToCSV(budgetData, budgetHeaders);
        csvContent += '\n\n';
      }

      // Add expenses section
      if (expenseData.length > 0) {
        csvContent += 'EXPENSES\n';
        csvContent += convertToCSV(expenseData, expenseHeaders);
        csvContent += '\n\n';
      }

      // Add income section
      if (incomeData.length > 0) {
        csvContent += 'INCOME STREAMS\n';
        csvContent += convertToCSV(incomeData, incomeHeaders);
        csvContent += '\n\n';
      }

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `financial_data_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      console.log('CSV export completed successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  // Render the appropriate chart based on user selection (budget or income/expenses)
  const renderChart = () => {
    if (showBudgetChart) {
      return <BarChartDashboard budgetList={budgetList} />;  // Show budget vs expenses chart
    }

    switch (chartPeriod) {
      case 'weekly':
        return <WeeklyBarChart />;  // Show weekly chart
      case 'monthly':
        return <MonthlyBarChart />;  // Show monthly chart
      case 'yearly':
        return <YearlyBarChart />;  // Show yearly chart
      default:
        return <WeeklyBarChart />;  // Default to weekly chart
    }
  };

  return (     
    <div className="p-8 bg-gray-50">       
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-bold text-4xl">Hi {user?.fullName}</h2>       {/* Display user's name */}
          <p className="text-gray-500">         
            Manage and check your finances below!       {/* Info about managing finances */}
          </p>
        </div>
        
        {/* Export to CSV Button */}
        <button 
          onClick={handleExportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          <Download className="h-4 w-4" />
          Export to CSV
        </button>
      </div>
      
      <CardInfo budgetList={budgetList} incomeList={incomeList} />       {/* Show card info with budget and income lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5">         
        <div className="lg:col-span-2">
          <div className="flex items-center mb-4 space-x-4">
            <button 
              onClick={() => setShowBudgetChart(!showBudgetChart)}  // Toggle between budget and income charts
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-300"
            >
              {showBudgetChart ? 'Show Income vs Expenses' : 'Show Budget vs Expenses'}  {/* Button text */}
            </button>
            
            
            {!showBudgetChart && (
              <Select 
                value={chartPeriod}
                onValueChange={setChartPeriod}  // Update chart period when selected
              >
                <SelectTrigger 
                  className="w-[180px] border-2 border-gray-300 hover:border-blue-500 
                            transition-colors duration-300 
                             bg-white shadow-sm rounded-lg 
                             focus:ring-2 focus:ring-blue-300"
                >
                  <SelectValue 
                    placeholder="Select Period" 
                    className="text-gray-700"
                  />
                
                </SelectTrigger>
                <SelectContent 
                  className="bg-white border border-gray-200 
                             rounded-lg shadow-lg 
                             overflow-hidden"
                >
                  <SelectItem 
                    value="weekly" 
                    className="cursor-pointer 
                               hover:bg-blue-50 
                               data-[state=checked]:bg-blue-100 
                               data-[state=checked]:text-blue-800 
                               px-3 py-2"
                  >
                    Weekly
                  </SelectItem>
                  <SelectItem 
                    value="monthly" 
                    className="cursor-pointer 
                               hover:bg-blue-50 
                               data-[state=checked]:bg-blue-100 
                               data-[state=checked]:text-blue-800 
                               px-3 py-2"
                  >
                    Monthly
                  </SelectItem>
                  <SelectItem 
                    value="yearly" 
                    className="cursor-pointer 
                               hover:bg-blue-50 
                               data-[state=checked]:bg-blue-100 
                               data-[state=checked]:text-blue-800 
                               px-3 py-2"
                  >
                    Yearly
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          
          {renderChart()}  {/* Render the selected chart */}
          
          <ExpenseListTable             
            expensesList={expensesList}             // Pass the expenses list to table
            refreshData={() => getBudgetList()}     // Refresh data when table is updated
          />         
        </div>         
        <div className="grid gap-5">           
          <h2 className="font-bold text-lg">Latest Budgets</h2>   {/* Display latest budgets */}
          {budgetList?.length > 0
            ? budgetList.map((budget) => (
                <BudgetItem 
                  budget={budget} 
                  key={budget.id} 
                />
              ))
            : [1, 2, 3, 4].map((item, index) => (
                <div
                  key={index}
                  className="h-[180px] w-full bg-slate-200 rounded-lg animate-pulse"
                ></div>
              ))}
        </div>       
      </div>     
    </div>   
  ); 
}  

export default Dashboard;