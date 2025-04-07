"use client"
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import ExpenseListTable from './_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';
import AddExpense from './_components/AddExpense';

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getAllExpenses();
      getUserBudgets();
    }
  }, [user]);

  /**
   * Used to get All expenses belong to users
   */
  const getAllExpenses = async () => {
    const result = await db.select({
      id: Expenses.id,
      name: Expenses.name,
      amount: Expenses.amount,
      createdAt: Expenses.createdAt,
      budgetId: Expenses.budgetId,
    }).from(Budgets)
      .rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress))
      .orderBy(desc(Expenses.id));
    setExpensesList(result);
  }

  /**
   * Get user's budgets for the dropdown
   */
  const getUserBudgets = async () => {
    const result = await db.select()
      .from(Budgets)
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress.emailAddress));
    setBudgets(result);
  }

  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl mb-6'>My Expenses</h2>
      
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Left side: Add Expense Form */}
        <div className='md:col-span-1'>
          <AddExpense
            user={user}
            refreshData={getAllExpenses}
            budgets={budgets}
          />
        </div>

        {/* Right side: Expenses Table */}
        <div className='md:col-span-2'>
          <ExpenseListTable 
            refreshData={getAllExpenses}
            expensesList={expensesList}
          />
        </div>
      </div>
    </div>
  )
}

export default ExpensesScreen;