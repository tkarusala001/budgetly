import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function BarChartDashboard({ budgetList }) {
  return (
    <div className="border rounded-2xl p-5 h-[400px] w-full mb-6">
      <h2 className="font-bold text-xl mb-4">Budget vs Expenses</h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={budgetList}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 65,
          }}
          //obtains values
        >
          <XAxis
            dataKey="name"
            angle={-30}
            textAnchor="end"
            interval={0}
            tick={{ dy: 10, fontSize: 15 }}
            height={60}
          />
            //x axis
          
          <YAxis tick={{ fontSize: 14 }} />
          <Tooltip contentStyle={{ fontSize: 14 }} />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              paddingTop: "10px",
              fontSize: "14px" //ui for barchart
            }}
          />
          
          <Bar dataKey="amount" fill="#50C878" name="Budget" />
          <Bar dataKey="totalSpend" fill="#DE3163" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
      
    </div>
  );
}

export default BarChartDashboard;