import React from "react";
import { Trash2, Calendar } from "lucide-react";
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
import { Incomes } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function IncomeItem({ budget, onDelete }) {
  /** 
   * Function to handle deletion of income source 
   * Deletes the income source from the database and triggers the onDelete callback.
   */
  const handleDelete = async () => {
    try {
      // Delete income source from the database where the income id matches
      await db.delete(Incomes).where(eq(Incomes.id, budget.id));
      onDelete();  // Trigger onDelete to refresh the data
      toast("Income source deleted successfully!");
    } catch (error) {
      console.error("Error deleting income source:", error);
      toast("Error deleting income source. Please try again.");
    }
  };

  /** 
   * Function to format the date 
   * Converts the date string into a more readable format (e.g., "Dec 5, 2024")
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';  // Return 'No date' if the date is not provided
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Display income icon */}
          <h2 className="text-2xl p-3 px-4 bg-slate-100 rounded-full">{budget?.icon}</h2>
          <div>
            {/* Display income source name */}
            <h2 className="font-bold">{budget.name}</h2>
            {/* Display formatted income date */}
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(budget.date)}
            </div>
          </div>
        </div>
        {/* Display income amount */}
        <div className="text-right">
          <h2 className="font-bold text-primary text-lg">${budget.amount}</h2>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        {/* Alert dialog to confirm deletion */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 p-0 hover:bg-red-100">
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the income source "{budget.name}". This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {/* Cancel button */}
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {/* Delete button */}
              <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default IncomeItem;
