// import React, { useState, useEffect, useCallback } from "react";
// import axios from "axios";
// import { Loader2, MessageSquare, Mail, BellRing, Check, CircleX, X } from "lucide-react";
// import StatCard from "../../components/StatCard";

// // --- Icons for StatCards ---
// const icons = {
//   total: <Mail className="w-6 h-6 text-blue-500" />,
//   new: <BellRing className="w-6 h-6 text-yellow-500" />,
//   resolved: <Check className="w-6 h-6 text-green-500" />,
//   unresolved: <CircleX className="w-6 h-6 text-red-500" />,
// };

// const Inbox = () => {
//   const [enquiries, setEnquiries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({ total: 0, new: 0, resolved: 0, unresolved: 0 });
//   const [selectedImage, setSelectedImage] = useState(null);

//   const API_BASE = "http://localhost:5000/api/enquiries";

//   // --- Fetch enquiries from API ---
//   const fetchEnquiries = useCallback(async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token"); // ✅ use the same token as AbstractSupport
//       const { data } = await axios.get(API_BASE, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (Array.isArray(data.enquiries)) {
//         setEnquiries(data.enquiries);
//         updateStats(data.enquiries);
//       } else {
//         setEnquiries([]);
//         setStats({ total: 0, new: 0, resolved: 0, unresolved: 0 });
//       }
//     } catch (err) {
//       console.error("Error fetching enquiries:", err);
//       setEnquiries([]);
//       setStats({ total: 0, new: 0, resolved: 0, unresolved: 0 });
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchEnquiries();
//   }, [fetchEnquiries]);

//   // --- Update enquiry status (resolve) ---
//   const updateEnquiryStatus = async (enquiryId, messageId) => {
//     try {
//       await axios.put(
//         `${API_BASE}/${enquiryId}`,
//         { messageId, status: "resolved" },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       fetchEnquiries();
//     } catch (err) {
//       console.error("Failed to update enquiry status:", err);
//     }
//   };

//   // --- Update Stats like AbstractSupport ---
//   const updateStats = (list) => {
//     const total = list.reduce((acc, e) => acc + e.messages.length, 0);

//     const oneDayAgo = new Date();
//     oneDayAgo.setDate(oneDayAgo.getDate() - 1);
//     const newCount = list.reduce(
//       (acc, e) => acc + e.messages.filter((m) => new Date(m.createdAt) > oneDayAgo).length,
//       0
//     );

//     const resolved = list.reduce(
//       (acc, e) => acc + e.messages.filter((m) => m.status === "resolved").length,
//       0
//     );

//     const unresolved = list.reduce(
//       (acc, e) => acc + e.messages.filter((m) => m.status === "unresolved").length,
//       0
//     );

//     setStats({ total, new: newCount, resolved, unresolved });
//   };

//   // --- Render enquiries by status ---
//   const renderEnquiryCards = (list, isResolved = false) => {
//     let allMessages = [];
//     list.forEach((enquiry) => {
//       enquiry.messages.forEach((msg) => {
//         allMessages.push({
//           ...enquiry,
//           messageId: msg._id,
//           message: msg.text,
//           messageStatus: msg.status,
//           messageCreatedAt: msg.createdAt,
//         });
//       });
//     });

//     const filtered = allMessages.filter((msg) =>
//       isResolved ? msg.messageStatus === "resolved" : msg.messageStatus === "unresolved"
//     );

//     if (filtered.length === 0) {
//       return (
//         <div className="flex flex-col items-center justify-center p-12 text-gray-500 space-y-2 bg-white rounded-xl shadow-md">
//           <MessageSquare className="h-12 w-12" />
//           <p>{isResolved ? "No resolved enquiries." : "No new enquiries."}</p>
//         </div>
//       );
//     }

