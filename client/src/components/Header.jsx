import React from "react";

const Header = () => (
  <nav className="bg-white shadow-sm rounded-lg p-4 flex items-center justify-between mb-6">
    <div className="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input type="text" placeholder="Search..." className="w-48 text-sm border-none focus:ring-0 bg-transparent"/>
    </div>
    <div className="flex items-center">
      <span className="text-sm text-gray-600 mr-4">John Doe</span>
      <img src="https://placehold.co/40x40/696cff/FFFFFF/png?text=JD" alt="User Avatar" className="w-10 h-10 rounded-full"/>
    </div>
  </nav>
);

export default Header;
