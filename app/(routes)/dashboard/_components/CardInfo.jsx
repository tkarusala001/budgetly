import formatNumber from "@/utils";
import getFinancialAdvice from "@/utils/getFinancialAdvice";
import {
  PiggyBank,
  ReceiptText,
  Wallet,
  Sparkles,
  CircleDollarSign,
  Briefcase,
} from "lucide-react";
import React, { useEffect, useState } from "react";

function CardInfo({ budgetList, incomeList }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [financialAdvice, setFinancialAdvice] = useState("");

  useEffect(() => {
    if (budgetList.length > 0 || incomeList.length > 0) {
      CalculateCardInfo();
    }
  }, [budgetList, incomeList]);

  useEffect(() => {
    if (totalBudget > 0 || totalIncome > 0 || totalSpend > 0) {
      const fetchFinancialAdvice = async () => {
        const advice = await getFinancialAdvice(
          totalBudget,
          totalIncome,
          totalSpend
        );
        setFinancialAdvice(advice);
      };

      fetchFinancialAdvice();
    }
  }, [totalBudget, totalIncome, totalSpend]);

  const CalculateCardInfo = () => {
    console.log(budgetList);
    let totalBudget_ = 0;
    let totalSpend_ = 0;
    let totalIncome_ = 0;

    budgetList.forEach((element) => {
      totalBudget_ = totalBudget_ + Number(element.amount);
      totalSpend_ = totalSpend_ + element.totalSpend;
    });

    incomeList.forEach((element) => {
      totalIncome_ = totalIncome_ + element.totalAmount;
    });

    setTotalIncome(totalIncome_);
    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
  };

  const accountBalance = totalIncome - totalSpend;

  return (
    <div>
      {budgetList?.length > 0 ? (
        <div>
          <div className="p-7 border mt-4 -mb-1 rounded-2xl flex items-center justify-between">
            <div className="">
              <div className="flex mb-2 flex-row space-x-1 items-center ">
                <h2 className="text-md font-bold">Financial Advice: </h2>
              </div>
              <h2 className="font-light text-md">
                {financialAdvice || "Loading financial advice..."}
              </h2>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Total Budget</h2>
                <h2 className="font-bold text-2xl">
                ${totalBudget.toLocaleString()}
                </h2>
              </div>
              <PiggyBank className="bg-blue-400 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Total Expenses</h2>
                <h2 className="font-bold text-2xl">
                ${totalSpend.toLocaleString()}
                </h2>
              </div>
              <ReceiptText className="bg-blue-400 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Sum of Income Streams</h2>
                <h2 className="font-bold text-2xl">
                ${totalIncome.toLocaleString()}
                </h2>
              </div>
              <CircleDollarSign className="bg-blue-400 p-3 h-12 w-12 rounded-full text-white" />
            </div>
            <div className="p-7 border rounded-2xl flex items-center justify-between">
              <div>
                <h2 className="text-sm">Account Balance</h2>
                <h2 className="font-bold text-2xl">
                  ${accountBalance.toLocaleString()}
                </h2>
              </div>
              <Briefcase className="bg-blue-400 p-3 h-12 w-12 rounded-full text-white" />
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((item, index) => (
            <div
              className="h-[110px] w-full bg-slate-200 animate-pulse rounded-lg"
              key={index}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CardInfo;