//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {filtered.map((msgObj, index) => (
//           <div key={index} className="bg-white shadow-md rounded-xl p-6 border-l-4 border-blue-500">
//             <p className="font-semibold">{msgObj.firstName} {msgObj.lastName}</p>
//             <p className="text-sm text-gray-600">{msgObj.email}</p>
//             <p className="text-gray-700 mt-2">{msgObj.message}</p>
//             <p className="text-xs text-gray-400 mt-1">
//               {new Date(msgObj.messageCreatedAt).toLocaleString()}
//             </p>

//             {!isResolved && (
//               <div className="flex space-x-2 mt-3">
//                 <button
//                   onClick={() => setSelectedImage(msgObj.proof)}
//                   className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-lg"
//                 >
//                   View File
//                 </button>
//                 <button
//                   onClick={() => updateEnquiryStatus(msgObj._id, msgObj.messageId)}
//                   className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg"
//                 >
//                   Resolve
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6 p-4">
//       {/* StatCards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <StatCard icon={icons.total} title="Total" value={stats.total} change="-" isPositive />
//         <StatCard icon={icons.new} title="New" value={stats.new} change="-" isPositive />
//         <StatCard icon={icons.resolved} title="Resolved" value={stats.resolved} change="-" isPositive />
//         <StatCard icon={icons.unresolved} title="Unresolved" value={stats.unresolved} change="-" isPositive={false} />
//       </div>

//       {/* Unresolved Enquiries */}
//       <div className="space-y-4">
//         <h2 className="text-xl font-bold">Unresolved Enquiries</h2>
//         {loading ? <Loader2 className="animate-spin" /> : renderEnquiryCards(enquiries, false)}
//       </div>

//       {/* Resolved Enquiries */}
//       <div className="space-y-4">
//         <h2 className="text-xl font-bold">Resolved Enquiries</h2>
//         {loading ? <Loader2 className="animate-spin" /> : renderEnquiryCards(enquiries, true)}
//       </div>

//       {/* Image Modal */}
//       {selectedImage && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
//           <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
//             <button
//               onClick={() => setSelectedImage(null)}
//               className="absolute top-2 right-2 p-2 bg-gray-200 rounded-full"
//             >
//               <X size={20} />
//             </button>
//             <img src={selectedImage} alt="Proof" className="max-w-full max-h-full object-contain" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Inbox;


import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Loader2, MessageSquare, Mail, BellRing, Check, CircleX, X } from "lucide-react";
import StatCard from "../../components/StatCard";

// --- Icons for StatCards ---
const icons = {
  total: <Mail className="w-6 h-6 text-blue-500" />,
  new: <BellRing className="w-6 h-6 text-yellow-500" />,
  resolved: <Check className="w-6 h-6 text-green-500" />,
  unresolved: <CircleX className="w-6 h-6 text-red-500" />,
};

