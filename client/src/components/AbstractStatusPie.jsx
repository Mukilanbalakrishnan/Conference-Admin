import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const AbstractStatusPie = ({ data }) => {
  const COLORS = {
    approved: "#28a745",
    rejected: "#dc3545",
    pending: "#ffc107",
  };

  const pieData = [
    { name: "Approved", value: data.approved },
    { name: "Rejected", value: data.rejected },
    { name: "Pending", value: data.pending },
  ];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold text-[#566a7f] mb-4">Abstract Status Breakdown</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name.toLowerCase()]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AbstractStatusPie;
