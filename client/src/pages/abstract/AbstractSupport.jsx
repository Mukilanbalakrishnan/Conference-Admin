
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";

// Components
import UnifiedAbstractDashboard from "../../components/AbstractsTable";
import StatCard from "../../components/StatCard";
import RevenueChart from "../../components/RevenueChart";
import AbstractStatusPie from "../../components/AbstractStatusPie";
import AbstractTrendChart from "../../components/AbstractTrendChart";

// --- Icons for StatCards ---
const icons = {
  total: (
    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"></path>
    </svg>
  ),
  approved: (
    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
    </svg>
  ),
  rejected: (
    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  ),
  pending: (
    <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2"></path>
    </svg>
  ),
};

const AbstractSupport = () => {
  const [abstracts, setAbstracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trend, setTrend] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0, pending: 0 });

  // --- Fetch abstracts from API ---
  const fetchAbstracts = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "https://it-con-backend.onrender.com/api/admin/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const formattedData = data.map((item) => {
        const teamMembers = item.registration?.participants?.length
          ? item.registration.participants.map((p) => ({
              name: p.name || "Unknown",
              email: p.email || "-",
              phone: p.phone || "-",
              designation: p.designation || "-",
              organisation: p.organisation || "-",
              gender: p.gender || "-",
              proofUrl: p.proofUrl || null,
            }))
          : [];

        return {
          id: item._id || Math.random().toString(),
          userId: item.userId || "N/A",
          authorName: item.name || "Unknown",
          email: item.registration?.participants?.[0]?.email || "-",
          mobile: item.registration?.participants?.[0]?.phone || "-",

          registrationId: item.registration?._id || null,
          uniqueId: item.registration?.uniqueId || "-",
          track: item.registration?.track || "-",
          presentationMode: item.registration?.presentationMode || "-",
          title: item.registration?.abstractTitle || "No Title",
          content: item.registration?.abstractContent || null,
          team: teamMembers,
          country: item.registration?.country || "-",
          proofUrl: item.registration?.proofUrl || null,
          paperUrl: item.registration?.paperUrl || null,

          status: item.workflow?.abstractStatus || "Pending",
          abstractApprovedBy: item.workflow?.abstractApprovedBy || "-",
          rejectedReason: item.workflow?.rejectedReason || null,
          abstractreasonBy: item.workflow?.abstractreasonBy || "-",

          finalPaperStatus: item.workflow?.paperStatus || "-",
          paperApprovedBy: item.workflow?.paperApprovedBy || "-",

          paymentStatus: item.workflow?.paymentStatus || "unpaid",
          paymentApprovedBy: item.workflow?.paymentApprovedBy || "-",
          paymentMethod: item.workflow?.paymentMethod || "-",
          amountPaid: item.workflow?.amountPaid || 0,
          discount: item.workflow?.discount || 0,
          paymentDate: item.workflow?.paymentDate || null,
          transactionId: item.workflow?.transactionId || "-",

          createdAt: item.workflow?.createdAt || new Date().toISOString(),
          updatedAt: item.workflow?.updatedAt || new Date().toISOString(),
        };
      });

      // ✅ Only keep abstracts with actual content
      const filteredData = formattedData.filter(
        (item) =>
          item.content &&
          item.content.trim() !== "" &&
          item.content !== "No Content"
      );

      console.log("Filtered abstracts with content:", filteredData);
      setAbstracts(filteredData);

      updateTrend(filteredData);
      updateStats(filteredData);
    } catch (err) {
      console.error("Error fetching abstracts:", err);
      setAbstracts([]);
      setTrend([]);
      setStats({ total: 0, approved: 0, rejected: 0, pending: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbstracts();
  }, [fetchAbstracts]);

  // --- Update stats from data ---
  const updateStats = (data) => {
    const total = data.length;
    const approved = data.filter((a) => a.status.toLowerCase() === "approved").length;
    const rejected = data.filter((a) => a.status.toLowerCase() === "rejected").length;
    const pending = data.filter(
      (a) =>
        a.status.toLowerCase() === "pending" ||
        a.status.toLowerCase() === "under review"
    ).length;

    setStats({ total, approved, rejected, pending });
  };

  // --- Update trend data ---
  const updateTrend = (data) => {
    const trendMap = {};
    data.forEach((item) => {
      const date = new Date(item.createdAt).toISOString().split("T")[0];
      trendMap[date] = (trendMap[date] || 0) + 1;
    });
    const trendData = Object.keys(trendMap).map((date) => ({
      date,
      count: trendMap[date],
    }));
    setTrend(trendData);
  };

  // --- Callback to update abstract status ---
  const updateAbstractLocal = async (userId, newStatus) => {
    try {
      await axios.put(
        `https://it-con-backend.onrender.com/api/admin/users/abstract/${userId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      fetchAbstracts();
    } catch (err) {
      console.error("Error updating abstract status:", err);
    }
  };

  const chartData = [
    { name: "Abstracts", approved: stats.approved, rejected: stats.rejected },
  ];

  return (
    <div className="space-y-6 p-4">
      {/* StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={icons.total} title="Total Abstracts" value={stats.total} change="+5%" isPositive />
        <StatCard icon={icons.approved} title="Approved" value={stats.approved} change="+3%" isPositive />
        <StatCard icon={icons.rejected} title="Rejected" value={stats.rejected} change="-1%" isPositive={false} />
        <StatCard icon={icons.pending} title="Pending" value={stats.pending} change="+2%" isPositive />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={chartData} />
          <AbstractStatusPie data={{ approved: stats.approved, rejected: stats.rejected, pending: stats.total - stats.approved - stats.rejected }} />
      </div>

      {/* Trend Chart */}
      <AbstractTrendChart data={trend} />

      {/* Dashboard Table */}
      <h1 className="text-2xl font-bold mb-6">Abstract Support Dashboard</h1>
      <UnifiedAbstractDashboard
        abstractsData={abstracts}
        loading={loading}
        updateAbstractLocal={updateAbstractLocal}
      />
    </div>
  );
};

export default AbstractSupport;
