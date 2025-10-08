import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import StatCard from "../../components/StatCard";
import RevenueChart from "../../components/RevenueChart";
import AbstractStatusPie from "../../components/AbstractStatusPie";
import AbstractTrendChart from "../../components/AbstractTrendChart";
import { Loader2 } from "lucide-react";

// --- Fee Structure (for reference) ---
const feeStructure = {
  student: { early: 8000, regular: 12000 },
  researchscholar: { early: 1000, regular: 1200 },
  faculty: { early: 1500, regular: 1800 },
  industry: { early: 2000, regular: 2500 },
};

// --- Early bird deadline ---
const earlyBirdDeadline = new Date("2025-03-15T23:59:59");

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    revenue: 0,
    registrations: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  // --- Update stats dynamically ---
  const updateStats = (data) => {
    const revenue = data
      .filter((p) => p.status.toLowerCase() === "paid")
      .reduce((acc, p) => acc + (p.amountPaid || p.finalAmount), 0);

    const registrations = data.length;
    const pending = data.filter((p) => p.status.toLowerCase() !== "paid").length;

    setStats({ revenue, registrations, pending });
  };

  // --- Fetch all users and payment data ---
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "https://it-con-backend.onrender.com/api/admin/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const users = Array.isArray(data) ? data : [];

      // Only include abstract-approved users
      const approvedUsers = users.filter(
        (u) => u.workflow?.abstractStatus?.toLowerCase() === "approved"
      );

      // Map user data to table format
      const formatted = approvedUsers.map((u) => {
        const category = u.registration?.category?.toLowerCase() || "student";
        const createdAt = new Date(u.workflow?.createdAt || new Date());
        const isEarly = createdAt <= earlyBirdDeadline;

        const standardFee = isEarly
          ? feeStructure[category]?.early
          : feeStructure[category]?.regular;

        const discountAmount = u.workflow?.discount ? standardFee - (u.workflow?.amountPaid || standardFee) : 0;
        const finalAmount = u.workflow?.amountPaid || standardFee;

        return {
          id: u._id,
          name: u.registration?.participants?.[0]?.name || "N/A",
          email: u.registration?.participants?.[0]?.email || "N/A",
          category: u.registration?.category || "student",
          standardFee,
          discount: discountAmount,
          finalAmount,
          status: u.workflow?.paymentStatus || "unpaid",
          date: u.workflow?.paymentDate || u.workflow?.createdAt,
          abstractStatus: u.workflow?.abstractStatus || "N/A",
        };
      });

      setPayments(formatted);
      updateStats(formatted);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setPayments([]);
      setStats({ revenue: 0, registrations: 0, pending: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Payment Management (Approved Abstracts Only)
      </h2>

      {/* --- Stats Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`₹${stats.revenue}`} change="" isPositive />
        <StatCard title="Registrations" value={stats.registrations} change="" isPositive />
        <StatCard title="Pending Payments" value={stats.pending} change="" isPositive={false} />
      </div>

      {/* --- Charts Section --- */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart data={payments} />
        <AbstractStatusPie data={payments} />
      </div> */}
      {/* --- Payment Table --- */}
      <div className="bg-white shadow-md rounded-xl p-6 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Payment Details</h3>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : payments.length === 0 ? (
          <p className="text-center text-gray-500 py-6">
            No approved abstracts found for payment.
          </p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Category</th>
                <th className="border p-3 text-left">Abstract Status</th>
                <th className="border p-3 text-left">Standard Fee</th>
                <th className="border p-3 text-left">Discount</th>
                <th className="border p-3 text-left">Final Amount Paid</th>
                <th className="border p-3 text-left">Payment Status</th>
                <th className="border p-3 text-left">Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="border p-3">{p.name}</td>
                  <td className="border p-3">{p.email}</td>
                  <td className="border p-3 capitalize">{p.category}</td>
                  <td className="border p-3">
                    <span className={`font-medium ${p.abstractStatus.toLowerCase() === "approved" ? "text-green-600" : "text-red-600"}`}>
                      {p.abstractStatus === "approved" ? "✅ Approved" : p.abstractStatus}
                    </span>
                  </td>
                  <td className="border p-3">₹{p.standardFee}</td>
                  <td className="border p-3">₹{p.discount}</td>
                  <td className="border p-3 font-semibold">₹{p.finalAmount}</td>
                  <td className={`border p-3 font-medium ${p.status.toLowerCase() === "paid" ? "text-green-600" : "text-red-600"}`}>
                    {p.status}
                  </td>
                  <td className="border p-3">{p.date ? new Date(p.date).toLocaleDateString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
