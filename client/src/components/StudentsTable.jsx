import React from "react";

const StudentsTable = ({ students, onView }) => (
  <div className="bg-white shadow-sm rounded-lg mb-6">
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold text-[#566a7f]">Selected Students</h2>
    </div>
    <div className="p-4 overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Paper</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((stu) => (
            <tr key={stu.id} className="bg-white border-b">
              <td className="px-6 py-4">{stu.id}</td>
              <td className="px-6 py-4">{stu.name}</td>
              <td className="px-6 py-4">{stu.paper}</td>
              <td className="px-6 py-4">
                <button onClick={() => onView(stu)} className="text-indigo-600 hover:underline">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default StudentsTable;
