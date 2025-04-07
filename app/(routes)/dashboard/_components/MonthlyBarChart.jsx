import React, { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { Incomes, Expenses, Budgets } from "@/utils/schema";
import { eq, sql, and, gte, lt } from "drizzle-orm";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

function MonthlyBarChart() {
  const { user } = useUser();
  const [monthlyData, setMonthlyData] = useState([]);

  const getMonthlyIncomeAndExpenses = async () => {
    if (!user) return [];

    const monthlyResults = [];
    
    // Get the last 12 months
    for (let i = 0; i < 12; i++) {
      const startDate = startOfMonth(subMonths(new Date(), i));
      const endDate = endOfMonth(subMonths(new Date(), i));

      // Fetch monthly income
      // Fetch monthly income
    const incomeResult = await db
    .select({
    totalIncome: sql`COALESCE(SUM(CAST(${Incomes.amount} AS NUMERIC)), 0)`.mapWith(Number)
    })
    .from(Incomes)
    .where(
    and(
        eq(Incomes.createdBy, user.primaryEmailAddress.emailAddress),
        gte(Incomes.date, startDate),
        lt(Incomes.date, endDate)
    )
    );

      // Fetch monthly expenses
      const expensesResult = await db
        .select({
          totalExpenses: sql`COALESCE(SUM(${Expenses.amount}), 0)`.mapWith(Number)
        })
        .from(Expenses)
        .leftJoin(
          Budgets,
          eq(Budgets.id, Expenses.budgetId)
        )
        .where(
          and(
            eq(Budgets.createdBy, user.primaryEmailAddress.emailAddress),
            gte(Expenses.createdAt, startDate),
            lt(Expenses.createdAt, endDate)
          )
        );

      monthlyResults.unshift({
        name: format(startDate, 'MMM'),
        income: incomeResult[0]?.totalIncome || 0,
        expenses: expensesResult[0]?.totalExpenses || 0
      });
    }

    return monthlyResults;
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMonthlyIncomeAndExpenses();
      setMonthlyData(data);
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="border rounded-2xl p-5 h-[400px] w-full mb-6">
      <h2 className="font-bold text-xl mb-4">Monthly Income vs Expenses</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={monthlyData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 65,
          }}
          //monthly data
        >
          <XAxis
            dataKey="name"
            angle={-30}
            textAnchor="end"
            interval={0}
            tick={{ dy: 10, fontSize: 15 }}
            height={60}
          />
          //x axis code
          <YAxis tick={{ fontSize: 14 }} />
          <Tooltip contentStyle={{ fontSize: 14 }} />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              paddingTop: "10px",
              fontSize: "14px"
            }}
          />
          //ui for barchart
          <Bar dataKey="income" fill="#50C878" name="Income" />
          <Bar dataKey="expenses" fill="#DE3163" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
//final touches

export default MonthlyBarChart;