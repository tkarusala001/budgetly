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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, AlertCircle } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Incomes } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function CreateIncomes({ refreshData }) {   
  // State variables for emoji icon, form fields, and date picker
  const [emojiIcon, setEmojiIcon] = useState("😀");   
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);    
  const [name, setName] = useState("");   
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState(false);   
  const [date, setDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get user details from Clerk
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
    setDate(new Date());
    setEmojiIcon("😀");
    setAmountError(false);
  };

  /**    
   * Function to create a new income entry
   */
  const onCreateIncomes = async () => {
    // Check if amount is a valid number
    if (isNaN(amount) || amount === "") {
      setAmountError(true);
      return;
    }
     
    const result = await db       
      .insert(Incomes)       
      .values({         
        name: name,         
        amount: Number(amount),         
        createdBy: user?.primaryEmailAddress?.emailAddress,         
        icon: emojiIcon,
        date: date
      })       
      .returning({ insertedId: Incomes.id });      

    if (result) {       
      refreshData();  // Trigger refresh of income data
      toast("New Income Source Created!");
      
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
            <h2>Create New Income Source</h2>           
          </div>         
        </DialogTrigger>         
        <DialogContent>           
          <DialogHeader>             
            <DialogTitle>Create New Income Source</DialogTitle>             
            <DialogDescription>               
              <div className="mt-5 space-y-4">                 
                <div>
                  {/* Emoji Picker Button */}
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
                        setEmojiIcon(e.emoji);  // Set the emoji on selection
                        setOpenEmojiPicker(false);                     
                      }}                   
                    />                 
                  </div>                 
                </div>

                {/* Income Source Input */}
                <div>                   
                  <h2 className="text-black font-medium mb-1">Income Source</h2>                   
                  <Input                     
                    placeholder="e.g. Youtube"     
                    value={name}                
                    onChange={(e) => setName(e.target.value)}                   
                  />                 
                </div>                 
                
                {/* Income Amount Input */}
                <div>                   
                  <h2 className="text-black font-medium mb-1">Income Amount</h2>                   
                  <Input                     
                    placeholder="e.g. 5000"     
                    value={amount}               
                    onChange={(e) => validateAmount(e.target.value)}                   
                  />
                  {amountError && (
                    <div className="flex items-center text-red-500 mt-1 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Please enter a valid number for the income amount
                    </div>
                  )}                  
                </div>
                
                {/* Date Picker for Income Date */}
                <div>                   
                  <h2 className="text-black font-medium mb-1">Income Date</h2>                   
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            setDate(selectedDate);  // Set the selected date
                          }
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>               
              </div>             
            </DialogDescription>           
          </DialogHeader>           
          <DialogFooter className="sm:justify-start">             
            <Button                 
              disabled={!name}  // Only disable if name is missing
              onClick={() => onCreateIncomes()}                 
              className="mt-5 w-full rounded-full"               
            >                 
              Create Income Source               
            </Button>           
          </DialogFooter>         
        </DialogContent>       
      </Dialog>     
    </div>   
  ); 
}  

export default CreateIncomes;