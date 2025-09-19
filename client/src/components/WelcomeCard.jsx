import React from "react";

const WelcomeCard = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between h-full">
    <div>
      <h2 className="text-xl font-semibold text-[#566a7f]">Congratulations John! 🎉</h2>
      <p className="text-sm text-[#697a8d] mt-1">You have reviewed all new abstracts.</p>
      <button className="mt-4 px-4 py-2 bg-[#696cff] text-white text-xs font-semibold rounded-md hover:bg-[#5f61e7] shadow-sm transition-colors">
        View Submissions
      </button>
    </div>
    <div className="hidden sm:block">
      <img src="https://demos.themeselection.com/sneat-bootstrap-html-admin-template-free/assets/img/illustrations/man-with-laptop-light.png" alt="Illustration" className="h-36"/>
    </div>
  </div>
);

export default WelcomeCard;
