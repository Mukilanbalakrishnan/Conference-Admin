
// import React, { useState } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";

// // --- Icons ---
// const icons = {
//   search: (
//     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//     </svg>
//   ),
//   team: (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 013.29-2.017M10 13a3 3 0 11-6 0 3 3 0 016 0zm7-3a3 3 0 11-6 0 3 3 0 016 0z"></path>
//     </svg>
//   ),
//   feedback: (
//     <svg className="w-12 h-12 text-[var(--brand-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
//     </svg>
//   ),
//   download: (
//     <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"></path>
//     </svg>
//   ),
// };

// // --- Modal ---
// const Modal = ({ children, onClose, size = "md" }) => {
//   const sizeClasses = { sm: "max-w-sm", md: "max-w-2xl", lg: "max-w-4xl" };
//   return (
//     <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className={`bg-white w-full ${sizeClasses[size]} rounded-2xl shadow-xl p-6 relative`}>
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl"
//         >
//           &times;
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// };

// const UnifiedAbstractDashboard = ({ abstractsData, loading, updateAbstractLocal }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedAbstract, setSelectedAbstract] = useState(null);
//   const [teamModalData, setTeamModalData] = useState(null);
//   const [rejectionModalData, setRejectionModalData] = useState(null);
//   const [rejectionReason, setRejectionReason] = useState("");

//   // 🔹 Filtering
//   const filteredAbstracts = abstractsData.filter((abs) => {
//     const matchesSearch =
//       abs.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       abs.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       abs.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       abs.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       abs.track?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       abs.mobile?.includes(searchTerm);
//     const matchesFilter = statusFilter === "All" || abs.status === statusFilter;
//     return matchesSearch && matchesFilter;
//   });

//   const getStatusBadgeClass = (status) => {
//     switch (status?.toLowerCase()) {
//       case "approved": return "bg-blue-100 text-blue-700";
//       case "rejected": return "bg-red-100 text-red-700";
//       case "under review": return "bg-orange-100 text-orange-700";
//       case "pending": return "bg-gray-100 text-gray-700";
//       default: return "bg-gray-100 text-gray-700";
//     }
//   };

//   // 🔹 Update status
//   const updateAbstractStatus = async (abs, newStatus, reason = null) => {
//     try {
//       const token = localStorage.getItem("token");
//       const payload =
//         newStatus.toLowerCase() === "rejected"
//           ? { abstractStatus: "rejected", content: reason }
//           : { abstractStatus: newStatus.toLowerCase() };

//       await axios.put(
//         `https://it-con-backend.onrender.com/api/admin/users/abstract/${abs.userId}`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       updateAbstractLocal?.(abs.userId, newStatus);
//       setSelectedAbstract(null);
//       setRejectionModalData(null);
//       setRejectionReason("");
//     } catch (err) {
//       console.error("Error updating status:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Failed to update status");
//     }
//   };

//   const handleRejectSubmit = () => {
//     if (rejectionReason.trim() === "") {
//       alert("Please provide a reason before rejecting.");
//       return;
//     }
//     updateAbstractStatus(rejectionModalData, "rejected", rejectionReason);
//   };

//   // 🔹 Handle proof viewing safely
//   const handleViewProof = (proofUrl) => {
//     if (!proofUrl) return;
//     if (proofUrl.startsWith("blob:") || proofUrl.startsWith("http")) {
//       window.open(proofUrl, "_blank");
//     } else {
//       alert("Cannot open local files directly. Please upload them to server first.");
//     }
//   };

//   // 🔹 Export filtered data (with team)
//   const exportToExcel = () => {
//     if (!filteredAbstracts.length) {
//       alert("No data to export!");
//       return;
//     }

