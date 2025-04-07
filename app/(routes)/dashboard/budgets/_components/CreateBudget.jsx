"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";

// CreateBudget component to handle budget creation
function CreateBudget({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { user } = useUser();

  /**
   * Function to validate the amount input
   * Shows error if the input is not a valid number
   */
  const validateAmount = (value) => {
    setAmount(value);
    // Remove the error if the field is empty or contains a valid number
    if (value === "" || !isNaN(value)) {
      setAmountError(false);
    }
  };

  /**
   * Reset the form to initial values
   */
  const resetForm = () => {
    setName("");
    setAmount("");
    setEmojiIcon("😀");
    setAmountError(false);
  };

  /**
   * Function to create a new budget
   * Validates input before inserting to database
   */
  const onCreateBudget = async () => {
    // Check if amount is a valid number
    if (isNaN(amount) || amount === "") {
      setAmountError(true);
      return;
    }

    // Insert the new budget into the database
    const result = await db
      .insert(Budgets)
      .values({
        name: name,
        amount: parseFloat(amount), // Convert string to number
        createdBy: user?.primaryEmailAddress?.emailAddress,
        icon: emojiIcon,
      })
      .returning({ insertedId: Budgets.id });

    // If the result is successful, refresh the data and show a success message
    if (result) {
      refreshData();
      toast("New Budget Created!");
      
      // Close the dialog and reset the form
      setDialogOpen(false);
      resetForm();
    }
  };

  return (
    <div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <div
            className="bg-slate-100 p-10 rounded-2xl
            items-center flex flex-col border-2 border-dashed
            cursor-pointer hover:shadow-md"
          >
            <h2 className="text-3xl">+</h2>
            <h2>Create New Budget</h2>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle>
            <DialogDescription>
              <div className="mt-5">
                <Button
                  variant="outline"
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                >
                  {emojiIcon}
                </Button>
                <div className="absolute z-20">
                  <EmojiPicker
                    open={openEmojiPicker}
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji);
                      setOpenEmojiPicker(false);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Name</h2>
                  <Input
                    placeholder="e.g. Home Decor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input
                    placeholder="e.g. 5000"
                    value={amount}
                    onChange={(e) => validateAmount(e.target.value)}
                  />
                  {amountError && (
                    <div className="flex items-center text-red-500 mt-1 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Please enter a valid number for the budget amount
                    </div>
                  )}
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              disabled={!name} // Only disable if name is missing, allow any amount input
              onClick={() => onCreateBudget()} // Validation happens inside this function
              className="mt-5 w-full rounded-full"
            >
              Create Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateBudget;