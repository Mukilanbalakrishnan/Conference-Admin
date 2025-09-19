import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import StatCard from "../../components/StatCard";
import RevenueChart from "../../components/RevenueChart";
import AbstractStatusPie from "../../components/AbstractStatusPie";
import AbstractTrendChart from "../../components/AbstractTrendChart";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

// ✅ Fixed: Use a working geoJSON source
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

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
  revenue: (
    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3h2a1 1 0 0 1 2 0c0 1.105-.895 2-2 2-1.657 0-3 1.343-3 3h8"></path>
    </svg>
  ),
};

// --- Fee Structure ---
const feeStructure = {
  student: { early: 8000, regular: 10000 },
  academic: { early: 10000, regular: 12000 },
  industry: { early: 10000, regular: 12000 },
};
const earlyBirdDeadline = new Date("2026-01-31T23:59:59Z");
const regularDeadline = new Date("2026-02-20T23:59:59Z");

const MainDashboard = () => {
  const [stats, setStats] = useState({ total: 0, approved: 0, rejected: 0, revenue: 0 });
  const [trend, setTrend] = useState([]);
  const [countryCounts, setCountryCounts] = useState({});

  // --- Fetch registrations ---
  const fetchRegistrations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("https://it-con-backend.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const formattedData = data.map((item) => ({
        id: item._id || Math.random().toString(),
        category: item.registration?.category || "student",
        content: item.registration?.abstractContent || null,
        country: item.registration?.country || "-",
        status: item.workflow?.abstractStatus || "pending",
        paymentStatus: item.workflow?.paymentStatus || "unpaid",
        createdAt: item.workflow?.createdAt || new Date().toISOString(),
      }));

      const filtered = formattedData.filter((r) => r.content && r.content.trim() !== "");
      updateStats(filtered);
      updateTrend(filtered);
      updateCountryCounts(filtered);
    } catch (err) {
      console.error("Error fetching registrations:", err);
      setStats({ total: 0, approved: 0, rejected: 0, revenue: 0 });
      setTrend([]);
      setCountryCounts({});
    }
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // --- Calculate Revenue & Stats ---
  const updateStats = (data) => {
    const total = data.length;
    const approved = data.filter((r) => r.status.toLowerCase() === "approved").length;
    const rejected = data.filter((r) => r.status.toLowerCase() === "rejected").length;

    let revenue = 0;
    data.forEach((r) => {
      if (r.paymentStatus === "paid") {
        const createdDate = new Date(r.createdAt);
        const isEarlyBird = createdDate <= earlyBirdDeadline;
        const isRegular = createdDate > earlyBirdDeadline && createdDate <= regularDeadline;

        let category = "student";
        if (r.category?.toLowerCase().includes("academic")) category = "academic";
        if (r.category?.toLowerCase().includes("industry")) category = "industry";

        if (isEarlyBird) revenue += feeStructure[category].early;
        else if (isRegular) revenue += feeStructure[category].regular;
        else revenue += feeStructure[category].regular;
      }
    });

    setStats({ total, approved, rejected, revenue });
  };

  // --- Registration Trend ---
  const updateTrend = (data) => {
    const map = {};
    data.forEach((r) => {
      const date = new Date(r.createdAt).toISOString().split("T")[0];
      map[date] = (map[date] || 0) + 1;
    });
    setTrend(Object.keys(map).map((date) => ({ date, count: map[date] })));
  };

  // --- Country Distribution ---
  const updateCountryCounts = (data) => {
    const counts = {};
    data.forEach((r) => {
      counts[r.country] = (counts[r.country] || 0) + 1;
    });
    setCountryCounts(counts);
  };

  const chartData = [{ name: "Registrations", approved: stats.approved, rejected: stats.rejected }];

  return (
    <div className="space-y-6 p-4">
      {/* StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={icons.total} title="Total Registrations" value={stats.total} change="+10%" isPositive />
        <StatCard icon={icons.approved} title="Approved" value={stats.approved} change="+5%" isPositive />
        <StatCard icon={icons.rejected} title="Rejected" value={stats.rejected} change="-2%" isPositive={false} />
        <StatCard icon={icons.revenue} title="Total Revenue" value={`₹${stats.revenue.toLocaleString()}`} change="+15%" isPositive />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={chartData} />
        <AbstractStatusPie data={{ approved: stats.approved, rejected: stats.rejected, pending: stats.total - stats.approved - stats.rejected }} />
      </div>

      {/* Registration Trend */}
      <AbstractTrendChart data={trend} />

      {/* World Map */}
      <div className="p-4 shadow rounded-lg bg-white">
        <h2 className="text-xl font-bold mb-4">Participants by Country</h2>
        <ComposableMap projectionConfig={{ scale: 200 }} style={{ width: "100%", height: "700px" }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} fill="#E5E7EB" stroke="#D1D5DB" />
              ))
            }
          </Geographies>
          {Object.entries(countryCounts).map(([country, count], idx) => (
            <Marker key={idx} coordinates={[60.9629, 20.5937] /* TODO: Replace with actual lat/long */}>
              <circle r={Math.sqrt(count) * 2} fill="#F59E0B" stroke="#fff" strokeWidth={1} />
              <text textAnchor="middle" y={-10} fontSize={10} fill="#111">{`${country} (${count})`}</text>
            </Marker>
          ))}
        </ComposableMap>
      </div>
    </div>
  );
};

export default MainDashboard;