const Inbox = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, new: 0, resolved: 0, unresolved: 0 });
  const [selectedImage, setSelectedImage] = useState(null);
  const [replyMessages, setReplyMessages] = useState({}); // ✅ Track reply per message

  const API_BASE = "hhttps://it-con-backend.onrender.com/api/enquiries";

  // --- Fetch enquiries from API ---
  const fetchEnquiries = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // ✅ same token as AbstractSupport
      const { data } = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(data.enquiries)) {
        setEnquiries(data.enquiries);
        updateStats(data.enquiries);
      } else {
        setEnquiries([]);
        setStats({ total: 0, new: 0, resolved: 0, unresolved: 0 });
      }
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      setEnquiries([]);
      setStats({ total: 0, new: 0, resolved: 0, unresolved: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // --- Update enquiry status (resolve) ---
  const updateEnquiryStatus = async (enquiryId, messageId) => {
    try {
      await axios.put(
        `${API_BASE}/${enquiryId}`,
        { messageId, status: "resolved" },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchEnquiries();
    } catch (err) {
      console.error("Failed to update enquiry status:", err);
    }
  };

  // --- Update Stats like AbstractSupport ---
  const updateStats = (list) => {
    const total = list.reduce((acc, e) => acc + e.messages.length, 0);

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const newCount = list.reduce(
      (acc, e) => acc + e.messages.filter((m) => new Date(m.createdAt) > oneDayAgo).length,
      0
    );

    const resolved = list.reduce(
      (acc, e) => acc + e.messages.filter((m) => m.status === "resolved").length,
      0
    );

    const unresolved = list.reduce(
      (acc, e) => acc + e.messages.filter((m) => m.status === "unresolved").length,
      0
    );

    setStats({ total, new: newCount, resolved, unresolved });
  };

  // --- Gmail Reply ---
  const handleGmailReply = (email, messageId) => {
    const subject = encodeURIComponent("Query Resolution");
    const body = encodeURIComponent(replyMessages[messageId] || "");
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`,
      "_blank"
    );
  };

  // --- Render enquiries by status ---
  const renderEnquiryCards = (list, isResolved = false) => {
    let allMessages = [];
    list.forEach((enquiry) => {
      enquiry.messages.forEach((msg) => {
        allMessages.push({
          ...enquiry,
          messageId: msg._id,
          message: msg.text,
          messageStatus: msg.status,
          messageCreatedAt: msg.createdAt,
        });
      });
    });

    const filtered = allMessages.filter((msg) =>
      isResolved ? msg.messageStatus === "resolved" : msg.messageStatus === "unresolved"
    );

    if (filtered.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-gray-500 space-y-2 bg-white rounded-xl shadow-md">
          <MessageSquare className="h-12 w-12" />
          <p>{isResolved ? "No resolved enquiries." : "No new enquiries."}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((msgObj, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-6 border-l-4 border-blue-500 flex flex-col justify-between"
          >
            <div>
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-gray-900 font-semibold">
                  {msgObj.firstName} {msgObj.lastName}
                </p>

                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-gray-900 font-semibold">{msgObj.mobile}</p>

                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-blue-600 font-semibold">{msgObj.email}</p>

                <p className="text-sm font-medium text-gray-500">Message</p>
                <p className="text-gray-700 mt-1">{msgObj.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(msgObj.messageCreatedAt).toLocaleString()}
                </p>

                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-500">Reply Message</p>
                  <textarea
                    value={replyMessages[msgObj.messageId] || ""}
                    onChange={(e) =>
                      setReplyMessages({
                        ...replyMessages,
                        [msgObj.messageId]: e.target.value,
                      })
                    }
                    className="border p-2 rounded w-full text-sm"
                    placeholder="Type your reply here..."
                  />
                </div>

                <div className="mt-3">
                  <button
                    onClick={() => handleGmailReply(msgObj.email, msgObj.messageId)}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Reply via Gmail
                  </button>
                </div>
              </div>
            </div>
            {!isResolved && (
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => setSelectedImage(msgObj.proof)}
                  className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-lg"
                >
                  View File
                </button>
                <button
                  onClick={() => updateEnquiryStatus(msgObj._id, msgObj.messageId)}
                  className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg"
                >
                  Resolve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4">
      {/* StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={icons.total} title="Total" value={stats.total} change="-" isPositive />
        <StatCard icon={icons.new} title="New" value={stats.new} change="-" isPositive />
        <StatCard icon={icons.resolved} title="Resolved" value={stats.resolved} change="-" isPositive />
        <StatCard icon={icons.unresolved} title="Unresolved" value={stats.unresolved} change="-" isPositive={false} />
      </div>

      {/* Unresolved Enquiries */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Unresolved Enquiries</h2>
        {loading ? <Loader2 className="animate-spin" /> : renderEnquiryCards(enquiries, false)}
      </div>

      {/* Resolved Enquiries */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Resolved Enquiries</h2>
        {loading ? <Loader2 className="animate-spin" /> : renderEnquiryCards(enquiries, true)}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 p-2 bg-gray-200 rounded-full"
            >
              <X size={20} />
            </button>
            <img src={selectedImage} alt="Proof" className="max-w-full max-h-full object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;
