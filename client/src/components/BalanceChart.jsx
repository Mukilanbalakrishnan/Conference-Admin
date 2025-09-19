import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const BalanceChart = ({ balance, change, data }) => {
  const PRIMARY = "#696cff";
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-[#566a7f]">Total Balance</h3>
      <p className="text-2xl font-bold text-[#566a7f]">
        {balance} <span className="text-sm font-semibold text-green-500">▲ {change}</span>
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={PRIMARY} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name"/>
          <YAxis/>
          <Tooltip/>
          <Area type="monotone" dataKey="income" stroke={PRIMARY} fillOpacity={1} fill="url(#colorIncome)"/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BalanceChart;
