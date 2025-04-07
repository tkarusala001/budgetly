"use client";
import { Button } from "@/components/ui/button"; // Importing Button component
import { PenBox } from "lucide-react"; // Importing PenBox icon for edit button
import React, { useEffect, useState } from "react"; // Importing necessary hooks
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Importing Dialog components for modal
import EmojiPicker from "emoji-picker-react"; // Importing emoji picker component
import { useUser } from "@clerk/nextjs"; // Importing Clerk user hook for authentication
import { Input } from "@/components/ui/input"; // Importing Input component for text fields
import { db } from "@/utils/dbConfig"; // Importing database config
import { Budgets } from "@/utils/schema"; // Importing Budgets schema to interact with database
import { eq } from "drizzle-orm"; // Importing equality function for SQL queries
import { toast } from "sonner"; // Importing toast notifications for success messages

// EditBudget component to handle updating budget information
function EditBudget({ budgetInfo, refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon); // State for selected emoji, initialized from existing budget info
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false); // State to control emoji picker visibility

  const [name, setName] = useState(); // State for budget name
  const [amount, setAmount] = useState(); // State for budget amount

  const { user } = useUser(); // Retrieve user info from Clerk

  // useEffect hook to set initial values based on the passed budgetInfo prop
  useEffect(() => {
    if (budgetInfo) {
      setEmojiIcon(budgetInfo?.icon); // Set initial emoji from the budget info
      setAmount(budgetInfo.amount); // Set initial amount
      setName(budgetInfo.name); // Set initial name
    }
  }, [budgetInfo]);

  /**
   * onUpdateBudget function to update the budget in the database
   * It performs an update query and refreshes the data upon success
   */
  const onUpdateBudget = async () => {
    const result = await db
      .update(Budgets)
      .set({
        name: name, // Updated name
        amount: amount, // Updated amount
        icon: emojiIcon, // Updated emoji icon
      })
      .where(eq(Budgets.id, budgetInfo.id)) // Ensure update applies to the correct budget
      .returning(); // Return the updated budget data

    // If the update is successful, refresh the data and show a toast notification
    if (result) {
      refreshData(); // Trigger data refresh in parent component
      toast("Budget Updated!"); // Show success notification
    }
  };

  return (
    <div>
      {/* Dialog component to open the budget editing modal */}
      <Dialog>
        <DialogTrigger asChild>
          {/* Button to trigger opening the dialog */}
          <Button className="flex space-x-2 gap-2 rounded-full">
            <PenBox className="w-4" /> Edit {/* Icon and text for Edit button */}
          </Button>
        </DialogTrigger>
        {/* Dialog content for editing budget */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle> {/* Title of the dialog */}
            <DialogDescription>
              <div className="mt-5">
                {/* Button to toggle the emoji picker visibility */}
                <Button
                  variant="outline"
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)} // Toggle emoji picker on click
                >
                  {emojiIcon} {/* Display current emoji */}
                </Button>
                {/* Emoji picker for selecting a new emoji */}
                <div className="absolute z-20">
                  <EmojiPicker
                    open={openEmojiPicker} // Controlled visibility
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji); // Set emoji on click
                      setOpenEmojiPicker(false); // Close picker after selection
                    }}
                  />
                </div>
                {/* Budget name input field */}
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Name</h2>
                  <Input
                    placeholder="e.g. Home Decor" // Placeholder text for name
                    defaultValue={budgetInfo?.name} // Pre-fill with current budget name
                    onChange={(e) => setName(e.target.value)} // Update state when name is changed
                  />
                </div>
                {/* Budget amount input field */}
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input
                    type="number" // Ensure only numbers can be entered
                    defaultValue={budgetInfo?.amount} // Pre-fill with current amount
                    placeholder="e.g. 5000$" // Placeholder text for amount
                    onChange={(e) => setAmount(e.target.value)} // Update state when amount is changed
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          {/* Dialog footer with action buttons */}
          <DialogFooter className="sm:justify-start">
            {/* Button to close the dialog and trigger the update */}
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)} // Disable button if name or amount is empty
                onClick={() => onUpdateBudget()} // Trigger budget update on click
                className="mt-5 w-full rounded-full"
              >
                Update Budget
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent> 
      </Dialog>
    </div>
  );
}

export default EditBudget; 
