"use client";
import React, { useEffect, useState } from "react";
import CreateIncomes from "./CreateIncomes";
import { db } from "@/utils/dbConfig";
import { desc, eq } from "drizzle-orm";
import { Incomes } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import IncomeItem from "./IncomeItem";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function IncomeList() {
  const [incomelist, setIncomelist] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const { user } = useUser();

  // Modify dateRange initialization
  const [dateRange, setDateRange] = useState({
    from: null,
    to: null
  });
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    user && getIncomelist();
  }, [user]);

  const getIncomelist = async () => {
    const result = await db
      .select()
      .from(Incomes)
      .where(eq(Incomes.createdBy, user?.primaryEmailAddress?.emailAddress))
      .orderBy(desc(Incomes.id));

    setIncomelist(result);
    setFilteredList(result);
  };

  const applyFilters = () => {
    let filtered = incomelist;

    // Date range filter
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= dateRange.from && itemDate <= dateRange.to;
      });
    }

    // Amount range filter
    if (minAmount) {
      filtered = filtered.filter(item => item.amount >= Number(minAmount));
    }
    if (maxAmount) {
      filtered = filtered.filter(item => item.amount <= Number(maxAmount));
    }

    // Name search filter
    if (searchName) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    setFilteredList(filtered);
  };

  const resetFilters = () => {
    setDateRange({ from: null, to: null });
    setMinAmount('');
    setMaxAmount('');
    setSearchName('');
    setFilteredList(incomelist);
  };

  return (
    <div className="mt-7">
      {/* Filtering Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date Range Filter */}
        <div>
          <h3 className="text-sm font-medium mb-2">Date Range</h3>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                {dateRange?.from && dateRange?.to ? (
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {`From ${format(dateRange.from, "PPP")} to ${format(dateRange.to, "PPP")}`}
                  </Button>
                ) : (
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>Select Date Range</span>
                  </Button>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Amount Range Filters */}
        <div>
          <h3 className="text-sm font-medium mb-2">Amount Range</h3>
          <div className="flex gap-2">
            <Input 
              type="number" 
              placeholder="Min Amount" 
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
            <Input 
              type="number" 
              placeholder="Max Amount" 
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Name Search */}
        <div>
          <h3 className="text-sm font-medium mb-2">Search by Name</h3>
          <Input 
            placeholder="Search income source" 
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Action Buttons */}
      <div className="flex justify-end space-x-2 mb-4">
        <Button onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={resetFilters}>Reset</Button>
      </div>

      {/* Income List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateIncomes refreshData={() => getIncomelist()} />
        {filteredList?.length > 0 ? (
          filteredList.map((budget, index) => (
            <IncomeItem
              budget={budget}
              key={index}
              onDelete={() => getIncomelist()}
            />
          ))
        ) : (
          [1, 2, 3, 4, 5].map((item, index) => (
            <div
              key={index}
              className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"
            ></div>
          ))
        )}
      </div>
    </div>
  );
}

export default IncomeList;