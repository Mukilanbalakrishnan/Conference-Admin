import React from "react";
import TransactionItem from "./TransactionItem";

const TransactionsList = ({ transactions }) => (
  <div className="bg-white shadow-sm rounded-lg mb-6">
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold text-[#566a7f]">Recent Transactions</h2>
    </div>
    <div className="p-4 space-y-4">
      {transactions.map((item) => (
        <TransactionItem key={item.id} {...item} />
      ))}
    </div>
  </div>
);

export default TransactionsList;
