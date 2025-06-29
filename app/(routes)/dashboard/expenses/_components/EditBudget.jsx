"use client";
import { Button } from "@/components/ui/button";
import { PenBox } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"; 
import EmojiPicker from "emoji-picker-react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema"; // Importing Budgets schema to interact with database
import { eq } from "drizzle-orm";
import { toast } from "sonner"; 



function EditBudget({ budgetInfo, refreshData }) {
  const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [name, setName] = useState();
  const [amount, setAmount] = useState();

  const { user } = useUser();

  // Set initial values based on the passed budgetInfo prop
  // Set initial values when editing an existing budget
  useEffect(() => {
      if (budgetInfo) {
      setEmojiIcon(budgetInfo?.icon); // Set emoji icon
      setAmount(budgetInfo.amount);   // Set budget amount
      setName(budgetInfo.name);       // Set budget name
    }
  }, [budgetInfo]);

// Update budget details in the database
  const onUpdateBudget = async () => {
    const result = await db
      .update(Budgets)
      .set({
        name: name,             // New name
       amount: amount,         // New amount
       icon: emojiIcon,        // New icon
     })
     .where(eq(Budgets.id, budgetInfo.id)) // Find the correct budget by ID
     .returning();             // Return updated record

    if (result) {
     refreshData();            // Refresh UI with updated data
     toast("Budget Updated!"); // Show success message
    }
};

return (
  <div>
    <Dialog>
      {/* Trigger button to open the update budget modal */}
      <DialogTrigger asChild>
        <Button className="flex space-x-2 gap-2 rounded-full">
          <PenBox className="w-4" /> Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Budget</DialogTitle>
          <DialogDescription>
            <div className="mt-5">
              {/* Button to toggle emoji picker */}
              <Button
                variant="outline"
                className="text-lg"
                onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
              >
                {emojiIcon}
              </Button>

              {/* Emoji picker popup */}
              <div className="absolute z-20">
                <EmojiPicker
                  open={openEmojiPicker}
                  onEmojiClick={(e) => {
                    setEmojiIcon(e.emoji); // Set selected emoji
                    setOpenEmojiPicker(false); // Close picker
                  }}
                />
              </div>

              {/* Input field for budget name */}
              <div className="mt-2">
                <h2 className="text-black font-medium my-1">Budget Name</h2>
                <Input
                  placeholder="e.g. Home Decor"
                  defaultValue={budgetInfo?.name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Input field for budget amount */}
              <div className="mt-2">
                <h2 className="text-black font-medium my-1">Budget Amount</h2>
                <Input
                  type="number"
                  defaultValue={budgetInfo?.amount}
                  placeholder="e.g. 5000$"
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Button to confirm update */}
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              disabled={!(name && amount)} // Disable if fields are empty
              onClick={() => onUpdateBudget()} // Call update function
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