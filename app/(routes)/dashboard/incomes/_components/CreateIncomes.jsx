"use client";
import React, { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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
  const [date, setDate] = useState(new Date());

  // Get user details from Clerk
  const { user } = useUser();    

  /**    
   * Function to create a new income entry
   */
  const onCreateIncomes = async () => {     
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
      // Reset the form after successful creation
      setName("");
      setAmount("");
      setDate(new Date());
      setEmojiIcon("😀");
    }   
  };   

  return (     
    <div>       
      <Dialog>         
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
                    type="number"                     
                    placeholder="e.g. 5000"     
                    value={amount}               
                    onChange={(e) => setAmount(e.target.value)}                   
                  />                 
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
            <DialogClose asChild>               
              <Button                 
                disabled={!(name && amount)}  // Disable button if name or amount are missing
                onClick={() => onCreateIncomes()}                 
                className="mt-5 w-full rounded-full"               
              >                 
                Create Income Source               
              </Button>             
            </DialogClose>           
          </DialogFooter>         
        </DialogContent>       
      </Dialog>     
    </div>   
  ); 
}  

export default CreateIncomes;
