"use client";
import React, { useState } from "react"; // Importing React and useState hook
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; // Importing dialog components
import EmojiPicker from "emoji-picker-react"; // Importing emoji picker for budget icon selection
import { Button } from "@/components/ui/button"; // Importing button component
import { Input } from "@/components/ui/input"; // Importing input component for text fields
import { db } from "@/utils/dbConfig"; // Importing database config
import { Budgets } from "@/utils/schema"; // Importing Budgets schema to interact with database
import { useUser } from "@clerk/nextjs"; // Importing Clerk hook to manage user authentication
import { toast } from "sonner"; // Importing toast notifications

// CreateBudget component to handle budget creation
function CreateBudget({ refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState("😀"); // State for the selected emoji icon
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false); // State to manage emoji picker visibility

  const [name, setName] = useState(); // State for the budget name
  const [amount, setAmount] = useState(); // State for the budget amount

  const { user } = useUser(); // Hook to get the current user data

  /**
   * Function to create a new budget
   * Inserts the budget data into the database and triggers a refresh
   */
  const onCreateBudget = async () => {
    // Insert the new budget into the database
    const result = await db
      .insert(Budgets) // Interacting with the Budgets schema in the database
      .values({
        name: name, // Budget name entered by the user
        amount: amount, // Budget amount entered by the user
        createdBy: user?.primaryEmailAddress?.emailAddress, // User who is creating the budget
        icon: emojiIcon, // Selected emoji for the budget
      })
      .returning({ insertedId: Budgets.id }); // Return the inserted budget's ID

    // If the result is successful, refresh the data and show a success message
    if (result) {
      refreshData(); // Refresh the parent component's data
      toast("New Budget Created!"); // Display a toast notification
    }
  };

  return (
    <div>
      {/* Dialog component for the budget creation modal */}
      <Dialog>
        {/* Trigger the dialog when the user clicks on this section */}
        <DialogTrigger asChild>
          <div
            className="bg-slate-100 p-10 rounded-2xl
            items-center flex flex-col border-2 border-dashed
            cursor-pointer hover:shadow-md"
          >
            <h2 className="text-3xl">+</h2> {/* "+" icon for creating a new budget */}
            <h2>Create New Budget</h2> {/* Title of the section */}
          </div>
        </DialogTrigger>
        {/* Modal content */}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Budget</DialogTitle> {/* Modal header */}
            <DialogDescription>
              <div className="mt-5">
                {/* Button to toggle emoji picker visibility */}
                <Button
                  variant="outline"
                  className="text-lg"
                  onClick={() => setOpenEmojiPicker(!openEmojiPicker)} // Toggle emoji picker
                >
                  {emojiIcon} {/* Display selected emoji */}
                </Button>
                {/* Emoji picker dialog */}
                <div className="absolute z-20">
                  <EmojiPicker
                    open={openEmojiPicker} // Controlled visibility of the picker
                    onEmojiClick={(e) => {
                      setEmojiIcon(e.emoji); // Set the selected emoji
                      setOpenEmojiPicker(false); // Close the picker after selection
                    }}
                  />
                </div>
                {/* Budget name input field */}
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Name</h2>
                  <Input
                    placeholder="e.g. Home Decor" // Placeholder text
                    onChange={(e) => setName(e.target.value)} // Update name state
                  />
                </div>
                {/* Budget amount input field */}
                <div className="mt-2">
                  <h2 className="text-black font-medium my-1">Budget Amount</h2>
                  <Input
                    type="number" // Only allows numbers
                    placeholder="e.g. 5000$" // Placeholder text
                    onChange={(e) => setAmount(e.target.value)} // Update amount state
                  />
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          {/* Modal footer */}
          <DialogFooter className="sm:justify-start">
            {/* Close button */}
            <DialogClose asChild>
              <Button
                disabled={!(name && amount)} // Disable the button if name or amount is missing
                onClick={() => onCreateBudget()} // Call onCreateBudget function on click
                className="mt-5 w-full rounded-full"
              >
                Create Budget {/* Button text */}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateBudget; 