//     const exportData = [];
//     filteredAbstracts.forEach((abs) => {
//       if (Array.isArray(abs.team) && abs.team.length > 0) {
//         abs.team.forEach((member) => {
//           exportData.push({
//             "User ID": abs.userId,
//             "Author Name": abs.authorName,
//             "Email": abs.email,
//             "Track": abs.track,
//             "Amount Paid": abs.amountPaid,
//             "Abstract Title": abs.title,
//             "Status": abs.status,
//             "Final Paper Status": abs.finalPaperStatus,
//             "Team Member Name": member.name,
//             "Team Member Email": member.email,
//             "Team Member Phone": member.phone,
//             "Team Member Designation": member.designation,
//             "Team Member Organisation": member.organisation,
//             "Team Member Gender": member.gender,
//             "Team Member Proof": member.proofUrl,
//           });
//         });
//       } else {
//         exportData.push({
//           "User ID": abs.userId,
//           "Author Name": abs.authorName,
//           "Email": abs.email,
//           "Track": abs.track,
//           "Amount Paid": abs.amountPaid,
//           "Abstract Title": abs.title,
//           "Status": abs.status,
//           "Final Paper Status": abs.finalPaperStatus,
//           "Team Member Name": "-",
//           "Team Member Email": "-",
//           "Team Member Phone": "-",
//           "Team Member Designation": "-",
//           "Team Member Organisation": "-",
//           "Team Member Gender": "-",
//           "Team Member Proof": "-",
//         });
//       }
//     });

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Abstracts");
//     XLSX.writeFile(wb, "abstracts.xlsx");
//   };

