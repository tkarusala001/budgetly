import React from "react";
import Link from "next/link";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function BudgetItem({ budget, onDelete }) {
  const calculateProgressPerc = () => {
    const perc = (budget.totalSpend / budget.amount) * 100;
    return perc > 100 ? 100 : perc.toFixed(2);
  };

  const remainingAmount = budget.amount - budget.totalSpend;
  const isOverBudget = remainingAmount < 0;

  const handleDelete = async () => {
    try {
      // First delete all associated expenses
      await db.delete(Expenses).where(eq(Expenses.budgetId, budget.id));
      
      // Then delete the budget
      await db.delete(Budgets).where(eq(Budgets.id, budget.id));
      
      // Call the onDelete callback to refresh the list
      onDelete();
      
      toast("Budget deleted successfully!");
    } catch (error) {
      console.error("Error deleting budget:", error);
      toast("Error deleting budget. Please try again.");
    }
  };

  return (
    <div className="relative">
      {/* Overspending Alert Badge */}
      {isOverBudget && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
            <AlertTriangle className="h-3 w-3" />
            OVER BUDGET!
          </div>
        </div>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-100 z-20"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the budget "{budget.name}" and all its associated expenses. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Link href={"/dashboard/expenses/" + budget?.id}>
        <div className={`p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[170px] ${
          isOverBudget ? 'border-red-300 bg-red-50' : ''
        }`}>
          <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-2 items-center">
              <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">
                {budget?.icon}
              </h2>
              <div>
                <h2 className="font-bold">{budget.name}</h2>
                <h2 className="text-sm text-gray-500">{budget.totalItem} Item</h2>
              </div>
            </div>
            <h2 className="font-bold text-primary text-lg">${budget.amount}</h2>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs text-slate-400">
                ${budget.totalSpend ? budget.totalSpend : 0} Spend
              </h2>
              <h2 className={`text-xs font-medium ${
                isOverBudget ? 'text-red-600 font-bold' : 'text-slate-400'
              }`}>
                {isOverBudget ? 
                  `$${Math.abs(remainingAmount)} Over Budget!` : 
                  `$${remainingAmount} Remaining`
                }
              </h2>
            </div>
            <div className="w-full bg-slate-300 h-2 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  isOverBudget ? 'bg-red-500' : 'bg-primary'
                }`}
                style={{
                  width: `${calculateProgressPerc()}%`,
                }}
              ></div>
            </div>
            
            {/* Additional warning text for overspending */}
            {isOverBudget && (
              <div className="mt-2 text-center">
                <span className="text-xs text-red-600 font-semibold bg-red-100 px-2 py-1 rounded">
                  ⚠️ Budget Exceeded
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default BudgetItem;