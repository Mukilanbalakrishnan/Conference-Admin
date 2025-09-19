import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const RevenueChart = ({ data }) => {
  const COLORS = { approved: "#28a745", rejected: "#dc3545" };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-[#566a7f] mb-4">Abstracts Approved vs Rejected</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="#a1acb8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#a1acb8" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip />
          <Legend iconSize={10} iconType="circle" />
          <Bar dataKey="approved" fill={COLORS.approved} radius={[4, 4, 0, 0]} />
          <Bar dataKey="rejected" fill={COLORS.rejected} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