//   return (
//     <div className="p-4">
//       {/* Search, Filter & Export */}
//       <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
//         <div className="flex items-center border rounded-lg w-full md:w-64 p-2">
//           {icons.search}
//           <input
//             type="text"
//             placeholder="Search by ID, name, email, mobile or title..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="border-none outline-none ml-2 w-full"
//           />
//         </div>
//         <div className="flex items-center gap-3 w-full md:w-auto">
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="border rounded-lg p-2 w-full md:w-auto"
//           >
//             <option value="All">All Statuses</option>
//             <option value="approved">Approved</option>
//             <option value="rejected">Rejected</option>
//             <option value="under review">Under Review</option>
//             <option value="pending">Pending</option>
//           </select>
//           <button
//             onClick={exportToExcel}
//             className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
//           >
//             {icons.download} Export
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-auto bg-white rounded-lg shadow-lg">
//         <table className="min-w-full text-left divide-y divide-gray-200">
//           <thead className="bg-gray-50 text-xs uppercase text-gray-700 sticky top-0">
//             <tr>
//               <th className="p-3">User ID</th>
//               <th className="p-3">Author Name</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Track</th>
//               <th className="p-3">Amount Paid</th>
//               <th className="p-3">Abstract Title</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Final Paper Status</th>
//               <th className="p-3 text-center">Team</th>
//               <th className="p-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {loading ? (
//               <tr><td colSpan="11" className="text-center p-4">Loading...</td></tr>
//             ) : filteredAbstracts.length === 0 ? (
//               <tr><td colSpan="11" className="text-center p-4">No abstracts found.</td></tr>
//             ) : (
//               filteredAbstracts.map((abs) => (
//                 <tr key={abs.id} className="hover:bg-gray-50">
//                   <td className="p-2 font-mono">{abs.userId}</td>
//                   <td className="p-2 font-medium">{abs.authorName}</td>
//                   <td className="p-2">{abs.email || "-"}</td>
//                   <td className="p-2">{abs.track || "-"}</td>
//                   <td className="p-2">{abs.amountPaid ?? "-"}</td>
//                   <td className="p-2">{abs.title}</td>
//                   <td className="p-2 text-center">
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(abs.status)}`}>
//                       {abs.status}
//                     </span>
//                   </td>
//                   <td className="p-2 text-center">{abs.finalPaperStatus || "-"}</td>
//                   <td className="p-2 text-center">
//                     {Array.isArray(abs.team) && abs.team.length > 0 ? (
//                       <button
//                         onClick={() => setTeamModalData(abs)}
//                         className="text-blue-500 hover:underline flex items-center justify-center gap-1"
//                       >
//                         {icons.team} View
//                       </button>
//                     ) : "-"}
//                   </td>
//                   <td className="p-2 text-center">
//                     <button
//                       onClick={() => setSelectedAbstract(abs)}
//                       className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Team Modal */}
//       {teamModalData && (
//         <Modal onClose={() => setTeamModalData(null)} size="lg">
//           <h3 className="text-xl font-bold mb-4">
//             Team Members for "{teamModalData.title}"
//           </h3>
//           {Array.isArray(teamModalData.team) && teamModalData.team.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200 text-sm">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="p-2 text-left">Name</th>
//                     <th className="p-2 text-left">Email</th>
//                     <th className="p-2 text-left">Phone</th>
//                     <th className="p-2 text-left">Designation</th>
//                     <th className="p-2 text-left">Organisation</th>
//                     <th className="p-2 text-left">Gender</th>
//                     <th className="p-2 text-left">Proof</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {teamModalData.team.map((member, i) => (
//                     <tr key={i} className="hover:bg-gray-50">
//                       <td className="p-2">{member.name || "Unnamed"}</td>
//                       <td className="p-2">{member.email || "-"}</td>
//                       <td className="p-2">{member.phone || "-"}</td>
//                       <td className="p-2">{member.designation || "-"}</td>
//                       <td className="p-2">{member.organisation || "-"}</td>
//                       <td className="p-2">{member.gender || "-"}</td>
//                       <td className="p-2">
//                         {member.proofUrl ? (
//                           <button
//                             onClick={() => handleViewProof(member.proofUrl)}
//                             className="text-blue-500 hover:underline"
//                           >
//                             View Proof
//                           </button>
//                         ) : "-"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500 text-sm">No team members available.</p>
//           )}
//         </Modal>
//       )}

//       {/* Abstract Modal */}
//       {selectedAbstract && (
//         <Modal onClose={() => setSelectedAbstract(null)} size="lg">
//           <h2 className="text-2xl font-bold mb-2">{selectedAbstract.title}</h2>
//           <p className="text-gray-600 mb-4">By: {selectedAbstract.authorName}</p>
//           <div className="bg-gray-50 p-4 rounded max-h-80 overflow-y-auto space-y-2">
//             <p><strong>Content:</strong> {selectedAbstract.content}</p>
//             <p><strong>Track:</strong> {selectedAbstract.track}</p>
//             <p><strong>Amount Paid:</strong> {selectedAbstract.amountPaid}</p>
//             <p><strong>Final Paper Status:</strong> {selectedAbstract.finalPaperStatus}</p>
//             <p><strong>Email:</strong> {selectedAbstract.email}</p>
//             <p><strong>Mobile:</strong> {selectedAbstract.mobile}</p>
//           </div>
//           <div className="flex justify-end gap-3 mt-4">
//             <button
//               onClick={() => setRejectionModalData(selectedAbstract)}
//               className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
//             >
//               Reject
//             </button>
//             <button
//               onClick={() => updateAbstractStatus(selectedAbstract, "under review")}
//               className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200"
//             >
//               Under Review
//             </button>
//             <button
//               onClick={() => updateAbstractStatus(selectedAbstract, "approved")}
//               className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200"
//             >
//               Approve
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* Rejection Modal */}
//       {rejectionModalData && (
//         <Modal onClose={() => setRejectionModalData(null)} size="md">
//           <div className="text-center p-4">
//             <div className="mx-auto w-fit bg-orange-100 rounded-full p-4 mb-4">
//               {icons.feedback}
//             </div>
//             <h3 className="text-2xl font-bold my-2">Provide Feedback</h3>
//             <p className="text-gray-500 mb-4">Please give a reason for rejecting this abstract.</p>
//             <textarea
//               rows="4"
//               className="w-full border rounded-lg p-3 mb-4"
//               placeholder="Write feedback here..."
//               value={rejectionReason}
//               onChange={(e) => setRejectionReason(e.target.value)}
//             ></textarea>
//             <button
//               onClick={handleRejectSubmit}
//               className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg mt-4 hover:bg-green-600 transition shadow-lg shadow-green-500/30"
//             >
//               Send Feedback & Reject
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default UnifiedAbstractDashboard;
import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

// --- Icons ---
const icons = {
  search: (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
  ),
  team: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 013.29-2.017M10 13a3 3 0 11-6 0 3 3 0 016 0zm7-3a3 3 0 11-6 0 3 3 0 016 0z"></path>
    </svg>
  ),
  feedback: (
    <svg className="w-12 h-12 text-[var(--brand-orange)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
    </svg>
  ),
  download: (
    <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"></path>
    </svg>
  ),
};

// --- Modal ---
const Modal = ({ children, onClose, size = "md" }) => {
  const sizeClasses = { sm: "max-w-sm", md: "max-w-2xl", lg: "max-w-4xl" };
  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white w-full ${sizeClasses[size]} rounded-2xl shadow-xl p-6 relative`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const UnifiedAbstractDashboard = ({ abstractsData, loading, updateAbstractLocal }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAbstract, setSelectedAbstract] = useState(null);
  const [teamModalData, setTeamModalData] = useState(null);
  const [rejectionModalData, setRejectionModalData] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [discount, setDiscount] = useState("false"); // New state for discount radio

  // 🔹 Filtering
  const filteredAbstracts = abstractsData.filter((abs) => {
    const matchesSearch =
      abs.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abs.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abs.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abs.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abs.track?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      abs.mobile?.includes(searchTerm);
    const matchesFilter = statusFilter === "All" || abs.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved": return "bg-blue-100 text-blue-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "under review": return "bg-orange-100 text-orange-700";
      case "pending": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  // 🔹 Update status with discount
const updateAbstractStatus = async (abs, newStatus, reason = null) => {
  try {
    const token = localStorage.getItem("token");
    const payload =
      newStatus.toLowerCase() === "rejected"
        ? { abstractStatus: "rejected", rejectedReason: reason, discount } // ✅ fixed key name
        : { abstractStatus: newStatus.toLowerCase(), discount };

    await axios.put(
      `http://localhost:5000/api/admin/users/abstract/${abs.id}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    updateAbstractLocal?.(abs.id, newStatus);
    setSelectedAbstract(null);
    setRejectionModalData(null);
    setRejectionReason("");
    setDiscount("false");
  } catch (err) {
    console.error("Error updating status:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to update status");
  }
};


  const handleRejectSubmit = () => {
    if (rejectionReason.trim() === "") {
      alert("Please provide a reason before rejecting.");
      return;
    }
    updateAbstractStatus(rejectionModalData, "rejected", rejectionReason);
  };

  // 🔹 Handle proof viewing safely
  const handleViewProof = (proofUrl) => {
    if (!proofUrl) return;
    if (proofUrl.startsWith("blob:") || proofUrl.startsWith("http")) {
      window.open(proofUrl, "_blank");
    } else {
      alert("Cannot open local files directly. Please upload them to server first.");
    }
  };

  // 🔹 Export filtered data (with team)
  const exportToExcel = () => {
    if (!filteredAbstracts.length) {
      alert("No data to export!");
      return;
    }

    const exportData = [];
    filteredAbstracts.forEach((abs) => {
      if (Array.isArray(abs.team) && abs.team.length > 0) {
        abs.team.forEach((member) => {
          exportData.push({
            "User ID": abs.userId,
            "Author Name": abs.authorName,
            "Email": abs.email,
            "Track": abs.track,
            "Amount Paid": abs.amountPaid,
            "Abstract Title": abs.title,
            "Status": abs.status,
            "Final Paper Status": abs.finalPaperStatus,
            "Team Member Name": member.name,
            "Team Member Email": member.email,
            "Team Member Phone": member.phone,
            "Team Member Designation": member.designation,
            "Team Member Organisation": member.organisation,
            "Team Member Gender": member.gender,
            "Team Member Proof": member.proofUrl,
          });
        });
      } else {
        exportData.push({
          "User ID": abs.userId,
          "Author Name": abs.authorName,
          "Email": abs.email,
          "Track": abs.track,
          "Amount Paid": "-",
          "Abstract Title": abs.title,
          "Status": abs.status,
          "Final Paper Status": "-",
          "Team Member Name": "-",
          "Team Member Email": "-",
          "Team Member Phone": "-",
          "Team Member Designation": "-",
          "Team Member Organisation": "-",
          "Team Member Gender": "-",
          "Team Member Proof": "-",
        });
      }
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Abstracts");
    XLSX.writeFile(wb, "abstracts.xlsx");
  };

  return (
    <div className="p-4">
      {/* Search, Filter & Export */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <div className="flex items-center border rounded-lg w-full md:w-64 p-2">
          {icons.search}
          <input
            type="text"
            placeholder="Search by ID, name, email, mobile or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none outline-none ml-2 w-full"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg p-2 w-full md:w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="under review">Under Review</option>
            <option value="pending">Pending</option>
          </select>
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
          >
            {icons.download} Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white rounded-lg shadow-lg">
        <table className="min-w-full text-left divide-y divide-gray-200">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 sticky top-0">
            <tr>
              <th className="p-3">User ID</th>
              <th className="p-3">Author Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Track</th>
              <th className="p-3">Amount Paid</th>
              <th className="p-3">Abstract Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Final Paper Status</th>
              <th className="p-3 text-center">Team</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="11" className="text-center p-4">Loading...</td></tr>
            ) : filteredAbstracts.length === 0 ? (
              <tr><td colSpan="11" className="text-center p-4">No abstracts found.</td></tr>
            ) : (
              filteredAbstracts.map((abs) => (
                <tr key={abs.id} className="hover:bg-gray-50">
                  <td className="p-2 font-mono">{abs.userId}</td>
                  <td className="p-2 font-medium">{abs.authorName}</td>
                  <td className="p-2">{abs.email || "-"}</td>
                  <td className="p-2">{abs.track || "-"}</td>
                  <td className="p-2">{abs.amountPaid ?? "-"}</td>
                  <td className="p-2">{abs.title}</td>
                  <td className="p-2 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(abs.status)}`}>
                      {abs.status}
                    </span>
                  </td>
                  <td className="p-2 text-center">{abs.finalPaperStatus || "-"}</td>
                  <td className="p-2 text-center">
                    {Array.isArray(abs.team) && abs.team.length > 0 ? (
                      <button
                        onClick={() => setTeamModalData(abs)}
                        className="text-blue-500 hover:underline flex items-center justify-center gap-1"
                      >
                        {icons.team} View
                      </button>
                    ) : "-"}
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => setSelectedAbstract(abs)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Team Modal */}
      {teamModalData && (
        <Modal onClose={() => setTeamModalData(null)} size="lg">
          <h3 className="text-xl font-bold mb-4">
            Team Members for "{teamModalData.title}"
          </h3>
          {Array.isArray(teamModalData.team) && teamModalData.team.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Phone</th>
                    <th className="p-2 text-left">Designation</th>
                    <th className="p-2 text-left">Organisation</th>
                    <th className="p-2 text-left">Gender</th>
                    <th className="p-2 text-left">Proof</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teamModalData.team.map((member, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-2">{member.name || "Unnamed"}</td>
                      <td className="p-2">{member.email || "-"}</td>
                      <td className="p-2">{member.phone || "-"}</td>
                      <td className="p-2">{member.designation || "-"}</td>
                      <td className="p-2">{member.organisation || "-"}</td>
                      <td className="p-2">{member.gender || "-"}</td>
                      <td className="p-2">
                        {member.proofUrl ? (
                          <button
                            onClick={() => handleViewProof(member.proofUrl)}
                            className="text-blue-500 hover:underline"
                          >
                            View Proof
                          </button>
                        ) : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No team members available.</p>
          )}
        </Modal>
      )}

      {/* Abstract Modal */}
      {selectedAbstract && (
        <Modal onClose={() => setSelectedAbstract(null)} size="lg">
          <h2 className="text-2xl font-bold mb-2">{selectedAbstract.title}</h2>
          <p className="text-gray-600 mb-4">By: {selectedAbstract.authorName}</p>
          <div className="bg-gray-50 p-4 rounded max-h-80 overflow-y-auto space-y-2">
            <p><strong>Content:</strong> {selectedAbstract.content}</p>
            <p><strong>Track:</strong> {selectedAbstract.track}</p>
            {/* <p><strong>Amount Paid:</strong> {selectedAbstract.amountPaid}</p>
            <p><strong>Final Paper Status:</strong> {selectedAbstract.finalPaperStatus}</p> */}
            <p><strong>Email:</strong> {selectedAbstract.email}</p>
            <p><strong>Mobile:</strong> {selectedAbstract.mobile}</p>
          </div>

          {/* Discount radio buttons */}
          <div className="mt-4 flex items-center gap-4">
            <span className="font-semibold">Discount:</span>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="discount"
                value="true"
                checked={discount === "true"}
                onChange={(e) => setDiscount(e.target.value)}
              />
              Yes
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="discount"
                value="false"
                checked={discount === "false"}
                onChange={(e) => setDiscount(e.target.value)}
              />
              No
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setRejectionModalData(selectedAbstract)}
              className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
            >
              Reject
            </button>
            {/* <button
              onClick={() => updateAbstractStatus(selectedAbstract, "under review")}
              className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200"
            >
              Under Review
            </button> */}
            <button
              onClick={() => updateAbstractStatus(selectedAbstract, "approved")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Approve
            </button>
          </div>
        </Modal>
      )}

      {/* Rejection Modal */}
      {rejectionModalData && (
        <Modal onClose={() => setRejectionModalData(null)} size="sm">
          <h3 className="text-xl font-bold mb-2">Reject "{rejectionModalData.title}"</h3>
          <textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full border p-2 rounded h-24 resize-none"
          ></textarea>
          <div className="flex justify-end gap-3 mt-3">
            <button
              onClick={handleRejectSubmit}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Submit
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UnifiedAbstractDashboard;
// import React, { useState } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";

// // --- Icons ---
// const icons = {
//   search: (
//     <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//     </svg>
//   ),
//   team: (
//     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a3.002 3.002 0 013.29-2.017M10 13a3 3 0 11-6 0 3 3 0 016 0zm7-3a3 3 0 11-6 0 3 3 0 016 0z"></path>
//     </svg>
//   ),
//   download: (
//     <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"></path>
//     </svg>
//   ),
// };

// // --- Modal ---
// const Modal = ({ children, onClose, size = "md" }) => {
//   const sizeClasses = { sm: "max-w-sm", md: "max-w-2xl", lg: "max-w-4xl" };
//   return (
//     <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className={`bg-white w-full ${sizeClasses[size]} rounded-2xl shadow-xl p-6 relative`}>
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl"
//         >
//           &times;
//         </button>
//         {children}
//       </div>
//     </div>
//   );
// };

// const UnifiedAbstractDashboard = ({ abstractsData, loading, updateAbstractLocal }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [selectedAbstract, setSelectedAbstract] = useState(null);
//   const [teamModalData, setTeamModalData] = useState(null);
//   const [rejectionModalData, setRejectionModalData] = useState(null);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [discount, setDiscount] = useState("false"); // Discount state

//   // 🔹 Filtering
//   const filteredAbstracts = abstractsData.filter((abs) => {
//     const matchesSearch =
//       abs.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       abs.authorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       abs.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       abs.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       abs.track?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       abs.mobile?.includes(searchTerm);
//     const matchesFilter = statusFilter === "All" || abs.status === statusFilter;
//     return matchesSearch && matchesFilter;
//   });

//   const getStatusBadgeClass = (status) => {
//     switch (status?.toLowerCase()) {
//       case "approved": return "bg-blue-100 text-blue-700";
//       case "rejected": return "bg-red-100 text-red-700";
//       case "under review": return "bg-orange-100 text-orange-700";
//       case "pending": return "bg-gray-100 text-gray-700";
//       default: return "bg-gray-100 text-gray-700";
//     }
//   };

//   // 🔹 Update status with discount
//   const updateAbstractStatus = async (abs, newStatus, reason = null) => {
//     try {
//       const token = localStorage.getItem("token");
//       const payload =
//         newStatus.toLowerCase() === "rejected"
//           ? { abstractStatus: "rejected", content: reason, discount }
//           : { abstractStatus: newStatus.toLowerCase(), discount };

//       await axios.put(
//         `http://localhost:5000/api/admin/users/abstract/${abs.id}`,
//         payload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       updateAbstractLocal?.(abs.id, newStatus, discount);
//       setSelectedAbstract(null);
//       setRejectionModalData(null);
//       setRejectionReason("");
//       setDiscount("false");
//     } catch (err) {
//       console.error("Error updating status:", err.response?.data || err.message);
//       alert(err.response?.data?.message || "Failed to update status");
//     }
//   };

//   const handleRejectSubmit = () => {
//     if (rejectionReason.trim() === "") {
//       alert("Please provide a reason before rejecting.");
//       return;
//     }
//     updateAbstractStatus(rejectionModalData, "rejected", rejectionReason);
//   };

//   // 🔹 Handle proof viewing
//   const handleViewProof = (proofUrl) => {
//     if (!proofUrl) return;
//     if (proofUrl.startsWith("blob:") || proofUrl.startsWith("http")) {
//       window.open(proofUrl, "_blank");
//     } else {
//       alert("Cannot open local files directly. Please upload them to server first.");
//     }
//   };

//   // 🔹 Export filtered data
//   const exportToExcel = () => {
//     if (!filteredAbstracts.length) {
//       alert("No data to export!");
//       return;
//     }

//     const exportData = [];
//     filteredAbstracts.forEach((abs) => {
//       if (Array.isArray(abs.team) && abs.team.length > 0) {
//         abs.team.forEach((member) => {
//           exportData.push({
//             "User ID": abs.userId,
//             "Author Name": abs.authorName,
//             "Email": abs.email,
//             "Track": abs.track,
//             "Amount Paid": abs.amountPaid,
//             "Abstract Title": abs.title,
//             "Status": abs.status,
//             "Final Paper Status": abs.finalPaperStatus,
//             "Discount Applied": abs.discount ? "Yes" : "No",
//             "Team Member Name": member.name,
//             "Team Member Email": member.email,
//             "Team Member Phone": member.phone,
//             "Team Member Designation": member.designation,
//             "Team Member Organisation": member.organisation,
//             "Team Member Gender": member.gender,
//             "Team Member Proof": member.proofUrl,
//           });
//         });
//       } else {
//         exportData.push({
//           "User ID": abs.userId,
//           "Author Name": abs.authorName,
//           "Email": abs.email,
//           "Track": abs.track,
//           "Amount Paid": "-",
//           "Abstract Title": abs.title,
//           "Status": abs.status,
//           "Final Paper Status": "-",
//           "Discount Applied": abs.discount ? "Yes" : "No",
//           "Team Member Name": "-",
//           "Team Member Email": "-",
//           "Team Member Phone": "-",
//           "Team Member Designation": "-",
//           "Team Member Organisation": "-",
//           "Team Member Gender": "-",
//           "Team Member Proof": "-",
//         });
//       }
//     });

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Abstracts");
//     XLSX.writeFile(wb, "abstracts.xlsx");
//   };

//   return (
//     <div className="p-4">
//       {/* Search, Filter & Export */}
//       <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
//         <div className="flex items-center border rounded-lg w-full md:w-64 p-2">
//           {icons.search}
//           <input
//             type="text"
//             placeholder="Search by ID, name, email, mobile or title..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="border-none outline-none ml-2 w-full"
//           />
//         </div>
//         <div className="flex items-center gap-3 w-full md:w-auto">
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="border rounded-lg p-2 w-full md:w-auto"
//           >
//             <option value="All">All Statuses</option>
//             <option value="approved">Approved</option>
//             <option value="rejected">Rejected</option>
//             <option value="under review">Under Review</option>
//             <option value="pending">Pending</option>
//           </select>
//           <button
//             onClick={exportToExcel}
//             className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
//           >
//             {icons.download} Export
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-auto bg-white rounded-lg shadow-lg">
//         <table className="min-w-full text-left divide-y divide-gray-200">
//           <thead className="bg-gray-50 text-xs uppercase text-gray-700 sticky top-0">
//             <tr>
//               <th className="p-3">User ID</th>
//               <th className="p-3">Author Name</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Track</th>
//               <th className="p-3">Amount Paid</th>
//               <th className="p-3">Abstract Title</th>
//               <th className="p-3">Status</th>
//               <th className="p-3">Final Paper Status</th>
//               <th className="p-3 text-center">Team</th>
//               <th className="p-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {loading ? (
//               <tr><td colSpan="11" className="text-center p-4">Loading...</td></tr>
//             ) : filteredAbstracts.length === 0 ? (
//               <tr><td colSpan="11" className="text-center p-4">No abstracts found.</td></tr>
//             ) : (
//               filteredAbstracts.map((abs) => (
//                 <tr key={abs.id} className="hover:bg-gray-50">
//                   <td className="p-2 font-mono">{abs.userId}</td>
//                   <td className="p-2 font-medium">{abs.authorName}</td>
//                   <td className="p-2">{abs.email || "-"}</td>
//                   <td className="p-2">{abs.track || "-"}</td>
//                   <td className="p-2">{abs.amountPaid ?? "-"}</td>
//                   <td className="p-2">{abs.title}</td>
//                   <td className="p-2 text-center">
//                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(abs.status)}`}>
//                       {abs.status}
//                     </span>
//                   </td>
//                   <td className="p-2 text-center">{abs.finalPaperStatus || "-"}</td>
//                   <td className="p-2 text-center">
//                     {Array.isArray(abs.team) && abs.team.length > 0 ? (
//                       <button
//                         onClick={() => setTeamModalData(abs)}
//                         className="text-blue-500 hover:underline flex items-center justify-center gap-1"
//                       >
//                         {icons.team} View
//                       </button>
//                     ) : "-"}
//                   </td>
//                   <td className="p-2 text-center">
//                     <button
//                       onClick={() => setSelectedAbstract(abs)}
//                       className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600"
//                     >
//                       View
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Team Modal */}
//       {teamModalData && (
//         <Modal onClose={() => setTeamModalData(null)} size="lg">
//           <h3 className="text-xl font-bold mb-4">Team Members for "{teamModalData.title}"</h3>
//           {Array.isArray(teamModalData.team) && teamModalData.team.length > 0 ? (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200 text-sm">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="p-2 text-left">Name</th>
//                     <th className="p-2 text-left">Email</th>
//                     <th className="p-2 text-left">Phone</th>
//                     <th className="p-2 text-left">Designation</th>
//                     <th className="p-2 text-left">Organisation</th>
//                     <th className="p-2 text-left">Gender</th>
//                     <th className="p-2 text-left">Proof</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {teamModalData.team.map((member, i) => (
//                     <tr key={i} className="hover:bg-gray-50">
//                       <td className="p-2">{member.name || "Unnamed"}</td>
//                       <td className="p-2">{member.email || "-"}</td>
//                       <td className="p-2">{member.phone || "-"}</td>
//                       <td className="p-2">{member.designation || "-"}</td>
//                       <td className="p-2">{member.organisation || "-"}</td>
//                       <td className="p-2">{member.gender || "-"}</td>
//                       <td className="p-2">
//                         {member.proofUrl ? (
//                           <button
//                             onClick={() => handleViewProof(member.proofUrl)}
//                             className="text-blue-500 hover:underline"
//                           >
//                             View Proof
//                           </button>
//                         ) : "-"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p className="text-gray-500 text-sm">No team members available.</p>
//           )}
//         </Modal>
//       )}

//       {/* Abstract Modal */}
//       {selectedAbstract && (
//         <Modal onClose={() => setSelectedAbstract(null)} size="lg">
//           <h2 className="text-2xl font-bold mb-2">{selectedAbstract.title}</h2>
//           <p className="text-gray-600 mb-4">By: {selectedAbstract.authorName}</p>
//           <div className="bg-gray-50 p-4 rounded max-h-80 overflow-y-auto space-y-2">
//             <p><strong>Content:</strong> {selectedAbstract.content}</p>
//             <p><strong>Track:</strong> {selectedAbstract.track}</p>
//             <p><strong>Amount Paid:</strong> {selectedAbstract.amountPaid}</p>
//             <p><strong>Final Paper Status:</strong> {selectedAbstract.finalPaperStatus}</p>
//             <p><strong>Email:</strong> {selectedAbstract.email}</p>
//             <p><strong>Mobile:</strong> {selectedAbstract.mobile}</p>
//           </div>

//           {/* Discount radio buttons */}
//           <div className="mt-4 flex items-center gap-4">
//             <span className="font-semibold">Discount:</span>
//             <label className="flex items-center gap-1">
//               <input
//                 type="radio"
//                 name="discount"
//                 value="true"
//                 checked={discount === "true"}
//                 onChange={(e) => setDiscount(e.target.value)}
//               />
//               Yes
//             </label>
//             <label className="flex items-center gap-1">
//               <input
//                 type="radio"
//                 name="discount"
//                 value="false"
//                 checked={discount === "false"}
//                 onChange={(e) => setDiscount(e.target.value)}
//               />
//               No
//             </label>
//           </div>

//           <div className="flex justify-end gap-3 mt-4">
//             <button
//               onClick={() => setRejectionModalData(selectedAbstract)}
//               className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
//             >
//               Reject
//             </button>
//             <button
//               onClick={() => updateAbstractStatus(selectedAbstract, "under review")}
//               className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200"
//             >
//               Under Review
//             </button>
//             <button
//               onClick={() => updateAbstractStatus(selectedAbstract, "approved")}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//             >
//               Approve
//             </button>
//           </div>
//         </Modal>
//       )}

//       {/* Rejection Modal */}
//       {rejectionModalData && (
//         <Modal onClose={() => setRejectionModalData(null)} size="sm">
//           <h3 className="text-xl font-bold mb-2">Reject "{rejectionModalData.title}"</h3>
//           <textarea
//             placeholder="Enter rejection reason..."
//             value={rejectionReason}
//             onChange={(e) => setRejectionReason(e.target.value)}
//             className="w-full border p-2 rounded h-24 resize-none"
//           ></textarea>
//           <div className="flex justify-end gap-3 mt-3">
//             <button
//               onClick={handleRejectSubmit}
//               className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//             >
//               Submit
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default UnifiedAbstractDashboard;
