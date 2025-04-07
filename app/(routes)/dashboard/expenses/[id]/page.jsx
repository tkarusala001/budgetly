"use client";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import ExpenseListTable from "../_components/ExpenseListTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EditBudget from "../_components/EditBudget";

function ExpensesScreen({ params }) {
  const { user, isLoaded } = useUser();
  const [budgetInfo, setbudgetInfo] = useState(null);
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRouter();

  useEffect(() => {
    if (isLoaded && user && params.id) {
      getBudgetInfo();
    }
  }, [isLoaded, user, params.id]);

  const getBudgetInfo = async () => {
    try {
      setLoading(true);
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`COALESCE(sum(${Expenses.amount}), 0)`.mapWith(Number),
          totalItem: sql`COALESCE(count(${Expenses.id}), 0)`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .where(eq(Budgets.id, params.id))
        .groupBy(Budgets.id);

      console.log("Budget Info Result:", result);
      setbudgetInfo(result[0] || null);
      await getExpensesList();
    } catch (error) {
      console.error("Error fetching budget info:", error);
      toast.error("Failed to fetch budget information");
    } finally {
      setLoading(false);
    }
  };

  const getExpensesList = async () => {
    try {
      const result = await db
        .select()
        .from(Expenses)
        .where(eq(Expenses.budgetId, params.id))
        .orderBy(desc(Expenses.id));
      
      console.log("Expenses List:", result);
      setExpensesList(result || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to fetch expenses");
    }
  };

  const deleteBudget = async () => {
    try {
      const deleteExpenseResult = await db
        .delete(Expenses)
        .where(eq(Expenses.budgetId, params.id))
        .returning();

      if (deleteExpenseResult) {
        await db
          .delete(Budgets)
          .where(eq(Budgets.id, params.id))
          .returning();
      }
      toast.success("Budget Deleted!");
      route.replace("/dashboard/budgets");
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast.error("Failed to delete budget");
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 md:p-10">
      <h2 className="text-2xl font-bold gap-2 flex justify-between items-center mb-6">
        <span className="flex gap-2 items-center">
          <ArrowLeft onClick={() => route.back()} className="cursor-pointer" />
          My Expenses
        </span>
        <div className="flex gap-2 items-center">
          {budgetInfo && (
            <>
              <EditBudget
                budgetInfo={budgetInfo}
                refreshData={getBudgetInfo}
              />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="flex gap-2 rounded-full" variant="destructive">
                    <Trash className="w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your current budget along with expenses and remove your data
                      from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteBudget}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </h2>

      {loading ? (
        <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse" />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {budgetInfo && <BudgetItem budget={budgetInfo} />}
              <ExpenseListTable
                expensesList={expensesList}
                refreshData={getBudgetInfo}
              />
            </div>
            
            <div className="lg:col-span-1">
              <AddExpense
                budgetId={params.id}
                user={user}
                refreshData={getBudgetInfo}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExpensesScreen;