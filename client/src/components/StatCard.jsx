import React from "react";

const StatCard = ({ icon, title, value}) => (
  <div className="bg-white p-5 rounded-lg shadow-sm flex items-start justify-between">
    <div>
      <p className="text-[#697a8d] text-sm font-medium">{title}</p>
      <p className="text-2xl font-bold text-[#566a7f] mt-1">{value}</p>
     
    </div>
    <div className="bg-gray-100 rounded-lg p-2">{icon}</div>
  </div>
);

export default StatCard;
