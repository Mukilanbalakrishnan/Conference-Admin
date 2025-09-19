import React from "react";

const TransactionItem = ({ type, description, amount, isPositive }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-semibold text-[#566a7f]">{type}</p>
      <p className="text-sm text-[#697a8d]">{description}</p>
    </div>
    <p className={`font-semibold ${isPositive ? "text-green-500" : "text-red-500"}`}>
      {isPositive ? "+" : "-"}${amount} USD
    </p>
  </div>
);

export default TransactionItem;
