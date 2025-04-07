import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, XCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { db } from "@/utils/dbConfig";
import { Expenses } from "@/utils/schema";
import { toast } from "sonner";

const CustomToast = ({ message, type }) => (
  <div className="flex items-center gap-2">
    {type === 'error' ? (
      <XCircle className="h-5 w-5 text-white" />
    ) : (
      <CheckCircle2 className="h-5 w-5 text-white" />
    )}
    <span className="font-medium">{message}</span>
  </div>
);

const AddExpense = ({ user, refreshData, budgets, budgetId = null }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    selectedBudgetId: budgetId || '',
    date: new Date(),
  });

  useEffect(() => {
    if (budgetId) {
      setFormData(prev => ({
        ...prev,
        selectedBudgetId: budgetId
      }));
    }
  }, [budgetId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateSelect = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date
    }));
  };

  const handleBudgetSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      selectedBudgetId: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.custom((t) => (
        <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg">
          <CustomToast message="Please enter an expense name" type="error" />
        </div>
      ));
      return false;
    }
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      toast.custom((t) => (
        <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg">
          <CustomToast message="Please enter a valid amount" type="error" />
        </div>
      ));
      return false;
    }
    if (!formData.selectedBudgetId && !budgetId) {
      toast.custom((t) => (
        <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg">
          <CustomToast message="Please select a budget" type="error" />
        </div>
      ));
      return false;
    }
    if (!formData.date) {
      toast.custom((t) => (
        <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg">
          <CustomToast message="Please select a date" type="error" />
        </div>
      ));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const expenseData = {
        name: formData.name.trim(),
        amount: Number(formData.amount),
        budgetId: budgetId || formData.selectedBudgetId,
        createdAt: formData.date.toISOString(),
      };

      await db.insert(Expenses).values(expenseData);

      toast.custom((t) => (
        <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg">
          <CustomToast message="Expense added successfully!" type="success" />
        </div>
      ));
      
      // Reset form
      setFormData({
        name: '',
        amount: '',
        selectedBudgetId: budgetId || '',
        date: new Date(),
      });
      
      // Refresh the expenses list
      refreshData();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.custom((t) => (
        <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg">
          <CustomToast message="Failed to add expense" type="error" />
        </div>
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Expense Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter expense name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Expense Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "MM-dd-yyyy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {!budgetId && (
            <div className="space-y-2">
              <Label>Select Budget</Label>
              {budgets && budgets.length > 0 ? (
                <Select
                  defaultValue={formData.selectedBudgetId}
                  value={formData.selectedBudgetId}
                  onValueChange={handleBudgetSelect}
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgets.map((budget) => (
                      <SelectItem key={budget.id} value={budget.id.toString()}>
                        {budget.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-gray-500 mt-1">
                  No budgets available. Please create a budget first.
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || (!budgetId && (!budgets || budgets.length === 0))}
          >
            {loading ? "Adding..." : "Add New Expense"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddExpense;
